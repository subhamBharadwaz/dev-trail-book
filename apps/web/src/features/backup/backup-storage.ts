import { topics } from "@/features/topics/data/content";
import type { Json } from "@trailbook/sync";
import {
  withReadingDefaults,
  restorePlan,
  type RestoreMode,
  type StudyBackup,
} from "@trailbook/learning/backup";
import { recordsPreparation } from "@trailbook/learning/preparation-records";
import { guestRecords } from "@/features/account/data/local-import";
import { progress } from "@/features/account/data/progress-store";
import { guestStudy } from "@/features/account/hooks/use-study-records";
export const backupTarget = () => progress.getSnapshot().userId ?? "guest";
export const backupRecords = (): Record<string, Json> =>
  progress.getSnapshot().userId ? progress.values() : guestRecords();
export function restoreBackup(
  backup: StudyBackup,
  mode: RestoreMode,
  target: string,
) {
  if (backupTarget() !== target)
    throw new Error(
      "Your account changed. Review this backup again before restoring.",
    );
  const store = progress.getSnapshot().userId ? progress : guestStudy;
  if (Object.keys(store.getSnapshot().conflicts).length)
    throw new Error(
      "Resolve the sync conflicts in Account & sync before restoring.",
    );
  const plan = restorePlan(backup, backupRecords(), mode);
  const before = store.getSnapshot();
  if (progress.getSnapshot().userId) {
    progress.write(plan.changes);
    if (progress.getSnapshot().storageError) {
      progress.publish({ ...before, storageError: true });
      throw new Error(
        "Device storage could not save the restore. Nothing was applied. Free some space and retry.",
      );
    }
    return { ...plan, reload: false };
  }
  const next = { ...backupRecords(), ...plan.changes };
  const writes: Record<string, string | null> = {};
  for (const type of ["read", "saved"])
    if (Object.keys(plan.changes).some((k) => k.startsWith(`reading/${type}/`)))
      writes[`trailbook:${type}`] = JSON.stringify(
        Object.entries(next)
          .filter(
            ([key, value]) =>
              key.startsWith(`reading/${type}/`) && value === true,
          )
          .map(([key]) => key.slice(`reading/${type}/`.length)),
      );
  if (Object.keys(plan.changes).some((k) => k.startsWith("prep/")))
    writes["trailbook:preparation:v1"] = JSON.stringify(
      recordsPreparation(next),
    );
  const modern: Record<string, Json> = {};
  for (const [key, value] of Object.entries(plan.changes)) {
    if (key.startsWith("practice/session/"))
      writes[`trailbook:practice:v1:${key.slice("practice/session/".length)}`] =
        value === null ? null : JSON.stringify(value);
    if (key.startsWith("practice/preferences/"))
      writes[
        `trailbook:practice:preferences:${key.slice("practice/preferences/".length)}`
      ] = value === null ? null : JSON.stringify(value);
    if (
      key.startsWith("practice/mistake/") ||
      key.startsWith("practice/interview")
    )
      modern[key] = value;
  }
  const old = Object.fromEntries(
    Object.keys(writes).map((key) => [key, localStorage.getItem(key)]),
  );
  try {
    for (const [key, value] of Object.entries(writes)) {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    }
    guestStudy.write(modern);
    if (guestStudy.getSnapshot().storageError)
      throw new Error("Device storage is full.");
  } catch {
    for (const [key, value] of Object.entries(old))
      try {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
      } catch {
        /* Keep the original values in memory when storage is unavailable. */
      }
    guestStudy.publish({ ...before, storageError: true });
    throw new Error(
      "The restore could not be saved. Free some device space, then retry; keep your backup file.",
    );
  }
  return { ...plan, reload: Object.keys(writes).length > 0 };
}
export function downloadBackup(text: string, filename: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const exportBackupRecords = () =>
  withReadingDefaults(
    backupRecords(),
    topics.map((t) => t.slug),
  );

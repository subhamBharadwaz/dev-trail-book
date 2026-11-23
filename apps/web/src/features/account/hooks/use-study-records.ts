import { browserStorage } from "@/lib/browser-storage";
import { useSyncExternalStore } from "react";
import { createProgressStore } from "@trailbook/sync";
import { progress, useCloudProgress } from "../data/progress-store";
export const guestStudy = createProgressStore(browserStorage, () =>
  crypto.randomUUID(),
);
const serverSnapshot = guestStudy.getSnapshot();
guestStudy.activate("web-notebook-guest");
export function studyStore() {
  return progress.getSnapshot().userId ? progress : guestStudy;
}
export function useStudyRecords() {
  const cloud = useCloudProgress();
  const guest = useSyncExternalStore(
    guestStudy.subscribe,
    guestStudy.getSnapshot,
    () => serverSnapshot,
  );
  const snapshot = cloud.userId ? cloud : guest;
  const values = Object.fromEntries(
    Object.entries(snapshot.records).map(([key, record]) => [
      key,
      record.value,
    ]),
  );
  for (const [key, change] of Object.entries(snapshot.pending))
    values[key] = change.value;
  return { ...snapshot, values, accountId: cloud.userId };
}

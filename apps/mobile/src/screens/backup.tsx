import { topics } from "@trailbook/content/native";
import { useState } from "react";
import { View } from "react-native";
import {
  withReadingDefaults,
  backupGroups,
  createBackup,
  parseBackup,
  restorePlan,
  type RestoreMode,
  type StudyBackup,
} from "@trailbook/learning/backup";
import { Screen } from "@/components/screen";
import { Text } from "@/components/text";
import { Action } from "@/components/action";
import { Choice } from "@/components/choice";
import { progress, useProgress } from "@/lib/progress";
import {
  shareBackup,
  pickBackup,
  saveBackupOnDevice,
} from "@/features/backup/files";
import { space } from "@/theme";
export default function Backup() {
  const snapshot = useProgress();
  const [preview, setPreview] = useState<{
    backup: StudyBackup;
    owner: string | null;
  } | null>(null);
  const [mode, setMode] = useState<RestoreMode>("missing");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const plan = preview
    ? restorePlan(preview.backup, snapshot.values, mode)
    : null;
  const conflicts = Object.keys(snapshot.conflicts).length;
  const run = async (task: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await task();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not finish. Your backup file is unchanged.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <Screen>
      <Text variant="display">Your progress belongs to you.</Text>
      <Text muted>
        A portable copy of reading progress, practice, mistakes, mock answers,
        and assessments. Sign-in credentials are excluded.
      </Text>
      <Text variant="title">Keep a copy</Text>
      <Text muted>
        Exports this device’s current records, including queued edits. Your
        notes are in the file; save it somewhere private.
      </Text>
      <Action
        label="Save backup on this phone"
        disabled={busy || conflicts > 0}
        onPress={() =>
          void run(async () => {
            const result = createBackup(
              withReadingDefaults(
                progress.values(),
                topics.map((t) => t.slug),
              ),
              "android",
            );
            await saveBackupOnDevice(result.text, result.filename);
            setMessage(
              `Backup saved: ${result.filename}.${result.skipped ? ` ${result.skipped} unsupported records were excluded.` : ""}`,
            );
          })
        }
      />
      <Action
        secondary
        label="Share a backup copy"
        disabled={busy || conflicts > 0}
        onPress={() =>
          void run(async () => {
            const result = createBackup(
              withReadingDefaults(
                progress.values(),
                topics.map((t) => t.slug),
              ),
              "android",
            );
            await shareBackup(result.text, result.filename);
            setMessage(
              `Prepared ${Object.keys(result.backup.records).length} records. Use the share sheet to save your copy.${result.skipped ? ` ${result.skipped} unsupported records were excluded.` : ""}`,
            );
          })
        }
      />
      {conflicts > 0 && (
        <Text>
          Resolve sync conflicts in Your space before exporting or restoring.
        </Text>
      )}
      <Text variant="title">Restore a copy</Text>
      <Text muted>
        Works with website and Android backups. Review the file before applying.
        Records absent from the backup stay as they are.
      </Text>
      <Action
        secondary
        label="Choose backup file"
        disabled={busy}
        onPress={() =>
          void run(async () => {
            const owner = progress.getSnapshot().userId;
            const raw = await pickBackup();
            if (raw !== null) {
              setPreview({ backup: parseBackup(raw), owner });
              setMode("missing");
            }
          })
        }
      />
      {preview && plan && (
        <View style={{ gap: space.lg }}>
          <Text variant="title">Review this restore</Text>
          <Text muted>
            Exported {new Date(preview.backup.exportedAt).toLocaleString()} from{" "}
            {preview.backup.source}. Restores into the current account or guest
            space.
          </Text>
          {backupGroups(preview.backup).map((g) => (
            <Text key={g.label}>
              {g.label}: {g.count}
            </Text>
          ))}
          <Choice
            label="Restore behavior"
            value={mode}
            onChange={(value) => {
              if (value === "missing" || value === "matching") setMode(value);
            }}
            options={[
              { value: "missing", label: "Add missing only" },
              { value: "matching", label: "Use backup values" },
            ]}
          />
          <Text>
            {plan.added} to add · {plan.updated} to replace · {plan.kept} kept.
            Backup deletions apply only with “Use backup values”.
          </Text>
          {preview.owner !== snapshot.userId && (
            <Text accessibilityRole="alert">
              Your account changed. Choose the file again before restoring.
            </Text>
          )}
          <Action
            label="Apply reviewed restore"
            disabled={
              busy ||
              conflicts > 0 ||
              preview.owner !== snapshot.userId ||
              plan.added + plan.updated === 0
            }
            onPress={() =>
              void run(async () => {
                const before = progress.getSnapshot();
                if (before.userId !== preview.owner)
                  throw new Error(
                    "Your account changed. Review the file again.",
                  );
                if (Object.keys(before.conflicts).length)
                  throw new Error("Resolve sync conflicts first.");
                const latest = restorePlan(
                  preview.backup,
                  progress.values(),
                  mode,
                );
                progress.write(latest.changes);
                if (progress.getSnapshot().storageError) {
                  progress.publish({ ...before, storageError: true });
                  throw new Error(
                    "Device storage could not save this restore. Free some space and retry.",
                  );
                }
                setPreview(null);
                setMessage(
                  `Restored ${latest.added} new and ${latest.updated} matching records. Your saved data will sync when connected.`,
                );
              })
            }
          />
          <Action
            secondary
            label="Cancel restore"
            onPress={() => setPreview(null)}
          />
        </View>
      )}
      {!!error && <Text accessibilityRole="alert">{error}</Text>}
      {!!message && <Text>{message}</Text>}
    </Screen>
  );
}

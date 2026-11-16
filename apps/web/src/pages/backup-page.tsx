import { useRef, useState } from "react";
import { Input } from "@ui-sdk/react/input";
import { Textarea } from "@ui-sdk/react/textarea";
import { Field, FieldLabel } from "@ui-sdk/react/field";
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio";
import { Button } from "@/components/ui/button";
import {
  backupGroups,
  createBackup,
  maxBackupBytes,
  parseBackup,
  restorePlan,
  type RestoreMode,
  type StudyBackup,
} from "@trailbook/learning/backup";
import {
  backupTarget,
  backupRecords,
  exportBackupRecords,
  restoreBackup,
  downloadBackup,
} from "@/features/backup/backup-storage";
import { useStudyRecords } from "@/features/account/hooks/use-study-records";
export function BackupPage() {
  const state = useStudyRecords();
  const [raw, setRaw] = useState("");
  const rawValue = useRef("");
  const [paste, setPaste] = useState(false);
  const [preview, setPreview] = useState<{
    backup: StudyBackup;
    target: string;
  } | null>(null);
  const [mode, setMode] = useState<RestoreMode>("missing");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reload, setReload] = useState(false);
  const plan = preview
    ? restorePlan(preview.backup, backupRecords(), mode)
    : null;
  const changed = !!preview && preview.target !== backupTarget();
  function review(text = rawValue.current) {
    setError("");
    setMessage("");
    try {
      setPreview({ backup: parseBackup(text), target: backupTarget() });
      setMode("missing");
    } catch (e) {
      setPreview(null);
      setError(e instanceof Error ? e.message : "Could not read this backup.");
    }
  }
  return (
    <div className="mx-auto max-w-3xl space-y-7 px-5 py-8 sm:px-8 sm:py-12">
      <header>
        <p className="text-sm font-medium uppercase tracking-widest text-green">
          EXPORT & RESTORE
        </p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight">
          Your progress belongs to you.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-ink">
          A portable JSON copy of reading progress, practice, mistakes, mock
          answers, and assessments. No sign-in credentials are included.
        </p>
      </header>
      <section className="space-y-4 rounded-2xl border border-line bg-surface p-5 sm:p-7">
        <h2 className="text-xl font-medium">Keep a copy</h2>
        <p className="text-base leading-7 text-muted-ink">
          Exports this device’s current study records, including queued edits.
          Your notes and interview answers are in the file, so keep it somewhere
          private.
        </p>
        <Button
          disabled={Object.keys(state.conflicts).length > 0}
          onClick={() => {
            setError("");
            try {
              const result = createBackup(exportBackupRecords(), "web");
              downloadBackup(result.text, result.filename);
              setMessage(
                `Backup downloaded: ${Object.keys(result.backup.records).length} records.${result.skipped ? ` ${result.skipped} unsupported records were excluded.` : ""}`,
              );
            } catch (e) {
              setError(e instanceof Error ? e.message : "Could not export.");
            }
          }}
        >
          Download study backup
        </Button>
        {Object.keys(state.conflicts).length > 0 && (
          <a href="#/account" className="block text-green">
            Resolve sync conflicts before exporting →
          </a>
        )}
      </section>
      <section className="space-y-5 rounded-2xl border border-line p-5 sm:p-7">
        <h2 className="text-xl font-medium">Restore a copy</h2>
        <p className="text-base leading-7 text-muted-ink">
          Choose a backup from the website or Android app. Review it before
          applying. Records absent from the file stay as they are.
        </p>
        <Field>
          <FieldLabel className="font-medium">
            Choose backup JSON file
          </FieldLabel>
          <Input
            type="file"
            accept=".json,application/json"
            className="mt-3 block min-h-12 w-full text-base file:mr-3 file:rounded-lg file:border file:border-line file:bg-surface file:p-3 file:text-ink"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (!file) return;
              if (file.size > maxBackupBytes) {
                setError("Choose a backup smaller than 8 MB.");
                return;
              }
              void file
                .text()
                .then((text) => {
                  setRaw(text);
                  review(text);
                })
                .catch(() =>
                  setError("Could not read this file. Try selecting it again."),
                );
            }}
          />
        </Field>
        <Button variant="ghost" onClick={() => setPaste(!paste)}>
          {paste ? "Hide pasted JSON" : "Paste backup JSON instead"}
        </Button>
        {paste && (
          <>
            <Field>
              <FieldLabel className="font-medium">
                Backup text contents
              </FieldLabel>
              <Textarea
                className="mt-3 min-h-44 w-full rounded-xl border border-line bg-page p-4 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-green"
                value={raw}
                maxLength={maxBackupBytes}
                onValueChange={(value) => {
                  rawValue.current = value;
                  setRaw(value);
                }}
              />
            </Field>
            <Button variant="outline" onClick={() => review()}>
              Review pasted backup
            </Button>
          </>
        )}
        {preview && plan && (
          <div className="space-y-5 rounded-xl bg-surface p-5">
            <h3 className="text-lg font-medium">Review this restore</h3>
            <p className="text-sm leading-6 text-muted-ink">
              Exported {new Date(preview.backup.exportedAt).toLocaleString()}{" "}
              from {preview.backup.source}. Destination:{" "}
              {state.accountId
                ? "your signed-in account"
                : "this browser’s guest data"}
              .
            </p>
            <dl className="space-y-2">
              {backupGroups(preview.backup).map((g) => (
                <div key={g.label} className="flex justify-between gap-4">
                  <dt className="text-sm text-muted-ink">{g.label}</dt>
                  <dd>{g.count}</dd>
                </div>
              ))}
            </dl>
            <RadioGroup
              aria-label="Restore behavior"
              value={mode}
              onValueChange={(value) => {
                if (value === "missing" || value === "matching") setMode(value);
              }}
              className="space-y-3"
            >
              {[
                {
                  value: "missing",
                  label: "Add missing records only (recommended)",
                },
                {
                  value: "matching",
                  label: "Use backup values for matching records",
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-line p-3 text-base"
                >
                  <Radio
                    value={option.value}
                    className="flex size-5 items-center justify-center rounded-full border border-muted-ink data-checked:border-green data-checked:bg-green"
                  >
                    <RadioIndicator>
                      <span className="block size-2 rounded-full bg-page" />
                    </RadioIndicator>
                  </Radio>
                  {option.label}
                </label>
              ))}
            </RadioGroup>
            <p className="text-base leading-7">
              {plan.added} to add · {plan.updated} to replace · {plan.kept}{" "}
              kept. Backup deletions apply only when you choose matching values.
            </p>
            {changed && (
              <p role="alert">
                Your account changed. Review the file again before restoring.
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Button
                disabled={changed || plan.added + plan.updated === 0}
                data-agent-confirm="Applies the reviewed study backup to the current account or guest data"
                onClick={() => {
                  setError("");
                  try {
                    const result = restoreBackup(
                      preview.backup,
                      mode,
                      preview.target,
                    );
                    setMessage(
                      `Restored ${result.added} new and ${result.updated} matching records. Existing records absent from the backup were kept.`,
                    );
                    setReload(result.reload);
                    setPreview(null);
                  } catch (e) {
                    setError(
                      e instanceof Error ? e.message : "Restore failed.",
                    );
                  }
                }}
              >
                Apply reviewed restore
              </Button>
              <Button variant="outline" onClick={() => setPreview(null)}>
                Cancel restore
              </Button>
            </div>
          </div>
        )}
      </section>
      {error && (
        <p role="alert" className="rounded-xl border border-line p-4 text-base">
          {error}
        </p>
      )}
      <p role="status" className="text-base leading-7 text-green">
        {message}
      </p>
      {reload && (
        <Button onClick={() => window.location.reload()}>
          Reload to open restored guest data
        </Button>
      )}
      <a
        href="#/account"
        className="inline-flex min-h-11 items-center text-green"
      >
        Account & sync →
      </a>
    </div>
  );
}

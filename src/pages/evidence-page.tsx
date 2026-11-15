import { useState } from "react";
import { Check, Download, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EvidenceForm } from "@/features/preparation/components/evidence-form";
import { PreparationShell } from "@/features/preparation/components/preparation-shell";
import {
  addDays,
  dateKey,
  dueReviews,
  evidenceKinds,
  type Evidence,
} from "@/features/preparation/data/preparation";
import { usePreparation } from "@/features/preparation/hooks/use-preparation";
export function EvidencePage() {
  const { state, update, storageError } = usePreparation();
  const [filter, setFilter] = useState<"all" | "due">("all");
  const [removed, setRemoved] = useState<Evidence | null>(null);
  const today = dateKey();
  const due = dueReviews(state.entries, today);
  const recent = state.entries.filter(
    (entry) => entry.date >= addDays(today, -6) && entry.date <= today,
  );
  const entries = state.entries
    .filter(
      (entry) =>
        filter === "all" || due.some((review) => review.entry.id === entry.id),
    )
    .toSorted((a, b) => b.date.localeCompare(a.date));
  return (
    <PreparationShell
      title="Proof you can come back to."
      description="Keep the attempts, mistakes and small wins that show your progress. Review the gaps, then try again without notes."
    >
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          [
            recent.filter((entry) => entry.kind === "mock").length,
            "Mocks · last 7 days",
            "Aim for two each week",
          ],
          [
            recent.filter((entry) => entry.kind === "build").length,
            "Timed tasks · last 7 days",
            "Aim for one each week",
          ],
          [
            recent.filter((entry) => entry.kind === "dsa" && entry.independent)
              .length,
            "Independent DSA attempts",
            "Include later re-solves",
          ],
          [due.length, "Reviews due", "Repair, then reproduce"],
        ].map(([count, label, hint]) => (
          <div
            key={label}
            className="rounded-2xl border border-line bg-surface p-4 sm:p-5"
          >
            <p className="text-3xl font-medium tabular-nums text-green">
              {count}
            </p>
            <p className="mt-2 text-sm font-medium leading-6">{label}</p>
            <p className="mt-1 text-sm leading-6 text-muted-ink">{hint}</p>
          </div>
        ))}
      </div>
      <EvidenceForm
        onSave={(entry) =>
          update((current) => ({
            ...current,
            entries: [entry, ...current.entries],
          }))
        }
      />
      <section className="mt-9" aria-label="Evidence journal">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-medium tracking-tight">Your journal</h2>
          <Button
            variant="outline"
            className="min-h-11 gap-2 border-line bg-surface text-ink"
            onClick={() => {
              const url = URL.createObjectURL(
                new Blob([JSON.stringify(state, null, 2)], {
                  type: "application/json",
                }),
              );
              const link = document.createElement("a");
              link.href = url;
              link.download = `trailbook-evidence-${today}.json`;
              link.click();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }}
          >
            <Download size={16} aria-hidden="true" />
            Export backup
          </Button>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-ink" role="status">
          {storageError
            ? "Storage is unavailable. Export your evidence before leaving this page."
            : "Saved only in this browser. Export a backup before clearing browser data or switching devices."}
        </p>
        <div className="my-5 flex flex-wrap gap-2">
          {(["all", "due"] as const).map((value) => (
            <Button
              key={value}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              variant="outline"
              className="min-h-11 border-line bg-surface px-4 text-muted-ink aria-pressed:border-green aria-pressed:bg-green-soft aria-pressed:text-green"
            >
              {value === "all"
                ? `All attempts (${state.entries.length})`
                : `Due reviews (${due.length})`}
            </Button>
          ))}
        </div>
        {removed && (
          <div
            className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-green-soft p-4"
            role="status"
          >
            <p className="text-sm">Removed “{removed.title}”.</p>
            <Button
              variant="ghost"
              onClick={() => {
                update((current) => ({
                  ...current,
                  entries: [removed, ...current.entries],
                }));
                setRemoved(null);
              }}
              className="min-h-11 text-green"
            >
              Undo removal
            </Button>
          </div>
        )}
        {!entries.length ? (
          <div className="rounded-2xl border border-dashed border-line p-8 text-center">
            <h3 className="text-lg font-medium">
              {filter === "due"
                ? "Nothing waiting for a re-solve."
                : "Start with one honest attempt."}
            </h3>
            <p className="mx-auto mt-3 max-w-md text-base leading-7 text-muted-ink">
              {filter === "due"
                ? "DSA attempts return after two and seven days. Mocks, builds and explanations return the next day."
                : "Record a problem, a spoken explanation or a timed task. You can include unsuccessful attempts and use them to choose the next repair."}
            </p>
            <a
              href="#/today"
              className="mt-4 inline-flex min-h-11 items-center gap-2 font-medium text-green"
            >
              Choose today’s practice
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <article
                key={entry.id}
                className="rounded-2xl border border-line bg-page p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm leading-6 text-muted-ink">
                      {
                        evidenceKinds.find((kind) => kind.value === entry.kind)
                          ?.label
                      }{" "}
                      · <time dateTime={entry.date}>{entry.date}</time>
                    </p>
                    <h3 className="mt-2 break-words text-lg font-medium leading-7">
                      {entry.title}
                    </h3>
                  </div>
                  <span className="rounded-full bg-surface px-3 py-2 text-sm text-green">
                    {entry.kind === "application"
                      ? "Activity recorded"
                      : entry.independent
                        ? "Independent attempt"
                        : "Hints / help used"}
                  </span>
                </div>
                {entry.notes && (
                  <p className="mt-4 whitespace-pre-wrap break-words text-base leading-7 text-muted-ink">
                    {entry.notes}
                  </p>
                )}
                {entry.reviews.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.reviews.map((date) => (
                      <Button
                        key={date}
                        variant="outline"
                        disabled={date > today}
                        aria-pressed={entry.completedReviews.includes(date)}
                        onClick={() =>
                          update((current) => ({
                            ...current,
                            entries: current.entries.map((item) =>
                              item.id !== entry.id
                                ? item
                                : {
                                    ...item,
                                    completedReviews:
                                      item.completedReviews.includes(date)
                                        ? item.completedReviews.filter(
                                            (value) => value !== date,
                                          )
                                        : [...item.completedReviews, date],
                                  },
                            ),
                          }))
                        }
                        className="min-h-11 whitespace-normal border-line bg-surface px-3 py-2 text-sm text-muted-ink aria-pressed:bg-green-soft aria-pressed:text-green"
                      >
                        {entry.completedReviews.includes(date) && (
                          <Check size={15} aria-hidden="true" />
                        )}
                        {entry.completedReviews.includes(date)
                          ? "Reviewed"
                          : date <= today
                            ? "Mark reviewed"
                            : "Review scheduled"}{" "}
                        · {date}
                      </Button>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex flex-wrap justify-between gap-3">
                  <p className="self-center text-sm text-muted-ink">
                    {entry.reviews.length > 0
                      ? "Only mark reviewed after a real re-attempt."
                      : "Keep applying while interviews are active."}
                  </p>
                  <Button
                    variant="ghost"
                    aria-label={`Remove attempt: ${entry.title}`}
                    className="min-h-11 text-sm text-muted-ink"
                    onClick={() => {
                      setRemoved(entry);
                      update((current) => ({
                        ...current,
                        entries: current.entries.filter(
                          (item) => item.id !== entry.id,
                        ),
                      }));
                    }}
                  >
                    Remove attempt
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </PreparationShell>
  );
}

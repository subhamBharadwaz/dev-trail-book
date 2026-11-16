import type { Readiness, ReadinessAction } from "@trailbook/learning/readiness";
import { Button } from "@/components/ui/button";
import { ProgressMeter } from "@/components/ui/progress-meter";
export function LearningSignals({
  data: d,
  open,
}: {
  data: Readiness;
  open(action: ReadinessAction): void;
}) {
  return (
    <div className="grid gap-7 lg:grid-cols-2">
      <section className="rounded-2xl border border-line p-5 sm:p-7">
        <h2 className="text-xl font-medium">Where to spend another attempt</h2>
        <p className="mt-3 text-sm leading-6 text-muted-ink">
          Open notebook gaps and your latest rating per prompt in the last 30
          days. Overdue gaps come first.
        </p>
        <div className="mt-5 space-y-5">
          {d.weakTopics.length ? (
            d.weakTopics.slice(0, 5).map((t) => (
              <article key={t.id} className="border-t border-line pt-4">
                <h3 className="break-words text-base font-medium">{t.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-ink">
                  {t.mistakes} open gaps · {t.overdue} overdue · {t.lowRatings}{" "}
                  low self-ratings
                </p>
                <Button
                  variant="ghost"
                  className="mt-2"
                  onClick={() =>
                    open({
                      id: t.id,
                      title: t.title,
                      detail: "",
                      target: t.slug
                        ? "topic"
                        : t.mistakes
                          ? "mistakes"
                          : "interviews",
                      sessionId:
                        !t.slug && !t.mistakes ? t.sessionId : undefined,
                      slug: t.slug || undefined,
                    })
                  }
                  aria-label={`Revisit: ${t.title}`}
                >
                  Revisit this →
                </Button>
              </article>
            ))
          ) : (
            <p className="text-base leading-7 text-muted-ink">
              No weak-topic signals yet. A mock assessment or an honest mistake
              gives you a better starting point than a guessed score.
            </p>
          )}
        </div>
      </section>
      <section className="rounded-2xl border border-line p-5 sm:p-7">
        <h2 className="text-xl font-medium">Reading coverage</h2>
        <p className="mt-3 text-sm leading-6 text-muted-ink">
          {d.read} of {d.total} lessons marked read. Reading completion tracks
          exposure; recall and problem-solving need separate practice.
        </p>
        <div className="mt-5 space-y-5">
          {d.coverage.map((c) => (
            <div key={c.id}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span>{c.name}</span>
                <span className="text-muted-ink">
                  {c.read}/{c.total}
                </span>
              </div>
              <ProgressMeter
                value={c.read}
                max={c.total}
                label={`${c.name} reading coverage`}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

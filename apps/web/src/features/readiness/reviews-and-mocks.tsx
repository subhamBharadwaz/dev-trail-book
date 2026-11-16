import type { Readiness, ReadinessAction } from "@trailbook/learning/readiness";
import { Button } from "@/components/ui/button";
import { ProgressMeter } from "@/components/ui/progress-meter";
export function ReviewsAndMocks({
  data: d,
  open,
}: {
  data: Readiness;
  open(action: ReadinessAction): void;
}) {
  return (
    <div className="grid gap-7 lg:grid-cols-2">
      <section className="rounded-2xl border border-line p-5 sm:p-7">
        <h2 className="text-xl font-medium">Reviews waiting for you</h2>
        <p className="mt-3 text-sm leading-6 text-muted-ink">
          {d.overdue} overdue · {d.dueToday} due today. Each scheduled journal
          retry counts as one review.
        </p>
        <div className="mt-5 space-y-4">
          {d.reviews.length ? (
            d.reviews.slice(0, 5).map((review) => (
              <article key={review.id} className="border-t border-line pt-4">
                <h3 className="break-words text-base font-medium">
                  {review.title}
                </h3>
                <p className="mt-2 text-sm text-muted-ink">
                  Due {review.date} · {review.detail}
                </p>
                <Button
                  variant="ghost"
                  className="mt-2"
                  aria-label={`Open review: ${review.title} due ${review.date}`}
                  onClick={() =>
                    open({
                      id: review.id,
                      title: review.title,
                      detail: "",
                      target: review.target,
                    })
                  }
                >
                  Open review →
                </Button>
              </article>
            ))
          ) : (
            <p className="text-base leading-7 text-muted-ink">
              Nothing is due right now. New mistakes and scheduled journal
              reviews will appear here.
            </p>
          )}
        </div>
        {d.reviews.length > 5 && (
          <p className="mt-4 text-sm text-muted-ink">
            Showing the oldest five of {d.reviews.length} reviews.
          </p>
        )}
      </section>
      <section className="rounded-2xl border border-line p-5 sm:p-7">
        <h2 className="text-xl font-medium">Your recent mock pattern</h2>
        <p className="mt-3 text-sm leading-6 text-muted-ink">
          Last five completed sessions, oldest to newest. These are self-ratings
          on different question sets, not matched interview grades.
        </p>
        <div className="mt-5 space-y-5">
          {d.trend.length ? (
            d.trend.map((mock, index) => (
              <article key={mock.id} className="border-t border-line pt-4">
                <div className="flex flex-wrap justify-between gap-2">
                  <h3 className="font-medium">
                    {mock.date} · {mock.duration} min
                  </h3>
                  <p className="text-green">
                    {mock.score === null
                      ? "Not assessed"
                      : `${mock.score}% self-rated`}
                  </p>
                </div>
                <p className="my-3 text-sm text-muted-ink">
                  {mock.focus === "all" ? "Mixed topics" : mock.focus} ·{" "}
                  {mock.rated}/{mock.total} answers assessed
                </p>
                {mock.score !== null && (
                  <ProgressMeter
                    value={mock.score}
                    max={100}
                    label={`Mock ${index + 1} self-assessed score`}
                  />
                )}
                <Button
                  variant="ghost"
                  className="mt-3"
                  aria-label={`Review mock ${index + 1} from ${mock.date}`}
                  onClick={() =>
                    open({
                      id: mock.id,
                      title: "Review mock",
                      detail: "",
                      target: "interviews",
                      sessionId: mock.id,
                    })
                  }
                >
                  Review session →
                </Button>
              </article>
            ))
          ) : (
            <p className="text-base leading-7 text-muted-ink">
              Finish a timed mock and assess its answers to start seeing your
              pattern.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  afterDays,
  day,
  reviewMistake,
  type Mistake,
} from "@trailbook/learning/mistakes";
export function MistakeCard({
  mistake: m,
  save,
  edit,
}: {
  mistake: Mistake;
  save(m: Mistake): void;
  edit(): void;
}) {
  const [revealed, setRevealed] = useState(false);
  return (
    <article className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-ink">
        <span>
          {m.topicTitle} · {m.source}
        </span>
        <span>
          {m.status === "mastered"
            ? "Mastered"
            : m.due <= day()
              ? "Ready to retry"
              : `Retry ${m.due}`}{" "}
          · {m.streak}/3 recalls
        </span>
      </div>
      <h2 className="mt-4 break-words text-xl font-medium leading-relaxed">
        {m.question}
      </h2>
      <p className="mt-3 text-sm text-muted-ink">
        Answer out loud before revealing. {m.misses}{" "}
        {m.misses === 1 ? "miss" : "misses"} recorded.
      </p>
      {revealed && (
        <div className="mt-5 space-y-4 border-t border-line pt-5">
          <div>
            <h3 className="font-medium text-green">Correct answer</h3>
            <p className="mt-2 whitespace-pre-wrap break-words leading-7">
              {m.answer}
            </p>
          </div>
          {m.yourAnswer && (
            <div>
              <h3 className="font-medium">Your previous answer</h3>
              <p className="mt-2 whitespace-pre-wrap break-words text-muted-ink">
                {m.yourAnswer}
              </p>
            </div>
          )}
          <div>
            <h3 className="font-medium">Your reflection</h3>
            <p className="mt-2 whitespace-pre-wrap break-words text-muted-ink">
              {m.explanation ||
                "Add what confused you and a rule you can use next time."}
            </p>
          </div>
        </div>
      )}
      <div className="mt-5 flex flex-wrap gap-3">
        {!revealed ? (
          <Button
            aria-label={`Reveal answer for ${m.question}`}
            onClick={() => setRevealed(true)}
          >
            Reveal answer
          </Button>
        ) : (
          m.status === "open" && (
            <>
              <Button
                disabled={m.due > day()}
                onClick={() => {
                  save(reviewMistake(m, true));
                  setRevealed(false);
                }}
              >
                Recalled it
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  save(reviewMistake(m, false));
                  setRevealed(false);
                }}
              >
                Retry tomorrow
              </Button>
            </>
          )
        )}
        <Button
          variant="outline"
          aria-label={`Edit reflection for ${m.question}`}
          onClick={edit}
        >
          Edit reflection
        </Button>
        {m.status === "mastered" && (
          <Button
            variant="outline"
            onClick={() =>
              save({
                ...m,
                status: "open",
                streak: 0,
                due: day(),
                updatedAt: new Date().toISOString(),
              })
            }
          >
            Reopen for review
          </Button>
        )}
        {m.status === "open" && (
          <Button
            variant="ghost"
            onClick={() =>
              save({
                ...m,
                due: afterDays(1),
                updatedAt: new Date().toISOString(),
              })
            }
          >
            Snooze one day
          </Button>
        )}
        {m.topicSlug && (
          <a
            className="inline-flex min-h-11 items-center text-sm font-medium text-green"
            href={`#/topic/${m.topicSlug}`}
          >
            Read lesson →
          </a>
        )}
      </div>
    </article>
  );
}

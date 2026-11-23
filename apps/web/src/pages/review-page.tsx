import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, CalendarDays, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressMeter } from "@/components/ui/progress-meter";
import { useReviews } from "@/features/reviews/use-reviews";
import { useStudyRecords } from "@/features/account/hooks/use-study-records";
import type { ReviewItem } from "@trailbook/learning/reviews";
import { afterDays } from "@trailbook/learning/mistakes";
export function ReviewPage() {
  const { accountId } = useStudyRecords();
  return <ReviewWorkspace key={accountId ?? "guest"} />;
}
function ReviewWorkspace() {
  const reviews = useReviews();
  const [session, setSession] = useState<{
    ids: string[];
    index: number;
    reviewed: number;
  } | null>(null);
  const [error, setError] = useState("");
  const currentId = session?.ids[session.index];
  const current = reviews.items.find((item) => item.id === currentId);
  const completed = !!session && session.index >= session.ids.length;
  const upcoming = reviews.items.filter(
    (item) => item.due > reviews.today && item.due <= afterDays(7),
  );
  const start = () => {
    setError("");
    setSession({
      ids: reviews.due.slice(0, 10).map((item) => item.id),
      index: 0,
      reviewed: 0,
    });
  };
  const advance = (graded: boolean) =>
    setSession((previous) =>
      previous
        ? {
            ...previous,
            index: previous.index + 1,
            reviewed: previous.reviewed + Number(graded),
          }
        : previous,
    );
  return (
    <div className="mx-auto max-w-4xl space-y-7 px-5 py-8 sm:px-8 lg:py-12">
      <header>
        <p className="text-sm font-semibold tracking-wide text-green">
          LESS REREADING. MORE REMEMBERING.
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
          Your review schedule
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted-ink">
          Bring back what you practiced before it fades. Try to answer without
          the notes, then compare your explanation honestly.
        </p>
      </header>
      <section
        aria-label="Review summary"
        className="grid grid-cols-2 gap-4 rounded-xl border border-line bg-surface p-5 sm:p-6"
      >
        <div>
          <p className="text-sm text-muted-ink">Due today, including overdue</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">
            {reviews.due.length}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-ink">Coming in the next 7 days</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">
            {upcoming.length}
          </p>
        </div>
      </section>
      {reviews.storageError && (
        <p
          role="alert"
          className="rounded-lg border border-line p-4 text-sm leading-7"
        >
          Device storage could not save your review. Keep this page open and
          export a backup before clearing browser data.
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm leading-7 text-ink">
          {error}
        </p>
      )}
      {session && !completed && (
        <>
          <ProgressMeter
            value={session.index}
            max={session.ids.length}
            label="Review session progress"
          />
          <p className="text-sm text-muted-ink">
            Review {session.index + 1} of {session.ids.length}
          </p>
          {current && current.due <= reviews.today ? (
            <ReviewPrompt
              key={current.id}
              item={current}
              onGrade={(recalled) => {
                if (reviews.grade(current.id, recalled)) advance(true);
                else
                  setError(
                    "This review changed or could not be saved. Check Account & sync or skip it for now.",
                  );
              }}
              onSkip={() => advance(false)}
            />
          ) : (
            <section className="space-y-4 rounded-xl border border-line p-6">
              <h2 className="text-xl font-semibold">
                This review is no longer due.
              </h2>
              <p className="text-sm leading-7 text-muted-ink">
                It may have been updated in your notebook or on another device.
                Its schedule has been kept.
              </p>
              <Button onClick={() => advance(false)}>Continue</Button>
            </section>
          )}
        </>
      )}
      {(!session || completed) && (
        <section className="space-y-4 rounded-xl border border-line bg-surface p-5 sm:p-7">
          <CalendarDays size={24} className="text-green" aria-hidden="true" />
          <h2 className="text-xl font-semibold">
            {completed
              ? "A useful session, not just another streak."
              : reviews.due.length
                ? "A small session is enough to start."
                : "You’re caught up for today."}
          </h2>
          {completed && (
            <p className="text-sm leading-7 text-muted-ink">
              {session.reviewed} reviewed ·{" "}
              {session.ids.length - session.reviewed} skipped. Skipped items
              keep their original due date.
            </p>
          )}
          <p className="text-sm leading-7 text-muted-ink">
            {reviews.due.length
              ? "Oldest due items come first. Topics you rated “Needs practice” win ties. Each session contains up to 10 reviews."
              : reviews.items.length
                ? "Your next reviews will appear here when due. You can practice something new in the meantime."
                : "Answer a flashcard or quiz, or add a mistake in your notebook, to start building your schedule. Existing answered practice questions are picked up too."}
          </p>
          <div className="flex flex-wrap gap-3">
            {reviews.due.length > 0 && (
              <Button onClick={start} className="gap-2">
                Start {Math.min(reviews.due.length, 10)}{" "}
                {reviews.due.length === 1 ? "review" : "reviews"}{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            )}
            <a
              className="inline-flex min-h-11 items-center gap-2 text-sm text-green underline underline-offset-4"
              href="/practice"
            >
              Practice questions
            </a>
            <a
              className="inline-flex min-h-11 items-center text-sm text-green underline underline-offset-4"
              href="/mistakes"
            >
              Mistake notebook
            </a>
          </div>
        </section>
      )}
      {upcoming.length > 0 && (
        <section aria-labelledby="upcoming-heading" className="space-y-4">
          <h2 id="upcoming-heading" className="text-xl font-semibold">
            A look ahead
          </h2>
          <ul className="divide-y divide-line rounded-xl border border-line px-5">
            {upcoming.slice(0, 7).map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-start justify-between gap-2 py-4"
              >
                <p className="min-w-0 flex-1 text-sm leading-7">
                  {item.question}
                </p>
                <time
                  dateTime={item.due}
                  className="text-sm tabular-nums text-muted-ink"
                >
                  {item.due}
                </time>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="space-y-3 border-t border-line pt-6 text-sm leading-7 text-muted-ink">
        <h2 className="text-base font-semibold text-ink">
          How the schedule works
        </h2>
        <p>
          Question reviews move through 1, 3, 7, 14, 30 and 60 days after
          successful recall when due. A miss brings the next review back to
          tomorrow. Repeating an answer early does not push its due date
          forward.
        </p>
        <p>
          Notebook mistakes keep their existing 1, 3 and 7-day retry sequence. A
          question already represented by an open mistake appears only once.
          This is a practical recall schedule, not a measured mastery score.
        </p>
        <a
          className="inline-flex min-h-11 items-center text-green underline"
          href="/backup"
        >
          Export your schedule with your study backup
        </a>
      </section>
    </div>
  );
}
function ReviewPrompt({
  item,
  onGrade,
  onSkip,
}: {
  item: ReviewItem;
  onGrade: (recalled: boolean) => void;
  onSkip: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);
  const hasAnswer = !!item.answer.trim();
  return (
    <section
      className="space-y-5 rounded-xl border border-line bg-surface p-5 sm:p-7"
      aria-label="Current review"
    >
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-ink">
        <span>
          {item.kind === "mistake" ? "From your notebook" : "Practice question"}
        </span>
        <span>{item.topicTitle}</span>
        {item.weak && (
          <span className="rounded bg-green-soft px-2 py-1 text-green">
            Needs practice
          </span>
        )}
      </div>
      <h2
        ref={heading}
        tabIndex={-1}
        className="text-xl font-semibold leading-8 outline-none focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green"
      >
        {item.question}
      </h2>
      <p className="text-sm leading-7 text-muted-ink">
        Answer aloud or on paper before opening the reference. A
        familiar-looking answer is different from recalling it yourself.
      </p>
      {!revealed ? (
        <Button onClick={() => setRevealed(true)} className="gap-2">
          <BookOpen size={16} aria-hidden="true" />
          Show reference answer
        </Button>
      ) : (
        <>
          <div className="space-y-3 rounded-lg border border-line bg-page p-4">
            <h3 className="text-sm font-semibold">Reference answer</h3>
            <p className="whitespace-pre-wrap text-base leading-8">
              {hasAnswer
                ? item.answer
                : "Add a reference answer in your mistake notebook before grading this item."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              disabled={!hasAnswer}
              variant="outline"
              onClick={() => onGrade(false)}
              className="gap-2"
            >
              <RotateCcw size={16} aria-hidden="true" />
              Needs another try
            </Button>
            <Button disabled={!hasAnswer} onClick={() => onGrade(true)}>
              Recalled without help
            </Button>
          </div>
        </>
      )}
      <div className="flex flex-wrap justify-between gap-3 border-t border-line pt-3">
        <Button variant="ghost" onClick={onSkip}>
          Skip for now
        </Button>
        {item.topicSlug && (
          <a
            className="inline-flex min-h-11 items-center text-sm text-green underline"
            href={`/topic/${item.topicSlug}`}
          >
            Revisit lesson
          </a>
        )}
      </div>
    </section>
  );
}

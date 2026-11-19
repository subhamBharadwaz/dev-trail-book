import { ArrowRight, BookOpen, Clock3, CornerDownRight } from "lucide-react";
import { ProgressMeter } from "@/components/ui/progress-meter";
import type { Topic } from "@/features/topics/data/content";
export function StudyHero({
  topic,
  readCount,
  total,
}: {
  topic: Topic;
  readCount: number;
  total: number;
}) {
  const allRead = readCount === total;
  return (
    <section
      aria-label="Your study starting point"
      className="grid gap-8 border-b border-line pb-9 @min-[700px]:grid-cols-[minmax(0,1.2fr)_minmax(0,0.85fr)] @min-[700px]:gap-6 @min-[1050px]:gap-10 @min-[700px]:pb-11"
    >
      <div className="min-w-0 py-1 @min-[700px]:py-4">
        <p className="flex items-center gap-2 text-sm font-medium text-green">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-green" />
          A LITTLE PROGRESS. EVERY DAY.
        </p>
        <h1 className="mt-5 max-w-xl text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[1.06] tracking-[-0.055em] text-ink">
          Learn it.
          <br />
          Build it.
          <br />
          <span className="text-green">Explain it.</span>
        </h1>
        <p className="mt-5 max-w-[430px] text-base leading-8 text-muted-ink">
          Close the gap between knowing a concept and using it. One focused
          session at a time.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a
            href="#/today"
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-green px-5 py-3 text-sm font-medium text-page hover:bg-green/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green"
          >
            Start today’s session
            <ArrowRight size={17} aria-hidden="true" />
          </a>
          <a
            href="#/topics"
            className="inline-flex min-h-12 items-center gap-2 rounded-lg px-3 text-sm font-medium text-ink hover:bg-surface focus-visible:outline-2 focus-visible:outline-green"
          >
            Browse all topics
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="min-w-0 self-center rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-muted-ink">
            {allRead ? "WORTH ANOTHER LOOK" : "YOUR NEXT SMALL STEP"}
          </p>
          <BookOpen
            size={18}
            aria-hidden="true"
            className="shrink-0 text-green"
          />
        </div>
        <p className="mt-7 text-sm text-green">
          {allRead
            ? "Revisit a core concept"
            : readCount
              ? "Keep building your foundation"
              : "Start with a strong foundation"}
        </p>
        <h2 className="mt-2 text-2xl font-medium leading-snug tracking-tight text-ink">
          {topic.title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted-ink">
          {topic.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-ink">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={14} aria-hidden="true" />
            {topic.minutes} min read
          </span>
          <span>{topic.questions.length} recall questions</span>
        </div>
        <a
          href={`#/topic/${topic.slug}`}
          className="mt-6 flex min-h-12 items-center justify-between gap-3 rounded-lg border border-line bg-page px-4 py-3 text-sm font-medium text-green hover:border-green focus-visible:outline-2 focus-visible:outline-green"
        >
          {allRead ? "Review this lesson" : "Open this lesson"}
          <CornerDownRight size={17} aria-hidden="true" />
        </a>
        <div className="mt-7 border-t border-line pt-5">
          <div className="mb-3 flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-ink">Your reading trail</span>
            <span className="font-medium tabular-nums text-ink">
              {readCount}
              <span className="font-normal text-muted-ink"> / {total}</span>
            </span>
          </div>
          <ProgressMeter
            value={readCount}
            max={total}
            label="Lessons marked read"
          />
          <p className="mt-3 text-sm leading-6 text-muted-ink">
            Reading is a start. Practice is what makes it yours.
          </p>
        </div>
      </div>
    </section>
  );
}

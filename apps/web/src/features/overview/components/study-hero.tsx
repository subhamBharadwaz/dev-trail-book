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
        <p className="inline-flex items-center gap-2 rounded-md bg-[var(--peach)] px-2.5 py-1.5 text-xs font-semibold text-[#1d1b18]">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-green" />
          FRONTEND FIRST. AT YOUR PACE.
        </p>
        <h1 className="mt-5 max-w-xl text-[clamp(2.25rem,4vw,3.75rem)] font-bold leading-[1.1] tracking-[-0.045em] text-ink">
          Learn it.
          <br />
          Build it.
          <br />
          <span>Explain it.</span>
        </h1>
        <p className="mt-5 max-w-[330px] text-base leading-7 text-muted-ink">
          From web foundations to confident frontend development.
        </p>
        <div className="mt-5 flex max-w-[280px] flex-col items-stretch gap-3">
          <a
            href="/paths/plan-week-1"
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-[var(--edge)] bg-[var(--button-fill)] px-5 py-3 text-sm font-semibold text-[var(--button-ink)] shadow-[2px_3px_0_var(--edge)] hover:brightness-95 active:translate-y-px active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green"
          >
            Start learning
            <ArrowRight size={17} aria-hidden="true" />
          </a>
          <a
            href="/topics"
            className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-[var(--edge)] bg-surface px-3 text-sm font-medium text-ink shadow-[2px_2px_0_var(--edge)] hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-green"
          >
            Explore topics
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="min-w-0 self-center rounded-xl border border-[var(--edge)] bg-surface bg-[linear-gradient(color-mix(in_srgb,var(--line)_25%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--line)_25%,transparent)_1px,transparent_1px)] bg-size-[20px_20px] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-muted-ink">
            {allRead ? "WORTH ANOTHER LOOK" : "YOUR NEXT STEP"}
          </p>
          <BookOpen
            size={18}
            aria-hidden="true"
            className="shrink-0 text-green"
          />
        </div>
        <p className="sr-only">
          {allRead
            ? "Revisit a core concept"
            : readCount
              ? "Keep building your foundation"
              : "Start with a strong foundation"}
        </p>
        <h2 className="mt-2 text-2xl font-medium leading-snug tracking-tight text-ink">
          {readCount === 0 ? "Web foundations" : topic.title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted-ink">
          {readCount === 0
            ? "Semantic HTML, responsive CSS, and how the browser works."
            : topic.description}
        </p>
        <div className="mt-5 inline-flex flex-wrap gap-x-4 gap-y-2 rounded-md bg-[var(--peach)] px-2 py-1 text-sm text-[#1d1b18]">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={14} aria-hidden="true" />
            {topic.minutes} min read
          </span>
          <span>{topic.questions.length} recall questions</span>
        </div>
        <a
          href={
            readCount === 0 ? "/paths/plan-week-1" : `/topic/${topic.slug}`
          }
          className="mt-6 flex min-h-12 items-center justify-between gap-3 rounded-lg border border-[var(--edge)] bg-page px-4 py-3 text-sm font-medium text-ink shadow-[2px_2px_0_var(--edge)] hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-green"
        >
          {allRead
            ? "Review this lesson"
            : readCount === 0
              ? "Open learning path"
              : "Open this lesson"}
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

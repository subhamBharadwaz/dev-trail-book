import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  GraduationCap,
} from "lucide-react";
import { PathCard } from "@/features/learning-paths/components/path-card";
import {
  getPathProgress,
  learningPaths,
  type LearningPath,
} from "@/features/learning-paths/data/learning-paths";
import { ProgressMeter } from "@/components/ui/progress-meter";
import { useReadingState } from "@/hooks/use-reading-state";
export function LearningPathsPage({ path }: { path?: LearningPath }) {
  const { read } = useReadingState();
  if (!path)
    return (
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-12 md:py-12">
        <p className="text-sm font-medium uppercase tracking-[.15em] text-green">
          A LITTLE DIRECTION GOES A LONG WAY
        </p>
        <h1 className="mt-4 text-4xl font-medium tracking-tight">
          Find a trail. Keep going.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-muted-ink">
          Follow a sequence of connected concepts. Read at your own pace; your
          progress comes along with you.
        </p>
        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          {learningPaths.map((path, index) => (
            <PathCard key={path.id} path={path} read={read} index={index} />
          ))}
        </div>
        <p className="mt-8 text-sm leading-6 text-muted-ink">
          Progress uses your “Mark as read” choices. It stays on this browser.
        </p>
      </div>
    );
  const progress = getPathProgress(path, read);
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-12">
      <a
        href="#/paths"
        className="inline-flex items-center gap-2 text-sm text-muted-ink"
      >
        <ArrowLeft size={14} />
        All learning paths
      </a>
      <div className="mt-9 flex size-12 items-center justify-center rounded-xl bg-green-soft text-green">
        <GraduationCap size={25} />
      </div>
      <p className="mt-6 text-sm uppercase tracking-[.15em] text-green">
        {path.level}
      </p>
      <h1 className="mt-3 text-4xl font-medium leading-tight tracking-tight">
        {path.title}
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-muted-ink">
        {path.description}
      </p>
      <div className="mt-7 rounded-xl border border-line bg-surface p-5">
        <div className="mb-3 flex items-center justify-between gap-4 text-sm">
          <span>
            {progress.completed} of {progress.total} topics read
          </span>
          <strong className="font-medium text-green">
            {progress.percent}%
          </strong>
        </div>
        <ProgressMeter
          value={progress.completed}
          max={progress.total}
          label="Learning path progress"
        />
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-sm text-muted-ink">
            <Clock3 size={14} />
            {progress.minutes} minutes of reading
          </span>
          <a
            href={`#/topic/${(progress.next || progress.topics[0]).slug}`}
            className="inline-flex items-center gap-3 rounded-lg bg-[#2c684e] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#20513b]"
          >
            {progress.percent === 100
              ? "Revisit first topic"
              : progress.completed
                ? "Continue learning"
                : "Start this path"}
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
      <ol className="mt-7 divide-y divide-[var(--line)]">
        {progress.topics.map((topic, index) => (
          <li key={topic.slug}>
            <a
              href={`#/topic/${topic.slug}`}
              className="group flex items-center gap-4 rounded-lg py-6 focus-visible:outline-2 focus-visible:outline-green"
            >
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-full border ${read.includes(topic.slug) ? "border-green bg-green-soft text-green" : "border-line text-muted-ink"}`}
              >
                {read.includes(topic.slug) ? (
                  <Check size={16} aria-label="Read" />
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-medium group-hover:text-green">
                  {topic.title}
                </h2>
                <p className="mt-1.5 text-sm leading-6 text-muted-ink">
                  {topic.description}
                </p>
                <span className="mt-2 block text-sm text-muted-ink">
                  {topic.minutes} min read
                </span>
              </div>
              <ArrowRight size={16} className="shrink-0 text-green" />
            </a>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line p-5">
        <div>
          <h2 className="text-sm font-medium">
            Put your understanding to the test.
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-ink">
            Practice questions from this path, at any point in your reading.
          </p>
        </div>
        <a
          href={`#/practice/path/${path.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-green"
        >
          Practice this path
          <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}

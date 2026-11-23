import { ArrowRight, Clock3, Route } from "lucide-react";
import { ProgressMeter } from "@/components/ui/progress-meter";
import { getPathProgress, type LearningPath } from "../data/learning-paths";
export function PathCard({
  path,
  read,
  index,
}: {
  path: LearningPath;
  read: string[];
  index: number;
}) {
  const progress = getPathProgress(path, read);
  return (
    <a
      href={`/paths/${path.id}`}
      className="group flex min-w-0 h-full flex-col rounded-xl border border-line bg-page p-6 transition-colors hover:border-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green"
    >
      <div className="flex items-center justify-between">
        <span className="flex size-10 items-center justify-center rounded-xl bg-green-soft text-green">
          <Route size={20} />
        </span>
        <span className="font-mono text-sm text-muted-ink">0{index + 1}</span>
      </div>
      <p className="mt-6 text-sm font-medium uppercase tracking-[.13em] text-green">
        {path.level}
      </p>
      <h2 className="mt-3 text-xl font-medium tracking-tight">{path.title}</h2>
      <p className="mt-3 flex-1 text-sm leading-7 text-muted-ink">
        {path.description}
      </p>
      <div className="mb-5 mt-6 flex flex-wrap gap-4 text-sm text-muted-ink">
        <span>{progress.total} topics</span>
        <span className="flex items-center gap-1.5">
          <Clock3 size={13} />
          {progress.minutes} min
        </span>
      </div>
      <ProgressMeter
        value={progress.completed}
        max={progress.total}
        label={`${path.title} progress`}
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-muted-ink">
          {progress.completed} of {progress.total} read
        </span>
        <span className="flex items-center gap-2 font-medium text-green">
          {progress.percent === 100
            ? "Revisit path"
            : progress.completed
              ? "Continue path"
              : "Explore path"}
          <ArrowRight size={14} />
        </span>
      </div>
    </a>
  );
}

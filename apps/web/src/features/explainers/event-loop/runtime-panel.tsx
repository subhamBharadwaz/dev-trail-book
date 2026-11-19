import {
  ArrowDown,
  Layers3,
  ListOrdered,
  Timer,
  type LucideIcon,
} from "lucide-react";
import type { Frame, Lane } from "./trace";
const icons: Record<Lane, LucideIcon> = {
  stack: Layers3,
  browser: Timer,
  microtasks: ListOrdered,
  tasks: ListOrdered,
};
const descriptions: Record<Lane, string> = {
  stack: "Top frame runs first",
  browser: "Delay threshold, not a deadline",
  microtasks: "Drain at the checkpoint",
  tasks: "Wait for the next task selection",
};
export function RuntimePanel({
  lane,
  title,
  frames,
  active,
}: {
  lane: Lane;
  title: string;
  frames: Frame[];
  active: boolean;
}) {
  const Icon = icons[lane];
  return (
    <section
      aria-label={title}
      className={`min-w-0 rounded-xl border p-3 sm:p-4 ${active ? "border-green/60 bg-green-soft" : "border-line bg-page"}`}
    >
      <div className="flex items-center gap-2 text-sm font-medium text-ink">
        <Icon size={16} className="shrink-0 text-green" aria-hidden="true" />
        <h4>{title}</h4>
      </div>
      <p className="mb-3 mt-1 text-xs leading-relaxed text-muted-ink">
        {descriptions[lane]}
      </p>
      <ol
        className={`flex min-h-24 gap-2 ${lane === "stack" ? "flex-col-reverse justify-start" : "flex-col"}`}
      >
        {frames.map((frame, index) => (
          <li
            data-trace-token={frame.id}
            key={frame.id}
            className="flex min-h-10 items-center gap-2 rounded-lg border border-green/25 bg-green-soft px-2.5 py-2 font-mono text-sm leading-relaxed text-ink"
          >
            {lane !== "stack" && lane !== "browser" && (
              <span className="font-sans text-muted-ink">{index + 1}</span>
            )}
            <span className="min-w-0 break-words">{frame.label}</span>
            {lane === "stack" && index === frames.length - 1 && (
              <ArrowDown
                size={12}
                aria-label="Running frame"
                className="ml-auto shrink-0 text-green"
              />
            )}
          </li>
        ))}
        {frames.length === 0 && (
          <li className="grid min-h-24 place-items-center rounded-lg border border-dashed border-line px-2 text-sm text-muted-ink">
            {lane === "stack" ? "Stack is empty" : "Nothing queued"}
          </li>
        )}
      </ol>
    </section>
  );
}

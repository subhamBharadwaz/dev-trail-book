import { LessonDrawing } from "./drawings/lesson-drawing";
import { useId } from "react";
import { GitBranch, Lightbulb } from "lucide-react";
import type { Diagram } from "./types";
export function TopicDiagram({ visual }: { visual: Diagram }) {
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      className="mb-10 rounded-2xl border border-line bg-surface p-4 text-ink sm:p-6"
    >
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-green">
        <GitBranch size={16} aria-hidden="true" />
        Visual field note
      </p>
      <h2 id={id} className="mt-3 text-2xl font-medium tracking-tight">
        {visual.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-ink">
        {visual.intro}
      </p>
      <LessonDrawing kind={visual.drawing} />
      <div className="rounded-xl border border-line bg-page p-4">
        <h3 className="mb-3 text-sm font-medium">A concrete example</h3>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="mb-1 text-xs font-medium uppercase tracking-wider text-green">
              Input / situation
            </dt>
            <dd className="overflow-x-auto whitespace-pre-wrap break-words font-mono leading-relaxed">
              {visual.example.input}
            </dd>
          </div>
          <div>
            <dt className="mb-1 text-xs font-medium uppercase tracking-wider text-green">
              Result / decision
            </dt>
            <dd className="overflow-x-auto whitespace-pre-wrap break-words font-mono leading-relaxed">
              {visual.example.output}
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-sm leading-relaxed text-muted-ink">
          {visual.example.explanation}
        </p>
      </div>
      <p className="mt-4 flex gap-2 text-sm leading-relaxed text-muted-ink">
        <Lightbulb
          size={18}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-green"
        />
        {visual.takeaway}
      </p>
    </section>
  );
}

import { useId } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowRight,
  CircleHelp,
  Database,
  FileCode2,
  GitBranch,
  Monitor,
  Server,
  ShieldCheck,
} from "lucide-react";
import type { Schematic, VisualStage } from "./schematic-types";
import { ConceptScenes } from "./special-scenes";
const tile = "min-w-0 rounded-xl border border-line bg-page p-3 text-center";
export function Artifact({
  stage,
  index,
  prose = false,
}: {
  stage: VisualStage;
  index?: number;
  prose?: boolean;
}) {
  return (
    <div className={tile}>
      {index !== undefined && (
        <p className="mb-2 font-mono text-xs text-green">
          {String(index + 1).padStart(2, "0")}
        </p>
      )}
      <FileCode2
        size={24}
        className="mx-auto mb-2 text-green"
        aria-hidden="true"
      />
      <h3 className="text-sm font-semibold">{stage.label}</h3>
      <p
        className={`mt-2 whitespace-pre-wrap break-words rounded border border-line bg-surface px-2 py-2 text-sm leading-relaxed ${prose ? "font-sans" : "font-mono"}`}
      >
        {stage.value}
      </p>
      {stage.items && (
        <ul className="mt-2 space-y-1 text-left">
          {stage.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-1.5 text-xs leading-relaxed text-muted-ink"
            >
              <span aria-hidden="true" className="text-green">
                ↳
              </span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export function SchematicDrawing({ spec }: { spec: Schematic }) {
  const id = useId();
  return (
    <figure
      aria-labelledby={id}
      className="@container my-5 rounded-xl border border-line bg-page p-3 sm:p-5"
    >
      <figcaption id={id} className="mb-5 text-base font-medium">
        {spec.title}
      </figcaption>
      <SchematicBody spec={spec} />
      <p className="mt-5 border-t border-line pt-3 text-sm leading-relaxed text-muted-ink">
        {spec.note}
      </p>
    </figure>
  );
}
function SchematicBody({ spec }: { spec: Schematic }) {
  const marker = useId();
  switch (spec.kind) {
    case "sequence": {
      const x = (index: number) => ((index + 0.5) * 600) / spec.actors.length;
      return (
        <div>
          <div
            className={`grid gap-2 ${spec.actors.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}
          >
            {spec.actors.map((actor, index) => (
              <div
                key={actor}
                className="min-w-0 rounded-lg border-2 border-green/40 bg-green-soft px-2 py-3 text-center"
              >
                <span className="mx-auto mb-2 block w-fit text-green">
                  {index === 0 ? (
                    <Monitor size={20} aria-hidden="true" />
                  ) : index === spec.actors.length - 1 &&
                    spec.actors.length === 3 ? (
                    <Database size={20} aria-hidden="true" />
                  ) : (
                    <Server size={20} aria-hidden="true" />
                  )}
                </span>
                <h3 className="break-words text-sm font-semibold">{actor}</h3>
              </div>
            ))}
          </div>
          <ol className="mt-3">
            {spec.messages.map((message, index) => (
              <li
                key={`${index}-${message.label}`}
                className="relative border-b border-line py-2"
              >
                <p className="text-center font-mono text-sm leading-relaxed">
                  <span className="mr-2 text-xs text-muted-ink">
                    {index + 1}.
                  </span>
                  {message.label}
                </p>
                <svg
                  viewBox="0 0 600 38"
                  className="h-9 w-full"
                  aria-hidden="true"
                >
                  <defs>
                    <marker
                      id={`${marker}-${index}`}
                      markerWidth="8"
                      markerHeight="8"
                      refX="7"
                      refY="4"
                      orient="auto"
                    >
                      <path d="M0 0 L8 4 L0 8" className="fill-green" />
                    </marker>
                  </defs>
                  {spec.actors.map((actor, i) => (
                    <line
                      key={actor}
                      x1={x(i)}
                      x2={x(i)}
                      y1="0"
                      y2="38"
                      strokeDasharray="4 4"
                      className="stroke-line"
                      strokeWidth="2"
                    />
                  ))}
                  <line
                    x1={x(message.from)}
                    x2={x(message.to)}
                    y1="20"
                    y2="20"
                    className="stroke-green"
                    strokeWidth="2"
                    markerEnd={`url(#${marker}-${index})`}
                  />
                </svg>
                <p className="sr-only">
                  {spec.actors[message.from]} to {spec.actors[message.to]}
                </p>
              </li>
            ))}
          </ol>
        </div>
      );
    }
    case "flow":
      return (
        <ol className="flex flex-col items-stretch gap-2 @min-[600px]:flex-row">
          {spec.stages.map((stage, index) => (
            <li
              key={stage.label}
              className="flex min-w-0 flex-1 flex-col items-stretch gap-2 @min-[600px]:flex-row"
            >
              <div className="min-w-0 flex-1">
                <Artifact stage={stage} index={index} />
              </div>
              {index < spec.stages.length - 1 && (
                <div className="flex items-center justify-center text-green">
                  <ArrowDown
                    className="@min-[600px]:hidden"
                    size={20}
                    aria-hidden="true"
                  />
                  <ArrowRight
                    className="hidden @min-[600px]:block"
                    size={20}
                    aria-hidden="true"
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      );
    case "fork":
      return (
        <div>
          <div
            className={`grid gap-3 ${spec.inputs.length > 1 ? "grid-cols-2" : ""}`}
          >
            {spec.inputs.map((stage) => (
              <Artifact key={stage.label} stage={stage} />
            ))}
          </div>
          <div className="my-3 flex justify-around text-green">
            {spec.inputs.map((stage) => (
              <ArrowDown key={stage.label} size={22} aria-hidden="true" />
            ))}
          </div>
          <div className="rounded-xl border-2 border-green/50 bg-green-soft p-4 text-center">
            <GitBranch
              className="mx-auto mb-2 text-green"
              size={24}
              aria-hidden="true"
            />
            <h3 className="font-semibold">{spec.hub.label}</h3>
            <p className="mt-2 whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
              {spec.hub.value}
            </p>
          </div>
          <div className="my-3 flex justify-around text-green">
            {spec.outputs.map((stage) => (
              <ArrowDown key={stage.label} size={22} aria-hidden="true" />
            ))}
          </div>
          <div
            className={`grid gap-3 ${spec.outputs.length > 1 ? "@min-[440px]:grid-cols-2" : ""}`}
          >
            {spec.outputs.map((stage) => (
              <Artifact key={stage.label} stage={stage} />
            ))}
          </div>
        </div>
      );
    case "states":
      return (
        <div>
          <div className="flex w-fit max-w-full items-center gap-2 rounded-full border-2 border-green/50 bg-green-soft px-4 py-3 text-sm font-semibold">
            <CircleHelp size={20} className="shrink-0" aria-hidden="true" />
            {spec.root}
          </div>
          <ul
            aria-label="Independent outcomes"
            className="ml-4 space-y-4 border-l-2 border-dashed border-green/50 py-4 pl-6"
          >
            {spec.branches.map((branch) => (
              <li key={branch.label} className="relative min-w-0">
                <span
                  aria-hidden="true"
                  className="absolute -left-6 top-5 h-px w-6 bg-green/50"
                />
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="absolute -left-4 top-3 text-green"
                />
                <div className="grid min-w-0 gap-3 rounded-xl border border-line bg-page p-3 @min-[480px]:grid-cols-[140px_minmax(0,1fr)]">
                  <div>
                    <h3 className="font-mono text-sm font-semibold">
                      {branch.label}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-green">
                      {branch.when}
                    </p>
                  </div>
                  <p className="min-w-0 whitespace-pre-wrap break-words rounded-lg border border-line bg-surface px-3 py-2 font-mono text-sm leading-relaxed">
                    {branch.value}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    case "cycle":
      return (
        <div className="relative">
          <ArrowRight
            size={22}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 text-green"
          />
          <ArrowDown
            size={22}
            aria-hidden="true"
            className="pointer-events-none absolute left-3/4 top-1/2 -translate-x-1/2 -translate-y-1/2 text-green"
          />
          <ArrowLeft
            size={22}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-3/4 -translate-x-1/2 -translate-y-1/2 text-green"
          />
          <ArrowUp
            size={22}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 text-green"
          />
          <ol className="relative grid grid-cols-2 gap-x-10 gap-y-14">
            {spec.stages.map((stage, index) => (
              <li
                key={stage.label}
                className={
                  index === 2 ? "order-4" : index === 3 ? "order-3" : ""
                }
              >
                <Artifact stage={stage} index={index} prose />
              </li>
            ))}
          </ol>
        </div>
      );
    case "security":
      return (
        <div className="space-y-4">
          {spec.rows.map((row) => (
            <div key={row.gate} className="rounded-xl border border-line p-3">
              <p className="mb-3 whitespace-pre-wrap break-words rounded bg-surface px-3 py-2 font-mono text-sm">
                {row.input}
              </p>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-green/50" />
                <div className="flex max-w-[80%] items-center gap-2 rounded-full border-2 border-green/50 bg-green-soft px-3 py-2 text-sm font-semibold">
                  <ShieldCheck
                    size={20}
                    className="shrink-0 text-green"
                    aria-hidden="true"
                  />
                  {row.gate}
                </div>
                <div className="h-px flex-1 bg-green/50" />
              </div>
              <ArrowDown
                className="mx-auto my-2 text-green"
                size={18}
                aria-hidden="true"
              />
              <p className="whitespace-pre-wrap break-words text-center font-mono text-sm leading-relaxed">
                {row.output}
              </p>
            </div>
          ))}
        </div>
      );
    case "waterfall":
      return (
        <div className="space-y-6">
          {[false, true].map((parallel) => (
            <div key={String(parallel)}>
              <h3 className="mb-3 text-sm font-semibold">
                {parallel
                  ? "Independent work started together"
                  : "Accidental sequential waits"}
              </h3>
              <div className="flex justify-between text-xs text-muted-ink">
                <span>0 ms</span>
                <span>300 ms</span>
                <span>600 ms</span>
              </div>
              {["Profile", "Projects"].map((label, index) => (
                <div key={label} className="mt-2">
                  <p className="text-sm">
                    {label} <span className="text-muted-ink">300 ms</span>
                  </p>
                  <svg
                    viewBox="0 0 600 22"
                    preserveAspectRatio="none"
                    className="mt-1 h-6 w-full rounded bg-surface"
                    aria-hidden="true"
                  >
                    <line
                      x1="300"
                      x2="300"
                      y1="0"
                      y2="22"
                      className="stroke-line"
                    />
                    <rect
                      x={parallel ? 0 : index * 300}
                      y="2"
                      width="300"
                      height="18"
                      rx="4"
                      className="fill-green"
                    />
                  </svg>
                </div>
              ))}
              <p className="mt-2 font-mono text-sm text-green">
                Waiting ≈ {parallel ? 300 : 600} ms + overhead
              </p>
            </div>
          ))}
        </div>
      );
    case "funnel": {
      const max = Math.max(...spec.stages.map((stage) => stage.count));
      return (
        <ol className="space-y-4">
          {spec.stages.map((stage) => (
            <li key={stage.label}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-sm font-medium">{stage.label}</h3>
                <strong className="font-mono text-lg tabular-nums">
                  {stage.count}
                </strong>
              </div>
              <svg
                viewBox="0 0 100 14"
                preserveAspectRatio="none"
                className="h-10 w-full rounded-lg bg-surface"
                aria-hidden="true"
              >
                <rect
                  width={(stage.count / max) * 100}
                  height="14"
                  rx="2"
                  className="fill-green"
                />
              </svg>
            </li>
          ))}
        </ol>
      );
    }
    default:
      return <ConceptScenes kind={spec.kind} />;
  }
}

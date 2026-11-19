import { LessonDrawing } from "./drawings/lesson-drawing";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsiblePanel,
} from "@ui-sdk/react/collapsible";
import { BinaryTree } from "./shared/binary-tree";
import { useId, useRef, useState } from "react";
import { Button } from "@ui-sdk/react/button";
import { Braces, Lightbulb } from "lucide-react";
import type { Scenario, Walkthrough } from "./types";
import { PlaybackControls, visualButton } from "./shared/playback-controls";
import { usePlayback } from "./shared/use-playback";
import { useTraceMotion } from "./shared/use-trace-motion";
export function TopicWalkthrough({ visual }: { visual: Walkthrough }) {
  const [selected, setSelected] = useState(visual.scenarios[0].id);
  const scenario = visual.scenarios.find((item) => item.id === selected)!;
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      className="mb-10 rounded-2xl border border-line bg-surface text-ink"
    >
      <header className="p-4 sm:p-6">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-green">
          <Braces size={16} aria-hidden="true" />
          Interactive explainer
        </p>
        <h2 id={id} className="mt-3 text-2xl font-medium tracking-tight">
          {visual.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-ink">
          {visual.intro}
        </p>
        {visual.scenarios.length > 1 && (
          <div
            className="mt-4 flex flex-wrap gap-2"
            aria-label="Worked examples"
          >
            {visual.scenarios.map((item) => (
              <Button
                key={item.id}
                aria-label={`Try example: ${item.label}`}
                aria-pressed={selected === item.id}
                className={`${visualButton} aria-pressed:border-green aria-pressed:bg-green-soft aria-pressed:text-green`}
                onClick={() => setSelected(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        )}
      </header>
      {visual.drawing && (
        <Collapsible
          className="mx-4 mb-4 sm:mx-6"
          aria-label="Table relationship reference"
        >
          <CollapsibleTrigger className={`${visualButton} w-full`}>
            See the table relationship
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <LessonDrawing kind={visual.drawing} />
          </CollapsiblePanel>
        </Collapsible>
      )}
      <ScenarioPlayer key={scenario.id} scenario={scenario} />
      <div className="m-4 flex gap-2 rounded-xl border border-line bg-page p-4 text-sm leading-relaxed sm:m-6">
        <Lightbulb
          size={18}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-green"
        />
        <p>{visual.takeaway}</p>
      </div>
      <p className="border-t border-line px-4 py-3 text-xs leading-relaxed text-muted-ink sm:px-6">
        Guided example: step controls change this teaching model; they do not
        run arbitrary code.
        {visual.source && (
          <>
            {" "}
            <a
              href={visual.source}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              Read the reference ↗
            </a>
          </>
        )}
      </p>
    </section>
  );
}
function ScenarioPlayer({ scenario }: { scenario: Scenario }) {
  const playback = usePlayback(scenario.steps.length);
  const step = scenario.steps[playback.cursor];
  const root = useRef<HTMLDivElement>(null);
  useTraceMotion(root, playback.cursor, playback.animate);
  return (
    <>
      <PlaybackControls
        playback={playback}
        total={scenario.steps.length}
        title={step.title}
      />
      <div className="p-4 sm:p-6">
        <div
          aria-live={playback.playing ? "off" : "polite"}
          aria-atomic="true"
          className="mb-4 rounded-xl border border-line bg-page p-4"
        >
          <h3 className="font-medium">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-ink">
            {step.detail}
          </p>
        </div>
        <div className="mb-4 overflow-x-auto rounded-xl border border-line bg-page py-3">
          <pre
            aria-label="Worked example code"
            className="min-w-max font-mono text-sm leading-7"
          >
            <code>
              {scenario.code.map((line, index) => (
                <span
                  key={`${index}-${line}`}
                  aria-current={index === step.line ? "step" : undefined}
                  className={`flex gap-3 border-l-2 px-3 ${index === step.line ? "border-green bg-green-soft text-ink" : "border-transparent text-muted-ink"}`}
                >
                  <span
                    aria-hidden="true"
                    className="w-4 select-none text-right opacity-70"
                  >
                    {index + 1}
                  </span>
                  <span>{line || " "}</span>
                  {"\n"}
                </span>
              ))}
            </code>
          </pre>
        </div>
        <div ref={root}>
          {step.tree && <BinaryTree {...step.tree} />}
          {step.cells && (
            <section
              aria-label="Algorithm values and pointers"
              className="mb-4 rounded-xl border border-line bg-page p-3"
            >
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-ink">
                Values · zero-based indices
              </p>
              <ol className="flex flex-wrap gap-2">
                {step.cells.map((cell, index) => (
                  <li
                    key={cell.id}
                    className={`min-w-12 flex-1 rounded-lg border p-2 text-center ${cell.markers?.length ? "border-green bg-green-soft" : "border-line"} ${cell.muted ? "opacity-40" : ""}`}
                  >
                    <span className="block text-xs text-muted-ink">
                      {index}
                    </span>
                    <span className="mt-1 block font-mono text-base">
                      {cell.value}
                    </span>
                    <div className="mt-2 flex min-h-5 flex-wrap justify-center gap-1">
                      {cell.markers?.map((marker) => (
                        <span
                          key={marker}
                          data-trace-token={`marker-${marker}`}
                          className="rounded bg-green-soft px-1 text-xs font-semibold text-green"
                        >
                          {marker}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}
          <div className="grid gap-3 @min-[520px]:grid-cols-2">
            {step.panels.map((panel) => (
              <section
                key={panel.id}
                aria-label={panel.label}
                className="min-w-0 rounded-xl border border-line bg-page p-4"
              >
                <h4 className="text-sm font-medium">{panel.label}</h4>
                {panel.hint && (
                  <p className="mt-1 text-xs leading-relaxed text-muted-ink">
                    {panel.hint}
                  </p>
                )}
                <ul className="mt-3 flex min-h-12 flex-wrap content-start gap-2">
                  {panel.tokens.map((token) => (
                    <li
                      key={token.id}
                      data-trace-token={token.id}
                      className="max-w-full whitespace-pre-wrap break-words rounded-lg border border-green/25 bg-green-soft px-3 py-2 font-mono text-sm leading-relaxed"
                    >
                      {token.label}
                    </li>
                  ))}
                  {panel.tokens.length === 0 && (
                    <li className="text-sm text-muted-ink">
                      Empty at this step.
                    </li>
                  )}
                </ul>
              </section>
            ))}
          </div>
        </div>
        {step.result && (
          <p
            aria-label="Example result"
            className="mt-4 whitespace-pre-wrap rounded-xl border border-green/40 bg-green-soft p-4 font-mono text-sm leading-relaxed"
          >
            {step.result}
          </p>
        )}
      </div>
    </>
  );
}

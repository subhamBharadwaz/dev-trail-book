import { useEffect, useRef, useState } from "react";
import { Button } from "@ui-sdk/react/button";
import {
  ArrowLeft,
  ArrowRight,
  Braces,
  Check,
  Pause,
  Play,
  RotateCcw,
  Terminal,
} from "lucide-react";
import { RuntimePanel } from "./runtime-panel";
import { source, trace } from "./trace";
import { useTraceMotion } from "../shared/use-trace-motion";
const control =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-line bg-page px-3 text-sm font-medium text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green disabled:cursor-not-allowed disabled:opacity-40";
export default function EventLoopExplainer() {
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const animate = useRef(false);
  const step = trace[cursor];
  const last = cursor === trace.length - 1;
  useTraceMotion(root, cursor, animate);
  useEffect(() => {
    if (!playing || last) return;
    const timer = window.setTimeout(() => {
      animate.current = true;
      setCursor((value) => value + 1);
    }, 2200);
    const pause = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", pause);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", pause);
    };
  }, [cursor, playing, last]);
  function move(to: number, pointer: boolean) {
    animate.current = pointer;
    setPlaying(false);
    setCursor(Math.max(0, Math.min(trace.length - 1, to)));
  }
  return (
    <section
      aria-labelledby="event-loop-lab-title"
      className="mb-10 rounded-2xl border border-line bg-surface text-ink"
    >
      <header className="p-4 pb-0 sm:p-6 sm:pb-0">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-green">
          <Braces size={16} aria-hidden="true" />
          Interactive explainer · browser JavaScript
        </p>
        <h2
          id="event-loop-lab-title"
          className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl"
        >
          Watch the event loop work.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-ink">
          Follow the code. Track the queues. See why a promise runs before a
          timer.
        </p>
      </header>
      <div className="m-4 overflow-hidden rounded-xl border border-line bg-page sm:m-6">
        <div className="flex items-center justify-between border-b border-line px-3 py-2 text-xs text-muted-ink">
          <span className="font-mono">example.js</span>
          <span>Predict the output first</span>
        </div>
        <div className="overflow-x-auto py-3">
          <pre
            aria-label="JavaScript example"
            className="min-w-max font-mono text-sm leading-7"
          >
            <code>
              {source.map((line, index) => (
                <span
                  key={line}
                  aria-current={step.line === index ? "step" : undefined}
                  className={`flex gap-3 border-l-2 px-3 ${step.line === index ? "border-green bg-green-soft text-ink" : "border-transparent text-muted-ink"}`}
                >
                  <span
                    aria-hidden="true"
                    className="w-3 select-none text-right opacity-70"
                  >
                    {index + 1}
                  </span>
                  <span>{line}</span>
                  {step.line === index && (
                    <span className="pr-3 text-green" aria-hidden="true">
                      ←
                    </span>
                  )}
                  {"\n"}
                </span>
              ))}
            </code>
          </pre>
        </div>
      </div>
      <div className="sticky top-16 z-10 mb-4 flex flex-wrap items-center gap-2 border-y border-line bg-surface px-4 py-3 sm:px-6">
        <p className="w-full truncate text-sm text-muted-ink">
          Step {cursor + 1}/{trace.length} ·{" "}
          <span className="font-medium text-ink">{step.title}</span>
        </p>
        <Button
          className={control}
          disabled={cursor === 0}
          onClick={(event) => move(cursor - 1, event.detail > 0)}
          aria-label="Previous event-loop step"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Back</span>
        </Button>
        <Button
          className={`${control} flex-1 border-green bg-green-soft text-green sm:flex-none`}
          disabled={last}
          onClick={(event) => move(cursor + 1, event.detail > 0)}
          aria-label="Next event-loop step"
        >
          Next step
          <ArrowRight size={15} aria-hidden="true" />
        </Button>
        <Button
          className={control}
          aria-label={
            playing && !last
              ? "Pause event-loop playback"
              : "Play event-loop trace"
          }
          onClick={() => {
            if (last) {
              animate.current = false;
              setCursor(0);
            }
            setPlaying((value) => (last ? true : !value));
          }}
        >
          {playing && !last ? (
            <Pause size={15} aria-hidden="true" />
          ) : (
            <Play size={15} aria-hidden="true" />
          )}
          <span className="sr-only sm:not-sr-only">
            {playing && !last ? "Pause" : last ? "Replay" : "Play"}
          </span>
        </Button>
        <Button
          className={`${control} sm:ml-auto`}
          disabled={cursor === 0 && !playing}
          aria-label="Reset event-loop trace"
          onClick={() => move(0, false)}
        >
          <RotateCcw size={15} aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Reset</span>
        </Button>
      </div>
      <div className="px-4 sm:px-6">
        <div
          className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-ink"
          aria-label="Execution phase"
        >
          {(
            [
              ["sync", "1. Sync"],
              ["microtasks", "2. Microtasks"],
              ["tasks", "3. Task"],
            ] as const
          ).map(([phase, label], index) => (
            <span key={phase} className="contents">
              {index > 0 && <ArrowRight size={12} aria-hidden="true" />}
              <span
                aria-current={step.phase === phase ? "step" : undefined}
                className={`rounded-full px-2.5 py-1.5 ${step.phase === phase ? "bg-green-soft font-medium text-green" : "bg-page"}`}
              >
                {label}
              </span>
            </span>
          ))}
        </div>
        <div ref={root} className="grid grid-cols-2 gap-3">
          <RuntimePanel
            lane="stack"
            title="Call stack"
            frames={step.stack}
            active={step.stack.length > 0}
          />
          <RuntimePanel
            lane="browser"
            title="Browser timer"
            frames={step.browser}
            active={step.browser.length > 0}
          />
          <RuntimePanel
            lane="microtasks"
            title="Microtask queue"
            frames={step.microtasks}
            active={step.phase === "microtasks" && step.microtasks.length > 0}
          />
          <RuntimePanel
            lane="tasks"
            title="Task queue"
            frames={step.tasks}
            active={step.phase === "tasks"}
          />
        </div>
        <section
          aria-label="Console output"
          className="mt-3 rounded-xl border border-line bg-page p-3 sm:p-4"
        >
          <div className="mb-3 flex items-center justify-between text-sm font-medium">
            <span className="flex items-center gap-2">
              <Terminal size={16} aria-hidden="true" className="text-green" />
              Console
            </span>
            <span className="text-xs font-normal text-muted-ink">
              {step.output.length} / 5 entries
            </span>
          </div>
          <ol className="flex min-h-10 flex-wrap items-center gap-2 font-mono text-sm">
            {step.output.map((entry, index) => (
              <li
                key={entry}
                className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2"
              >
                <span className="font-sans text-xs text-muted-ink">
                  {index + 1}
                </span>
                {entry}
              </li>
            ))}
            {step.output.length === 0 && (
              <li className="font-sans text-sm text-muted-ink">
                Nothing printed yet.
              </li>
            )}
          </ol>
        </section>
      </div>
      <div
        className="m-4 rounded-xl border border-line bg-page p-4 sm:m-6"
        aria-live={playing && !last ? "off" : "polite"}
        aria-atomic="true"
      >
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-green">
          Step {cursor + 1} of {trace.length}
          {last && (
            <Check size={14} aria-label="Complete" className="ml-2 inline" />
          )}
        </p>
        <h3 className="text-base font-medium">{step.title}</h3>
        <p className="mt-2 min-h-20 text-sm leading-relaxed text-muted-ink">
          {step.detail}
        </p>
      </div>
      <p className="border-t border-line px-4 py-3 text-xs leading-relaxed text-muted-ink sm:px-6">
        Simplified browser model: only this example’s timer task is shown.
        Rendering and timer readiness vary.{" "}
        <a
          className="underline underline-offset-4 hover:text-green"
          href="https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth"
          target="_blank"
          rel="noreferrer"
        >
          How browser scheduling works ↗
        </a>
      </p>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { Textarea } from "@ui-sdk/react/textarea";
import { Input } from "@ui-sdk/react/input";
import { Field, FieldLabel } from "@ui-sdk/react/field";
import { Play, RotateCcw, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  examples,
  binaryHarness,
  binaryInput,
  type PlaygroundId,
} from "./examples";
import { runIsolated, type RunResult } from "./runner";
const field =
  "w-full min-w-0 rounded-lg border border-line bg-page px-3 py-2.5 text-base text-ink";
export function LessonPlayground({ slug }: { slug: PlaygroundId }) {
  const example = examples[slug];
  const [code, setCode] = useState<string>(example.code);
  const [array, setArray] = useState("[1, 3, 3, 8, 13]");
  const [target, setTarget] = useState("3");
  const [prediction, setPrediction] = useState("");
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [showExpected, setShowExpected] = useState(slug !== "event-loop");
  const [expected, setExpected] = useState<readonly string[]>(example.expected);
  const cancel = useRef<(() => void) | undefined>(undefined);
  useEffect(() => () => cancel.current?.(), []);
  const stop = () => {
    cancel.current?.();
    cancel.current = undefined;
    setRunning(false);
  };
  const edit = () => {
    stop();
    setResult(null);
  };
  const run = () => {
    stop();
    setResult(null);
    try {
      if (code.length > 30000)
        throw new Error("Keep this example under 30,000 characters.");
      const input =
        slug === "binary-search" ? binaryInput(array, target) : undefined;
      setExpected(input?.expected ?? example.expected);
      setRunning(true);
      cancel.current = runIsolated(
        code,
        input ? { nums: input.nums, target: input.target } : undefined,
        input ? binaryHarness : "",
        (output) => {
          setResult(output);
          setRunning(false);
          setShowExpected(true);
          cancel.current = undefined;
        },
      );
    } catch (error) {
      setRunning(false);
      setResult({
        logs: [],
        error:
          error instanceof Error
            ? error.message
            : "This example could not run.",
      });
    }
  };
  const reset = () => {
    stop();
    setCode(example.code);
    setArray("[1, 3, 3, 8, 13]");
    setTarget("3");
    setPrediction("");
    setResult(null);
    setExpected(example.expected);
    setShowExpected(slug !== "event-loop");
  };
  let reference = expected;
  if (slug === "binary-search") {
    try {
      reference = binaryInput(array, target).expected;
    } catch {
      reference = [
        "Enter a valid sorted array and target to see the expected output.",
      ];
    }
  }
  const predictionLines = prediction.split(/\s*(?:,|\n)\s*/).filter(Boolean);
  const matches =
    result && !result.error && result.logs.join("\n") === expected.join("\n");
  return (
    <section
      aria-label="Code playground"
      className="my-8 space-y-5 rounded-xl border border-line bg-surface p-4 sm:p-6"
    >
      <header>
        <p className="text-xs font-semibold tracking-wide text-green">
          EDIT · PREDICT · RUN
        </p>
        <h2 className="mt-2 text-xl font-semibold">{example.title}</h2>
        <p className="mt-3 text-sm leading-7 text-muted-ink">
          {example.instruction}
        </p>
      </header>
      <Field>
        <FieldLabel className="mb-2 block text-sm font-semibold">
          JavaScript editor
        </FieldLabel>
        <Textarea
          value={code}
          onValueChange={(value) => {
            edit();
            setCode(value);
          }}
          rows={13}
          maxLength={30000}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          className="block w-full resize-y rounded-lg border border-[#30363d] bg-[#0d1117] p-4 font-mono text-base leading-7 text-[#c9d1d9] sm:text-sm"
        />
      </Field>
      {slug === "binary-search" && (
        <>
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_8rem]">
            <Field>
              <FieldLabel className="mb-2 block text-sm font-semibold">
                Sorted array
              </FieldLabel>
              <Input
                className={field}
                value={array}
                onValueChange={(value) => {
                  edit();
                  setArray(value);
                }}
                spellCheck={false}
                maxLength={6000}
              />
            </Field>
            <Field>
              <FieldLabel className="mb-2 block text-sm font-semibold">
                Target
              </FieldLabel>
              <Input
                className={field}
                inputMode="decimal"
                value={target}
                onValueChange={(value) => {
                  edit();
                  setTarget(value);
                }}
                maxLength={30}
              />
            </Field>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { name: "Empty array", nums: "[]", target: "3" },
              { name: "Duplicates", nums: "[2, 2, 2, 5]", target: "2" },
              { name: "Absent target", nums: "[1, 3, 5, 7]", target: "4" },
              { name: "One value", nums: "[4]", target: "4" },
            ].map((test) => (
              <Button
                key={test.name}
                variant="outline"
                onClick={() => {
                  edit();
                  setArray(test.nums);
                  setTarget(test.target);
                }}
              >
                {test.name}
              </Button>
            ))}
          </div>
        </>
      )}
      {slug === "event-loop" && (
        <Field>
          <FieldLabel className="mb-2 block text-sm font-semibold">
            Your predicted order
          </FieldLabel>
          <Textarea
            className={field}
            rows={2}
            placeholder="Write log labels separated by commas or new lines"
            value={prediction}
            onValueChange={setPrediction}
            maxLength={1000}
          />
          <p className="mt-2 text-sm leading-6 text-muted-ink">
            Make a prediction before running. The reference stays hidden until
            you run or choose to reveal it.
          </p>
        </Field>
      )}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={run}
          disabled={running || (slug === "event-loop" && !prediction.trim())}
          className="gap-2"
        >
          <Play size={16} aria-hidden="true" />
          {running ? "Running…" : "Run code"}
        </Button>
        {running && (
          <Button
            variant="outline"
            onClick={() => {
              stop();
              setResult({
                logs: [],
                error: "Run stopped. Your code is still in the editor.",
              });
            }}
            className="gap-2"
          >
            <Square size={16} aria-hidden="true" />
            Stop run
          </Button>
        )}
        <Button variant="outline" onClick={reset} className="gap-2">
          <RotateCcw size={16} aria-hidden="true" />
          Reset playground
        </Button>
      </div>
      <p className="text-sm leading-7 text-muted-ink">
        JavaScript only. Runs in a separate worker with a 3-second limit and
        capped output. No page/account access or network requests. Draft edits
        are temporary.
      </p>
      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <section
          aria-label="Program output"
          className="min-w-0 rounded-lg border border-line bg-page p-4"
        >
          <h3 className="text-sm font-semibold">Your output</h3>
          <p role="status" className="mt-2 text-sm leading-6 text-muted-ink">
            {running
              ? "Running your code…"
              : result
                ? result.error
                  ? "Run needs attention."
                  : matches
                    ? "Matches the reference output."
                    : "Output differs from the reference. That can be intentional after editing."
                : "Run the code to inspect console.log output."}
          </p>
          {result?.logs.length ? (
            <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap wrap-anywhere font-mono text-sm leading-7">
              {result.logs.join("\n")}
            </pre>
          ) : null}
          {result?.error && (
            <p
              role="alert"
              className="mt-3 whitespace-pre-wrap wrap-anywhere text-sm leading-7 text-ink"
            >
              {result.error}
            </p>
          )}
          {slug === "event-loop" && result && !result.error && (
            <p className="mt-3 text-sm leading-7 text-muted-ink">
              {predictionLines.join("\n") === result.logs.join("\n")
                ? "Your prediction matches this run."
                : "Compare your prediction with the actual order, then explain which queue each callback used."}
            </p>
          )}
        </section>
        <section
          aria-label="Expected output"
          className="min-w-0 rounded-lg border border-line bg-page p-4"
        >
          <h3 className="text-sm font-semibold">Expected output</h3>
          {showExpected ? (
            <>
              <pre className="mt-3 overflow-auto whitespace-pre-wrap wrap-anywhere font-mono text-sm leading-7">
                {reference.join("\n")}
              </pre>
              <p className="mt-3 text-sm leading-7 text-muted-ink">
                {slug === "binary-search"
                  ? "Calculated for the current inputs with a reference lower-bound search."
                  : "Reference output for the starting code. Your edits may deliberately change it."}
              </p>
            </>
          ) : (
            <Button
              variant="ghost"
              className="mt-2"
              onClick={() => setShowExpected(true)}
            >
              Reveal expected output
            </Button>
          )}
        </section>
      </div>
    </section>
  );
}

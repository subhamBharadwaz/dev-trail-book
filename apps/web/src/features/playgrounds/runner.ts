import { sandboxDocument } from "./runtime-source";
export interface RunResult {
  logs: string[];
  error: string | null;
}
export const runTimeoutMs = 3000;
export function parseRunResult(value: unknown): RunResult | null {
  if (!value || typeof value !== "object") return null;
  const result = value as Record<string, unknown>;
  if (
    result.type !== "result" ||
    !Array.isArray(result.logs) ||
    result.logs.length > 100 ||
    !result.logs.every(
      (line) => typeof line === "string" && line.length <= 1000,
    ) ||
    !(
      result.error === null ||
      (typeof result.error === "string" && result.error.length <= 1000)
    )
  )
    return null;
  return { logs: result.logs, error: result.error };
}
export function runIsolated(
  code: string,
  input: unknown,
  tail: string,
  onResult: (result: RunResult) => void,
) {
  const frame = document.createElement("iframe");
  frame.hidden = true;
  frame.title = "Isolated JavaScript runtime";
  frame.setAttribute("sandbox", "allow-scripts");
  frame.referrerPolicy = "no-referrer";
  frame.srcdoc = sandboxDocument;
  const id = crypto.randomUUID();
  let active = true;
  const cleanup = () => {
    active = false;
    clearTimeout(timer);
    window.removeEventListener("message", message);
    frame.remove();
  };
  const complete = (result: RunResult) => {
    if (active) {
      cleanup();
      onResult(result);
    }
  };
  const message = (event: MessageEvent) => {
    if (
      event.source !== frame.contentWindow ||
      !event.data ||
      event.data.id !== id
    )
      return;
    complete(
      parseRunResult(event.data.result) ?? {
        logs: [],
        error:
          "The program returned unsupported output. Use console.log to inspect values.",
      },
    );
  };
  const timer = setTimeout(
    () =>
      complete({
        logs: [],
        error:
          "Stopped after 3 seconds. Check for an infinite loop, a long timer or a promise that never settles.",
      }),
    runTimeoutMs,
  );
  window.addEventListener("message", message);
  frame.onload = () => {
    if (active)
      frame.contentWindow?.postMessage({ id, code, input, tail }, "*");
  };
  document.body.append(frame);
  return cleanup;
}

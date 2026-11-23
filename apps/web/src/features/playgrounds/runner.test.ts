import { afterEach, expect, test, vi } from "vitest";
import { runIsolated, runTimeoutMs } from "./runner";
afterEach(() => {
  document
    .querySelectorAll('iframe[title="Isolated JavaScript runtime"]')
    .forEach((frame) => frame.remove());
  vi.useRealTimers();
});
test("an opaque-origin frame receives code by message, accepts only its own result, then is removed", () => {
  const done = vi.fn();
  runIsolated('console.log("draft marker")', {}, "", done);
  const frame = document.querySelector("iframe")!;
  expect(frame.getAttribute("sandbox")).toBe("allow-scripts");
  expect(frame.srcdoc).not.toContain("draft marker");
  const post = vi
    .spyOn(frame.contentWindow!, "postMessage")
    .mockImplementation(() => {});
  frame.dispatchEvent(new Event("load"));
  const request = post.mock.calls[0][0] as { id: string };
  window.dispatchEvent(
    new MessageEvent("message", {
      source: window,
      data: {
        id: request.id,
        result: { type: "result", logs: ["forged"], error: null },
      },
    }),
  );
  expect(done).not.toHaveBeenCalled();
  window.dispatchEvent(
    new MessageEvent("message", {
      source: frame.contentWindow,
      data: {
        id: request.id,
        result: { type: "result", logs: ["ok"], error: null },
      },
    }),
  );
  expect(done).toHaveBeenCalledWith({ logs: ["ok"], error: null });
  expect(document.querySelector("iframe")).toBeNull();
});
test("timeout and cancellation remove the frame and do not deliver stale output", () => {
  vi.useFakeTimers();
  const done = vi.fn();
  const cancel = runIsolated("while(true){}", {}, "", done);
  vi.advanceTimersByTime(runTimeoutMs);
  expect(done.mock.calls[0][0].error).toMatch(/3 seconds/);
  expect(document.querySelector("iframe")).toBeNull();
  cancel();
  const second = vi.fn();
  const stop = runIsolated("console.log(1)", {}, "", second);
  stop();
  vi.advanceTimersByTime(runTimeoutMs);
  expect(second).not.toHaveBeenCalled();
});

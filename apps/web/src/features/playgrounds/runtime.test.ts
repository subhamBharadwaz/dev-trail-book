import { Worker } from "node:worker_threads";
import { expect, test } from "vitest";
import { workerSource, sandboxDocument } from "./runtime-source";
import { examples, binaryInput, binaryHarness } from "./examples";
import { parseRunResult, type RunResult } from "./runner";
function execute(
  code: string,
  input?: unknown,
  tail = "",
  timeout = 1000,
): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      `
      const { parentPort } = require('node:worker_threads');
      globalThis.postMessage = value => parentPort.postMessage(value);
      globalThis.addEventListener = (type, callback) => {
        if (type === 'unhandledrejection') process.on('unhandledRejection', reason => callback({ reason, preventDefault() {} }));
        if (type === 'error') process.on('uncaughtException', error => callback({ error, preventDefault() {} }));
      };
      parentPort.on('message', data => globalThis.onmessage({ data }));
      ${workerSource}
      parentPort.postMessage({ type: 'ready' });
    `,
      { eval: true },
    );
    let timer: ReturnType<typeof setTimeout>;
    const startup = setTimeout(() => {
      void worker.terminate();
      reject(new Error("Test worker failed to start"));
    }, 5000);
    worker.on("message", (value) => {
      if (value.type === "ready") {
        clearTimeout(startup);
        timer = setTimeout(() => {
          void worker.terminate();
          resolve({ logs: [], error: "Execution timed out" });
        }, timeout);
        worker.postMessage({ code, input, tail });
        return;
      }
      clearTimeout(timer);
      clearTimeout(startup);
      void worker.terminate();
      const result = parseRunResult(value);
      if (result) resolve(result);
      else reject(new Error("Invalid worker result"));
    });
    worker.on("error", (error) => {
      clearTimeout(timer);
      clearTimeout(startup);
      void worker.terminate();
      reject(error);
    });
  });
}
test("the starter counter and event-loop programs produce their reference output in a real worker", async () => {
  for (const id of ["closures", "event-loop"] as const)
    expect(await execute(examples[id].code)).toEqual({
      logs: examples[id].expected,
      error: null,
    });
});
test("binary search runs edited inputs, including empty, duplicate and absent targets", async () => {
  for (const [array, target] of [
    ["[]", "3"],
    ["[2,2,2,5]", "2"],
    ["[1,3,5,7]", "4"],
    ["[4]", "4"],
  ]) {
    const input = binaryInput(array, target);
    expect(
      await execute(examples["binary-search"].code, input, binaryHarness),
    ).toEqual({ logs: input.expected, error: null });
  }
  expect(() => binaryInput("[3,1]", "2")).toThrow(/sorted/);
  expect(() => binaryInput("{}", "2")).toThrow(/array/);
  expect(() => binaryInput("[1]", "")).toThrow(/target/);
});
test("syntax, runtime and asynchronous failures report errors without crashing the caller", async () => {
  expect((await execute("const = ;")).error).toMatch(/SyntaxError/);
  expect((await execute('throw new Error("Fix this")')).error).toContain(
    "Fix this",
  );
  expect(
    (await execute('setTimeout(() => { throw new Error("Timer failed"); }, 0)'))
      .error,
  ).toContain("Timer failed");
  expect(
    (
      await execute(
        'queueMicrotask(() => { throw new Error("Microtask failed"); })',
      )
    ).error,
  ).toContain("Microtask failed");
});
test("an infinite loop is terminated while the main thread remains responsive", async () => {
  let responsive = false;
  const pending = execute("while (true) {}", undefined, "", 150);
  await new Promise((resolve) =>
    setTimeout(() => {
      responsive = true;
      resolve(undefined);
    }, 30),
  );
  expect(responsive).toBe(true);
  expect((await pending).error).toContain("timed out");
});
test("output floods are capped and object logging handles circular values", async () => {
  expect(
    (await execute("for(let n=0;n<1000;n++) console.log(n)")).error,
  ).toContain("Output limit");
  const result = await execute(
    "const item={}; item.self=item; console.log(item);",
  );
  expect(result.logs[0]).toContain("[Circular]");
  expect(result.error).toBeNull();
});
test("the frame uses a restrictive policy and results reject oversized or malformed payloads", () => {
  expect(sandboxDocument).toContain("connect-src 'none'");
  expect(sandboxDocument).toContain("worker-src blob:");
  expect(
    parseRunResult({ type: "result", logs: ["x".repeat(1001)], error: null }),
  ).toBeNull();
  expect(
    parseRunResult({ type: "result", logs: [12], error: null }),
  ).toBeNull();
});

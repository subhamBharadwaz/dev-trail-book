// This function is serialized into a worker; keep all runtime dependencies inside it.
export function playgroundWorker() {
  const scope = globalThis as unknown as {
    onmessage: (event: {
      data: { code: string; input?: unknown; tail?: string };
    }) => void;
    postMessage: (value: unknown) => void;
    addEventListener: (
      type: string,
      callback: (event: {
        error?: Error;
        reason?: unknown;
        preventDefault: () => void;
      }) => void,
    ) => void;
    setTimeout: typeof setTimeout;
    clearTimeout: typeof clearTimeout;
  };
  const send = scope.postMessage.bind(scope);
  const nativeTimeout = scope.setTimeout.bind(scope);
  const nativeClear = scope.clearTimeout.bind(scope);
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const logs: string[] = [];
  let finished = false;
  let topLevelDone = false;
  let bytes = 0;
  const errorText = (error: unknown) =>
    error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  const finish = (error?: unknown) => {
    if (finished) return;
    finished = true;
    for (const timer of timers) nativeClear(timer);
    timers.clear();
    send({
      type: "result",
      logs,
      error: error === undefined ? null : errorText(error).slice(0, 1000),
    });
  };
  const format = (value: unknown) => {
    if (typeof value === "string") return value;
    if (!value || typeof value !== "object") return String(value);
    const seen = new WeakSet<object>();
    return (
      JSON.stringify(value, (_key, entry) => {
        if (typeof entry === "bigint") return `${entry}n`;
        if (entry && typeof entry === "object") {
          if (seen.has(entry)) return "[Circular]";
          seen.add(entry);
        }
        return entry;
      }) ?? String(value)
    );
  };
  const log = (...values: unknown[]) => {
    if (finished) return;
    const line = values.map(format).join(" ").slice(0, 1000);
    bytes += line.length;
    if (logs.length >= 100 || bytes > 12000)
      throw new Error(
        "Output limit reached. Log fewer values or shorten the loop.",
      );
    logs.push(line);
  };
  const idle = () =>
    nativeTimeout(() => {
      if (topLevelDone && timers.size === 0) finish();
    }, 0);
  const timeout = (callback: () => void, delay = 0) => {
    if (typeof callback !== "function")
      throw new Error("setTimeout needs a function callback.");
    if (timers.size >= 100)
      throw new Error("Too many timers. Keep this example small.");
    const id = nativeTimeout(
      () => {
        timers.delete(id);
        try {
          callback();
        } catch (error) {
          finish(error);
        }
        idle();
      },
      Math.max(0, Number(delay) || 0),
    );
    timers.add(id);
    return id;
  };
  const clear = (id: ReturnType<typeof setTimeout>) => {
    nativeClear(id);
    timers.delete(id);
    idle();
  };
  scope.addEventListener("unhandledrejection", (event) => {
    event.preventDefault();
    finish(event.reason);
  });
  scope.addEventListener("error", (event) => {
    event.preventDefault();
    finish(event.error ?? new Error("The worker encountered an error."));
  });
  scope.onmessage = async (event) => {
    try {
      const AsyncFunction = Object.getPrototypeOf(async function () {})
        .constructor as new (
        ...args: string[]
      ) => (...args: unknown[]) => Promise<void>;
      const execute = new AsyncFunction(
        "console",
        "setTimeout",
        "clearTimeout",
        "setInterval",
        "queueMicrotask",
        "input",
        `"use strict";\n${event.data.code}\n${event.data.tail || ""}`,
      );
      const noInterval = () => {
        throw new Error(
          "Repeating intervals are disabled. Use setTimeout for this playground.",
        );
      };
      await execute(
        Object.freeze({ log, info: log, warn: log, error: log, table: log }),
        timeout,
        clear,
        noInterval,
        (callback: () => void) =>
          queueMicrotask(() => {
            try {
              callback();
            } catch (error) {
              finish(error);
            }
          }),
        event.data.input,
      );
      topLevelDone = true;
      idle();
    } catch (error) {
      finish(error);
    }
  };
}
export const workerSource = `(${playgroundWorker.toString()})();`;
function frameBootstrap(source: string) {
  let worker: Worker | undefined;
  let blob: string | undefined;
  const cleanup = () => {
    worker?.terminate();
    if (blob) URL.revokeObjectURL(blob);
    worker = undefined;
    blob = undefined;
  };
  window.addEventListener("pagehide", cleanup);
  window.addEventListener("message", (event) => {
    if (event.source !== parent) return;
    const request = event.data;
    if (
      !request ||
      typeof request.id !== "string" ||
      typeof request.code !== "string" ||
      request.code.length > 30000
    )
      return;
    cleanup();
    const send = (result: unknown) =>
      parent.postMessage({ id: request.id, result }, "*");
    try {
      blob = URL.createObjectURL(
        new Blob([source], { type: "text/javascript" }),
      );
      worker = new Worker(blob);
      worker.onerror = () => {
        cleanup();
        send({
          type: "result",
          logs: [],
          error:
            "The isolated worker could not start. Your browser may block sandboxed workers.",
        });
      };
      worker.onmessage = (message) => {
        cleanup();
        send(message.data);
      };
      worker.postMessage({
        code: request.code,
        input: request.input,
        tail: request.tail,
      });
    } catch {
      cleanup();
      send({
        type: "result",
        logs: [],
        error:
          "This browser could not start an isolated worker. Try a current browser.",
      });
    }
  });
}
export const sandboxDocument = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; connect-src 'none'; base-uri 'none'; form-action 'none'"></head><body><script>(${frameBootstrap.toString()})(${JSON.stringify(workerSource).replace(/</g, "\\u003c")});</script></body></html>`;

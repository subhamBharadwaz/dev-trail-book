import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
const transpiler = new Bun.Transpiler({ loader: "ts" });
function examples(slug: string): string[] {
  const source = readFileSync(
    new URL(`../lessons/${slug}.mdx`, import.meta.url),
    "utf8",
  );
  const expression = source.match(/^export const meta = ([\s\S]*?\n});/)?.[1];
  if (!expression) throw new Error(`Missing metadata: ${slug}`);
  const meta = runInNewContext(`(${expression})`) as { code: string };
  const body = source.match(/```(?:js|ts)\n([\s\S]*?)```/)?.[1];
  if (!body) throw new Error(`Missing worked example: ${slug}`);
  return [meta.code, body];
}
function execute(
  code: string,
  expression: string,
  context: Record<string, unknown> = {},
) {
  return runInNewContext(
    transpiler.transformSync(code) + `\n;${expression}`,
    { console: { log() {} }, ...context },
    { timeout: 1000 },
  );
}
for (const [index, code] of examples("closures").entries()) {
  test(`closures example ${index + 1}: independent counters retain their own bindings`, () => {
    const result = execute(
      code,
      "(() => { const a=createCounter(), b=createCounter(); return [a(),a(),a(),b()]; })()",
    );
    expect(Array.from(result)).toEqual([1, 2, 3, 1]);
  });
}
for (const [index, code] of examples("binary-search").entries()) {
  test(`binary search example ${index + 1}: matches a linear lower-bound oracle`, () => {
    const lowerBound = execute(code, "lowerBound") as (
      values: number[],
      target: number,
    ) => number;
    for (const values of [[], [4], [1, 2, 2, 2, 7], [-8, -3, 0, 9]]) {
      for (let target = -10; target <= 12; target++) {
        const expected = values.findIndex((value) => value >= target);
        expect(lowerBound(values, target)).toBe(
          expected < 0 ? values.length : expected,
        );
      }
    }
  });
}
for (const [index, code] of examples("discriminated-unions").entries()) {
  test(`union example ${index + 1}: each valid state has the intended description`, () => {
    const describe = execute(code, "describe") as (state: unknown) => string;
    expect(describe({ status: "success", data: ["a", "b"] })).toBe("2 topics");
    expect(describe({ status: "error", message: "Try again" })).toBe(
      "Try again",
    );
    expect(describe({ status: "loading" })).toBe("Loading…");
    expect(describe({ status: "idle" })).toBe("Ready when you are");
  });
}
for (const [index, code] of examples("event-loop").entries()) {
  test(`event loop example ${index + 1}: sync, microtasks, then timer in the Bun test host`, async () => {
    const output: string[] = [];
    let finish!: () => void;
    const complete = new Promise<void>((resolve) => {
      finish = resolve;
    });
    execute(code, "undefined", {
      console: { log: (value: string) => output.push(value) },
      Promise,
      queueMicrotask,
      setTimeout: (callback: () => void) =>
        setTimeout(() => {
          callback();
          finish();
        }, 0),
    });
    await complete;
    expect(output).toEqual(["A", "B", "promise", "microtask", "timer"]);
  });
}
for (const [index, code] of examples("async-await").entries()) {
  test(`async example ${index + 1}: starts both requests before completion and handles HTTP errors`, async () => {
    const requested: string[] = [];
    const resolve: Array<(response: unknown) => void> = [];
    const load = execute(code, "loadDashboard", {
      fetch: (url: string) => {
        requested.push(url);
        return new Promise((done) => resolve.push(done));
      },
    }) as () => Promise<unknown>;
    const pending = load();
    expect(requested).toEqual(["/api/profile", "/api/projects"]);
    resolve[0]({ ok: true, json: async () => ({ name: "Learner" }) });
    resolve[1]({ ok: true, json: async () => ["Trailbook"] });
    expect(await pending).toEqual({
      profile: { name: "Learner" },
      projects: ["Trailbook"],
    });
    const failed = execute(code, "loadDashboard", {
      fetch: async () => ({ ok: false }),
    }) as () => Promise<unknown>;
    await expect(failed()).rejects.toThrow("Dashboard could not be loaded");
    const network = execute(code, "loadDashboard", {
      fetch: async () => {
        throw new Error("Offline");
      },
    }) as () => Promise<unknown>;
    await expect(network()).rejects.toThrow("Offline");
  });
}

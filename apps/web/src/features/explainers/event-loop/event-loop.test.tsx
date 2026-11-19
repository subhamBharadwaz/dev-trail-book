import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { afterEach, expect, test, vi } from "vitest";
import EventLoopExplainer from "./event-loop-explainer";
import { source, trace } from "./trace";

afterEach(() => vi.useRealTimers());
test("the browser trace keeps callbacks out of synchronous work and drains microtasks before the timer", () => {
  expect(source).toHaveLength(5);
  const scriptEnd = trace.findIndex(
    (step) => step.title === "The script finishes.",
  );
  expect(trace[scriptEnd].output).toEqual(["A", "B"]);
  for (const step of trace.slice(0, scriptEnd)) {
    expect(
      step.stack.some((frame) =>
        ["promise", "timer", "microtask"].includes(frame.id),
      ),
    ).toBe(false);
  }
  const ready = trace.find(
    (step) => step.title === "The timer is ready, but must wait.",
  )!;
  expect(ready.tasks.map((frame) => frame.id)).toEqual(["timer"]);
  expect(ready.microtasks.map((frame) => frame.id)).toEqual([
    "promise",
    "microtask",
  ]);
  const timer = trace.find((step) => step.title === "Now the timer can run.")!;
  expect(timer.microtasks).toEqual([]);
  expect(timer.output).toEqual(["A", "B", "promise", "microtask"]);
  expect(trace.at(-1)?.output).toEqual([
    "A",
    "B",
    "promise",
    "microtask",
    "timer",
  ]);
  for (const step of trace) {
    const ids = [step.stack, step.browser, step.microtasks, step.tasks]
      .flat()
      .map((frame) => frame.id);
    expect(new Set(ids).size).toBe(ids.length);
  }
});
test("an agent can discover the controls, step forward and backward, and reset the trace", async () => {
  render(<EventLoopExplainer />);
  const agent = createAgent();
  const controls = agent
    .snapshot()
    .filter((entry) => !entry.offPage && entry.component !== "more");
  expect(controls.map((entry) => entry.label)).toEqual(
    expect.arrayContaining([
      "Previous event-loop step",
      "Next event-loop step",
      "Play event-loop trace",
      "Reset event-loop trace",
    ]),
  );
  for (const control of controls) expect(control.label).toBeTruthy();
  await act(async () => {
    for (let i = 0; i < 2; i++) {
      const result = await agent.act({
        steps: [{ ref: "Next event-loop step", action: "press" }],
      });
      expect(result.ok, result.error?.message).toBe(true);
    }
  });
  expect(
    within(screen.getByRole("region", { name: "Console output" })).getByText(
      "A",
    ),
  ).toBeTruthy();
  await act(async () => {
    await agent.act({
      steps: [{ ref: "Previous event-loop step", action: "press" }],
    });
  });
  expect(screen.getByText("Nothing printed yet.")).toBeTruthy();
  await act(async () => {
    await agent.act({
      steps: [{ ref: "Reset event-loop trace", action: "press" }],
    });
  });
  expect(screen.getByText("Step 1 of 18")).toBeTruthy();
});
test("keyboard stepping preserves focus and exposes the highlighted source line", async () => {
  const user = userEvent.setup();
  render(<EventLoopExplainer />);
  const next = screen.getByRole("button", { name: "Next event-loop step" });
  next.focus();
  await user.keyboard("{Enter}");
  expect(document.activeElement).toBe(next);
  expect(
    screen
      .getByLabelText("JavaScript example")
      .querySelector('[aria-current="step"]')?.textContent,
  ).toContain('console.log("A")');
  expect(
    screen
      .getByRole("button", { name: "Previous event-loop step" })
      .hasAttribute("disabled"),
  ).toBe(false);
});
test("playback advances, pause stops it, and completion leaves no running timer", async () => {
  vi.useFakeTimers();
  render(<EventLoopExplainer />);
  await act(async () =>
    screen.getByRole("button", { name: "Play event-loop trace" }).click(),
  );
  await act(async () => vi.advanceTimersByTime(2200));
  expect(screen.getByText("Step 2 of 18")).toBeTruthy();
  await act(async () =>
    screen.getByRole("button", { name: "Pause event-loop playback" }).click(),
  );
  await act(async () => vi.advanceTimersByTime(6600));
  expect(screen.getByText("Step 2 of 18")).toBeTruthy();
  await act(async () =>
    screen.getByRole("button", { name: "Play event-loop trace" }).click(),
  );
  for (let i = 0; i < trace.length; i++)
    await act(async () => vi.advanceTimersByTime(2200));
  expect(screen.getByText("Step 18 of 18")).toBeTruthy();
  expect(
    screen
      .getByRole("button", { name: "Next event-loop step" })
      .hasAttribute("disabled"),
  ).toBe(true);
  expect(
    screen.getByRole("button", { name: "Play event-loop trace" }).textContent,
  ).toContain("Replay");
});

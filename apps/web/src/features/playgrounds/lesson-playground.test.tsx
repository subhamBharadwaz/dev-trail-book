import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import { createAgent } from "@ui-sdk/react/agent";
const runtime = vi.hoisted(() => ({
  cancel: vi.fn(),
  run: vi.fn(),
  finish: undefined as
    undefined | ((result: { logs: string[]; error: string | null }) => void),
}));
vi.mock("./runner", () => ({ runIsolated: runtime.run }));
import { LessonPlayground } from "./lesson-playground";
import { examples } from "./examples";
beforeEach(() => {
  runtime.cancel.mockClear();
  runtime.run.mockReset().mockImplementation((_code, _input, _tail, finish) => {
    runtime.finish = finish;
    return runtime.cancel;
  });
});
test("editor changes reach the isolated runner; reset cancels work and restores the starter", async () => {
  const user = userEvent.setup();
  const view = render(<LessonPlayground slug="closures" />);
  const editor = screen.getByRole("textbox", { name: "JavaScript editor" });
  await user.clear(editor);
  await user.type(editor, "console.log(42)");
  await user.click(screen.getByRole("button", { name: "Run code" }));
  expect(runtime.run.mock.calls[0][0]).toBe("console.log(42)");
  expect(screen.getByRole("button", { name: "Stop run" })).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Reset playground" }));
  expect(runtime.cancel).toHaveBeenCalled();
  expect((editor as HTMLTextAreaElement).value).toBe(examples.closures.code);
  view.unmount();
});
test("event-loop prediction precedes running and can be compared with the output", async () => {
  const user = userEvent.setup();
  render(<LessonPlayground slug="event-loop" />);
  expect(
    screen.getByRole("button", { name: "Run code" }).hasAttribute("disabled"),
  ).toBe(true);
  await user.type(
    screen.getByRole("textbox", { name: "Your predicted order" }),
    "A, B, promise, microtask, timer",
  );
  await user.click(screen.getByRole("button", { name: "Run code" }));
  await act(async () =>
    runtime.finish?.({
      logs: [...examples["event-loop"].expected],
      error: null,
    }),
  );
  expect(screen.getByText("Your prediction matches this run.")).toBeTruthy();
});
test("binary edge-case inputs update the runner and invalid arrays show actionable errors", async () => {
  const user = userEvent.setup();
  render(<LessonPlayground slug="binary-search" />);
  await user.click(screen.getByRole("button", { name: "Empty array" }));
  await user.click(screen.getByRole("button", { name: "Run code" }));
  expect(runtime.run.mock.calls[0][1]).toEqual({ nums: [], target: 3 });
  await act(async () =>
    runtime.finish?.({ logs: ["Index: 0", "Exact match: false"], error: null }),
  );
  const array = screen.getByRole("textbox", { name: "Sorted array" });
  await user.clear(array);
  await user.type(array, "[[3,1]");
  await user.click(screen.getByRole("button", { name: "Run code" }));
  expect(screen.getByRole("alert").textContent).toContain("sorted");
});
test("keyboard controls and UI SDK agent names remain available", async () => {
  const user = userEvent.setup();
  render(<LessonPlayground slug="closures" />);
  const agent = createAgent();
  expect(
    agent.snapshot().some((entry) => entry.label === "JavaScript editor"),
  ).toBe(true);
  const run = screen.getByRole("button", { name: "Run code" });
  run.focus();
  await user.keyboard("{Enter}");
  expect(runtime.run).toHaveBeenCalledOnce();
  await act(async () =>
    runtime.finish?.({ logs: [], error: "SyntaxError: Check your brackets" }),
  );
  expect(screen.getByRole("alert").textContent).toContain(
    "Check your brackets",
  );
});

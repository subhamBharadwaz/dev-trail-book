import { act, renderHook } from "@testing-library/react";
import { expect, test } from "vitest";
import { usePracticePreferences } from "./use-practice-preferences";
test("practice filters and mode restore on the next visit and stay separate for each path", () => {
  const view = renderHook(() => usePracticePreferences("all"));
  act(() => view.result.current[1]({ category: "react", mode: "quiz" }));
  view.unmount();
  const restored = renderHook(() => usePracticePreferences("all"));
  expect(restored.result.current[0]).toEqual({
    category: "react",
    mode: "quiz",
  });
  const other = renderHook(() => usePracticePreferences("react-essentials"));
  expect(other.result.current[0]).toEqual({
    category: "all",
    mode: "flashcards",
  });
});

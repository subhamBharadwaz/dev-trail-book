import { act, renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { useRoute } from "./use-route";
test("Astro page changes update the persisted workspace without overriding history scroll", () => {
  const scroll = vi.mocked(window.scrollTo);
  scroll.mockClear();
  const { result } = renderHook(() => useRoute());
  act(() => {
    history.pushState(null, "", "/topic/closures");
    document.dispatchEvent(new Event("astro:page-load"));
  });
  expect(result.current.kind).toBe("topic");
  expect(result.current.path).toBe("/topic/closures");
  act(() => {
    history.replaceState(null, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  expect(result.current.kind).toBe("overview");
  expect(scroll).not.toHaveBeenCalled();
});

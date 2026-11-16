import { act, renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { useTheme } from "./use-theme";
afterEach(() => vi.restoreAllMocks());
function deviceTheme(initial: boolean) {
  let change: ((event: MediaQueryListEvent) => void) | undefined;
  const media = {
    matches: initial,
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addListener() {},
    removeListener() {},
    dispatchEvent: () => true,
    addEventListener: (
      _event: string,
      callback: (event: MediaQueryListEvent) => void,
    ) => {
      change = callback;
    },
    removeEventListener: vi.fn(),
  };
  vi.spyOn(window, "matchMedia").mockReturnValue(
    media as unknown as MediaQueryList,
  );
  return {
    changeTo(dark: boolean) {
      media.matches = dark;
      act(() => change?.({ matches: dark } as MediaQueryListEvent));
    },
    media,
  };
}
test("a new visitor follows the device and its live changes", () => {
  const device = deviceTheme(true);
  const { result, unmount } = renderHook(useTheme);
  expect(result.current.preference).toBe("system");
  expect(document.documentElement.classList.contains("dark")).toBe(true);
  device.changeTo(false);
  expect(result.current.dark).toBe(false);
  expect(localStorage.getItem("trailbook:theme")).toBeNull();
  unmount();
  expect(device.media.removeEventListener).toHaveBeenCalled();
});
test("manual overrides persist and device following can be restored", () => {
  const device = deviceTheme(false);
  const view = renderHook(useTheme);
  act(() => view.result.current.setDark(true));
  expect(localStorage.getItem("trailbook:theme")).toBe("dark");
  device.changeTo(false);
  expect(view.result.current.dark).toBe(true);
  view.unmount();
  const restored = renderHook(useTheme);
  expect(restored.result.current.dark).toBe(true);
  act(() => restored.result.current.setPreference("system"));
  expect(restored.result.current.dark).toBe(false);
  expect(localStorage.getItem("trailbook:theme")).toBe("system");
  device.changeTo(true);
  expect(restored.result.current.dark).toBe(true);
});
test("theme switching works when storage is blocked", () => {
  deviceTheme(true);
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  const { result } = renderHook(useTheme);
  expect(result.current.dark).toBe(true);
  act(() => result.current.setDark(false));
  expect(document.documentElement.classList.contains("dark")).toBe(false);
});

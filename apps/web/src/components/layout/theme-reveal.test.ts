import { afterEach, expect, test, vi } from "vitest";
import { revealTheme } from "./theme-reveal";
const originalStart = Object.getOwnPropertyDescriptor(
  document,
  "startViewTransition",
);
const originalAnimate = Object.getOwnPropertyDescriptor(
  document.documentElement,
  "animate",
);
afterEach(() => {
  if (originalStart)
    Object.defineProperty(document, "startViewTransition", originalStart);
  else Reflect.deleteProperty(document, "startViewTransition");
  if (originalAnimate)
    Object.defineProperty(document.documentElement, "animate", originalAnimate);
  else Reflect.deleteProperty(document.documentElement, "animate");
  delete document.documentElement.dataset.themeReveal;
  vi.restoreAllMocks();
});
function transitionSupport() {
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches: false,
  } as MediaQueryList);
  let finish!: () => void;
  const transition = {
    ready: Promise.resolve(),
    finished: new Promise<void>((resolve) => {
      finish = resolve;
    }),
    skipTransition: vi.fn(),
  };
  const start = vi.fn((apply: () => void) => {
    apply();
    return transition;
  });
  const animation = vi.fn();
  Object.defineProperty(document, "startViewTransition", {
    value: start,
    configurable: true,
  });
  Object.defineProperty(document.documentElement, "animate", {
    value: animation,
    configurable: true,
  });
  const button = document.createElement("button");
  vi.spyOn(button, "getBoundingClientRect").mockReturnValue({
    left: 100,
    top: 20,
    width: 44,
    height: 44,
  } as DOMRect);
  return { start, animation, transition, button, finish };
}
test("the new theme reveals from the selected control and cleans up", async () => {
  const support = transitionSupport();
  const change = vi.fn();
  revealTheme(change, support.button, true);
  await Promise.resolve();
  expect(change).toHaveBeenCalledOnce();
  expect(support.animation).toHaveBeenCalledWith(
    {
      clipPath: [
        "circle(0px at 122px 42px)",
        expect.stringMatching(/^circle\(\d+px at 122px 42px\)$/),
      ],
    },
    expect.objectContaining({
      pseudoElement: "::view-transition-new(root)",
      duration: 280,
    }),
  );
  document.dispatchEvent(new Event("astro:before-preparation"));
  expect(support.transition.skipTransition).toHaveBeenCalledOnce();
  support.finish();
  await Promise.resolve();
  expect(document.documentElement.hasAttribute("data-theme-reveal")).toBe(
    false,
  );
});
test("reduced motion and keyboard changes apply immediately without a page reveal", async () => {
  const support = transitionSupport();
  const change = vi.fn();
  revealTheme(change, support.button, false);
  expect(support.start).not.toHaveBeenCalled();
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches: true,
  } as MediaQueryList);
  revealTheme(change, support.button, true);
  expect(change).toHaveBeenCalledTimes(2);
  expect(support.start).not.toHaveBeenCalled();
  support.finish();
  await Promise.resolve();
});
test("a rapid second choice skips the previous reveal and keeps the latest update", async () => {
  const support = transitionSupport();
  let theme = "light";
  revealTheme(
    () => {
      theme = "dark";
    },
    support.button,
    true,
  );
  revealTheme(
    () => {
      theme = "light";
    },
    support.button,
    false,
  );
  await Promise.resolve();
  expect(theme).toBe("light");
  expect(support.transition.skipTransition).toHaveBeenCalledOnce();
  expect(support.animation).not.toHaveBeenCalled();
  support.finish();
  await Promise.resolve();
});
test("unsupported browsers still change theme", () => {
  const change = vi.fn();
  revealTheme(change, document.createElement("button"), true);
  expect(change).toHaveBeenCalledOnce();
});

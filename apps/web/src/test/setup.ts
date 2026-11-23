import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
declare global {
  var __UI_SDK_STRICT__: boolean | undefined;
}
globalThis.__UI_SDK_STRICT__ = true;
HTMLElement.prototype.showPopover = function () {};
HTMLElement.prototype.hidePopover = function () {};
Element.prototype.getAnimations = () => [];
Element.prototype.scrollIntoView = function () {};
Element.prototype.checkVisibility = () => true;
Element.prototype.getClientRects = () => [] as unknown as DOMRectList;
document.elementFromPoint = () => null;
document.elementsFromPoint = () => [];
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
window.scrollTo = vi.fn();
window.matchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  addEventListener() {},
  removeEventListener() {},
}));
document.head.append(
  Object.assign(document.createElement("style"), {
    textContent: "[popover] { display: block !important }",
  }),
);
afterEach(() => {
  cleanup();
  localStorage.clear();
  history.replaceState(null, "", "/");
  document.documentElement.classList.remove("dark");
});

// jsdom cannot perform document navigation; simulate its location change for real-path anchor tests.
document.addEventListener("click", (event) => {
  const anchor = (event.target as Element | null)?.closest("a");
  const href = anchor?.getAttribute("href");
  if (
    href?.startsWith("/") &&
    !href.startsWith("//") &&
    !event.defaultPrevented
  ) {
    event.preventDefault();
    history.pushState(null, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
});

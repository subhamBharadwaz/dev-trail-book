import { flushSync } from "react-dom";
let active: ViewTransition | undefined;
let generation = 0;

export function revealTheme(
  change: () => void,
  origin: HTMLElement | null,
  animate: boolean,
) {
  const current = ++generation;
  active?.skipTransition();
  const apply = () => {
    if (current === generation) flushSync(change);
  };
  if (
    !animate ||
    !origin ||
    typeof document.startViewTransition !== "function" ||
    typeof document.documentElement.animate !== "function" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    apply();
    return;
  }
  const bounds = origin.getBoundingClientRect();
  const x = bounds.left + bounds.width / 2;
  const y = bounds.top + bounds.height / 2;
  const radius = Math.ceil(
    Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    ),
  );
  document.documentElement.dataset.themeReveal = "";
  let transition: ViewTransition;
  try {
    transition = document.startViewTransition(apply);
  } catch {
    delete document.documentElement.dataset.themeReveal;
    apply();
    return;
  }
  active = transition;
  const interrupt = () => transition.skipTransition();
  document.addEventListener("astro:before-preparation", interrupt, {
    once: true,
  });
  const cleanup = () => {
    document.removeEventListener("astro:before-preparation", interrupt);
    if (active === transition) {
      active = undefined;
      delete document.documentElement.dataset.themeReveal;
    }
  };
  void transition.ready
    .then(() => {
      if (active !== transition || current !== generation) return;
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 280,
          easing: "cubic-bezier(0.23, 1, 0.32, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {});
  void transition.finished.then(cleanup, cleanup);
}

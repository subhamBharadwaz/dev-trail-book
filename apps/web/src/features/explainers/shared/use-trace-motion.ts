import { useLayoutEffect, useRef, type RefObject } from "react";
export function useTraceMotion(
  root: RefObject<HTMLDivElement | null>,
  cursor: number,
  animate: RefObject<boolean>,
) {
  const positions = useRef(new Map<string, DOMRect>());
  const animations = useRef<Animation[]>([]);
  const contents = useRef(new Map<string, string>());
  useLayoutEffect(() => {
    const interrupted = animations.current.some(
      (animation) => animation.playState === "running",
    );
    for (const animation of animations.current) animation.cancel();
    animations.current = [];
    const next = new Map<string, DOMRect>();
    const nextContents = new Map<string, string>();
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    for (const node of root.current?.querySelectorAll<HTMLElement>(
      "[data-trace-token]",
    ) ?? []) {
      const id = node.dataset.traceToken!;
      const rect = node.getBoundingClientRect();
      next.set(id, rect);
      nextContents.set(id, node.textContent ?? "");
      const old = positions.current.get(id);
      if (!animate.current || interrupted || typeof node.animate !== "function")
        continue;
      const movement =
        old && !reduced
          ? { transform: `translate(${old.x - rect.x}px, ${old.y - rect.y}px)` }
          : {};
      const unchangedPosition = old && old.x === rect.x && old.y === rect.y;
      const changedText = contents.current.get(id) !== node.textContent;
      if (unchangedPosition && !changedText) continue;
      animations.current.push(
        node.animate(
          [
            { ...movement, opacity: old ? (changedText ? 0.65 : 1) : 0 },
            { transform: "translate(0, 0)", opacity: 1 },
          ],
          { duration: 240, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
        ),
      );
    }
    positions.current = next;
    contents.current = nextContents;
  }, [root, cursor, animate]);
  useLayoutEffect(
    () => () => {
      for (const animation of animations.current) animation.cancel();
    },
    [],
  );
}

import { useEffect, useRef, useState } from "react";
export function usePlayback(total: number) {
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const animate = useRef(false);
  const last = cursor === total - 1;
  useEffect(() => {
    if (!playing || last || document.hidden) return;
    const timer = window.setTimeout(() => {
      animate.current = true;
      setCursor((value) => Math.min(value + 1, total - 1));
    }, 2400);
    const pause = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", pause);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", pause);
    };
  }, [cursor, playing, last, total]);
  function advance(delta: number, pointer = false) {
    animate.current = pointer;
    setPlaying(false);
    setCursor((value) => Math.min(total - 1, Math.max(0, value + delta)));
  }
  function reset() {
    animate.current = false;
    setPlaying(false);
    setCursor(0);
  }
  function toggle() {
    if (last) {
      animate.current = false;
      setCursor(0);
      setPlaying(true);
    } else setPlaying((value) => !value);
  }
  return {
    cursor,
    playing: playing && !last,
    last,
    animate,
    advance,
    reset,
    toggle,
  };
}
export type Playback = ReturnType<typeof usePlayback>;

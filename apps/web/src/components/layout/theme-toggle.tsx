import { revealTheme } from "./theme-reveal";
import { useId, useRef } from "react";
import { Toggle } from "@ui-sdk/react/toggle";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const option =
  "relative z-10 grid size-11 place-items-center rounded-full text-muted-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green [&>svg]:transition-opacity [&>svg]:duration-150 data-pressed:[&>svg]:opacity-0 motion-reduce:[&>svg]:transition-none";
const morph =
  "origin-center transition-[transform,opacity] duration-250 ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none";

function ThemeGlyph({ dark }: { dark: boolean }) {
  const mask = useId();
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 overflow-visible"
    >
      <defs>
        <mask
          id={mask}
          maskUnits="userSpaceOnUse"
          x="0"
          y="-12"
          width="36"
          height="36"
        >
          <rect x="0" y="-12" width="36" height="36" fill="white" />
          <circle
            cx="18"
            cy="6"
            r="7"
            fill="black"
            className={`${morph} ${dark ? "translate-x-0 translate-y-0" : "translate-x-3 -translate-y-3"}`}
          />
        </mask>
      </defs>
      <g className={`${morph} ${dark ? "scale-100" : "scale-[0.65]"}`}>
        <circle
          cx="12"
          cy="12"
          r="7"
          fill="currentColor"
          mask={`url(#${mask})`}
        />
      </g>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className={`${morph} ${dark ? "rotate-90 scale-[0.8] opacity-0" : "rotate-0 scale-100 opacity-100"}`}
      >
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
      </g>
    </svg>
  );
}

export function ThemeToggle() {
  const { dark, setDark } = useTheme();
  const lightButton = useRef<HTMLButtonElement>(null);
  const darkButton = useRef<HTMLButtonElement>(null);
  const pointer = useRef(false);
  const choose = (next: boolean) => {
    const animate = pointer.current;
    pointer.current = false;
    revealTheme(
      () => setDark(next),
      next ? darkButton.current : lightButton.current,
      animate && next !== dark,
    );
  };
  return (
    <div
      aria-label="Color theme"
      className="relative isolate flex shrink-0 items-center rounded-full border border-line bg-surface p-0.5 shadow-[inset_0_1px_0_#ffffff0a]"
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-0.5 top-0.5 grid size-11 place-items-center rounded-full bg-[var(--button-fill)] text-[var(--button-ink)] transition-transform duration-250 ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none ${dark ? "translate-x-full" : "translate-x-0"}`}
      >
        <ThemeGlyph dark={dark} />
      </span>
      <Toggle
        ref={lightButton}
        onPointerDown={() => {
          pointer.current = true;
        }}
        onKeyDown={() => {
          pointer.current = false;
        }}
        aria-label="Light theme"
        title="Paper workbook"
        pressed={!dark}
        onPressedChange={() => choose(false)}
        className={option}
      >
        <Sun size={18} aria-hidden="true" />
      </Toggle>
      <Toggle
        ref={darkButton}
        onPointerDown={() => {
          pointer.current = true;
        }}
        onKeyDown={() => {
          pointer.current = false;
        }}
        aria-label="Dark theme"
        title="Warm charcoal"
        pressed={dark}
        onPressedChange={() => choose(true)}
        className={option}
      >
        <Moon size={18} aria-hidden="true" />
      </Toggle>
    </div>
  );
}

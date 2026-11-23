import { Toggle } from "@ui-sdk/react/toggle";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
const option =
  "grid size-11 place-items-center rounded-full text-muted-ink hover:text-ink data-pressed:bg-[var(--button-fill)] data-pressed:text-[var(--button-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green";
export function ThemeToggle() {
  const { dark, setDark } = useTheme();
  return (
    <div
      aria-label="Color theme"
      className="flex shrink-0 items-center rounded-full border border-line bg-surface p-0.5 shadow-[inset_0_1px_0_#ffffff0a]"
    >
      <Toggle
        aria-label="Light theme"
        title="Paper workbook"
        pressed={!dark}
        onPressedChange={() => setDark(false)}
        className={option}
      >
        <Sun size={18} aria-hidden="true" />
      </Toggle>
      <Toggle
        aria-label="Dark theme"
        title="Warm charcoal"
        pressed={dark}
        onPressedChange={() => setDark(true)}
        className={option}
      >
        <Moon size={18} aria-hidden="true" />
      </Toggle>
    </div>
  );
}

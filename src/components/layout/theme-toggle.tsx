import { Toggle } from "@ui-sdk/react/toggle";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
export function ThemeToggle() {
  const { dark, setDark } = useTheme();
  return (
    <Toggle
      className="grid size-11 place-items-center rounded border-0 bg-transparent text-muted-ink hover:bg-surface-hover hover:text-ink"
      aria-label="Dark theme"
      pressed={dark}
      onPressedChange={setDark}
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </Toggle>
  );
}

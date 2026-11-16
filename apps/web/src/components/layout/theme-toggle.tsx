import { Toggle } from "@ui-sdk/react/toggle";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
export function ThemeToggle() {
  const { dark, setDark, preference, setPreference } = useTheme();
  return (
    <div className="flex items-center gap-0.5">
      <Toggle
        className="grid size-11 place-items-center rounded-lg border-0 bg-transparent text-muted-ink hover:bg-surface-hover hover:text-ink"
        aria-label="Dark theme"
        pressed={dark}
        onPressedChange={setDark}
        title={
          dark
            ? "Switch to Paper & indigo light"
            : "Switch to warm night reading"
        }
      >
        {dark ? (
          <Sun size={18} aria-hidden="true" />
        ) : (
          <Moon size={18} aria-hidden="true" />
        )}
      </Toggle>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Use device theme"
        onClick={() => setPreference("system")}
        title={
          preference === "system"
            ? "Following your device’s light or dark setting"
            : "Follow your device’s light or dark setting"
        }
        className={`size-11 rounded-lg hover:bg-surface-hover ${preference === "system" ? "bg-green-soft text-green" : "text-muted-ink"}`}
      >
        <Monitor size={17} aria-hidden="true" />
      </Button>
    </div>
  );
}

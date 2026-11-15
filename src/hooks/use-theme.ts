import { useEffect, useState, useSyncExternalStore } from "react";
export type ThemePreference = "light" | "dark" | "system";
const themeKey = "trailbook:theme";
const darkQuery = "(prefers-color-scheme: dark)";
function storedPreference(): ThemePreference {
  try {
    const value = localStorage.getItem(themeKey);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}
function subscribeToDevice(notify: () => void) {
  const media = window.matchMedia(darkQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}
function deviceIsDark() {
  return window.matchMedia(darkQuery).matches;
}
export function useTheme() {
  const [preference, setPreference] = useState(storedPreference);
  const systemDark = useSyncExternalStore(subscribeToDevice, deviceIsDark);
  const dark = preference === "dark" || (preference === "system" && systemDark);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === themeKey || event.key === null)
        setPreference(storedPreference());
    };
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("storage", sync);
    };
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  const choosePreference = (value: ThemePreference) => {
    setPreference(value);
    try {
      localStorage.setItem(themeKey, value);
    } catch {
      /* Theme controls remain usable when browser storage is blocked. */
    }
  };
  return {
    dark,
    preference,
    setPreference: choosePreference,
    setDark: (value: boolean) => choosePreference(value ? "dark" : "light"),
  };
}

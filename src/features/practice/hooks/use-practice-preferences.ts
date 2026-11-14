import { useEffect, useState } from "react";
import { categoryById } from "@/features/topics/data/content";
interface Preferences {
  category: string;
  mode: "flashcards" | "quiz";
}
export function usePracticePreferences(scope: string) {
  const key = `trailbook:practice:preferences:${scope}`;
  const [preferences, setPreferences] = useState<Preferences>(() => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      if (
        value &&
        (value.category === "all" || categoryById.has(value.category)) &&
        (value.mode === "flashcards" || value.mode === "quiz")
      )
        return value;
    } catch {
      /* Invalid or unavailable storage falls back to a fresh setup. */
    }
    return { category: "all", mode: "flashcards" };
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(preferences));
    } catch {
      /* Preferences remain usable without browser storage. */
    }
  }, [key, preferences]);
  return [preferences, setPreferences] as const;
}

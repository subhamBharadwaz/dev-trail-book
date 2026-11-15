import { useEffect, useState, type SetStateAction } from "react";
import {
  progress,
  useCloudProgress,
} from "@/features/account/data/progress-store";
import { categoryById } from "@/features/topics/data/content";
interface Preferences {
  category: string;
  mode: "flashcards" | "quiz";
}
export function usePracticePreferences(scope: string) {
  const key = `trailbook:practice:preferences:${scope}`;
  const cloud = useCloudProgress();
  const recordKey = `practice/preferences/${scope}`;
  const [localPreferences, setLocalPreferences] = useState<Preferences>(() => {
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
  const stored = progress.values()[recordKey] as unknown as
    Preferences | undefined;
  const preferences = cloud.userId
    ? stored &&
      (stored.category === "all" || categoryById.has(stored.category)) &&
      (stored.mode === "flashcards" || stored.mode === "quiz")
      ? stored
      : { category: "all", mode: "flashcards" as const }
    : localPreferences;
  const setPreferences = (change: SetStateAction<Preferences>) => {
    if (!cloud.userId) {
      setLocalPreferences(change);
      return;
    }
    const next = typeof change === "function" ? change(preferences) : change;
    progress.write({ [recordKey]: JSON.parse(JSON.stringify(next)) });
  };
  useEffect(() => {
    if (cloud.userId) return;
    try {
      localStorage.setItem(key, JSON.stringify(localPreferences));
    } catch {
      /* Preferences remain usable without browser storage. */
    }
  }, [key, localPreferences, cloud.userId]);
  return [preferences, setPreferences] as const;
}

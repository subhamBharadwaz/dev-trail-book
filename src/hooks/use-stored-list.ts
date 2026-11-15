import { useEffect, useState } from "react";
import {
  progress,
  useCloudProgress,
} from "@/features/account/data/progress-store";

export function useStoredList(key: string) {
  const cloud = useCloudProgress();
  const prefix = `reading/${key.slice("trailbook:".length)}/`;
  const [items, setItems] = useState<string[]>(() => {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value)
        ? value.filter((item): item is string => typeof item === "string")
        : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    if (cloud.userId) return;
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch {
      /* Reading remains available when browser storage is unavailable. */
    }
  }, [items, key, cloud.userId]);
  const visible = cloud.userId
    ? Object.entries(progress.values())
        .filter(
          ([record, value]) => record.startsWith(prefix) && value === true,
        )
        .map(([record]) => record.slice(prefix.length))
    : items;
  return [
    visible,
    (slug: string) => {
      if (cloud.userId) {
        progress.write({ [`${prefix}${slug}`]: !visible.includes(slug) });
        return;
      }
      setItems((current) =>
        current.includes(slug)
          ? current.filter((item) => item !== slug)
          : [...current, slug],
      );
    },
  ] as const;
}

import { useAccount } from "@/features/account/hooks/use-account";
import { useEffect, useState } from "react";
import {
  progress,
  useCloudProgress,
} from "@/features/account/data/progress-store";

export function useStoredList(key: string) {
  const { loading } = useAccount();
  const cloud = useCloudProgress();
  const prefix = `reading/${key.slice("trailbook:".length)}/`;
  const [items, setItems] = useState<string[]>([]);
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    let restoredItems: string[] = [];
    try {
      const value: unknown = JSON.parse(localStorage.getItem(key) || "[]");
      restoredItems = Array.isArray(value)
        ? value.filter((item): item is string => typeof item === "string")
        : [];
    } catch {
      /* Keep reading usable without storage. */
    }
    setItems(restoredItems);
    setRestored(true);
  }, [key]);
  useEffect(() => {
    if (cloud.userId || !restored) return;
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch {
      /* Reading remains available when browser storage is unavailable. */
    }
  }, [items, key, cloud.userId, restored]);
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
      if (loading || !restored) return;
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

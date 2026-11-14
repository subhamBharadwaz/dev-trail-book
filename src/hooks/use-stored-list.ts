import { useEffect, useState } from "react";

export function useStoredList(key: string) {
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
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch {
      /* Reading remains available when browser storage is unavailable. */
    }
  }, [items, key]);
  return [
    items,
    (slug: string) =>
      setItems((current) =>
        current.includes(slug)
          ? current.filter((item) => item !== slug)
          : [...current, slug],
      ),
  ] as const;
}

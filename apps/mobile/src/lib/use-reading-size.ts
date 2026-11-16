import { useState } from "react";
import { storage } from "./storage";
export function useReadingSize() {
  const [size, set] = useState(() => {
    const value = Number(storage.getItem("trailbook:mobile:reading-size"));
    return value >= 17 && value <= 23 ? value : 18;
  });
  return [
    size,
    (value: number) => {
      storage.setItem("trailbook:mobile:reading-size", String(value));
      set(value);
    },
  ] as const;
}

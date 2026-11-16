import { useSyncExternalStore } from "react";
import { randomUUID } from "expo-crypto";
import { createProgressStore } from "@trailbook/sync";
import { storage } from "./storage";
export const progress = createProgressStore(storage, randomUUID);
progress.activate("mobile-guest");
export function useProgress() {
  const snapshot = useSyncExternalStore(
    progress.subscribe,
    progress.getSnapshot,
  );
  const values = Object.fromEntries(
    Object.entries(snapshot.records).map(([key, record]) => [
      key,
      record.value,
    ]),
  );
  for (const [key, change] of Object.entries(snapshot.pending))
    values[key] = change.value;
  return { ...snapshot, values };
}

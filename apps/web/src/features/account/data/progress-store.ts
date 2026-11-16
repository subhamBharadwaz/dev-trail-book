import { useSyncExternalStore } from "react";
import { createProgressStore } from "@trailbook/sync";
export type {
  Json,
  RemoteRecord,
  Pending,
  ProgressSnapshot,
} from "@trailbook/sync";
export const progress = createProgressStore(localStorage, () =>
  crypto.randomUUID(),
);
export function useCloudProgress() {
  return useSyncExternalStore(progress.subscribe, progress.getSnapshot);
}

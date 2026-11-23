import { browserStorage } from "@/lib/browser-storage";
import { useSyncExternalStore } from "react";
import { createProgressStore } from "@trailbook/sync";
export type {
  Json,
  RemoteRecord,
  Pending,
  ProgressSnapshot,
} from "@trailbook/sync";
export const progress = createProgressStore(browserStorage, () =>
  crypto.randomUUID(),
);
const serverSnapshot = progress.getSnapshot();
export function useCloudProgress() {
  return useSyncExternalStore(
    progress.subscribe,
    progress.getSnapshot,
    () => serverSnapshot,
  );
}

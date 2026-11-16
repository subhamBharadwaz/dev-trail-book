import { useSyncExternalStore } from "react";
let state = { enabled: false, header: true, refreshed: null as number | null };
const listeners = new Set<() => void>();
export function useReminderSettings() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    () => state,
  );
}
export function setFirmHeader(enabled: boolean) {
  state = { ...state, header: enabled };
  listeners.forEach((listener) => listener());
}
export async function setStudyReminders(_enabled: boolean) {
  void _enabled;
  throw new Error(
    "Study notifications are available in the installed Android app.",
  );
}
export function startStudyNotifications() {
  return () => {};
}

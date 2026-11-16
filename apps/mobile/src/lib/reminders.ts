import { AppState, Platform } from "react-native";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";
import { useSyncExternalStore } from "react";
import { reminderSchedule } from "@trailbook/learning/study-nudges";
import { storage } from "./storage";
const enabledKey = "trailbook:mobile:study-reminders:v2";
const headerKey = "trailbook:mobile:firm-header";
const refreshedKey = "trailbook:mobile:reminders-refreshed";
const isOurs = (id: string) =>
  id.startsWith("trailbook-study-") || id === "trailbook-daily-study";
const listeners = new Set<() => void>();
function readSettings() {
  return {
    enabled: storage.getItem(enabledKey) === "1",
    header: storage.getItem(headerKey) !== "0",
    refreshed: Number(storage.getItem(refreshedKey)) || null,
  };
}
let snapshot = readSettings();
function emit() {
  snapshot = readSettings();
  listeners.forEach((listener) => listener());
}
export function useReminderSettings() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    () => snapshot,
  );
}
export function setFirmHeader(enabled: boolean) {
  storage.setItem(headerKey, enabled ? "1" : "0");
  emit();
}
let queue = Promise.resolve();
function serial<T>(task: () => Promise<T>): Promise<T> {
  const next = queue.then(task, task);
  queue = next.then(
    () => {},
    () => {},
  );
  return next;
}
async function schedule() {
  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted)
    throw new Error(
      "Notifications are disabled. Enable them in Android settings, then retry.",
    );
  const desired = reminderSchedule();
  const wanted = new Set(desired.map((s) => s.id));
  const existing = (
    await Notifications.getAllScheduledNotificationsAsync()
  ).filter((n) => isOurs(n.identifier));
  const present = new Set(existing.map((n) => n.identifier)),
    created: string[] = [];
  try {
    for (const slot of desired)
      if (!present.has(slot.id)) {
        await Notifications.scheduleNotificationAsync({
          identifier: slot.id,
          content: {
            title: "Make the next attempt count.",
            body: slot.line,
            data: { kind: "study" },
            sound: "default",
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: new Date(slot.at),
            channelId: "study",
          },
        });
        created.push(slot.id);
      }
    for (const item of existing)
      if (!wanted.has(item.identifier))
        await Notifications.cancelScheduledNotificationAsync(item.identifier);
  } catch (error) {
    await Promise.allSettled(
      created.map((id) => Notifications.cancelScheduledNotificationAsync(id)),
    );
    throw error;
  }
  storage.setItem(refreshedKey, String(Date.now()));
  emit();
}
export async function setStudyReminders(enabled: boolean) {
  return serial(async () => {
    if (Platform.OS === "web")
      throw new Error(
        "Study notifications are available in the installed Android app.",
      );
    if (enabled) {
      if (Platform.OS === "android")
        await Notifications.setNotificationChannelAsync("study", {
          name: "Study reminders",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      const permission = await Notifications.requestPermissionsAsync();
      if (!permission.granted)
        throw new Error(
          "Notification permission was not granted. You can enable it in Android settings.",
        );
      await schedule();
      storage.setItem(enabledKey, "1");
      storage.setItem("trailbook:mobile:reminder-hour", "");
      emit();
    } else {
      const pending = await Notifications.getAllScheduledNotificationsAsync();
      for (const item of pending.filter((n) => isOurs(n.identifier)))
        await Notifications.cancelScheduledNotificationAsync(item.identifier);
      await Notifications.dismissAllNotificationsAsync();
      storage.setItem(enabledKey, "0");
      emit();
    }
  });
}
export function startStudyNotifications() {
  void Notifications.cancelScheduledNotificationAsync(
    "trailbook-daily-study",
  ).catch(() => {});
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: AppState.currentState !== "active",
      shouldShowList: AppState.currentState !== "active",
      shouldPlaySound: AppState.currentState !== "active",
      shouldSetBadge: false,
    }),
  });
  const refresh = () => {
    if (storage.getItem(enabledKey) !== "1") return;
    const last = Number(storage.getItem(refreshedKey)) || 0;
    if (Date.now() - last < 6 * 3600000) return;
    void serial(async () => {
      if (storage.getItem(enabledKey) === "1") await schedule();
    }).catch(() => {});
  };
  const onResponse = (response: Notifications.NotificationResponse) => {
    if (response.notification.request.content.data?.kind !== "study") return;
    const id = response.notification.request.identifier;
    if (storage.getItem("trailbook:mobile:last-reminder-opened") === id) return;
    storage.setItem("trailbook:mobile:last-reminder-opened", id);
    router.navigate("/(tabs)/(today)");
  };
  const response =
    Notifications.addNotificationResponseReceivedListener(onResponse);
  void Notifications.getLastNotificationResponseAsync()
    .then((value) => {
      if (value) onResponse(value);
    })
    .catch(() => {});
  refresh();
  const lifecycle = AppState.addEventListener("change", (state) => {
    if (state === "active") {
      refresh();
      void Notifications.dismissAllNotificationsAsync().catch(() => {});
    }
  });
  return () => {
    response.remove();
    lifecycle.remove();
  };
}

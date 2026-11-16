import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { storage } from "./storage";
const id = "trailbook-daily-study";
export function reminderTime(): number | null {
  const value = storage.getItem("trailbook:mobile:reminder-hour");
  return value === null || value === "" ? null : Number(value);
}
export async function setReminder(hour: number | null) {
  if (Platform.OS === "web")
    throw new Error("Study reminders are available in the Android app.");
  if (hour !== null) {
    if (!Number.isInteger(hour) || hour < 0 || hour > 23)
      throw new Error("Choose a valid hour.");
    if (Platform.OS === "android")
      await Notifications.setNotificationChannelAsync("study", {
        name: "Study reminders",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    const permission = await Notifications.requestPermissionsAsync();
    if (!permission.granted)
      throw new Error(
        "Notifications are disabled. You can enable them in your device settings.",
      );
    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title: "A little progress, every day.",
        body: "Your next small step is waiting in Dev Trailbook.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute: 0,
        channelId: "study",
      },
    });
  } else await Notifications.cancelScheduledNotificationAsync(id);
  storage.setItem(
    "trailbook:mobile:reminder-hour",
    hour === null ? "" : String(hour),
  );
}

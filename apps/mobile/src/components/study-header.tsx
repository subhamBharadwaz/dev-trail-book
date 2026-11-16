import { useEffect, useState } from "react";
import { AppState, View } from "react-native";
import { Text } from "./text";
import { useReminderSettings } from "@/lib/reminders";
const lines = [
  "Your next interview will test today’s effort.",
  "Stop collecting topics. Make one attempt.",
  "Twenty minutes. No scrolling. Start now.",
  "Your plan needs proof. Do the work.",
  "Close the feed. Explain one answer.",
  "December is coming. Practice today.",
  "Build confidence with evidence, not excuses.",
  "One solved problem beats another saved link.",
];
export function StudyHeader({ title }: { title: string }) {
  const settings = useReminderSettings();
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    const listener = AppState.addEventListener("change", (state) => {
      if (state === "active") setNow(Date.now());
    });
    return () => {
      clearInterval(timer);
      listener.remove();
    };
  }, []);
  const line = lines[Math.floor(now / 14400000) % lines.length];
  return (
    <View style={{ flexShrink: 1, maxWidth: 290 }}>
      <Text
        variant="small"
        numberOfLines={2}
        accessibilityLabel={settings.header ? `${title}. ${line}` : title}
        style={{ fontWeight: "600", lineHeight: 20 }}
      >
        {settings.header ? line : title}
      </Text>
    </View>
  );
}

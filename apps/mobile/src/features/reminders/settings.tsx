import { useState } from "react";
import { View } from "react-native";
import { Text } from "@/components/text";
import { Action } from "@/components/action";
import { Choice } from "@/components/choice";
import { space } from "@/theme";
import {
  useReminderSettings,
  setStudyReminders,
  setFirmHeader,
} from "@/lib/reminders";
export function ReminderSettings() {
  const settings = useReminderSettings();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <View style={{ gap: space.lg }}>
      <Text variant="title">No more “later”.</Text>
      <Text muted>
        Study alerts at 9 AM, 1 PM, 5 PM, and 9 PM India time, four hours apart.
        Foreground alerts stay quiet while you use the app.
      </Text>
      <Text variant="small" muted>
        {settings.enabled
          ? "Enabled. The next 14 days are scheduled on your phone and renewed when you open the app. Android battery saving can delay delivery."
          : "Reminders are off. Enable them to let your phone interrupt the scrolling."}
      </Text>
      <Action
        secondary
        disabled={busy}
        label={
          settings.enabled
            ? "Turn off study alerts"
            : "Enable India-time study alerts"
        }
        onPress={() => {
          setBusy(true);
          setError("");
          void setStudyReminders(!settings.enabled)
            .catch((e) =>
              setError(
                e instanceof Error ? e.message : "Could not update reminders.",
              ),
            )
            .finally(() => setBusy(false));
        }}
      />
      {!!error && <Text accessibilityRole="alert">{error}</Text>}
      <Text variant="label">APP HEADER</Text>
      <Choice
        label="Study header tone"
        value={settings.header ? "firm" : "quiet"}
        options={[
          { value: "firm", label: "Firm reminders" },
          { value: "quiet", label: "Quiet header" },
        ]}
        onChange={(v) => setFirmHeader(v === "firm")}
      />
    </View>
  );
}

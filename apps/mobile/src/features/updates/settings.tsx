import { ApkUpdateSettings } from "./apk-settings";
import { Alert, View } from "react-native";
import { Text } from "@/components/text";
import { Action } from "@/components/action";
import { useAppUpdates } from "@/lib/app-updates";
import { space } from "@/theme";
export function UpdateSettings() {
  const update = useAppUpdates();
  return (
    <View style={{ gap: space.lg }}>
      <ApkUpdateSettings />
      <Text variant="title">Lesson and app updates</Text>
      <Text muted>
        Compatible lesson, design, and logic updates download inside the app.
        Native-library and permission changes still need a new APK.
      </Text>
      {update.supported && (
        <Action
          secondary
          label={
            update.busy ? "Checking or downloading…" : "Check for app update"
          }
          disabled={update.busy}
          onPress={() => void update.check()}
        />
      )}
      {!!update.message && <Text muted>{update.message}</Text>}
      {update.pending && (
        <Action
          label="Restart to apply update"
          disabled={update.busy}
          onPress={() =>
            Alert.alert(
              "Restart into the update?",
              "Your saved study records and drafts stay on this device. You can also restart later.",
              [
                { text: "Later", style: "cancel" },
                { text: "Restart", onPress: () => void update.apply() },
              ],
            )
          }
        />
      )}
      {!!update.error && <Text accessibilityRole="alert">{update.error}</Text>}
    </View>
  );
}

import { useApkUpdates } from "@/lib/apk-updates";
import { View } from "react-native";
import { router } from "expo-router";
import { Text } from "./text";
import { Action } from "./action";
import { useAppUpdates } from "@/lib/app-updates";
import { space, radius, useTheme } from "@/theme";
export function UpdateNotice() {
  const update = useAppUpdates(),
    { colors } = useTheme();
  const apk = useApkUpdates();
  if (apk.visible && apk.release)
    return (
      <View
        style={{
          padding: space.lg,
          gap: space.md,
          borderRadius: radius.medium,
          backgroundColor: colors.tint,
        }}
      >
        <Text>
          Dev Trailbook {apk.release.version} is available. Review what’s new
          and download the standalone APK.
        </Text>
        <Action
          label="Review new APK"
          onPress={() => router.navigate("/account")}
        />
        <Action secondary label="Later" onPress={apk.dismiss} />
      </View>
    );
  if (!update.pending) return null;
  return (
    <View
      style={{
        padding: space.lg,
        gap: space.md,
        borderRadius: radius.medium,
        backgroundColor: colors.tint,
      }}
    >
      <Text>
        A new app update is ready. Finish your current attempt, then restart.
      </Text>
      <Action
        secondary
        label="Review downloaded update"
        onPress={() => router.navigate("/account")}
      />
    </View>
  );
}

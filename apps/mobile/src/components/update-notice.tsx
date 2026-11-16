import { View } from "react-native";
import { router } from "expo-router";
import { Text } from "./text";
import { Action } from "./action";
import { useAppUpdates } from "@/lib/app-updates";
import { space, radius, useTheme } from "@/theme";
export function UpdateNotice() {
  const update = useAppUpdates(),
    { colors } = useTheme();
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

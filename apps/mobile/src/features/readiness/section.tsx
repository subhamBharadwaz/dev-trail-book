import { View } from "react-native";
import type { PropsWithChildren } from "react";
import { Text } from "@/components/text";
import { space, radius, useTheme } from "@/theme";
export function ReadinessSection({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        gap: space.lg,
        padding: space.xl,
        borderRadius: radius.large,
        backgroundColor: colors.surface,
      }}
    >
      <Text variant="title">{title}</Text>
      {children}
    </View>
  );
}

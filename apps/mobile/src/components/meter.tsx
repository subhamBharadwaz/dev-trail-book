import { View } from "react-native";
import { radius, useTheme } from "@/theme";
export function Meter({ value, label }: { value: number; label: string }) {
  const { colors } = useTheme();
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={{
        height: 6,
        borderRadius: radius.pill,
        backgroundColor: colors.line,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          height: "100%",
          width: `${Math.max(0, Math.min(1, value)) * 100}%`,
          backgroundColor: colors.accent,
        }}
      />
    </View>
  );
}

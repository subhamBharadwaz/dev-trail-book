import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { ComponentProps } from "react";
import type { ColorValue } from "react-native";
import { useTheme } from "@/theme";
export type IconName = ComponentProps<typeof MaterialIcons>["name"];
export function Icon({
  name,
  color,
  size = 24,
}: {
  name: IconName;
  color?: ColorValue;
  size?: number;
}) {
  const { colors } = useTheme();
  return (
    <MaterialIcons
      accessible={false}
      name={name}
      size={size}
      color={
        typeof color === "number" ? colors.accent : (color ?? colors.accent)
      }
    />
  );
}

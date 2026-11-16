import { Text as NativeText, type TextProps } from "react-native";
import { type, useTheme } from "@/theme";
export function Text({
  variant = "body",
  muted,
  style,
  ...props
}: TextProps & { variant?: keyof typeof type; muted?: boolean }) {
  const { colors } = useTheme();
  return (
    <NativeText
      {...props}
      style={[
        type[variant],
        { color: muted ? colors.muted : colors.text },
        style,
      ]}
    />
  );
}

import { Button, Host } from "@expo/ui";
import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import { Icon, type IconName } from "./icon";
import { radius, useTheme } from "@/theme";
export function Action({
  label,
  onPress,
  secondary,
  disabled,
}: {
  label: string;
  onPress(): void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  const { colors, mode } = useTheme();
  return (
    <Host
      colorScheme={mode}
      seedColor={colors.accent}
      matchContents={{ vertical: true }}
      style={{ width: "100%" }}
    >
      <Button
        label={label}
        onPress={onPress}
        disabled={disabled}
        variant={secondary ? "outlined" : "filled"}
        style={{
          borderRadius: radius.medium,
          paddingVertical: 14,
          ...(secondary
            ? { borderColor: colors.line }
            : { backgroundColor: colors.accent }),
        }}
      />
    </Host>
  );
}
export function IconAction({
  label,
  name,
  onPress,
  style,
}: {
  label: string;
  name: IconName;
  onPress(): void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [
        {
          minHeight: 48,
          minWidth: 48,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: radius.pill,
          backgroundColor: pressed ? colors.tint : "transparent",
        },
        style,
      ]}
    >
      <Icon name={name} />
    </Pressable>
  );
}

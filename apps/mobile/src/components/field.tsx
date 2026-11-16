import { TextInput, View, type TextInputProps } from "react-native";
import { Text } from "./text";
import { space, radius, type, useTheme } from "@/theme";
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: space.sm }}>
      <Text variant="small" style={{ fontWeight: "600" }}>
        {label}
      </Text>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        style={[
          type.body,
          {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.line,
            borderRadius: radius.medium,
            padding: space.lg,
            minHeight: 56,
            color: colors.text,
            textAlignVertical: props.multiline ? "top" : "center",
          },
          props.style,
        ]}
      />
    </View>
  );
}

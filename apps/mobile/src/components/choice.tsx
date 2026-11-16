import { Pressable, ScrollView, View } from "react-native";
import { Text } from "./text";
import { radius, space, useTheme } from "@/theme";
export function Choice<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange(value: T): void;
  label: string;
}) {
  const { colors } = useTheme();
  return (
    <View accessibilityLabel={label}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: space.sm, paddingVertical: space.xs }}
      >
        {options.map((option) => (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            aria-checked={value === option.value}
            accessibilityState={{ checked: value === option.value }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => ({
              paddingHorizontal: space.lg,
              paddingVertical: space.md,
              minHeight: 48,
              borderRadius: radius.pill,
              backgroundColor:
                value === option.value
                  ? colors.accent
                  : pressed
                    ? colors.tint
                    : colors.surface,
              borderWidth: 1,
              borderColor: value === option.value ? colors.accent : colors.line,
            })}
          >
            <Text
              variant="small"
              style={{
                color: value === option.value ? colors.onAccent : colors.text,
                fontWeight: "600",
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

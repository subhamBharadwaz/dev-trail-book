import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "./text";
import { Icon, type IconName } from "./icon";
import { radius, space, useTheme } from "@/theme";
const destinations = [
  { name: "today", href: "/" as const, label: "Today", icon: "today" },
  { name: "learn", href: "/learn" as const, label: "Learn", icon: "menu-book" },
  {
    name: "practice",
    href: "/practice" as const,
    label: "Practice",
    icon: "style",
  },
  {
    name: "progress",
    href: "/progress" as const,
    label: "Progress",
    icon: "insights",
  },
];
export function RailTabs() {
  const { colors } = useTheme();
  return (
    <Tabs
      style={{
        flex: 1,
        flexDirection: "row",
        backgroundColor: colors.background,
      }}
    >
      <TabList
        asChild
        style={{ flexDirection: "column", justifyContent: "flex-start" }}
      >
        <SafeAreaView
          style={{
            gap: space.sm,
            padding: space.md,
            width: 208,
            backgroundColor: colors.surface,
            borderRightWidth: 1,
            borderColor: colors.line,
          }}
        >
          <View
            style={{
              padding: space.page,
              paddingVertical: space.section,
              gap: space.sm,
            }}
          >
            <Icon name="route" size={32} />
            <Text variant="heading">Dev Trailbook</Text>
            <Text variant="small" muted>
              A little further, daily.
            </Text>
          </View>
          {destinations.map((item) => (
            <TabTrigger
              key={item.name}
              name={item.name}
              href={item.href}
              asChild
            >
              <RailLink label={item.label} icon={item.icon as IconName} />
            </TabTrigger>
          ))}
        </SafeAreaView>
      </TabList>
      <TabSlot style={{ flex: 1 }} />
    </Tabs>
  );
}
function RailLink({
  label,
  icon,
  isFocused,
  onPress,
}: {
  label: string;
  icon: IconName;
  isFocused?: boolean;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="tab"
      aria-selected={isFocused}
      accessibilityState={{ selected: isFocused }}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 56,
        paddingHorizontal: space.lg,
        borderRadius: radius.medium,
        flexDirection: "row",
        alignItems: "center",
        gap: space.md,
        backgroundColor: isFocused || pressed ? colors.tint : "transparent",
      })}
    >
      <Icon name={icon} color={isFocused ? colors.accent : colors.muted} />
      <Text
        variant="small"
        style={{
          color: isFocused ? colors.accent : colors.text,
          fontWeight: "600",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

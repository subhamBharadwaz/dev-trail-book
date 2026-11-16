import { useWindowDimensions } from "react-native";
import { RailTabs } from "@/components/rail-tabs";
import { Tabs } from "expo-router";
import { Icon } from "@/components/icon";
import { useTheme } from "@/theme";
export default function TabsLayout() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  if (width >= 768) return <RailTabs />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          minHeight: 70,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="(today)"
        options={{
          title: "Today",
          tabBarIcon: (props) => <Icon name="today" {...props} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarIcon: (props) => <Icon name="menu-book" {...props} />,
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: "Practice",
          tabBarIcon: (props) => <Icon name="style" {...props} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: (props) => <Icon name="insights" {...props} />,
        }}
      />
    </Tabs>
  );
}

import { useWindowDimensions } from "react-native";
import { RailTabs } from "@/components/rail-tabs";
import { NativeTabs } from "expo-router/native-tabs";
import { useTheme } from "@/theme";
export default function TabLayout() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  if (width >= 768) return <RailTabs />;
  return (
    <NativeTabs tintColor={colors.accent} backgroundColor={colors.surface}>
      <NativeTabs.Trigger name="(today)">
        <NativeTabs.Trigger.Icon md="today" sf="sun.max" />
        <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="learn">
        <NativeTabs.Trigger.Icon md="menu_book" sf="book" />
        <NativeTabs.Trigger.Label>Learn</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="practice">
        <NativeTabs.Trigger.Icon md="style" sf="rectangle.on.rectangle" />
        <NativeTabs.Trigger.Label>Practice</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="progress">
        <NativeTabs.Trigger.Icon md="insights" sf="chart.bar" />
        <NativeTabs.Trigger.Label>Progress</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

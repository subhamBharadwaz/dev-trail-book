import { Stack } from "expo-router/stack";
import { router } from "expo-router";
import { IconAction } from "./action";
import { useTheme } from "@/theme";
export function StudyStack({ title }: { title: string }) {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title,
          headerRight: () => (
            <IconAction
              name="account-circle"
              label="Account and settings"
              onPress={() => router.push("/account")}
            />
          ),
        }}
      />
    </Stack>
  );
}

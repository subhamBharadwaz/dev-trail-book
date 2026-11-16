import { useAppUpdates } from "@/lib/app-updates";
import { StudyHeader } from "./study-header";
import { Stack } from "expo-router/stack";
import { router } from "expo-router";
import { IconAction } from "./action";
import { useTheme } from "@/theme";
export function StudyStack({ title }: { title: string }) {
  const { colors } = useTheme();
  const { pending } = useAppUpdates();
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
          headerTitle: () => <StudyHeader title={title} />,
          headerRight: () => (
            <IconAction
              name={pending ? "system-update" : "account-circle"}
              label={pending ? "App update ready" : "Account and settings"}
              onPress={() => router.push("/account")}
            />
          ),
        }}
      />
    </Stack>
  );
}

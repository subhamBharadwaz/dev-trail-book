import { AppUpdatesProvider } from "@/lib/app-updates";
import type { ErrorBoundaryProps } from "expo-router";
import { Screen } from "@/components/screen";
import { Text } from "@/components/text";
import { Action } from "@/components/action";
import { startStudyNotifications } from "@/lib/reminders";
import { StudyHeader } from "@/components/study-header";
import { useEffect } from "react";
import { Stack } from "expo-router/stack";
import {
  ThemeProvider as NavigationTheme,
  DarkTheme,
  DefaultTheme,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider, useTheme } from "@/theme";
import { AccountProvider } from "@/lib/account-provider";
export const unstable_settings = { anchor: "(tabs)" };
void SplashScreen.preventAutoHideAsync();
function Navigation() {
  const { mode, colors } = useTheme();
  useEffect(() => startStudyNotifications(), []);
  const base = mode === "dark" ? DarkTheme : DefaultTheme;
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);
  return (
    <NavigationTheme
      value={{
        ...base,
        colors: {
          ...base.colors,
          background: colors.background,
          card: colors.background,
          primary: colors.accent,
          text: colors.text,
          border: colors.line,
        },
      }}
    >
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerTitle: ({ children }) => <StudyHeader title={children} />,
          headerTintColor: colors.text,
          headerStyle: { backgroundColor: colors.background },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, title: "Home" }}
        />
        <Stack.Screen name="topic/[slug]" options={{ title: "Lesson" }} />
        <Stack.Screen
          name="roadmap"
          options={{ title: "Preparation roadmap" }}
        />
        <Stack.Screen
          name="readiness"
          options={{ title: "Weekly readiness" }}
        />
        <Stack.Screen
          name="interviews"
          options={{ title: "Mock interviews" }}
        />
        <Stack.Screen name="mistakes" options={{ title: "Mistake notebook" }} />
        <Stack.Screen name="backup" options={{ title: "Export & restore" }} />
        <Stack.Screen name="account" options={{ title: "Your space" }} />
        <Stack.Screen
          name="evidence"
          options={{
            title: "Record your work",
            presentation: "formSheet",
            sheetAllowedDetents: [1],
          }}
        />
        <Stack.Screen name="auth/callback" options={{ title: "Sign in" }} />
      </Stack>
    </NavigationTheme>
  );
}
export default function RootLayout() {
  return (
    <ThemeProvider>
      <AccountProvider>
        <AppUpdatesProvider>
          <Navigation />
        </AppUpdatesProvider>
      </AccountProvider>
    </ThemeProvider>
  );
}

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return (
    <Screen>
      <Text variant="title">Let’s pick that up again.</Text>
      <Text>
        Something interrupted this screen. Your saved progress stays on this
        device.
      </Text>
      <Action label="Try again" onPress={() => void retry()} />
    </Screen>
  );
}

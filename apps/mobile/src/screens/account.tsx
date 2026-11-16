import { recordTitle, recordSummary } from "@/lib/record-summary";
import { useState } from "react";
import { Alert, View } from "react-native";
import { router } from "expo-router";
import { UpdateSettings } from "@/features/updates/settings";
import { ReminderSettings } from "@/features/reminders/settings";
import * as Linking from "expo-linking";
import { Screen } from "@/components/screen";
import { Text } from "@/components/text";
import { Action } from "@/components/action";
import { Field } from "@/components/field";
import { Choice } from "@/components/choice";
import { SectionHeading } from "@/components/section-heading";
import { Icon } from "@/components/icon";
import { client, useAccount } from "@/lib/account-provider";
import { progress, useProgress } from "@/lib/progress";
import { storage } from "@/lib/storage";
import { space, radius, useTheme } from "@/theme";
export default function Account() {
  const { colors, preference, setPreference } = useTheme();
  const { session, ready, error: accountError, retry } = useAccount();
  const snapshot = useProgress();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [reviewImport, setReviewImport] = useState(false);
  const conflicts = Object.entries(snapshot.conflicts);
  const canImport =
    session &&
    snapshot.phase !== "loading" &&
    snapshot.phase !== "syncing" &&
    !!snapshot.lastSynced;
  function missingGuest() {
    try {
      const cache = JSON.parse(
        storage.getItem("trailbook:cloud:mobile-guest:v1") ?? "null",
      );
      const records = Object.fromEntries(
        Object.entries(cache?.records ?? {}).map(([key, value]) => [
          key,
          (value as { value: unknown }).value,
        ]),
      );
      for (const [key, value] of Object.entries(cache?.pending ?? {}))
        records[key] = (value as { value: unknown }).value;
      const existing = progress.values();
      return Object.fromEntries(
        Object.entries(records).filter(([key]) => existing[key] === undefined),
      );
    } catch {
      return {};
    }
  }
  async function signIn() {
    if (!client || busy) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter your email address.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const { error } = await client.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: Linking.createURL("auth/callback") },
      });
      if (error) throw error;
      setMessage("Check your email and open the sign-in link on this device.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not send the sign-in link. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function signOut() {
    setBusy(true);
    try {
      const result = await client?.auth.signOut({ scope: "local" });
      if (result?.error) throw result.error;
      setMessage("Signed out on this device.");
    } catch {
      setError("Could not sign out. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen>
      <View style={{ gap: space.md }}>
        <Text variant="display">Make yourself at home.</Text>
        <Text muted>
          A quieter reading space. Your learning, wherever you pick it up.
        </Text>
      </View>
      <Action
        secondary
        label="Export & restore study data"
        onPress={() => router.push("/backup")}
      />
      <View
        style={{
          backgroundColor: colors.surface,
          padding: space.xl,
          borderRadius: radius.large,
          gap: space.lg,
        }}
      >
        <Icon name={session ? "cloud-done" : "devices"} size={32} />
        <Text variant="title">
          {session ? "Your devices, in step." : "Take your progress with you."}
        </Text>
        {!ready ? (
          <Text muted>Restoring your account…</Text>
        ) : session ? (
          <>
            <Text>{session.user.email}</Text>
            <Text variant="small" muted>
              {snapshot.phase === "saved"
                ? "Up to date"
                : snapshot.phase === "offline"
                  ? "Offline · changes will sync when you reconnect"
                  : snapshot.phase === "error"
                    ? "Sync needs attention"
                    : "Syncing your progress…"}
            </Text>
            <Text variant="small" muted>
              {Object.keys(snapshot.pending).length} changes waiting
              {snapshot.lastSynced
                ? ` · Last synced ${new Date(snapshot.lastSynced).toLocaleTimeString()}`
                : ""}
            </Text>
            {snapshot.storageError && (
              <Text style={{ color: colors.danger }}>
                Your device could not save its local cache. Keep the app open
                until changes sync.
              </Text>
            )}
            {snapshot.phase === "error" && (
              <Action secondary label="Retry connection" onPress={retry} />
            )}
            <Action
              secondary
              disabled={!canImport}
              label="Review progress from before sign-in"
              onPress={() => setReviewImport(true)}
            />
            {reviewImport && (
              <View style={{ gap: space.md }}>
                <Text>
                  {Object.keys(missingGuest()).length} local records can be
                  added. Existing account records stay as they are.
                </Text>
                <Action
                  disabled={!Object.keys(missingGuest()).length}
                  label="Import these records"
                  onPress={() => {
                    progress.write(JSON.parse(JSON.stringify(missingGuest())));
                    setReviewImport(false);
                    setMessage("Local progress queued for sync.");
                  }}
                />
                <Action
                  secondary
                  label="Cancel import"
                  onPress={() => setReviewImport(false)}
                />
              </View>
            )}
            <Action
              secondary
              disabled={busy}
              label="Sign out on this device"
              onPress={() =>
                Alert.alert(
                  "Sign out?",
                  Object.keys(snapshot.pending).length
                    ? "Changes waiting to sync will stay saved on this device for this account."
                    : "You can still study offline as a guest.",
                  [
                    { text: "Stay signed in", style: "cancel" },
                    { text: "Sign out", onPress: () => void signOut() },
                  ],
                )
              }
            />
          </>
        ) : (
          <>
            <Text muted>
              Use the same email as the website. Guest progress stays on this
              device until you choose to import it.
            </Text>
            <Field
              label="Email address"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
            <Action
              disabled={busy || !client}
              label={busy ? "Sending…" : "Email me a sign-in link"}
              onPress={() => void signIn()}
            />
            {!client && (
              <Text muted>
                Account sync hasn’t been configured for this build yet.
              </Text>
            )}
          </>
        )}
      </View>
      {!!(error || accountError) && (
        <View accessibilityRole="alert">
          <Text style={{ color: colors.danger }}>{error || accountError}</Text>
          <Action secondary label="Retry account connection" onPress={retry} />
        </View>
      )}
      {!!message && (
        <Text
          accessibilityLiveRegion="polite"
          style={{ color: colors.success }}
        >
          {message}
        </Text>
      )}
      {conflicts.length > 0 && (
        <View style={{ gap: space.lg }}>
          <SectionHeading
            title="Choose which change to keep"
            detail="This record changed on two devices. Your local version is preserved until you choose."
          />
          {conflicts.map(([key]) => (
            <View key={key} style={{ gap: space.md }}>
              <Text variant="small">{recordTitle(key)}</Text>
              <Text variant="small" muted>
                On this device:{" "}
                {recordSummary(key, snapshot.pending[key]?.value)}
              </Text>
              <Text variant="small" muted>
                In your account:{" "}
                {recordSummary(key, snapshot.conflicts[key].value)}
              </Text>
              <Action
                label="Keep this device’s change"
                onPress={() => progress.resolve(key, "local")}
              />
              <Action
                secondary
                label="Use account version"
                onPress={() => progress.resolve(key, "cloud")}
              />
            </View>
          ))}
        </View>
      )}

      <View style={{ gap: space.md }}>
        <SectionHeading
          title="Reading atmosphere"
          detail="Paper & Indigo by day. Warm charcoal when the lights go down."
        />
        <Choice
          label="App theme"
          value={preference}
          onChange={setPreference}
          options={[
            { value: "system", label: "Device" },
            { value: "light", label: "Paper" },
            { value: "dark", label: "Night" },
          ]}
        />
      </View>
      <UpdateSettings />
      <ReminderSettings />
      <Text variant="small" muted>
        All lessons are stored in the app for offline reading. Your theme and
        reminders belong to this device.
      </Text>
    </Screen>
  );
}

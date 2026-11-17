import { View } from "react-native";
import { Text } from "@/components/text";
import { Action } from "@/components/action";
import { useApkUpdates } from "@/lib/apk-updates";
import { space } from "@/theme";
export function ApkUpdateSettings() {
  const update = useApkUpdates();
  return (
    <View style={{ gap: space.md }}>
      <Text variant="title">Android APK releases</Text>
      <Text muted>
        When a new standalone app is released, you’ll see a notice here.
        Download the APK, then open it from your phone’s Downloads to approve
        installation. Your progress stays in the app; export a backup before
        upgrading.
      </Text>
      {!update.supported ? (
        <Text muted>
          APK update checks run in the standalone Android app. Development
          builds use Metro.
        </Text>
      ) : (
        <>
          <Text muted>Installed Android build: {update.installedBuild}</Text>
          <Action
            secondary
            label={update.busy ? "Checking APK releases…" : "Check for new APK"}
            disabled={update.busy}
            onPress={() => void update.check()}
          />
          {update.available && update.release ? (
            <>
              <Text variant="heading">
                Version {update.release.version} · build {update.release.build}
              </Text>
              <Text muted>
                {(update.release.size / 1024 ** 2).toFixed(1)} MB · standalone
                Android app
              </Text>
              <Text>
                {update.release.notes || "No release notes were provided."}
              </Text>
              <Action
                label={
                  update.opening ? "Opening download…" : "Download latest APK"
                }
                disabled={update.opening}
                onPress={() => void update.download()}
              />
              <Text muted>
                Your browser handles the download. Android may ask you to allow
                installation from that browser. Keep the existing app installed
                to retain its data.
              </Text>
            </>
          ) : update.checkedAt > 0 ? (
            <Text muted>
              {update.release
                ? "No newer standalone APK is available for this installation."
                : "No standalone APK release has been published yet."}
            </Text>
          ) : (
            <Text muted>
              Check when you’re connected to see available releases.
            </Text>
          )}
          {update.checkedAt > 0 && (
            <Text muted>
              Last checked: {new Date(update.checkedAt).toLocaleString()}
            </Text>
          )}
          {!!update.error && (
            <Text accessibilityRole="alert">{update.error}</Text>
          )}
        </>
      )}
    </View>
  );
}

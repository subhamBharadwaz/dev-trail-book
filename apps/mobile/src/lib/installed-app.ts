import { requireOptionalNativeModule } from "expo";
// expo-notifications already bundles ExpoApplication in our existing APK. Reading
// its constants optionally avoids adding a native dependency or forcing a new APK.
const application = requireOptionalNativeModule<{
  nativeBuildVersion?: string;
  applicationId?: string;
}>("ExpoApplication");
const code = Number(application?.nativeBuildVersion);
export const installedApp = {
  id: application?.applicationId ?? null,
  build: Number.isSafeInteger(code) && code > 0 ? code : null,
};

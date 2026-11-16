import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { AppState } from "react-native";
import * as Updates from "expo-updates";
import { UpdateContext } from "./updates-context";
import { storage } from "./storage";
import { progress } from "./progress";
export { useAppUpdates } from "./updates-context";
export function AppUpdatesProvider({ children }: PropsWithChildren) {
  const update = Updates.useUpdates();
  const supported = Updates.isEnabled && !__DEV__;
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  const running = useRef(false);
  const check = useCallback(async () => {
    if (!supported || running.current) return;
    if (update.isUpdatePending) {
      setMessage("An update is downloaded and ready.");
      return;
    }
    running.current = true;
    setBusy(true);
    setError("");
    setMessage("Checking for an update…");
    try {
      const result = await Updates.checkForUpdateAsync();
      storage.setItem("trailbook:mobile:update-checked", String(Date.now()));
      if (result.isAvailable || result.isRollBackToEmbedded) {
        setMessage("Downloading your update…");
        await Updates.fetchUpdateAsync();
        setMessage("Update downloaded. Restart when you’re ready.");
      } else setMessage("You’re running the latest compatible update.");
    } catch {
      setError(
        "Could not check for updates. Your installed app still works; retry when connected.",
      );
      setMessage("");
    } finally {
      running.current = false;
      setBusy(false);
    }
  }, [supported, update.isUpdatePending]);
  useEffect(() => {
    if (!supported) return;
    const subscription = AppState.addEventListener("change", (state) => {
      const last =
        Number(storage.getItem("trailbook:mobile:update-checked")) || 0;
      if (state === "active" && Date.now() - last > 6 * 3600000) void check();
    });
    return () => subscription.remove();
  }, [supported, check]);
  async function apply() {
    if (!supported || !update.isUpdatePending || running.current) return;
    if (progress.getSnapshot().storageError) {
      setError(
        "Device storage could not save your work. Export a backup before restarting.",
      );
      return;
    }
    setBusy(true);
    setError("");
    try {
      await Updates.reloadAsync();
    } catch {
      setError(
        "Could not restart into the update. Close and reopen the app to try again.",
      );
      setBusy(false);
    }
  }
  return (
    <UpdateContext
      value={{
        supported,
        pending: update.isUpdatePending,
        busy: busy || update.isDownloading,
        message: supported
          ? message
          : "Development builds use Metro. Install the standalone APK to receive in-app updates.",
        error,
        check,
        apply,
      }}
    >
      {children}
    </UpdateContext>
  );
}

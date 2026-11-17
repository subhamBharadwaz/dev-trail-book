import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { AppState, Platform } from "react-native";
import { installedApp } from "./installed-app";
import { fetch } from "expo/fetch";
import * as Linking from "expo-linking";
import { storage } from "./storage";
import {
  fetchApkRelease,
  hasNewApk,
  selectApkRelease,
  type ApkRelease,
} from "@/features/updates/apk-release";
const cacheKey = "trailbook:mobile:apk-release:v1";
const dismissedKey = "trailbook:mobile:apk-dismissed:v1";
const interval = 6 * 3600000;
interface ApkUpdateState {
  supported: boolean;
  installedBuild: number | null;
  release: ApkRelease | null;
  available: boolean;
  visible: boolean;
  busy: boolean;
  opening: boolean;
  checkedAt: number;
  error: string;
  check(): Promise<void>;
  download(): Promise<void>;
  dismiss(): void;
}
const Context = createContext<ApkUpdateState>({
  supported: false,
  installedBuild: null,
  release: null,
  available: false,
  visible: false,
  busy: false,
  opening: false,
  checkedAt: 0,
  error: "",
  async check() {},
  async download() {},
  dismiss() {},
});
export const useApkUpdates = () => useContext(Context);
function cached() {
  try {
    const value = JSON.parse(storage.getItem(cacheKey) || "null");
    return {
      release: selectApkRelease(value?.feed ?? []),
      checkedAt:
        typeof value?.checkedAt === "number" &&
        Number.isFinite(value.checkedAt) &&
        value.checkedAt <= Date.now()
          ? value.checkedAt
          : 0,
    };
  } catch {
    return { release: null, checkedAt: 0 };
  }
}
export function ApkUpdatesProvider({ children }: PropsWithChildren) {
  // Native installation metadata stays fixed across OTA updates; expoConfig does not.
  const installedBuild = installedApp.build;
  const supported =
    Platform.OS === "android" &&
    !__DEV__ &&
    installedApp.id === "com.devtrailbook.app" &&
    installedBuild !== null;
  const [state, setState] = useState(cached);
  const [busy, setBusy] = useState(false),
    [opening, setOpening] = useState(false);
  const [error, setError] = useState("");
  const [dismissed, setDismissed] = useState(() => {
    try {
      return Number(storage.getItem(dismissedKey)) || 0;
    } catch {
      return 0;
    }
  });
  const active = useRef<AbortController | null>(null);
  const lastAttempt = useRef(0),
    alive = useRef(true),
    openingRef = useRef(false);
  const check = useCallback(async () => {
    if (!supported || active.current) return;
    const controller = new AbortController();
    active.current = controller;
    lastAttempt.current = Date.now();
    setBusy(true);
    setError("");
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const result = await fetchApkRelease(
        fetch as typeof globalThis.fetch,
        controller.signal,
      );
      const release = selectApkRelease(result.feed);
      if (!alive.current) return;
      setState({ release, checkedAt: result.checkedAt });
      try {
        storage.setItem(cacheKey, JSON.stringify(result));
      } catch {
        /* Checks still work without a cache. */
      }
    } catch {
      if (alive.current)
        setError(
          "Could not check APK releases. Your app still works. Connect to the internet and try again.",
        );
    } finally {
      clearTimeout(timeout);
      active.current = null;
      if (alive.current) setBusy(false);
    }
  }, [supported]);
  useEffect(() => {
    alive.current = true;
    if (!supported) return;
    function refresh() {
      const last = Math.max(state.checkedAt, lastAttempt.current);
      if (Date.now() - last >= interval) void check();
    }
    refresh();
    const subscription = AppState.addEventListener("change", (value) => {
      if (value === "active") refresh();
    });
    return () => {
      alive.current = false;
      subscription.remove();
      active.current?.abort();
    };
  }, [supported, state.checkedAt, check]);
  const available = supported && hasNewApk(state.release, installedBuild);
  async function download() {
    if (!available || !state.release || openingRef.current) return;
    openingRef.current = true;
    setOpening(true);
    setError("");
    try {
      await Linking.openURL(state.release.downloadUrl);
    } catch {
      if (alive.current)
        setError(
          "Could not open the APK download. Try again when your browser is available.",
        );
    } finally {
      openingRef.current = false;
      if (alive.current) setOpening(false);
    }
  }
  function dismiss() {
    if (!state.release) return;
    setDismissed(state.release.build);
    try {
      storage.setItem(dismissedKey, String(state.release.build));
    } catch {
      /* Dismiss for this visit. */
    }
  }
  return (
    <Context
      value={{
        supported,
        installedBuild,
        ...state,
        available,
        visible: available && state.release!.build !== dismissed,
        busy,
        opening,
        error,
        check,
        download,
        dismiss,
      }}
    >
      {children}
    </Context>
  );
}

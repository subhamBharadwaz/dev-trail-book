import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { AppState } from "react-native";
import * as Linking from "expo-linking";
import * as Network from "expo-network";
import { createClient, type Session } from "@supabase/supabase-js";
import { createRecordSync } from "@trailbook/sync/engine";
import { secureStorage } from "./secure-storage";
import { progress } from "./progress";
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const client =
  url && key
    ? createClient(url, key, {
        auth: {
          storage: secureStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
          flowType: "pkce",
        },
      })
    : null;
const AccountContext = createContext<{
  session: Session | null;
  ready: boolean;
  error: string;
  retry(): void;
}>({ session: null, ready: false, error: "", retry() {} });
export function AccountProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(!client);
  const [error, setError] = useState("");
  const [attempt, retry] = useState(0);
  useEffect(() => {
    if (!client) return;
    let active = true;
    const auth = client;
    const update = (value: Session | null) => {
      if (!active) return;
      progress.activate(value?.user.id ?? "mobile-guest");
      setSession(value);
      setReady(true);
    };
    const subscription = auth.auth.onAuthStateChange((_event, value) =>
      update(value),
    );
    auth.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) setError(error.message);
        else update(data.session);
        setReady(true);
      })
      .catch(() => {
        if (active) {
          setError("Could not restore your account. Retry when connected.");
          setReady(true);
        }
      });
    async function callback(incoming: string) {
      const parsed = Linking.parse(incoming);
      const expected = Linking.parse(Linking.createURL("auth/callback"));
      if (
        parsed.scheme !== expected.scheme ||
        parsed.hostname !== expected.hostname ||
        parsed.path !== expected.path
      )
        return;
      const code = parsed.queryParams?.code;
      if (typeof code === "string") {
        try {
          const result = await auth.auth.exchangeCodeForSession(code);
          if (result.error && active)
            setError(
              "This sign-in link could not be used. Request a new link on this device.",
            );
        } catch {
          if (active) setError("Could not finish sign-in. Please try again.");
        }
      }
    }
    Linking.getInitialURL()
      .then((value) => {
        if (value && active) void callback(value);
      })
      .catch(() => {});
    const links = Linking.addEventListener(
      "url",
      (event) => void callback(event.url),
    );
    return () => {
      active = false;
      subscription.data.subscription.unsubscribe();
      links.remove();
    };
  }, [attempt]);
  const userId = session?.user.id;
  useEffect(() => {
    if (!userId || !client) return;
    const auth = client;
    let online = true;
    const engine = createRecordSync(auth, userId, progress, {
      online: () => online,
      subscribe(sync) {
        Network.getNetworkStateAsync()
          .then((value) => {
            online = value.isInternetReachable !== false;
            sync();
          })
          .catch(() => {});
        const network = Network.addNetworkStateListener((value) => {
          online = value.isInternetReachable !== false;
          if (online) sync();
          else progress.publish({ phase: "offline" });
        });
        const lifecycle = AppState.addEventListener("change", (state) => {
          if (state === "active") {
            auth.auth.startAutoRefresh();
            sync();
          } else auth.auth.stopAutoRefresh();
        });
        const timer = setInterval(() => {
          if (AppState.currentState === "active") sync();
        }, 60000);
        return () => {
          network.remove();
          lifecycle.remove();
          clearInterval(timer);
          auth.auth.stopAutoRefresh();
        };
      },
    });
    auth.auth.startAutoRefresh();
    return engine.stop;
  }, [userId, attempt]);
  return (
    <AccountContext
      value={{
        session,
        ready,
        error,
        retry: () => {
          setError("");
          retry((value) => value + 1);
        },
      }}
    >
      {children}
    </AccountContext>
  );
}
export const useAccount = () => useContext(AccountContext);

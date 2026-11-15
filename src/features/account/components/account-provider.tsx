import { useEffect, useRef, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { cloudConfigured, getSupabase } from "../data/supabase";
import { progress } from "../data/progress-store";
import { createSyncEngine } from "../data/sync-engine";
import { AccountContext } from "../hooks/use-account";
export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(cloudConfigured);
  const [error, setError] = useState("");
  const engine = useRef<ReturnType<typeof createSyncEngine> | null>(null);
  useEffect(() => {
    if (!cloudConfigured) return;
    let disposed = false;
    let unsubscribe: (() => void) | undefined;
    getSupabase()
      .then(async (client) => {
        if (disposed) return;
        const apply = (next: User | null) => {
          if (disposed) return;
          if (progress.getSnapshot().userId !== (next?.id ?? null)) {
            engine.current?.stop();
            engine.current = null;
            progress.activate(next?.id ?? null);
            if (next) engine.current = createSyncEngine(client, next.id);
          }
          setUser(next);
          setLoading(false);
        };
        const listener = client.auth.onAuthStateChange((event, session) => {
          // Supabase auth callbacks must not await other client calls while its session lock is held.
          setTimeout(() => {
            apply(session?.user ?? null);
            if (
              event === "SIGNED_IN" &&
              !disposed &&
              !window.location.hash.startsWith("#/")
            )
              window.location.hash = "/account";
          }, 0);
        });
        unsubscribe = () => listener.data.subscription.unsubscribe();
        const { data, error: sessionError } = await client.auth.getSession();
        if (disposed) return;
        if (sessionError)
          setError(
            "Could not restore your sign-in. Open Account & sync to sign in again.",
          );
        apply(data.session?.user ?? null);
      })
      .catch(() => {
        if (!disposed) {
          setError(
            "Account services could not load. Your local notes are still available.",
          );
          setLoading(false);
        }
      });
    return () => {
      disposed = true;
      unsubscribe?.();
      engine.current?.stop();
      engine.current = null;
      progress.activate(null);
    };
  }, []);
  async function signOut() {
    const client = await getSupabase();
    const { error: signOutError } = await client.auth.signOut({
      scope: "local",
    });
    if (signOutError) throw signOutError;
    engine.current?.stop();
    engine.current = null;
    progress.activate(null);
    setUser(null);
  }
  return (
    <AccountContext
      value={{
        user,
        loading,
        error,
        retry: () => {
          void engine.current?.sync();
        },
        signOut,
      }}
    >
      {loading ? (
        <div
          className="grid min-h-dvh place-items-center bg-page p-6 text-base text-ink"
          role="status"
        >
          Restoring your account…
        </div>
      ) : (
        children
      )}
    </AccountContext>
  );
}

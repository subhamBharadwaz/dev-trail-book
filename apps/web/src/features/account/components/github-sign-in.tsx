import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabase } from "../data/supabase";
export function GithubSignIn() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="mb-6 border-b border-line pb-6">
      <Button
        type="button"
        disabled={busy}
        className="min-h-12 w-full gap-2 border border-[var(--edge)] bg-[var(--button-fill)] px-4 text-[var(--button-ink)]"
        onClick={async () => {
          if (busy) return;
          setBusy(true);
          setError("");
          try {
            const client = await getSupabase();
            const { error: authError } = await client.auth.signInWithOAuth({
              provider: "github",
              options: { redirectTo: `${window.location.origin}/` },
            });
            if (authError) throw authError;
          } catch {
            setError(
              "GitHub sign-in could not start. Try again or use an email link. The GitHub provider may need to be enabled by the site administrator.",
            );
            setBusy(false);
          }
        }}
      >
        <KeyRound size={18} aria-hidden="true" />
        {busy ? "Opening GitHub…" : "Continue with GitHub"}
      </Button>
      <p className="mt-3 text-sm leading-6 text-muted-ink">
        Sign in to save your learning progress across devices. No repository
        access is requested.
      </p>
      {error && (
        <p role="alert" className="mt-3 text-sm leading-6 text-ink">
          {error}
        </p>
      )}
    </div>
  );
}

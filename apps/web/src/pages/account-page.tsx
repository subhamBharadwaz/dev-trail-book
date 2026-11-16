import { useState } from "react";
import { Input } from "@ui-sdk/react/input";
import { Field, FieldLabel } from "@ui-sdk/react/field";
import { Button } from "@/components/ui/button";
import { Cloud, Mail, RefreshCw, Upload } from "lucide-react";
import { useAccount } from "@/features/account/hooks/use-account";
import {
  progress,
  useCloudProgress,
} from "@/features/account/data/progress-store";
import { cloudConfigured, getSupabase } from "@/features/account/data/supabase";
import { guestRecords } from "@/features/account/data/local-import";
function recordLabel(key: string, value: unknown) {
  const parts = key.split("/");
  const name = (text: string) => text.replace(/[-:]/g, " ");
  if (
    parts[1] === "mistake" &&
    value &&
    typeof value === "object" &&
    "question" in value &&
    typeof value.question === "string"
  )
    return `Mistake: ${value.question}`;
  if (parts[1]?.startsWith("interview"))
    return `Mock interview: ${parts.slice(2).join(" / ") || "Current session"}`;
  if (parts[0] === "reading")
    return `${parts[1] === "read" ? "Reading progress" : "Saved topic"}: ${name(parts.slice(2).join("/"))}`;
  if (
    parts[0] === "prep" &&
    parts[1] === "entry" &&
    value &&
    typeof value === "object" &&
    "title" in value &&
    typeof value.title === "string"
  )
    return `Journal: ${value.title}`;
  if (parts[0] === "prep" && parts[1] === "day")
    return `Daily practice: ${parts[2]} · ${name(parts.slice(3).join(" "))}`;
  return `Practice: ${name(parts.slice(2).join("/"))}`;
}
export function AccountPage() {
  const { user, signOut, retry, error: accountError } = useAccount();
  const state = useCloudProgress();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [importConfirm, setImportConfirm] = useState(false);
  const pending = Object.keys(state.pending).length;
  const conflicts = Object.keys(state.conflicts);
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 lg:py-12">
      <p className="text-sm font-medium tracking-wide text-green">
        YOUR PROGRESS, TOGETHER
      </p>
      <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
        Account &amp; sync
      </h1>
      <p className="mt-4 text-base leading-7 text-muted-ink">
        Use the same account on your phone, tablet and laptop to pick up your
        progress, saved topics and practice.
      </p>
      {!cloudConfigured ? (
        <section className="mt-7 rounded-2xl border border-line bg-surface p-6">
          <h2 className="text-xl font-medium">Cloud sync is being set up.</h2>
          <p className="mt-3 text-base leading-7 text-muted-ink">
            You can keep studying and saving progress in this browser. Account
            sign-in will be available once the cloud connection is configured.
          </p>
          <a
            href="#/today"
            className="mt-4 inline-flex min-h-11 items-center text-green"
          >
            Continue today’s practice →
          </a>
        </section>
      ) : !user ? (
        <form
          className="mt-7 rounded-2xl border border-line bg-surface p-6"
          onSubmit={async (event) => {
            event.preventDefault();
            if (busy || !email.trim()) return;
            setBusy(true);
            setError("");
            setMessage("");
            try {
              const client = await getSupabase();
              const { error: sentError } = await client.auth.signInWithOtp({
                email: email.trim(),
                options: { emailRedirectTo: `${window.location.origin}/` },
              });
              if (sentError) throw sentError;
              setMessage(
                "Check your email for a sign-in link. Open it in the browser where you want to study. Check spam too; wait a minute before requesting another link.",
              );
            } catch {
              setError(
                "Could not send the sign-in link. Check your email address, connection and try again in a minute.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <h2 className="text-xl font-medium">Sign in with your email</h2>
          <p className="mt-3 text-base leading-7 text-muted-ink">
            We’ll email you a sign-in link. Your existing browser progress stays
            local until you choose to import it.
          </p>
          <Field className="mt-5">
            <FieldLabel className="text-sm font-medium">
              Email address
            </FieldLabel>
            <Input
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onValueChange={setEmail}
              placeholder="you@example.com"
              className="mt-2 min-h-12 w-full rounded-xl border border-muted-ink bg-page px-4 text-base text-ink"
            />
          </Field>
          <Button
            type="submit"
            disabled={busy}
            className="mt-5 min-h-12 gap-2 bg-green px-5 text-page hover:bg-green/90"
          >
            <Mail size={17} aria-hidden="true" />
            {busy ? "Sending link…" : "Email me a sign-in link"}
          </Button>
        </form>
      ) : (
        <>
          <section className="mt-7 rounded-2xl border border-line bg-surface p-6">
            <div className="flex items-center gap-3 text-green">
              <Cloud size={21} aria-hidden="true" />
              <h2 className="text-xl font-medium">Your account</h2>
            </div>
            <p className="mt-3 break-all text-base text-muted-ink">
              {user.email}
            </p>
            <p className="mt-4 text-base leading-7" role="status">
              {state.phase === "loading"
                ? "Loading your saved progress…"
                : state.phase === "syncing"
                  ? "Saving and checking your progress…"
                  : state.error ||
                    (conflicts.length
                      ? "Some records changed on another device. Choose which version to keep below."
                      : pending
                        ? `${pending} changes waiting to sync.`
                        : "Your account progress is up to date.")}
            </p>
            {state.lastSynced && (
              <p className="mt-2 text-sm text-muted-ink">
                Last synced: {new Date(state.lastSynced).toLocaleString()}
              </p>
            )}
            {state.storageError && (
              <p
                role="alert"
                className="mt-3 text-sm text-amber-700 dark:text-amber-300"
              >
                Browser storage is unavailable. Keep this page open until your
                changes sync.
              </p>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={retry}
                disabled={
                  state.phase === "syncing" || state.phase === "loading"
                }
                className="min-h-11 gap-2 border-line bg-page text-ink"
              >
                <RefreshCw size={16} aria-hidden="true" />
                Sync now
              </Button>
              <Button
                variant="outline"
                className="min-h-11 border-line bg-page text-ink"
                disabled={busy || (state.storageError && pending > 0)}
                onClick={async () => {
                  setBusy(true);
                  setError("");
                  try {
                    await signOut();
                    setMessage(
                      "Signed out. Your guest progress is available on this browser.",
                    );
                  } catch {
                    setError(
                      "Could not sign out. Check your connection and try again.",
                    );
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Sign out on this device
              </Button>
            </div>
            {pending > 0 && (
              <p className="mt-3 text-sm leading-6 text-muted-ink">
                Pending changes stay in this browser under your account and
                retry the next time you sign in here. Sync before leaving if you
                need them on another device.
              </p>
            )}
          </section>
          <section className="mt-5 rounded-2xl border border-line p-6">
            <h2 className="text-xl font-medium">
              Bring your browser progress along
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-ink">
              Import local bookmarks, reading progress, practice sessions and
              journal entries into this account. Existing cloud records are
              kept; matching records are skipped.
            </p>
            {!importConfirm ? (
              <Button
                variant="outline"
                className="mt-4 min-h-11 gap-2 border-line bg-surface text-ink"
                onClick={() => setImportConfirm(true)}
              >
                <Upload size={16} aria-hidden="true" />
                Review local import
              </Button>
            ) : (
              <div className="mt-4 rounded-xl bg-surface p-4">
                <p className="text-sm leading-6">
                  Import progress saved by anyone using this browser into{" "}
                  {user.email}? Only import records that belong to you.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    disabled={!state.lastSynced || state.phase === "loading"}
                    className="min-h-11 bg-green px-4 text-page hover:bg-green/90"
                    onClick={() => {
                      const values = guestRecords();
                      const current = progress.values();
                      const additions = Object.fromEntries(
                        Object.entries(values).filter(
                          ([key]) => !Object.hasOwn(current, key),
                        ),
                      );
                      progress.write(additions);
                      setMessage(
                        `${Object.keys(additions).length} local records added to your sync queue. Existing account records were kept.`,
                      );
                      setImportConfirm(false);
                    }}
                    data-agent-confirm="Imports this browser’s study records into the signed-in account"
                  >
                    Import into my account
                  </Button>
                  <Button
                    variant="outline"
                    className="min-h-11 border-line bg-page text-ink"
                    onClick={() => setImportConfirm(false)}
                  >
                    Cancel import
                  </Button>
                </div>
              </div>
            )}
          </section>
          {conflicts.length > 0 && (
            <section className="mt-7" aria-label="Sync conflicts">
              <h2 className="text-xl font-medium">
                Choose which changes to keep
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-ink">
                Both devices changed the same record. Other records have synced
                normally.
              </p>
              {conflicts.map((key) => (
                <article
                  key={key}
                  className="mt-4 rounded-xl border border-line bg-surface p-4"
                >
                  <h3 className="break-all font-medium">
                    {recordLabel(
                      key,
                      state.pending[key]?.value ?? state.conflicts[key].value,
                    )}
                  </h3>
                  <details className="mt-3 text-sm">
                    <summary className="cursor-pointer">
                      Compare the two versions
                    </summary>
                    <p className="mt-3 font-medium">This device</p>
                    <pre className="mt-1 max-h-48 overflow-auto whitespace-pre-wrap break-all rounded bg-page p-3">
                      {JSON.stringify(state.pending[key]?.value, null, 2)}
                    </pre>
                    <p className="mt-3 font-medium">Your account</p>
                    <pre className="mt-1 max-h-48 overflow-auto whitespace-pre-wrap break-all rounded bg-page p-3">
                      {JSON.stringify(state.conflicts[key].value, null, 2)}
                    </pre>
                  </details>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      className="min-h-11 whitespace-normal border-line bg-page px-3 text-ink"
                      aria-label={`Keep this device’s version: ${recordLabel(key, state.pending[key]?.value ?? state.conflicts[key].value)}`}
                      onClick={() => progress.resolve(key, "local")}
                    >
                      Keep this device’s version
                    </Button>
                    <Button
                      variant="outline"
                      className="min-h-11 whitespace-normal border-line bg-page px-3 text-ink"
                      aria-label={`Use account version: ${recordLabel(key, state.pending[key]?.value ?? state.conflicts[key].value)}`}
                      onClick={() => progress.resolve(key, "cloud")}
                    >
                      Use account version
                    </Button>
                  </div>
                </article>
              ))}
            </section>
          )}
        </>
      )}
      {(error || accountError) && (
        <p
          role="alert"
          className="mt-5 rounded-xl bg-surface p-4 text-base leading-7 text-ink"
        >
          {error || accountError}
        </p>
      )}
      <a
        href="#/backup"
        className="mt-6 inline-flex min-h-11 items-center font-medium text-green"
      >
        Export & restore your study data →
      </a>
      <p role="status" className="mt-5 text-base leading-7 text-green">
        {message}
      </p>
      <p className="mt-6 text-sm leading-6 text-muted-ink">
        Cloud sync covers your study records. Theme settings stay specific to
        each device. Changes sync on return to the app, periodically while it is
        open, and after you reconnect.
      </p>
    </div>
  );
}

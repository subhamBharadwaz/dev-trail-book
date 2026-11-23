import { Settings2, UserRound } from "lucide-react";
import { useAccount } from "../hooks/use-account";
export function SidebarProfile({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAccount();
  const name =
    typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user?.user_metadata?.user_name === "string"
        ? user.user_metadata.user_name
        : user?.email?.split("@")[0] || "Your account";
  return (
    <a
      href="/account"
      onClick={onNavigate}
      aria-label={
        user ? "Open account settings" : "Sign in or open account settings"
      }
      className="my-3 flex min-h-16 min-w-0 items-center gap-3 rounded-lg border border-line bg-surface px-3 py-3 hover:border-green focus-visible:outline-2 focus-visible:outline-green"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-green-soft text-sm font-semibold text-green">
        {user ? (
          name.slice(0, 1).toUpperCase()
        ) : (
          <UserRound size={18} aria-hidden="true" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block truncate text-sm font-medium text-ink">
          {name}
        </strong>
        <span className="mt-1 block text-xs leading-5 text-muted-ink">
          {user ? "Settings & sign out" : "Sign in to sync progress"}
        </span>
      </span>
      <Settings2
        size={16}
        aria-hidden="true"
        className="shrink-0 text-muted-ink"
      />
    </a>
  );
}

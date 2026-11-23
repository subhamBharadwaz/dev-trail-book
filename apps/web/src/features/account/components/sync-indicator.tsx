import { Cloud, CloudOff, UserRound } from "lucide-react";
import { useAccount } from "../hooks/use-account";
import { useCloudProgress } from "../data/progress-store";
export function SyncIndicator() {
  const { user } = useAccount();
  const state = useCloudProgress();
  const pending = Object.keys(state.pending).length;
  const issue =
    ["error", "offline"].includes(state.phase) ||
    Object.keys(state.conflicts).length > 0 ||
    state.storageError;
  const label = !user
    ? "Account & sync"
    : issue
      ? "Sync needs attention"
      : pending
        ? `${pending} changes waiting to sync`
        : state.phase === "saved"
          ? "Progress saved to your account"
          : "Syncing your progress";
  const Icon = !user ? UserRound : issue ? CloudOff : Cloud;
  return (
    <a
      href="/account"
      aria-label={label}
      title={label}
      className={`${user ? "grid" : "hidden sm:grid"} size-11 shrink-0 place-items-center rounded-lg hover:bg-surface-hover ${issue ? "text-amber-700 dark:text-amber-300" : "text-green"}`}
    >
      <Icon size={18} aria-hidden="true" />
    </a>
  );
}

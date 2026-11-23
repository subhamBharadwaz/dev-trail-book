import { ArrowRight } from "lucide-react";
import { useReviews } from "./use-reviews";
export function ReviewSummary() {
  const { due } = useReviews();
  return (
    <a
      href="/review"
      className="flex min-h-16 flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface p-5 text-base font-medium text-ink"
    >
      <span>
        Review what’s due{" "}
        <span className="ml-2 rounded-md bg-green-soft px-2 py-1 text-sm text-green">
          {due.length} today
        </span>
      </span>
      <ArrowRight size={18} className="text-green" aria-hidden="true" />
    </a>
  );
}

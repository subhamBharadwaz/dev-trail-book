import { ArrowRight } from "lucide-react";
export function FirstSession() {
  return (
    <section
      aria-labelledby="first-session-heading"
      className="my-7 flex flex-wrap items-center justify-between gap-5 rounded-xl border border-line bg-surface p-5 sm:p-6"
    >
      <div className="max-w-xl">
        <p className="text-xs font-semibold tracking-wide text-green">
          PUBLIC BETA · NEW HERE? START SMALL.
        </p>
        <h2
          id="first-session-heading"
          className="mt-2 text-xl font-semibold text-ink"
        >
          One concept. One example. One honest attempt.
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted-ink">
          Read and practice without an account. Guest progress stays in this
          browser; sign in for optional account sync across devices.
        </p>
      </div>
      <a
        href="/start-here"
        className="inline-flex min-h-12 items-center gap-3 rounded-lg border border-[var(--edge)] bg-page px-4 text-sm font-semibold text-ink shadow-[2px_2px_0_var(--edge)] hover:bg-surface-hover"
      >
        Find your starting point <ArrowRight size={16} aria-hidden="true" />
      </a>
    </section>
  );
}

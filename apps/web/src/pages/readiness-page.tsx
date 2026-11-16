import {
  useReadiness,
  openReadinessAction,
} from "@/features/readiness/use-readiness";
import { WeeklySummary } from "@/features/readiness/weekly-summary";
import { FocusPlan } from "@/features/readiness/focus-plan";
import { LearningSignals } from "@/features/readiness/learning-signals";
import { ReviewsAndMocks } from "@/features/readiness/reviews-and-mocks";
export function ReadinessPage() {
  const { data, loading, storageError } = useReadiness();
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-5 py-8 sm:px-8 sm:py-12">
      <header>
        <p className="text-sm font-medium uppercase tracking-widest text-green">
          WEEKLY READINESS
        </p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
          Know where to put your next hour.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-ink">
          A view of what you practiced, what needs another attempt, and what to
          do next.
        </p>
        <p className="mt-3 text-sm text-muted-ink">
          Last 7 days: {data.start} – {data.today}
        </p>
      </header>
      {loading && <p role="status">Loading your account records…</p>}
      {storageError && (
        <p role="alert">
          Some device data could not be saved. Check Account & sync before
          closing this page.
        </p>
      )}
      {!data.hasEvidence && (
        <p className="rounded-xl border border-dashed border-line p-5 text-base leading-7 text-muted-ink">
          Your baseline starts with one real attempt. Record practice, finish a
          mock, or capture a mistake to make this view useful.
        </p>
      )}
      <WeeklySummary data={data} />
      <FocusPlan data={data} open={openReadinessAction} />
      <ReviewsAndMocks data={data} open={openReadinessAction} />
      <LearningSignals data={data} open={openReadinessAction} />
      <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
        <h2 className="text-xl font-medium">The work behind this week</h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.practice.map((kind) => (
            <div
              key={kind.value}
              className="flex items-center justify-between gap-4"
            >
              <dt className="text-sm text-muted-ink">{kind.label}</dt>
              <dd className="text-lg font-medium">{kind.count}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-sm leading-6 text-muted-ink">
          {data.independentAttempts} independent coding/build attempts logged.
          Mock journal logs are separate from completed timed sessions. Reviews
          and reading coverage show your current saved state; the 7-day window
          applies to activity.
        </p>
      </section>
    </div>
  );
}

import type { Readiness } from "@trailbook/learning/readiness";
export function WeeklySummary({ data: d }: { data: Readiness }) {
  const metrics = [
    {
      label: "Active days",
      value: `${d.activeDays}/7`,
      detail: `${d.previousActiveDays}/7 in the previous week`,
    },
    {
      label: "Practice logs",
      value: d.logs,
      detail: `${d.previousLogs} in the previous week`,
    },
    {
      label: "Mocks completed",
      value: d.mocks,
      detail: `${d.previousMocks} in the previous week`,
    },
    {
      label: "Reviews due now",
      value: d.reviews.length,
      detail: `${d.overdue} overdue · ${d.dueToday} today`,
    },
  ];
  return (
    <section
      aria-label="Weekly activity summary"
      className="space-y-6 rounded-2xl border border-line bg-surface p-5 sm:p-7"
    >
      <dl className="grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label}>
            <dt className="text-sm text-muted-ink">{m.label}</dt>
            <dd className="mt-2 text-3xl font-medium tracking-tight text-green">
              {m.value}
            </dd>
            <p className="mt-2 text-sm leading-6 text-muted-ink">{m.detail}</p>
          </div>
        ))}
      </dl>
      <div className="border-t border-line pt-5">
        <h2 className="font-medium">A little progress, recorded.</h2>
        <ol aria-label="Daily activity" className="mt-4 grid grid-cols-7 gap-2">
          {d.days.map((day) => (
            <li
              key={day.date}
              className={`rounded-xl border px-1 py-3 text-center ${day.active ? "border-green/40 bg-green-soft text-green" : "border-line text-muted-ink"}`}
            >
              <span className="block text-sm">
                {new Date(`${day.date}T12:00:00`).toLocaleDateString(
                  undefined,
                  { weekday: "narrow" },
                )}
              </span>
              <span className="mt-2 block text-base font-medium">
                {Number(day.date.slice(-2))}
              </span>
              <span className="mt-2 block text-sm" aria-hidden="true">
                {day.active ? "●" : "○"}
              </span>
              <span className="sr-only">
                {day.date}:{" "}
                {day.active ? "Activity recorded" : "No activity recorded"}.{" "}
                {day.logs} logs, {day.mocks} completed mocks, {day.tasks}{" "}
                checklist tasks.
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm leading-6 text-muted-ink">
          An active day has a journal log, a completed mock, or a checked daily
          task. Logs and mocks are counted separately.
        </p>
      </div>
    </section>
  );
}

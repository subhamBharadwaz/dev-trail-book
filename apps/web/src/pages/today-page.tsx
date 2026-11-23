import { ReviewSummary } from "@/features/reviews/review-summary";
import { Check, ArrowUpRight, CalendarDays } from "lucide-react";
import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@ui-sdk/react/segmented-control";
import { ProgressMeter } from "@/components/ui/progress-meter";
import { PreparationShell } from "@/features/preparation/components/preparation-shell";
import {
  dailyTasks,
  dueReviews,
  routineOptions,
} from "@/features/preparation/data/preparation";
import { usePreparation } from "@/features/preparation/hooks/use-preparation";
import { useCloudProgress } from "@/features/account/data/progress-store";
import { useMistakes } from "@/features/mistakes/use-mistakes";
import { useNotebookDay } from "@/features/mistakes/use-notebook-day";
export function TodayPage() {
  const cloud = useCloudProgress();
  const { state, update, storageError } = usePreparation();
  const today = useNotebookDay();
  const { mistakes } = useMistakes();
  const mistakesDue = mistakes.filter(
    (m) => m.status === "open" && m.due <= today,
  ).length;
  const day = state.days[today] || { routine: "full" as const, completed: [] };
  const tasks = dailyTasks(day.routine);
  const completed = tasks.filter((task) =>
    day.completed.includes(task.id),
  ).length;
  const due = dueReviews(state.entries, today);
  return (
    <PreparationShell
      title="One good day of practice."
      description="Start with what you can do today. Choose your available time, make a real attempt, and leave a small piece of evidence."
    >
      <a
        href="/readiness"
        className="inline-flex min-h-11 items-center text-base font-medium text-green"
      >
        See your weekly readiness →
      </a>
      <ReviewSummary />
      <a
        href="/mistakes"
        className="flex min-h-14 items-center justify-between gap-4 rounded-xl border border-line bg-surface p-5 text-base font-medium text-green"
      >
        Mistake notebook <span>{mistakesDue} to retry →</span>
      </a>
      <a
        href="/interviews"
        className="inline-flex min-h-11 items-center text-base font-medium text-green"
      >
        Practice a timed mock interview →
      </a>
      <section
        className="rounded-2xl border border-line bg-surface p-5 sm:p-7"
        aria-label="Daily routine"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="flex items-center gap-2 text-sm text-muted-ink">
            <CalendarDays size={17} aria-hidden="true" />
            {new Date(`${today}T12:00:00`).toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <SegmentedControl
            aria-label="Available study time"
            value={day.routine}
            onValueChange={(value) => {
              if (value === "full" || value === "short" || value === "minimum")
                update((current) => ({
                  ...current,
                  days: {
                    ...current.days,
                    [today]: { ...day, routine: value },
                  },
                }));
            }}
            className="inline-flex flex-wrap gap-1 rounded-xl border border-line bg-page p-1"
          >
            {routineOptions.map((option) => (
              <SegmentedControlItem
                key={option.value}
                value={option.value}
                className="min-h-11 rounded-lg px-3 text-sm text-muted-ink aria-checked:bg-green-soft aria-checked:font-medium aria-checked:text-green"
              >
                {option.label}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        </div>
        <div className="mb-2 mt-6 flex justify-between gap-3 text-sm">
          <span>
            {completed === tasks.length
              ? "Your routine is complete. Take a breath."
              : "Your plan for today"}
          </span>
          <span className="text-muted-ink">
            {completed} / {tasks.length} done
          </span>
        </div>
        <ProgressMeter
          value={completed}
          max={tasks.length}
          label="Daily practice tasks completed"
        />
        <p className="mt-3 text-sm leading-6 text-muted-ink">
          {day.routine === "full"
            ? "Six focused hours. Breaks and meals are extra; keep one day each week for review and rest."
            : day.routine === "short"
              ? "A lighter day: keep recall, DSA, spoken practice and applications moving."
              : "A small day still counts. Write your next action and resume tomorrow."}
        </p>
      </section>
      <div className="mt-5 space-y-3">
        {tasks.map((task, index) => (
          <article
            key={task.id}
            className="rounded-2xl border border-line bg-page p-5 sm:p-6"
          >
            <div className="flex items-start gap-4">
              <Checkbox
                aria-label={`Complete: ${task.title}`}
                checked={day.completed.includes(task.id)}
                onCheckedChange={(checked) =>
                  update((current) => {
                    const currentDay = current.days[today] || day;
                    return {
                      ...current,
                      days: {
                        ...current.days,
                        [today]: {
                          ...currentDay,
                          completed: checked
                            ? [...new Set([...currentDay.completed, task.id])]
                            : currentDay.completed.filter(
                                (id) => id !== task.id,
                              ),
                        },
                      },
                    };
                  })
                }
                className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border border-muted-ink bg-surface text-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green aria-checked:border-green aria-checked:bg-green-soft"
              >
                <CheckboxIndicator>
                  <Check size={18} aria-hidden="true" />
                </CheckboxIndicator>
              </Checkbox>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-ink">
                  0{index + 1} · {task.minutes} minutes
                </p>
                <h2
                  className={`mt-1 text-lg font-medium leading-7 ${day.completed.includes(task.id) ? "text-muted-ink line-through" : "text-ink"}`}
                >
                  {task.title}
                </h2>
                <p className="mt-2 text-base leading-7 text-muted-ink">
                  {task.detail}
                </p>
                <a
                  href={task.href}
                  className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-green"
                >
                  {task.action}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
      <section className="mt-6 rounded-2xl border border-line bg-green-soft p-5 sm:p-6">
        <h2 className="text-lg font-medium">
          {due.length
            ? `${due.length} review${due.length === 1 ? "" : "s"} ready for another attempt`
            : "Give today’s work a second life."}
        </h2>
        <p className="mt-2 text-base leading-7 text-muted-ink">
          Record your attempt, the hints you used and what to fix. DSA attempts
          get reminders after two and seven days.
        </p>
        <a
          href="/evidence"
          className="mt-3 inline-flex min-h-11 items-center gap-2 font-medium text-green"
        >
          {due.length
            ? "Open due reviews"
            : "Record your first piece of evidence"}
          <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </section>
      <p className="mt-5 text-sm leading-6 text-muted-ink" role="status">
        {storageError
          ? "Browser storage is unavailable. Your changes last for this visit; export your evidence before leaving."
          : cloud.userId
            ? "Your checklist syncs to your signed-in account. A completed task records activity; independent practice builds readiness."
            : "Your checklist is saved for this date in this browser. Sign in to sync it across devices."}
      </p>
    </PreparationShell>
  );
}

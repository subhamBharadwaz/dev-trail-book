import { useRef, useState } from "react";
import { Clock3, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InterviewChoice } from "./interview-choice";
import {
  durations,
  focuses,
  interviewStats,
  remainingMs,
  formatRemaining,
  type Duration,
  type Interview,
  type createInterviewActions,
} from "@trailbook/learning/interviews";
import type { Json } from "@trailbook/sync";
export function InterviewSetup({
  sessions,
  values,
  actions,
  now,
}: {
  sessions: Interview[];
  values: Record<string, Json>;
  actions: ReturnType<typeof createInterviewActions>;
  now: number;
}) {
  const [duration, setDuration] = useState<Duration>(15);
  const [focus, setFocus] = useState("all");
  const settings = useRef({ duration: 15 as Duration, focus: "all" });
  return (
    <>
      <header>
        <p className="text-sm font-medium uppercase tracking-widest text-green">
          PRACTICE THE CONVERSATION
        </p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
          Your next interview starts here.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted-ink">
          Think out loud. Write your approach. Practice explaining a decision
          while the clock is running.
        </p>
      </header>
      <section className="space-y-6 rounded-2xl border border-line bg-surface p-5 sm:p-8">
        <div className="flex items-center gap-3">
          <Clock3 className="text-green" aria-hidden="true" />
          <h2 className="text-xl font-medium">Make room for a mock.</h2>
        </div>
        <InterviewChoice
          label="Session length"
          value={String(duration)}
          options={durations.map((d) => ({
            value: String(d.value),
            label: d.label,
          }))}
          onChange={(v) => {
            const next = Number(v) as Duration;
            settings.current.duration = next;
            setDuration(next);
          }}
        />
        <p className="text-sm text-muted-ink">
          {durations.find((d) => d.value === duration)?.description}
        </p>
        <InterviewChoice
          label="Technical focus"
          value={focus}
          options={focuses}
          onChange={(v) => {
            settings.current.focus = v;
            setFocus(v);
          }}
        />
        <p className="text-sm leading-6 text-muted-ink">
          Technical questions match your focus. Coding tasks prioritize it, then
          mix in broader frontend problems. Behavioral prompts use your real
          experience.
        </p>
        <Button
          onClick={() =>
            actions.start(settings.current.duration, settings.current.focus)
          }
          className="min-h-12 px-5"
        >
          Start mock interview <ArrowUpRight aria-hidden="true" />
        </Button>
        <p className="text-sm leading-6 text-muted-ink">
          Answers save as you type. The timer continues when you leave; pause
          explicitly to stop it. Reference guidance appears after finishing.
          Assessment is your own; code is not executed.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-medium">
          Your sessions{" "}
          <span className="text-muted-ink">({sessions.length})</span>
        </h2>
        {sessions.length ? (
          sessions.map((s) => {
            const stats = interviewStats(s, values);
            return (
              <article
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line p-5"
              >
                <div>
                  <h3 className="font-medium">
                    {s.duration}-minute mock ·{" "}
                    {focuses.find((f) => f.value === s.focus)?.label ?? s.focus}
                  </h3>
                  <p className="mt-2 text-sm text-muted-ink">
                    {new Date(s.startedAt).toLocaleString()} · {stats.answered}/
                    {stats.total} answered
                  </p>
                  <p className="mt-2 text-sm text-green">
                    {s.state === "completed"
                      ? `Reviewed ${stats.rated}/${stats.total}${stats.score !== null ? ` · self-assessed ${stats.score}%` : ""}`
                      : s.state === "paused"
                        ? "Paused"
                        : remainingMs(s, now) === 0
                          ? "Time is up · ready to review"
                          : `${formatRemaining(remainingMs(s, now))} remaining`}
                  </p>
                </div>
                <Button
                  variant="outline"
                  aria-label={`${s.state === "completed" ? "Review" : "Open"} session ${s.id}`}
                  onClick={() => actions.open(s.id)}
                >
                  {s.state === "completed" ? "Review session" : "Open session"}
                </Button>
              </article>
            );
          })
        ) : (
          <p className="rounded-xl border border-dashed border-line p-6 text-base leading-7 text-muted-ink">
            Your first session is a baseline. Focus on explaining your
            reasoning, then choose one thing to improve.
          </p>
        )}
      </section>
    </>
  );
}

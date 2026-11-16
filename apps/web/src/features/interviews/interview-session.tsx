import { useEffect, useRef, useState } from "react";
import { Field, FieldLabel } from "@ui-sdk/react/field";
import { Textarea } from "@ui-sdk/react/textarea";
import { Button } from "@/components/ui/button";
import {
  remainingMs,
  formatRemaining,
  getAnswer,
  interviewPosition,
  interviewStats,
  type Interview,
  type createInterviewActions,
} from "@trailbook/learning/interviews";
import type { Json } from "@trailbook/sync";
import { InterviewReview } from "./interview-review";
export function InterviewSession({
  session: s,
  values,
  actions,
  now,
}: {
  session: Interview;
  values: Record<string, Json>;
  actions: ReturnType<typeof createInterviewActions>;
  now: number;
}) {
  const index = interviewPosition(s, values),
    prompt = s.prompts[index],
    answer = getAnswer(values, s.id, prompt.id),
    remaining = remainingMs(s, now),
    completed = s.state === "completed",
    expired = remaining === 0;
  const [confirm, setConfirm] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const previous = useRef(index);
  useEffect(() => {
    if (previous.current !== index) {
      heading.current?.focus();
      previous.current = index;
    }
  }, [index]);
  return (
    <>
      <Button
        variant="ghost"
        onClick={() => actions.open(null)}
        className="justify-self-start"
      >
        ← All mock sessions
      </Button>
      <header className="sticky top-16 z-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-page p-4 sm:p-5">
        <div>
          <p className="text-sm text-muted-ink">
            {s.duration}-minute mock ·{" "}
            {completed
              ? "Review"
              : s.state === "paused"
                ? "Paused"
                : "In progress"}
          </p>
          <p className="mt-1 font-medium">
            Question {index + 1} of {s.prompts.length}
          </p>
        </div>
        {!completed && (
          <output
            role="timer"
            aria-label="Time remaining"
            className="font-mono text-3xl tabular-nums text-green"
          >
            {formatRemaining(remaining)}
          </output>
        )}
        {!completed && !expired && (
          <Button
            variant="outline"
            onClick={() =>
              actions.transition(s.state === "paused" ? "resume" : "pause")
            }
          >
            {s.state === "paused" ? "Resume timer" : "Pause timer"}
          </Button>
        )}
      </header>
      {expired && !completed && (
        <p
          role="status"
          className="rounded-xl bg-green-soft p-4 text-base leading-7"
        >
          Time’s up. Your answers are saved and locked. Finish to review your
          approach.
        </p>
      )}
      {s.state === "paused" && (
        <p role="status" className="rounded-xl bg-surface p-4">
          Timer paused. Resume when you’re ready to answer.
        </p>
      )}
      <section className="space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-green">
            {prompt.kind} · {prompt.topicTitle}
          </p>
          <h1
            ref={heading}
            tabIndex={-1}
            className="mt-4 scroll-mt-64 text-2xl font-medium leading-relaxed tracking-tight outline-none sm:text-3xl"
          >
            {prompt.question}
          </h1>
        </div>
        {completed ? (
          <InterviewReview
            session={s}
            prompt={prompt}
            values={values}
            actions={actions}
          />
        ) : (
          <>
            <Field>
              <FieldLabel className="font-medium">
                Your answer or approach
              </FieldLabel>
              <Textarea
                key={prompt.id}
                disabled={s.state !== "running" || expired}
                value={answer.text}
                onValueChange={(text) => actions.answer(prompt.id, { text })}
                maxLength={12000}
                rows={prompt.kind === "coding" ? 14 : 8}
                spellCheck={prompt.kind !== "coding"}
                className={`mt-3 w-full rounded-2xl border border-line bg-surface p-4 text-base leading-7 outline-none focus-visible:ring-2 focus-visible:ring-green disabled:opacity-60 ${prompt.kind === "coding" ? "font-mono" : ""}`}
              />
            </Field>
            <p className="text-sm leading-6 text-muted-ink">
              {prompt.kind === "coding"
                ? "Use this as a code scratchpad. Explain assumptions, complexity, and tests. Code is not executed here."
                : "Answer out loud first, then capture your explanation and an example."}{" "}
              Answers save as you type.
            </p>
          </>
        )}
      </section>
      <nav aria-label="Interview questions" className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          disabled={index === 0}
          onClick={() => actions.goTo(index - 1)}
        >
          Previous question
        </Button>
        <Button
          variant="outline"
          disabled={index === s.prompts.length - 1}
          onClick={() => actions.goTo(index + 1)}
        >
          Next question
        </Button>
      </nav>
      {!completed && (
        <section className="space-y-4 border-t border-line pt-6">
          {confirm ? (
            <>
              <p role="status" className="text-base leading-7">
                Finish this session? {interviewStats(s, values).answered} of{" "}
                {s.prompts.length} questions have an answer. Answers will be
                locked; you can assess them afterward.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => actions.transition("finish")}>
                  Finish and review
                </Button>
                <Button variant="outline" onClick={() => setConfirm(false)}>
                  Keep working
                </Button>
              </div>
            </>
          ) : (
            <Button onClick={() => setConfirm(true)}>
              {expired ? "Review my session" : "Finish session"}
            </Button>
          )}
        </section>
      )}
      {completed && prompt.topicSlug && (
        <a
          className="inline-flex min-h-11 items-center font-medium text-green"
          href={`#/topic/${prompt.topicSlug}`}
        >
          Revisit this lesson →
        </a>
      )}
    </>
  );
}

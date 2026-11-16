import { Field, FieldLabel } from "@ui-sdk/react/field";
import { Textarea } from "@ui-sdk/react/textarea";
import { Button } from "@/components/ui/button";
import { InterviewChoice } from "./interview-choice";
import {
  getAnswer,
  getDebrief,
  interviewStats,
  ratings,
  type Interview,
  type InterviewPrompt,
  type createInterviewActions,
} from "@trailbook/learning/interviews";
import type { Json } from "@trailbook/sync";
const field =
  "mt-2 min-h-28 w-full rounded-xl border border-line bg-page p-4 text-base leading-7 outline-none focus-visible:ring-2 focus-visible:ring-green";
export function InterviewReview({
  session,
  prompt,
  values,
  actions,
}: {
  session: Interview;
  prompt: InterviewPrompt;
  values: Record<string, Json>;
  actions: ReturnType<typeof createInterviewActions>;
}) {
  const answer = getAnswer(values, session.id, prompt.id),
    debrief = getDebrief(values, session.id),
    stats = interviewStats(session, values);
  const added =
    !!values[`practice/mistake/interview-${session.id}-${prompt.id}`];
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-green-soft p-5">
        <p className="font-medium text-green">
          {stats.answered}/{stats.total} answered · {stats.rated}/{stats.total}{" "}
          assessed
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-ink">
          {stats.score === null
            ? "Assess each answer against the checklist to establish your baseline."
            : `Self-assessed score: ${stats.score}% across ${stats.rated} rated answers. Unrated answers are excluded.`}{" "}
          This is a reflection tool, not an automated interview grade.
        </p>
      </div>
      <section>
        <h3 className="font-medium">Your answer</h3>
        <p
          className={`mt-3 whitespace-pre-wrap break-words rounded-xl border border-line p-4 text-base leading-7 ${prompt.kind === "coding" ? "font-mono" : ""}`}
        >
          {answer.text || "No answer recorded."}
        </p>
      </section>
      <section className="space-y-4 rounded-xl border border-line bg-surface p-5">
        <h3 className="font-medium text-green">Reference guidance</h3>
        <p className="whitespace-pre-wrap text-base leading-7">
          {prompt.reference}
        </p>
        <h4 className="font-medium">Review checklist</h4>
        <ul className="list-disc space-y-2 pl-5 text-base leading-7 text-muted-ink">
          {prompt.criteria.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>
      <InterviewChoice
        label="Self-assessment"
        value={answer.rating === null ? null : String(answer.rating)}
        options={ratings}
        onChange={(v) => actions.answer(prompt.id, { rating: Number(v) })}
      />
      <p className="text-sm leading-6 text-muted-ink">
        0: could not explain it. 1: important gaps or help needed. 2: sound
        answer with minor gaps. 3: clear, accurate, and supported by examples or
        tests.
      </p>
      <Field>
        <FieldLabel className="font-medium">
          What would I improve in this answer?
        </FieldLabel>
        <Textarea
          className={field}
          maxLength={4000}
          value={answer.reflection}
          onValueChange={(reflection) =>
            actions.answer(prompt.id, { reflection })
          }
        />
      </Field>
      <Button
        disabled={added}
        variant="outline"
        onClick={() => actions.addMistake(prompt.id)}
      >
        {added
          ? "Added to mistake notebook"
          : "Save this gap to mistake notebook"}
      </Button>
      <section className="space-y-5 border-t border-line pt-6">
        <h3 className="text-xl font-medium">Session debrief</h3>
        <Field>
          <FieldLabel className="font-medium">What went well?</FieldLabel>
          <Textarea
            className={field}
            maxLength={4000}
            value={debrief.strengths}
            onValueChange={(strengths) => actions.debrief({ strengths })}
          />
        </Field>
        <Field>
          <FieldLabel className="font-medium">
            One concrete next step
          </FieldLabel>
          <Textarea
            className={field}
            maxLength={4000}
            value={debrief.nextStep}
            onValueChange={(nextStep) => actions.debrief({ nextStep })}
          />
        </Field>
        <p className="text-sm text-muted-ink">
          Your assessment and debrief save automatically.
        </p>
      </section>
    </div>
  );
}

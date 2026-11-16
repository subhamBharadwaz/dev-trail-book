import { useEffect, useRef, useState } from "react";
import { Field, FieldLabel } from "@ui-sdk/react/field";
import { Input } from "@ui-sdk/react/input";
import { Textarea } from "@ui-sdk/react/textarea";
import { Button } from "@/components/ui/button";
import { validDate, type Mistake } from "@trailbook/learning/mistakes";
export function MistakeEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial: Mistake;
  onSave(m: Mistake): void;
  onCancel(): void;
}) {
  const question = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    question.current?.focus();
  }, []);
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const field =
    "mt-2 w-full rounded-xl border border-line bg-page p-3 text-base text-ink outline-none focus-visible:ring-2 focus-visible:ring-green";
  return (
    <form
      className="space-y-5 rounded-2xl border border-line bg-surface p-5 sm:p-7"
      onSubmit={(event) => {
        event.preventDefault();
        if (
          !draft.question.trim() ||
          !draft.answer.trim() ||
          !validDate(draft.due)
        ) {
          setError("Add a question, a correct answer, and a valid retry date.");
          return;
        }
        onSave({
          ...draft,
          question: draft.question.trim(),
          answer: draft.answer.trim(),
          updatedAt: new Date().toISOString(),
        });
      }}
    >
      <h2 className="text-xl font-medium">
        {initial.question
          ? "Reflect on this mistake"
          : "Capture a learning gap"}
      </h2>
      {(
        [
          ["question", "Question or problem"],
          ["answer", "Correct answer"],
          ["yourAnswer", "What I answered"],
          ["explanation", "Why I missed it / what I’ll do differently"],
        ] as const
      ).map(([key, label]) => (
        <Field key={key}>
          <FieldLabel className="text-sm font-medium">{label}</FieldLabel>
          <Textarea
            ref={key === "question" ? question : undefined}
            required={key === "question" || key === "answer"}
            maxLength={8000}
            className={field}
            rows={3}
            value={draft[key]}
            onValueChange={(value) =>
              setDraft((current) => ({ ...current, [key]: value }))
            }
          />
        </Field>
      ))}
      <Field>
        <FieldLabel className="text-sm font-medium">Retry date</FieldLabel>
        <Input
          type="date"
          required
          className={field}
          value={draft.due}
          onValueChange={(value) =>
            setDraft((current) => ({ ...current, due: value }))
          }
        />
      </Field>
      {error && (
        <p role="alert" className="text-base text-ink">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <Button type="submit">Save reflection</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel editing
        </Button>
      </div>
    </form>
  );
}

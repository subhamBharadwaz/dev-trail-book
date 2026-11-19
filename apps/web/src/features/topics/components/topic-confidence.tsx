import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio";
import { Field, FieldLabel, FieldDescription } from "@ui-sdk/react/field";
import { Button } from "@ui-sdk/react/button";
import {
  confidenceRecord,
  parseConfidence,
  type ConfidenceLevel,
} from "@trailbook/learning/confidence";
import {
  studyStore,
  useStudyRecords,
} from "@/features/account/hooks/use-study-records";
const options: { value: ConfidenceLevel; label: string; detail: string }[] = [
  {
    value: "learning",
    label: "Needs practice",
    detail: "I still need notes or hints.",
  },
  {
    value: "explain",
    label: "Can explain",
    detail: "I can explain it without notes.",
  },
  {
    value: "implement",
    label: "Can implement",
    detail: "I can build it and handle edge cases.",
  },
];
export function TopicConfidence({ slug }: { slug: string }) {
  const { values, storageError } = useStudyRecords();
  const confidence = parseConfidence(values[`reading/confidence/${slug}`]);
  return (
    <section
      id="confidence"
      aria-label="Topic confidence"
      className="my-7 rounded-xl border border-line p-4 sm:p-6"
    >
      <Field>
        <FieldLabel className="text-base font-medium text-ink">
          How well do you know this?
        </FieldLabel>
        <FieldDescription className="mt-2 text-sm leading-7 text-muted-ink">
          Your self-assessment is separate from “read”. Choose after trying
          recall and the exercise; it is not a verified skill score.
        </FieldDescription>
        <RadioGroup
          value={confidence?.level ?? null}
          onValueChange={(value) => {
            if (options.some((option) => option.value === value))
              studyStore().write(
                confidenceRecord(slug, value as ConfidenceLevel),
              );
          }}
          className="mt-4 grid gap-3 sm:grid-cols-3"
        >
          {options.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-surface p-3 text-sm leading-6 text-ink has-[[data-checked]]:border-green has-[[data-checked]]:bg-green-soft"
            >
              <Radio
                value={option.value}
                aria-label={option.label}
                className="mt-1 grid size-4 shrink-0 place-items-center rounded-full border border-muted-ink data-checked:border-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
              >
                <RadioIndicator className="size-2 rounded-full bg-green" />
              </Radio>
              <span>
                <span className="block font-medium">{option.label}</span>
                <span className="text-muted-ink">{option.detail}</span>
              </span>
            </label>
          ))}
        </RadioGroup>
      </Field>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-ink">
        <p>
          {confidence
            ? `Self-assessed on ${new Date(confidence.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.`
            : "Not assessed yet."}
        </p>
        {confidence && (
          <Button
            className="min-h-11 rounded px-2 text-green underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-green"
            onClick={() => studyStore().write(confidenceRecord(slug, null))}
          >
            Clear confidence rating
          </Button>
        )}
      </div>
      {storageError && (
        <p role="alert" className="mt-3 text-sm text-ink">
          Confidence could not be saved on this device. {storageError}
        </p>
      )}
    </section>
  );
}

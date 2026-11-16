import { useState } from "react";
import { Field, FieldLabel } from "@ui-sdk/react/field";
import { Input } from "@ui-sdk/react/input";
import { Textarea } from "@ui-sdk/react/textarea";
import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox";
import {
  Select,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@ui-sdk/react/select";
import { Check, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  addDays,
  dateKey,
  evidenceKinds,
  validDate,
  type Evidence,
  type EvidenceKind,
} from "../data/preparation";
const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-muted-ink bg-page px-3 py-3 text-base text-ink placeholder:text-muted-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green";
export function EvidenceForm({
  onSave,
}: {
  onSave: (entry: Evidence) => void;
}) {
  const [kind, setKind] = useState<EvidenceKind>("dsa");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(dateKey);
  const [independent, setIndependent] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <form
      className="rounded-2xl border border-line bg-surface p-5 sm:p-7"
      onSubmit={(event) => {
        event.preventDefault();
        if (!title.trim() || !validDate(date) || date > dateKey()) {
          setMessage("Add a title and a valid attempt date, today or earlier.");
          return;
        }
        onSave({
          id: crypto.randomUUID(),
          kind,
          title: title.trim(),
          notes: notes.trim(),
          date,
          independent,
          reviews:
            kind === "dsa"
              ? [addDays(date, 2), addDays(date, 7)]
              : kind === "mock" || kind === "build" || kind === "recall"
                ? [addDays(date, 1)]
                : [],
          completedReviews: [],
        });
        setTitle("");
        setNotes("");
        setIndependent(false);
        setMessage(
          kind === "application"
            ? "Activity saved in your journal."
            : "Evidence saved. Your next review is in the journal below.",
        );
      }}
    >
      <h2 className="text-xl font-medium">What did you actually practice?</h2>
      <p className="mt-2 text-sm leading-6 text-muted-ink">
        Save an honest attempt, including the parts that needed help.
      </p>
      <div className="mt-5 grid gap-5 @min-[640px]:grid-cols-2">
        <Select
          value={kind}
          items={[...evidenceKinds]}
          onValueChange={(value) => {
            if (evidenceKinds.some((option) => option.value === value))
              setKind(value as EvidenceKind);
          }}
        >
          <div>
            <SelectLabel className="text-sm font-medium">
              Practice type
            </SelectLabel>
            <SelectTrigger
              className={`${inputClass} flex items-center justify-between gap-3`}
            >
              <SelectValue />
              <ChevronDown size={16} aria-hidden="true" />
            </SelectTrigger>
          </div>
          <SelectContent className="z-50 min-w-64 rounded-xl border border-line bg-page p-2 text-ink shadow-lg">
            {evidenceKinds.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="min-h-11 cursor-pointer rounded-lg px-3 py-3 text-base outline-none data-highlighted:bg-green-soft data-highlighted:text-green"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Field>
          <FieldLabel className="text-sm font-medium">Attempt date</FieldLabel>
          <Input
            type="date"
            value={date}
            max={dateKey()}
            required
            onValueChange={setDate}
            className={inputClass}
          />
        </Field>
        <Field className="@min-[640px]:col-span-2">
          <FieldLabel className="text-sm font-medium">Attempt title</FieldLabel>
          <Input
            value={title}
            onValueChange={setTitle}
            required
            maxLength={160}
            placeholder="e.g. Two Sum — explained and coded from memory"
            className={inputClass}
          />
        </Field>
        <Field className="@min-[640px]:col-span-2">
          <FieldLabel className="text-sm font-medium">
            Evidence and next repair
          </FieldLabel>
          <Textarea
            value={notes}
            onValueChange={setNotes}
            rows={4}
            maxLength={4000}
            placeholder="What worked? Which hints did you need? Note complexity, edge cases, a commit link, or the next small fix."
            className={`${inputClass} resize-y leading-7`}
          />
        </Field>
      </div>
      {kind !== "application" && (
        <label className="mt-5 flex min-h-11 items-center gap-3 text-sm leading-6">
          <Checkbox
            checked={independent}
            onCheckedChange={(checked) => setIndependent(checked === true)}
            className="grid size-6 shrink-0 place-items-center rounded-md border border-muted-ink bg-page text-green aria-checked:bg-green-soft"
          >
            <CheckboxIndicator>
              <Check size={17} aria-hidden="true" />
            </CheckboxIndicator>
          </Checkbox>
          I completed this independently, without hints or copied answers.
        </label>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          className="min-h-12 gap-2 bg-green px-5 text-page hover:bg-green/90"
        >
          <Plus size={17} aria-hidden="true" />
          Save evidence
        </Button>
        <p role="status" className="max-w-sm text-sm leading-6 text-green">
          {message}
        </p>
      </div>
    </form>
  );
}

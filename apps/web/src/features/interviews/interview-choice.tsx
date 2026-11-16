import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio";
import { Check } from "lucide-react";
export function InterviewChoice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | null;
  options: { value: string; label: string }[];
  onChange(value: string): void;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium">{label}</p>
      <RadioGroup
        aria-label={label}
        value={value}
        onValueChange={(value) => {
          if (value !== null) onChange(value);
        }}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => (
          <label
            key={option.value}
            className="flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border border-line bg-page px-4 py-3 text-sm has-[[data-checked]]:border-green has-[[data-checked]]:bg-green-soft"
          >
            <Radio
              value={option.value}
              className="flex size-4 items-center justify-center rounded-full border border-muted-ink data-checked:border-green data-checked:bg-green data-checked:text-page"
            >
              <RadioIndicator>
                <Check size={11} />
              </RadioIndicator>
            </Radio>
            {option.label}
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}

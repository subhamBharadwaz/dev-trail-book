export function ProgressMeter({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) {
  return (
    <progress
      aria-label={label}
      value={value}
      max={max || 1}
      className="h-1.5 w-full overflow-hidden rounded-full border-0 bg-surface-hover accent-green [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-surface-hover [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-green [&::-moz-progress-bar]:bg-green"
    />
  );
}

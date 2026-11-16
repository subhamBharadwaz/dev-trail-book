import type { Readiness, ReadinessAction } from "@trailbook/learning/readiness";
import { Button } from "@/components/ui/button";
export function FocusPlan({
  data,
  open,
}: {
  data: Readiness;
  open(action: ReadinessAction): void;
}) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-green">
          YOUR NEXT THREE MOVES
        </p>
        <h2 className="mt-2 text-2xl font-medium">
          Turn the signal into practice.
        </h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {data.actions.map((action, index) => (
          <article
            key={action.id}
            className="flex flex-col items-start rounded-2xl border border-line bg-surface p-5"
          >
            <p className="font-mono text-sm text-green">0{index + 1}</p>
            <h3 className="mt-3 break-words text-lg font-medium leading-7">
              {action.title}
            </h3>
            <p className="mb-5 mt-3 break-words text-base leading-7 text-muted-ink">
              {action.detail}
            </p>
            <Button
              variant="outline"
              className="mt-auto"
              onClick={() => open(action)}
              aria-label={`Start: ${action.title}`}
            >
              Start this →
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}

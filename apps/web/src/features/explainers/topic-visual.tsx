import { lazy, Suspense } from "react";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@ui-sdk/react/collapsible";
import { ChevronDown } from "lucide-react";
import { visualGroups } from "./registry";
import type { VisualCatalog } from "./types";
import { TopicDiagram } from "./diagram";
import { TopicWalkthrough } from "./walkthrough";
const loaders: Record<string, () => Promise<{ visuals: VisualCatalog }>> = {
  javascript: () => import("./data/javascript"),
  react: () => import("./data/react"),
  platform: () => import("./data/platform"),
  algorithms: () => import("./data/algorithms"),
  diagrams: () => import("./data/diagrams"),
};
const components = Object.fromEntries(
  Object.entries(visualGroups).map(([slug, group]) => [
    slug,
    lazy(async () => {
      const { visuals } = await loaders[group]();
      const visual = visuals[slug];
      if (!visual) throw new Error(`Missing visual: ${slug}`);
      return {
        default: () =>
          visual.kind === "diagram" ? (
            <TopicDiagram visual={visual} />
          ) : (
            <TopicWalkthrough visual={visual} />
          ),
      };
    }),
  ]),
);
const EventLoop = lazy(() => import("./event-loop/event-loop-explainer"));
export function TopicVisual({ slug }: { slug: string }) {
  const Visual = slug === "event-loop" ? EventLoop : components[slug];
  if (!Visual) return null;
  return (
    <Collapsible
      key={slug}
      defaultOpen
      className="mb-8"
      aria-label="Lesson visual guide"
    >
      <CollapsibleTrigger className="group mb-3 flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium text-green focus-visible:outline-2 focus-visible:outline-green">
        Visual guide
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="group-data-open:rotate-180"
        />
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <Suspense
          fallback={
            <p role="status" className="p-4 text-sm text-muted-ink">
              Loading this lesson’s visual guide…
            </p>
          }
        >
          <Visual />
        </Suspense>
      </CollapsiblePanel>
    </Collapsible>
  );
}

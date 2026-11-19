import type { ReactNode } from "react";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@ui-sdk/react/collapsible";
import { ChevronDown } from "lucide-react";
export function StudyDisclosure({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Collapsible aria-label={title} className="rounded-lg border border-line">
      <CollapsibleTrigger className="group flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-ink focus-visible:outline-2 focus-visible:outline-green">
        {title}
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="shrink-0 group-data-open:rotate-180"
        />
      </CollapsibleTrigger>
      <CollapsiblePanel className="px-4 pb-4 text-sm leading-7 text-muted-ink">
        {children}
      </CollapsiblePanel>
    </Collapsible>
  );
}

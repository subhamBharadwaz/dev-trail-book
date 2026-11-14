import { ChevronRight } from "lucide-react";
import type { AppRoute } from "@/app/routes";
import { categoryById } from "@/features/topics/data/content";
import { SearchDialog } from "@/features/search/components/search-dialog";
import { MobileNavigation } from "./mobile-navigation";
import { ThemeToggle } from "./theme-toggle";
export function Topbar({ route }: { route: AppRoute }) {
  const title =
    route.kind === "topic"
      ? categoryById.get(route.topic.category)?.name
      : route.title;
  return (
    <header className="sticky top-0 z-15 flex h-[60px] items-center justify-between border-b border-line bg-page px-[18px] min-[701px]:static min-[701px]:h-[67px] min-[701px]:px-[25px] min-[961px]:px-[35px]">
      <div className="flex items-center gap-[9px] text-xs text-muted-ink min-[701px]:gap-[13px] [&_strong]:font-medium [&_strong]:text-ink max-[700px]:[&>span]:hidden max-[700px]:[&>svg]:hidden">
        <MobileNavigation route={route} />
        <span>Workspace</span>
        <ChevronRight size={13} />
        <strong>{title}</strong>
      </div>
      <div className="flex items-center gap-3 min-[701px]:gap-[19px]">
        <SearchDialog />
        <span className="h-[18px] w-px bg-line" />
        <ThemeToggle />
      </div>
    </header>
  );
}

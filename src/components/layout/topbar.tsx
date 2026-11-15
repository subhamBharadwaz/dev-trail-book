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
    <header className="sticky top-0 z-15 flex min-h-16 items-center justify-between gap-2 border-b border-line bg-page px-3 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-[9px] text-sm text-muted-ink xl:gap-3 [&_strong]:font-medium [&_strong]:text-ink max-xl:[&>span]:hidden max-xl:[&>svg]:hidden">
        <MobileNavigation route={route} />
        <span>Workspace</span>
        <ChevronRight size={13} />
        <strong className="truncate">{title}</strong>
      </div>
      <div className="flex shrink-0 items-center gap-1 sm:gap-3">
        <SearchDialog />
        <span className="h-[18px] w-px bg-line" />
        <ThemeToggle />
      </div>
    </header>
  );
}

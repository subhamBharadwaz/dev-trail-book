import { SidebarProfile } from "@/features/account/components/sidebar-profile";
import { Fragment } from "react";
import { ProgressMeter } from "@/components/ui/progress-meter";
import { BookOpen, Sprout } from "lucide-react";
import { workspaceNavigation } from "@/config/navigation";
import { categories, topics } from "@/features/topics/data/content";
import { useReadingState } from "@/hooks/use-reading-state";
import type { AppRoute } from "@/app/routes";
export function Sidebar({
  route,
  onNavigate,
}: {
  route: AppRoute;
  onNavigate?: () => void;
}) {
  const { saved, read } = useReadingState();
  const readCount = topics.filter((topic) => read.includes(topic.slug)).length;
  const activeCategory =
    route.kind === "topic"
      ? route.topic.category
      : route.kind === "collection"
        ? route.category?.id
        : undefined;
  return (
    <>
      <a
        onClick={onNavigate}
        className="flex items-center gap-2.5 px-[9px] text-[19px] font-semibold leading-[1.1] tracking-[-.7px] [&_small]:mt-1.5 [&_small]:block [&_small]:text-xs [&_small]:font-normal [&_small]:tracking-normal [&_small]:text-muted-ink"
        href="/"
      >
        <span className="grid h-[37px] w-[35px] place-items-center rounded-[9px] border border-line bg-page text-green">
          <BookOpen size={19} />
        </span>
        <span>
          dev<span className="font-normal">trailbook</span>
          <small>Learn. Build. Explain.</small>
        </span>
      </a>
      <nav aria-label="Main navigation" className="mt-8">
        <span className="mx-3 mb-3 block text-sm font-medium tracking-wider text-muted-ink">
          LEARN
        </span>
        {[...workspaceNavigation]
          .sort(
            (a, b) =>
              [
                "/",
                "/roadmap",
                "/paths",
                "/topics",
                "/today",
                "/practice",
                "/interviews",
                "/mistakes",
                "/readiness",
                "/evidence",
                "/saved",
                "/questions",
                "/facts",
                "/account",
              ].indexOf(a.href) -
              [
                "/",
                "/roadmap",
                "/paths",
                "/topics",
                "/today",
                "/practice",
                "/interviews",
                "/mistakes",
                "/readiness",
                "/evidence",
                "/saved",
                "/questions",
                "/facts",
                "/account",
              ].indexOf(b.href),
          )
          .map(({ href, name, Icon }) => (
            <Fragment key={href}>
              {href === "/today" && (
                <p className="mx-3 mb-3 mt-7 text-sm font-bold text-ink">
                  PRACTICE
                </p>
              )}
              {href === "/readiness" && (
                <p className="mx-3 mb-3 mt-7 text-sm font-bold text-ink">
                  YOUR WORKSPACE
                </p>
              )}
              <a
                onClick={onNavigate}
                key={href}
                className="my-1 flex border border-transparent min-h-11 items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-ink hover:bg-surface-hover hover:text-ink aria-[current=page]:border-transparent aria-[current=page]:bg-green-soft aria-[current=page]:font-medium aria-[current=page]:text-green"
                href={href}
                aria-current={
                  route.path === href ||
                  (href === "/paths" && route.kind === "learning-paths") ||
                  (href === "/practice" && route.kind === "practice")
                    ? "page"
                    : undefined
                }
              >
                <Icon size={17} />
                <span>{name}</span>
                {href === "/saved" && (
                  <span className="ml-auto text-sm text-muted-ink">
                    {
                      saved.filter((slug) =>
                        topics.some((item) => item.slug === slug),
                      ).length
                    }
                  </span>
                )}
              </a>
            </Fragment>
          ))}
        <div className="mx-[11px] my-[23px] h-px bg-line" />
        <span className="mx-3 mb-3 block text-sm font-medium tracking-wider text-muted-ink">
          TOPICS
        </span>
        {categories.map((item) => (
          <a
            onClick={onNavigate}
            key={item.id}
            className="my-1 flex border border-transparent min-h-11 items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-ink hover:bg-surface-hover hover:text-ink aria-[current=page]:border-transparent aria-[current=page]:bg-green-soft aria-[current=page]:font-medium aria-[current=page]:text-green"
            href={`/category/${item.id}`}
            aria-current={activeCategory === item.id ? "page" : undefined}
          >
            <span
              className={`grid size-7 shrink-0 place-items-center rounded text-sm font-semibold tracking-[-.5px] ${item.color}`}
            >
              {item.symbol}
            </span>
            <span>{item.name}</span>
            <span className="ml-auto text-sm text-muted-ink">
              {topics.filter((topic) => topic.category === item.id).length}
            </span>
          </a>
        ))}
      </nav>
      <div className="mt-auto pt-8">
        <div className="rounded-lg border border-line bg-page px-[13px] py-[15px] [&>div:first-child]:flex [&>div:first-child]:items-center [&>div:first-child]:gap-[7px] [&>div:first-child]:text-sm [&>div:first-child]:text-green [&_strong]:font-medium [&_p]:mt-2 [&_p]:text-sm [&_p]:text-muted-ink [&>span]:text-sm [&>span]:text-muted-ink">
          <div>
            <Sprout size={16} />
            <strong>Knowledge takes root.</strong>
          </div>
          <p>Small notes. Lasting understanding.</p>
          <div className="my-3">
            <ProgressMeter
              value={readCount}
              max={topics.length}
              label="Topics explored"
            />
          </div>
          <span>
            {readCount} of {topics.length} topics explored
          </span>
        </div>
        <SidebarProfile onNavigate={onNavigate} />
      </div>
    </>
  );
}

import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  type TreeItemData,
} from "@ui-sdk/react/tree";
import { ChevronRight, File, Folder, Library } from "lucide-react";
import type { AppRoute } from "@/app/routes";
import { navigateWithinApp } from "@/app/navigation";
import { categories, topics } from "@/features/topics/data/content";

const branches = categories.map((category) => ({
  ...category,
  children: [
    {
      value: `/category/${category.id}`,
      label: `Browse ${category.name}`,
      href: `/category/${category.id}`,
    },
    ...topics
      .filter((topic) => topic.category === category.id)
      .map((topic) => ({
        value: `/topic/${topic.slug}`,
        label: topic.title,
        href: `/topic/${topic.slug}`,
      })),
  ],
}));
const items: TreeItemData[] = branches.map((branch) => ({
  value: branch.id,
  label: branch.name,
  children: branch.children,
}));
const destinations = new Set(
  branches.flatMap((branch) => branch.children.map((item) => item.value)),
);
const row =
  "flex min-h-11 min-w-0 cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm leading-6 text-muted-ink hover:bg-surface-hover hover:text-ink data-current:bg-green-soft data-current:font-medium data-current:text-green group-focus-visible:outline-2 group-focus-visible:outline-green";

export function SidebarTopics({
  route,
  onNavigate,
}: {
  route: AppRoute;
  onNavigate?: () => void;
}) {
  return (
    <Tree
      aria-label="Topics by category"
      items={items}
      mode="none"
      current={destinations.has(route.path) ? route.path : undefined}
      onAction={(value, { event }) => {
        if (!destinations.has(value)) return;
        if (
          (event instanceof MouseEvent || event instanceof KeyboardEvent) &&
          (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        )
          return;
        event?.preventDefault();
        onNavigate?.();
        void navigateWithinApp(value);
      }}
    >
      {branches.map((branch) => (
        <TreeItem
          key={branch.id}
          value={branch.id}
          label={branch.name}
          className="group outline-none"
        >
          <TreeItemLabel className={`${row} my-1`}>
            <TreeItemIndicator className="grid size-5 shrink-0 place-items-center rounded text-muted-ink data-expanded:rotate-90 data-expanded:text-green motion-safe:transition-transform motion-safe:duration-150">
              <ChevronRight size={14} aria-hidden="true" />
            </TreeItemIndicator>
            <span
              className="grid size-5 shrink-0 place-items-center text-[var(--muted-ink)]"
              aria-hidden="true"
            >
              <Folder
                size={17}
                strokeWidth={1.25}
                className="fill-current/15"
              />
            </span>
            <span className="min-w-0 flex-1">{branch.name}</span>
            <span className="text-xs tabular-nums" aria-hidden="true">
              {branch.children.length - 1}
            </span>
          </TreeItemLabel>
          <TreeGroup className="mb-2 ml-[22px] pl-4">
            {branch.children.map((item) => (
              <TreeItem
                key={item.value}
                value={item.value}
                label={item.label}
                className="group relative outline-none before:absolute before:-left-4 before:bottom-0 before:top-0 before:border-l before:border-line/60 last:before:bottom-auto last:before:h-[22px]"
              >
                <TreeItemLabel
                  render={<a href={item.href} />}
                  className={`${row} relative`}
                >
                  <span
                    className="pointer-events-none absolute -left-4 top-[22px] w-4 border-t border-line/60"
                    aria-hidden="true"
                  />
                  {item.href.startsWith("/category/") ? (
                    <Library
                      size={15}
                      strokeWidth={1.75}
                      className="shrink-0 text-green"
                      aria-hidden="true"
                    />
                  ) : (
                    <File
                      size={15}
                      strokeWidth={1.25}
                      className="shrink-0 opacity-60"
                      aria-hidden="true"
                    />
                  )}
                  <span className="min-w-0 break-words">{item.label}</span>
                </TreeItemLabel>
              </TreeItem>
            ))}
          </TreeGroup>
        </TreeItem>
      ))}
    </Tree>
  );
}

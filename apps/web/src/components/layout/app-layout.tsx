import { SiteFooter } from "@/features/platform/components/site-footer";
import { sidebarScrollbar } from "./sidebar-scrollbar";
import { type ReactNode } from "react";
import type { AppRoute } from "@/app/routes";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
export function AppLayout({
  route,
  children,
}: {
  route: AppRoute;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="fixed -top-[100px] left-5 z-[1000] bg-green px-[18px] py-3 text-page focus:top-3"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Skip to content
      </a>
      <aside
        className={`${sidebarScrollbar} fixed inset-y-0 left-0 z-20 hidden w-64 flex-col overflow-y-auto overscroll-contain border-r border-line bg-sidebar-bg px-4 pt-7 xl:flex`}
      >
        <Sidebar route={route} />
      </aside>
      <div className="min-w-0 xl:ml-64">
        <Topbar route={route} />
        <main id="main-content" tabIndex={-1} className="@container min-w-0">
          {children}
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}

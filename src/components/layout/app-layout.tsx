import { useEffect, type ReactNode } from "react";
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
  useEffect(() => {
    document.title = `${route.kind === "overview" ? "Your developer field notes" : route.title} · Dev Trailbook`;
  }, [route.kind, route.title]);
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
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[248px] flex-col border-r border-line bg-sidebar-bg px-[17px] pt-[29px] min-[701px]:flex max-[1200px]:w-[225px] max-[1200px]:px-[13px] overflow-y-auto">
        <Sidebar route={route} />
      </aside>
      <div className="min-[701px]:ml-[225px] min-[1201px]:ml-[248px]">
        <Topbar route={route} />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}

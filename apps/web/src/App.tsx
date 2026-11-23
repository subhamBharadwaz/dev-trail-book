import { useAccount } from "./features/account/hooks/use-account";
import { useHydrated } from "./hooks/use-hydrated";
import { preloadTopic } from "./features/topics/data/content";
import { useEffect } from "react";
import { PageBoundary } from "./app/page-boundary";
import { AppRoutes } from "./app/app-routes";
import { ReadingProvider } from "./app/reading-provider";
import { AppLayout } from "./components/layout/app-layout";
import { useRoute } from "./hooks/use-route";
import { AccountProvider } from "./features/account/components/account-provider";
export default function App({ initialPath = "/" }: { initialPath?: string }) {
  useEffect(() => {
    void import("./lib/agent");
    const preload = (event: Event) => {
      const anchor = (event.target as Element | null)?.closest("a");
      const href = anchor?.getAttribute("href");
      if (href?.startsWith("/topic/"))
        void preloadTopic(href.slice(7)).catch(() => {});
    };
    document.addEventListener("pointerover", preload);
    document.addEventListener("focusin", preload);
    return () => {
      document.removeEventListener("pointerover", preload);
      document.removeEventListener("focusin", preload);
    };
  }, []);
  return (
    <AccountProvider>
      <Trailbook initialPath={initialPath} />
    </AccountProvider>
  );
}
function Trailbook({ initialPath }: { initialPath: string }) {
  const route = useRoute(initialPath);
  const { loading } = useAccount();
  const hydrated = useHydrated();
  const personal =
    /^(today|evidence|account|mistakes|interviews|readiness|backup|practice)$/.test(
      route.kind,
    ) ||
    (route.kind === "collection" && route.collection === "saved");
  return (
    <ReadingProvider>
      <AppLayout route={route}>
        <PageBoundary key={route.path}>
          {personal && (!hydrated || loading) ? (
            <div role="status" className="min-h-80 p-6 text-sm text-muted-ink">
              Loading your study workspace…
            </div>
          ) : (
            <AppRoutes route={route} />
          )}
        </PageBoundary>
      </AppLayout>
    </ReadingProvider>
  );
}

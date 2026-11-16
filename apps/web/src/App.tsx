import { PageBoundary } from "./app/page-boundary";
import { AppRoutes } from "./app/app-routes";
import { ReadingProvider } from "./app/reading-provider";
import { AppLayout } from "./components/layout/app-layout";
import { useRoute } from "./hooks/use-route";
import { AccountProvider } from "./features/account/components/account-provider";
export default function App() {
  return (
    <AccountProvider>
      <Trailbook />
    </AccountProvider>
  );
}
function Trailbook() {
  const route = useRoute();
  return (
    <ReadingProvider>
      <AppLayout route={route}>
        <PageBoundary key={route.path}>
          <AppRoutes route={route} />
        </PageBoundary>
      </AppLayout>
    </ReadingProvider>
  );
}

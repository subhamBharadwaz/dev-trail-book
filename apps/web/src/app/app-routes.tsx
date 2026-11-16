import { lazy, Suspense } from "react";
import { OverviewPage } from "@/pages/overview-page";
import { CollectionPage } from "@/pages/collection-page";
import { TopicPage } from "@/pages/topic-page";
import { NotFoundPage } from "@/pages/not-found-page";
import type { AppRoute } from "./routes";
const LearningPathsPage = lazy(() =>
  import("@/pages/learning-paths-page").then((module) => ({
    default: module.LearningPathsPage,
  })),
);
const PracticePage = lazy(() =>
  import("@/pages/practice-page").then((module) => ({
    default: module.PracticePage,
  })),
);
const AccountPage = lazy(() =>
  import("@/pages/account-page").then((module) => ({
    default: module.AccountPage,
  })),
);
const TodayPage = lazy(() =>
  import("@/pages/today-page").then((module) => ({
    default: module.TodayPage,
  })),
);
const EvidencePage = lazy(() =>
  import("@/pages/evidence-page").then((module) => ({
    default: module.EvidencePage,
  })),
);
const loading = (
  <div role="status" className="p-10 text-sm text-muted-ink">
    Getting your trail ready…
  </div>
);
const RoadmapPage = lazy(() =>
  import("@/pages/roadmap-page").then((module) => ({
    default: module.RoadmapPage,
  })),
);
export function AppRoutes({ route }: { route: AppRoute }) {
  switch (route.kind) {
    case "account":
      return (
        <Suspense fallback={loading}>
          <AccountPage />
        </Suspense>
      );
    case "today":
      return (
        <Suspense fallback={loading}>
          <TodayPage />
        </Suspense>
      );
    case "evidence":
      return (
        <Suspense fallback={loading}>
          <EvidencePage />
        </Suspense>
      );
    case "roadmap":
      return (
        <Suspense fallback={loading}>
          <RoadmapPage />
        </Suspense>
      );
    case "learning-paths":
      return (
        <Suspense fallback={loading}>
          <LearningPathsPage path={route.learningPath} />
        </Suspense>
      );
    case "practice":
      return (
        <Suspense fallback={loading}>
          <PracticePage key={route.path} path={route.learningPath} />
        </Suspense>
      );
    case "overview":
      return <OverviewPage />;
    case "collection":
      return <CollectionPage key={route.path} route={route} />;
    case "topic":
      return <TopicPage key={route.topic.slug} topic={route.topic} />;
    case "not-found":
      return <NotFoundPage />;
  }
}

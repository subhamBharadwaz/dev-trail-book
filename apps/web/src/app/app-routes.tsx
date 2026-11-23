import { PublicPage } from "@/pages/public-page";
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
const MistakesPage = lazy(() =>
  import("@/pages/mistakes-page").then((module) => ({
    default: module.MistakesPage,
  })),
);
const InterviewsPage = lazy(() =>
  import("@/pages/interviews-page").then((module) => ({
    default: module.InterviewsPage,
  })),
);
const ReadinessPage = lazy(() =>
  import("@/pages/readiness-page").then((module) => ({
    default: module.ReadinessPage,
  })),
);
const BackupPage = lazy(() =>
  import("@/pages/backup-page").then((module) => ({
    default: module.BackupPage,
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
    case "public-page":
      return <PublicPage page={route.page} />;
    case "backup":
      return (
        <Suspense fallback={loading}>
          <BackupPage />
        </Suspense>
      );
    case "readiness":
      return (
        <Suspense fallback={loading}>
          <ReadinessPage />
        </Suspense>
      );
    case "interviews":
      return (
        <Suspense fallback={loading}>
          <InterviewsPage />
        </Suspense>
      );
    case "mistakes":
      return (
        <Suspense fallback={loading}>
          <MistakesPage />
        </Suspense>
      );
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

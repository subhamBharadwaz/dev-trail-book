import { navigateWithinApp } from "./navigation";
import {
  learningPathById,
  type LearningPath,
} from "@/features/learning-paths/data/learning-paths";
import {
  categoryById,
  topicBySlug,
  type Category,
  type Topic,
} from "@/features/topics/data/content";
export type CollectionKind =
  "topics" | "saved" | "questions" | "facts" | "category";
export interface CollectionRoute {
  kind: "collection";
  path: string;
  title: string;
  collection: CollectionKind;
  category?: Category;
}
export type AppRoute =
  | {
      kind:
        | "today"
        | "evidence"
        | "account"
        | "mistakes"
        | "interviews"
        | "readiness"
        | "backup";
      path: string;
      title: string;
    }
  | { kind: "roadmap"; path: string; title: string }
  | { kind: "overview"; path: string; title: string }
  | { kind: "topic"; path: string; title: string; topic: Topic }
  | {
      kind: "learning-paths";
      path: string;
      title: string;
      learningPath?: LearningPath;
    }
  | {
      kind: "practice";
      path: string;
      title: string;
      learningPath?: LearningPath;
    }
  | CollectionRoute
  | { kind: "not-found"; path: string; title: string };
const collectionTitles = {
  topics: "All topics",
  saved: "Saved topics",
  questions: "Questions & answers",
  facts: "Must-know facts",
};
export function resolveRoute(path: string): AppRoute {
  if (path === "/backup")
    return { kind: "backup", path, title: "Export & restore" };
  if (path === "/readiness")
    return { kind: "readiness", path, title: "Weekly readiness" };
  if (path === "/interviews")
    return { kind: "interviews", path, title: "Mock interviews" };
  if (path === "/mistakes")
    return { kind: "mistakes", path, title: "Mistake notebook" };
  if (path === "/account")
    return { kind: "account", path, title: "Account & sync" };
  if (path === "/today")
    return { kind: "today", path, title: "Today’s practice" };
  if (path === "/evidence")
    return { kind: "evidence", path, title: "Evidence journal" };
  if (path === "/roadmap")
    return { kind: "roadmap", path, title: "Study roadmap" };
  if (path === "/") return { kind: "overview", path, title: "Overview" };
  const [, section, slug, ...extra] = path.split("/");
  if (path === "/paths")
    return { kind: "learning-paths", path, title: "Learning paths" };
  if (path === "/practice")
    return { kind: "practice", path, title: "Practice" };
  if (section === "paths" && slug && !extra.length) {
    const learningPath = learningPathById.get(slug);
    if (learningPath)
      return {
        kind: "learning-paths",
        path,
        title: learningPath.title,
        learningPath,
      };
  }
  if (section === "practice" && slug === "path" && extra.length === 1) {
    const learningPath = learningPathById.get(extra[0]);
    if (learningPath)
      return { kind: "practice", path, title: "Practice", learningPath };
  }

  if (!extra.length && section === "topic" && slug) {
    const topic = topicBySlug.get(slug);
    if (topic) return { kind: "topic", path, title: topic.title, topic };
  }
  if (!extra.length && section === "category" && slug) {
    const category = categoryById.get(slug);
    if (category)
      return {
        kind: "collection",
        path,
        title: category.name,
        collection: "category",
        category,
      };
  }
  if (path === `/${section}` && Object.hasOwn(collectionTitles, section)) {
    const collection = section as keyof typeof collectionTitles;
    return {
      kind: "collection",
      path,
      title: collectionTitles[collection],
      collection,
    };
  }
  return { kind: "not-found", path, title: "Page not found" };
}
export function topicHref(slug: string) {
  return `/topic/${slug}`;
}
export function navigateToTopic(slug: string) {
  return navigateWithinApp(topicHref(slug));
}

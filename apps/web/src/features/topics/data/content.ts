import { studyGuides } from "@trailbook/content/study-guides";
import { lazy, type ComponentType } from "react";

import type { TopicMeta } from "@trailbook/content/types";
export type { TopicMeta } from "@trailbook/content/types";
import { categories } from "@trailbook/content/categories";
export { categories } from "@trailbook/content/categories";
export interface Topic extends TopicMeta {
  Content: ComponentType<{ components?: Record<string, unknown> }>;
  searchText: string;
}
const metadata = import.meta.glob<{ meta: TopicMeta; searchText: string }>(
  "../../../../../../packages/content/lessons/*.mdx",
  { eager: true, query: "?metadata" },
);
const lessons = import.meta.glob<{ default: Topic["Content"] }>(
  "../../../../../../packages/content/lessons/*.mdx",
);
const pendingLessons = new Map<
  string,
  Promise<{ default: Topic["Content"] }>
>();
function loadLesson(path: string) {
  let pending = pendingLessons.get(path);
  if (!pending) {
    pending = lessons[path]();
    pendingLessons.set(path, pending);
    void pending.catch(() => pendingLessons.delete(path));
  }
  return pending;
}
export function preloadTopic(slug: string) {
  const path = Object.keys(lessons).find((path) =>
    path.endsWith(`/${slug}.mdx`),
  );
  return path ? loadLesson(path) : Promise.resolve();
}
const serverLessons = import.meta.env.SSR
  ? import.meta.glob<{ default: Topic["Content"] }>(
      "../../../../../../packages/content/lessons/*.mdx",
      { eager: true },
    )
  : {};
export const topics: Topic[] = Object.entries(metadata).map(
  ([path, module]) => ({
    ...module.meta,
    study: studyGuides[module.meta.slug],
    Content: serverLessons[path]?.default ?? lazy(() => loadLesson(path)),
    searchText: (
      JSON.stringify(module.meta) +
      " " +
      JSON.stringify(studyGuides[module.meta.slug]) +
      " " +
      module.searchText
    ).toLowerCase(),
  }),
);
export function matchesTopic(topic: Topic, query: string) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return terms.every((term) => topic.searchText.includes(term));
}
export function filterTopics(query: string, collection = topics) {
  return collection.filter((topic) => matchesTopic(topic, query));
}

export type Category = (typeof categories)[number];
export const topicBySlug = new Map(topics.map((topic) => [topic.slug, topic]));
export const categoryById = new Map(
  categories.map((category) => [category.id, category]),
);
export const topicCountByCategory = new Map(
  categories.map((category) => [
    category.id,
    topics.filter((topic) => topic.category === category.id).length,
  ]),
);

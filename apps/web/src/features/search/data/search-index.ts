import { topics, type Topic } from "@/features/topics/data/content";
const bodies = import.meta.glob<{ searchText: string }>(
  "../../../../../../packages/content/lessons/*.mdx",
  { eager: true, query: "?search" },
);
const bodyBySlug = new Map(
  Object.entries(bodies).map(([path, body]) => [
    path.split("/").pop()!.replace(".mdx", ""),
    body.searchText.toLowerCase(),
  ]),
);
export const searchTopics: Topic[] = topics.map((topic) => ({
  ...topic,
  searchText: topic.searchText + " " + (bodyBySlug.get(topic.slug) || ""),
}));
export const searchTopicBySlug = new Map(
  searchTopics.map((topic) => [topic.slug, topic]),
);

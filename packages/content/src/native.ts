import data from "./topics.json";
import type { NativeTopic } from "./types";
export const topics = data as NativeTopic[];
export { categories } from "./categories";
export const topicBySlug = new Map(topics.map((topic) => [topic.slug, topic]));
export function filterTopics(query: string) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return topics.filter((topic) =>
    terms.every((term) => topic.searchText.includes(term)),
  );
}
export const flashcards = topics.flatMap((topic) =>
  topic.questions.map((q, index) => ({
    ...q,
    id: `${topic.slug}:${index}`,
    topicSlug: topic.slug,
    topicTitle: topic.title,
    category: topic.category,
  })),
);

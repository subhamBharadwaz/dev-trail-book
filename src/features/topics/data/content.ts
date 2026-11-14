import { lazy, type ComponentType } from "react";

export interface TopicMeta {
  category: string;
  slug: string;
  title: string;
  description: string;
  minutes: number;
  level: string;
  tags: string[];
  questions: { question: string; answer: string }[];
  facts: string[];
  source: string;
  code: string;
  codeLanguage?: string;
  origin?: "discussion" | "study-plan" | "foundation";
  planWeek?: number;
  planPages?: number[];
  planRecordedStatus?: "covered" | "pending";
  optional?: boolean;
  quizDistractors?: string[];
  discussionSource?: { title: string; url: string };
}
export interface Topic extends TopicMeta {
  Content: ComponentType<{ components?: Record<string, unknown> }>;
  searchText: string;
}
const metadata = import.meta.glob<{ meta: TopicMeta; searchText: string }>(
  "../../../content/*.mdx",
  { eager: true, query: "?metadata" },
);
const lessons = import.meta.glob<{ default: Topic["Content"] }>(
  "../../../content/*.mdx",
);
export const topics: Topic[] = Object.entries(metadata).map(
  ([path, module]) => ({
    ...module.meta,
    Content: lazy(lessons[path]),
    searchText: (
      JSON.stringify(module.meta) +
      " " +
      module.searchText
    ).toLowerCase(),
  }),
);
export const categories = [
  {
    id: "javascript",
    name: "JavaScript",
    symbol: "JS",
    color: "bg-[#f6efd8] text-[#866616] dark:bg-[#423a24] dark:text-[#e4c976]",
    description: "The language underneath it all.",
    order: 1,
  },
  {
    id: "typescript",
    name: "TypeScript",
    symbol: "TS",
    color: "bg-[#e8eff9] text-[#3c69a2] dark:bg-[#253748] dark:text-[#96bce8]",
    description: "Better models. Fewer surprises.",
    order: 2,
  },
  {
    id: "react",
    name: "React",
    symbol: "⚛",
    color: "bg-[#e5f1f3] text-[#367983] dark:bg-[#263d3f] dark:text-[#8dcdd3]",
    description: "Think in components and state.",
    order: 3,
  },
  {
    id: "styling",
    name: "CSS & design",
    symbol: "#",
    color: "bg-[#f0eaf6] text-[#795a9d] dark:bg-[#3d3048] dark:text-[#c9a6e8]",
    description: "Interfaces that feel considered.",
    order: 4,
  },
  {
    id: "web",
    name: "Web fundamentals",
    symbol: "↗",
    color: "bg-[#f7e9e8] text-[#a36a65] dark:bg-[#46302e] dark:text-[#e1aaa4]",
    description: "Understand what the browser does.",
    order: 5,
  },
  {
    id: "tooling",
    name: "Tooling & shipping",
    symbol: "⌘",
    color: "bg-[#e9f0e3] text-[#607e49] dark:bg-[#303d29] dark:text-[#b8ce91]",
    description: "From an idea to a live site.",
    order: 6,
  },
  {
    id: "nextjs",
    name: "Next.js",
    symbol: "N",
    color: "bg-[#e8eff9] text-[#3c69a2] dark:bg-[#253748] dark:text-[#96bce8]",
    description: "Server boundaries, routes, and reliable mutations.",
    order: 7,
  },
  {
    id: "backend",
    name: "Backend & APIs",
    symbol: "API",
    color: "bg-[#e9f0e3] text-[#607e49] dark:bg-[#303d29] dark:text-[#b8ce91]",
    description: "Contracts, validation, and repeatable operations.",
    order: 8,
  },
  {
    id: "databases",
    name: "SQL & databases",
    symbol: "DB",
    color: "bg-[#f0eaf6] text-[#795a9d] dark:bg-[#3d3048] dark:text-[#c9a6e8]",
    description: "Queries, consistency, and measured performance.",
    order: 9,
  },
  {
    id: "security",
    name: "Security & auth",
    symbol: "S",
    color: "bg-[#f7e9e8] text-[#a36a65] dark:bg-[#46302e] dark:text-[#e1aaa4]",
    description: "Identity, permissions, and trust boundaries.",
    order: 10,
  },
  {
    id: "testing",
    name: "Testing & performance",
    symbol: "\u2713",
    color: "bg-[#e5f1f3] text-[#367983] dark:bg-[#263d3f] dark:text-[#8dcdd3]",
    description: "Prove behavior and measure the bottleneck.",
    order: 11,
  },
  {
    id: "dsa",
    name: "DSA & patterns",
    symbol: "{}",
    color: "bg-[#f6efd8] text-[#866616] dark:bg-[#423a24] dark:text-[#e4c976]",
    description: "Invariants, working code, and delayed re-solves.",
    order: 12,
  },
  {
    id: "ai",
    name: "AI features",
    symbol: "AI",
    color: "bg-[#f0eaf6] text-[#795a9d] dark:bg-[#3d3048] dark:text-[#c9a6e8]",
    description: "Small, reliable features with explicit boundaries.",
    order: 13,
  },
  {
    id: "interviews",
    name: "Interview & job prep",
    symbol: "\u2197",
    color: "bg-[#e9f0e3] text-[#607e49] dark:bg-[#303d29] dark:text-[#b8ce91]",
    description: "Real evidence, clear explanations, and sustainable practice.",
    order: 14,
  },
];
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

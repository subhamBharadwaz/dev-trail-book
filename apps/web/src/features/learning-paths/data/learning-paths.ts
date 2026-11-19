import { studyWeeks } from "@/features/roadmap/data/study-plan";
import { topicBySlug } from "@/features/topics/data/content";
export const learningPaths = [
  {
    id: "advanced-typescript",
    title: "Advanced TypeScript & runtime contracts",
    description:
      "From generics and type transformations to Zod-validated APIs and AI boundaries. Study in order, then implement each exercise.",
    level: "After TypeScript foundations",
    slugs: [
      "typed-props-api",
      "discriminated-unions",
      "ts-generics-constraints",
      "ts-mapped-utility-types",
      "ts-conditional-infer",
      "ts-literals-satisfies",
      "ts-narrowing-never",
      "ts-strictness-modules",
      "ts-react-contracts",
      "zod-runtime-contracts",
      "zod-transforms-refinements",
      "ts-ai-api-boundaries",
    ],
  },
  {
    id: "web-foundations",
    title: "Understand the foundations",
    description:
      "Connect the browser, JavaScript, and the types that hold your data together.",
    level: "Start here",
    slugs: ["http-basics", "closures", "async-await", "discriminated-unions"],
  },
  {
    id: "react-essentials",
    title: "Build thoughtful React interfaces",
    description:
      "Learn to model components, synchronize with the outside world, and make your UI accessible.",
    level: "Build on the basics",
    slugs: ["thinking-in-react", "effects", "accessible-ui"],
  },
  {
    id: "ship-your-site",
    title: "Take your site from idea to live",
    description:
      "Create a visual language, build your content system, and prepare a deployment.",
    level: "Put it into practice",
    slugs: ["tailwind-tokens", "vite-mdx", "vercel-deploy"],
  },
  ...studyWeeks.map((week) => ({
    id: week.id,
    title: `${week.number === 10 ? "Final buffer" : `Week ${week.number}`}: ${week.title}`,
    description: week.description,
    level: `Study plan · ${week.dates}`,
    slugs: week.slugs,
  })),
];
export type LearningPath = (typeof learningPaths)[number];
export const learningPathById = new Map(
  learningPaths.map((path) => [path.id, path]),
);
export function getPathTopics(path: LearningPath) {
  return path.slugs.flatMap((slug) => {
    const topic = topicBySlug.get(slug);
    return topic ? [topic] : [];
  });
}
export function getPathProgress(path: LearningPath, read: string[]) {
  const topics = getPathTopics(path);
  const completed = topics.filter((topic) => read.includes(topic.slug)).length;
  return {
    topics,
    completed,
    total: topics.length,
    minutes: topics.reduce((total, topic) => total + topic.minutes, 0),
    next: topics.find((topic) => !read.includes(topic.slug)),
    percent: topics.length ? Math.round((completed / topics.length) * 100) : 0,
  };
}

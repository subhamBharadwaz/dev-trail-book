import { topics } from "@/features/topics/data/content";
export interface PracticeCard {
  id: string;
  topicSlug: string;
  category: string;
  topicTitle: string;
  question: string;
  answer: string;
  options: { id: string; text: string }[];
  correctId: string;
}
const distractors: Record<string, string[]> = {
  closures: [
    "Yes. It freezes a copy of every value when the function is created.",
    "It can only read variables while the outer function is still running.",
  ],
  "async-await": [
    "Yes. Every HTTP error status makes fetch reject automatically.",
    "Only 500 responses reject; 404 responses always resolve to null.",
  ],
  "discriminated-unions": [
    "Yes. An interface automatically validates the response at runtime.",
    "A type assertion validates and removes invalid properties.",
  ],
  effects: [
    "It is a production retry mechanism for all Effects.",
    "Every state update always executes the Effect exactly twice.",
  ],
  "http-basics": [
    "The request failed because the server could not find a body.",
    "The server always sends an empty JSON object that must be parsed.",
  ],
  "tailwind-tokens": [
    "Yes. Every unique value should become a global token immediately.",
    "No. Tokens are only useful for brand colors, never spacing or type.",
  ],
  "thinking-in-react": [
    "Yes. Always store both the original and filtered list in state.",
    "Use an Effect to update a second list after every render.",
  ],
  "vercel-deploy": [
    "Yes. Vite encrypts them before sending them to the browser.",
    "Yes. Only the deployed server can read a VITE_ variable.",
  ],
  "vite-mdx": [
    "MDX automatically makes a static site server-rendered.",
    "MDX is required whenever you want to write a fenced code block.",
  ],
  "accessible-ui": [
    "Yes. Every icon has an automatic accessible label.",
    "An icon is sufficient as long as it has a visible color.",
  ],
};
export const flashcards: PracticeCard[] = topics.flatMap((topic) =>
  topic.questions.map((item, index) => ({
    id: `${topic.slug}:${index}`,
    topicSlug: topic.slug,
    category: topic.category,
    topicTitle: topic.title,
    question: item.question,
    answer: item.answer,
    options: [],
    correctId: "correct",
  })),
);
export const quizCards: PracticeCard[] = topics.flatMap((topic, index) => {
  const wrong = topic.quizDistractors ?? distractors[topic.slug];
  if (!wrong || !topic.questions[0]) return [];
  const options = [
    { id: "correct", text: topic.questions[0].answer },
    ...wrong.map((text, position) => ({ id: `alternative-${position}`, text })),
  ];
  const offset = index % options.length;
  return [
    {
      ...flashcards.find((card) => card.id === `${topic.slug}:0`)!,
      options: [...options.slice(offset), ...options.slice(0, offset)],
    },
  ];
});

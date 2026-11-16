import { topics } from "@/features/topics/data/content";
import { buildPractice } from "@trailbook/learning/practice";
export type { PracticeCard } from "@trailbook/learning/practice";
export const { flashcards, quizCards } = buildPractice(topics);

import type { Json } from "@trailbook/sync";
import type { PracticeCard } from "./practice";
export interface Mistake {
  id: string;
  question: string;
  answer: string;
  yourAnswer: string;
  explanation: string;
  topicSlug: string;
  topicTitle: string;
  category: string;
  source: "quiz" | "flashcard" | "manual" | "interview";
  createdAt: string;
  updatedAt: string;
  due: string;
  streak: number;
  misses: number;
  status: "open" | "mastered";
}
export const mistakeKey = (id: string) => `practice/mistake/${id}`;
export function day(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function afterDays(days: number, now = new Date()) {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return day(date);
}
export function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00`);
  return !Number.isNaN(date.getTime()) && day(date) === value;
}
export function parseMistake(value: unknown): Mistake | null {
  if (!value || typeof value !== "object") return null;
  const m = value as Mistake;
  if (
    ![
      m.id,
      m.question,
      m.answer,
      m.yourAnswer,
      m.explanation,
      m.topicSlug,
      m.topicTitle,
      m.category,
      m.createdAt,
      m.updatedAt,
      m.due,
    ].every((v) => typeof v === "string")
  )
    return null;
  if (
    !m.id ||
    !m.question.trim() ||
    !m.answer.trim() ||
    !validDate(m.due) ||
    !["open", "mastered"].includes(m.status) ||
    !["quiz", "flashcard", "manual", "interview"].includes(m.source) ||
    !Number.isSafeInteger(m.streak) ||
    m.streak < 0 ||
    !Number.isSafeInteger(m.misses) ||
    m.misses < 0
  )
    return null;
  return m;
}
export function mistakesFromRecords(records: Record<string, Json>) {
  return Object.entries(records)
    .flatMap(([key, value]) => {
      if (!key.startsWith("practice/mistake/")) return [];
      const mistake = parseMistake(value);
      return mistake && key === mistakeKey(mistake.id) ? [mistake] : [];
    })
    .sort(
      (a, b) =>
        a.due.localeCompare(b.due) || b.updatedAt.localeCompare(a.updatedAt),
    );
}
export function mistakeRecord(mistake: Mistake): Record<string, Json> {
  return { [mistakeKey(mistake.id)]: JSON.parse(JSON.stringify(mistake)) };
}
export function captureMistake(
  records: Record<string, Json>,
  card: PracticeCard,
  source: "quiz" | "flashcard",
  yourAnswer: string,
  now = new Date(),
) {
  const id = `card-${card.id}`;
  const previous = parseMistake(records[mistakeKey(id)]);
  const timestamp = now.toISOString();
  return mistakeRecord({
    id,
    question: card.question,
    answer: card.answer,
    topicSlug: card.topicSlug,
    topicTitle: card.topicTitle,
    category: card.category,
    source,
    yourAnswer,
    explanation: previous?.explanation ?? "",
    createdAt: previous?.createdAt ?? timestamp,
    updatedAt: timestamp,
    due: day(now),
    streak: 0,
    misses: (previous?.misses ?? 0) + 1,
    status: "open",
  });
}
export function reviewMistake(
  mistake: Mistake,
  recalled: boolean,
  now = new Date(),
): Mistake {
  if (mistake.status === "mastered" || (recalled && mistake.due > day(now)))
    return mistake;
  const streak = recalled ? Math.min(mistake.streak + 1, 3) : 0;
  return {
    ...mistake,
    updatedAt: now.toISOString(),
    streak,
    misses: mistake.misses + (recalled ? 0 : 1),
    due: afterDays(recalled ? [1, 3, 7][streak - 1] : 1, now),
    status: streak === 3 ? "mastered" : "open",
  };
}
export function newMistake(id: string, now = new Date()): Mistake {
  return {
    id,
    question: "",
    answer: "",
    yourAnswer: "",
    explanation: "",
    topicSlug: "",
    topicTitle: "Personal note",
    category: "personal",
    source: "manual",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    due: day(now),
    streak: 0,
    misses: 0,
    status: "open",
  };
}

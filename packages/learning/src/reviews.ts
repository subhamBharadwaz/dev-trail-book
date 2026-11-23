import type { Json } from "@trailbook/sync";
import type { PracticeCard } from "./practice";
import {
  afterDays,
  day,
  validDate,
  mistakesFromRecords,
  reviewMistake,
  mistakeRecord,
  type Mistake,
} from "./mistakes";
import { parseConfidence } from "./confidence";
export const reviewIntervals = [1, 3, 7, 14, 30, 60] as const;
export interface QuestionReview {
  version: 1;
  cardId: string;
  due: string;
  step: number;
  attempts: number;
  misses: number;
  reviewedAt: string;
}
export const reviewKey = (id: string) => `practice/review/${id}`;
export function parseQuestionReview(value: unknown): QuestionReview | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  if (
    v.version !== 1 ||
    typeof v.cardId !== "string" ||
    !/^[a-z0-9-]+:\d+$/.test(v.cardId) ||
    typeof v.due !== "string" ||
    !validDate(v.due) ||
    typeof v.reviewedAt !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T/.test(v.reviewedAt) ||
    !Number.isFinite(Date.parse(v.reviewedAt)) ||
    !Number.isSafeInteger(v.step) ||
    Number(v.step) < 0 ||
    Number(v.step) >= reviewIntervals.length ||
    !Number.isSafeInteger(v.attempts) ||
    Number(v.attempts) < 1 ||
    !Number.isSafeInteger(v.misses) ||
    Number(v.misses) < 0 ||
    Number(v.misses) > Number(v.attempts)
  )
    return null;
  return {
    version: 1,
    cardId: v.cardId,
    due: v.due,
    step: Number(v.step),
    attempts: Number(v.attempts),
    misses: Number(v.misses),
    reviewedAt: v.reviewedAt,
  };
}
export function scheduleQuestion(
  cardId: string,
  previous: QuestionReview | null,
  recalled: boolean,
  now = new Date(),
): QuestionReview {
  if (!/^[a-z0-9-]+:\d+$/.test(cardId)) throw new Error("Invalid review card");
  if (previous && previous.cardId !== cardId)
    throw new Error("Review card does not match");
  if (previous && recalled && previous.due > day(now)) return previous;
  const step =
    recalled && previous
      ? Math.min(previous.step + 1, reviewIntervals.length - 1)
      : 0;
  return {
    version: 1,
    cardId,
    due: afterDays(reviewIntervals[step], now),
    step,
    attempts: (previous?.attempts ?? 0) + 1,
    misses: (previous?.misses ?? 0) + (recalled ? 0 : 1),
    reviewedAt: now.toISOString(),
  };
}
export function questionReviewRecord(
  review: QuestionReview,
): Record<string, Json> {
  return { [reviewKey(review.cardId)]: JSON.parse(JSON.stringify(review)) };
}
export interface ReviewItem {
  id: string;
  kind: "question" | "mistake";
  due: string;
  question: string;
  answer: string;
  topicSlug: string;
  topicTitle: string;
  weak: boolean;
  cardId?: string;
  mistake?: Mistake;
  review?: QuestionReview;
}
export function buildReviewQueue(
  records: Record<string, Json>,
  cards: PracticeCard[],
  today = day(),
): ReviewItem[] {
  const byId = new Map(cards.map((card) => [card.id, card]));
  const reviews = new Map<string, QuestionReview>();
  for (const [key, value] of Object.entries(records)) {
    if (!key.startsWith("practice/review/")) continue;
    const review = parseQuestionReview(value);
    if (review && key === reviewKey(review.cardId) && byId.has(review.cardId))
      reviews.set(review.cardId, review);
  }
  const practiced = new Set<string>();
  for (const [key, value] of Object.entries(records)) {
    if (
      !key.startsWith("practice/session/") ||
      !value ||
      typeof value !== "object" ||
      Array.isArray(value)
    )
      continue;
    const results = (value as Record<string, Json>).results;
    if (!results || typeof results !== "object" || Array.isArray(results))
      continue;
    for (const [id, result] of Object.entries(results))
      if (typeof result === "boolean" && byId.has(id)) practiced.add(id);
  }
  const weak = (slug: string) =>
    parseConfidence(records[`reading/confidence/${slug}`])?.level ===
    "learning";
  const mistakes = mistakesFromRecords(records).filter(
    (m) => m.status === "open",
  );
  const items: ReviewItem[] = mistakes.map((mistake) => {
    const cardId =
      mistake.id.startsWith("card-") && byId.has(mistake.id.slice(5))
        ? mistake.id.slice(5)
        : undefined;
    return {
      id: `mistake:${mistake.id}`,
      kind: "mistake",
      due: mistake.due,
      question: mistake.question,
      answer: mistake.answer,
      topicSlug: mistake.topicSlug,
      topicTitle: mistake.topicTitle,
      weak: weak(mistake.topicSlug),
      cardId,
      mistake,
    };
  });
  const represented = new Set(
    items.flatMap((item) => (item.cardId ? [item.cardId] : [])),
  );
  for (const id of new Set([...reviews.keys(), ...practiced])) {
    if (
      represented.has(id) ||
      (Object.hasOwn(records, reviewKey(id)) && records[reviewKey(id)] === null)
    )
      continue;
    const card = byId.get(id)!;
    const review = reviews.get(id);
    items.push({
      id: `question:${id}`,
      kind: "question",
      due: review?.due ?? today,
      question: card.question,
      answer: card.answer,
      topicSlug: card.topicSlug,
      topicTitle: card.topicTitle,
      weak: weak(card.topicSlug),
      cardId: id,
      review,
    });
  }
  return items.sort(
    (a, b) =>
      a.due.localeCompare(b.due) ||
      Number(b.weak) - Number(a.weak) ||
      a.id.localeCompare(b.id),
  );
}
export function gradeReview(
  item: ReviewItem,
  records: Record<string, Json>,
  recalled: boolean,
  now = new Date(),
): Record<string, Json> {
  if (item.due > day(now)) return {};
  let changes: Record<string, Json> = {};
  if (item.mistake)
    changes = mistakeRecord(reviewMistake(item.mistake, recalled, now));
  if (item.cardId) {
    const previous = parseQuestionReview(records[reviewKey(item.cardId)]);
    changes = {
      ...changes,
      ...questionReviewRecord(
        scheduleQuestion(item.cardId, previous, recalled, now),
      ),
    };
  }
  return changes;
}

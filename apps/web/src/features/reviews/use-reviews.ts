import { progress } from "@/features/account/data/progress-store";
import {
  buildReviewQueue,
  gradeReview,
  parseQuestionReview,
  questionReviewRecord,
  reviewKey,
  scheduleQuestion,
} from "@trailbook/learning/reviews";
import type { PracticeCard } from "@trailbook/learning/practice";
import {
  studyStore,
  useStudyRecords,
} from "@/features/account/hooks/use-study-records";
import { guestRecords } from "@/features/account/data/local-import";
import { flashcards } from "@/features/practice/data/practice-cards";
import { useNotebookDay } from "@/features/mistakes/use-notebook-day";
export function recordPracticeReview(
  card: PracticeCard,
  recalled: boolean,
  accountId: string | null,
) {
  if (progress.getSnapshot().userId !== accountId) return false;
  const store = studyStore();
  const previous = parseQuestionReview(store.values()[reviewKey(card.id)]);
  const next = scheduleQuestion(card.id, previous, recalled);
  if (next !== previous) store.write(questionReviewRecord(next));
  return true;
}
export function useReviews() {
  const snapshot = useStudyRecords();
  const today = useNotebookDay();
  const values = snapshot.accountId
    ? snapshot.values
    : { ...guestRecords(), ...snapshot.values };
  const items = buildReviewQueue(values, flashcards, today);
  return {
    today,
    items,
    due: items.filter((item) => item.due <= today),
    storageError: snapshot.storageError,
    grade(id: string, recalled: boolean) {
      if (progress.getSnapshot().userId !== snapshot.accountId) return false;
      const store = studyStore();
      const records = snapshot.accountId
        ? store.values()
        : { ...guestRecords(), ...store.values() };
      const latest = buildReviewQueue(records, flashcards, today).find(
        (item) => item.id === id,
      );
      if (!latest || latest.due > today) return false;
      store.write(gradeReview(latest, records, recalled));
      return !store.getSnapshot().storageError;
    },
  };
}

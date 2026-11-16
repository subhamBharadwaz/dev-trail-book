import {
  mistakesFromRecords,
  captureMistake,
  mistakeRecord,
  type Mistake,
} from "@trailbook/learning/mistakes";
import type { PracticeCard } from "@trailbook/learning/practice";
import {
  guestStudy,
  studyStore,
  useStudyRecords,
} from "@/features/account/hooks/use-study-records";
export const guestNotebook = guestStudy;
export const notebookStore = studyStore;
export function savePracticeMistake(
  card: PracticeCard,
  source: "quiz" | "flashcard",
  answer: string,
) {
  const store = studyStore();
  store.write(captureMistake(store.values(), card, source, answer));
}
export function useMistakes() {
  const { values, storageError } = useStudyRecords();
  return {
    mistakes: mistakesFromRecords(values),
    storageError,
    save: (mistake: Mistake) => studyStore().write(mistakeRecord(mistake)),
  };
}

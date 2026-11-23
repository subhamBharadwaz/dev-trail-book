import { navigateWithinApp } from "@/app/navigation";
import { buildReadiness } from "@trailbook/learning/readiness";
import { preparationRecords } from "@trailbook/learning/preparation-records";
import { currentInterviewKey } from "@trailbook/learning/interviews";
import type { ReadinessAction } from "@trailbook/learning/readiness";
import { topics, categories } from "@/features/topics/data/content";
import { usePreparation } from "@/features/preparation/hooks/use-preparation";
import { useReadingState } from "@/hooks/use-reading-state";
import { useNotebookDay } from "@/features/mistakes/use-notebook-day";
import {
  studyStore,
  useStudyRecords,
} from "@/features/account/hooks/use-study-records";
export function useReadiness() {
  const records = useStudyRecords();
  const prep = usePreparation();
  const { read } = useReadingState();
  const today = useNotebookDay();
  const values = { ...records.values, ...preparationRecords(prep.state) };
  for (const slug of read) values[`reading/read/${slug}`] = true;
  return {
    data: buildReadiness(values, topics, categories, today),
    storageError: records.storageError || prep.storageError,
    loading: records.accountId !== null && records.phase === "loading",
  };
}
export function openReadinessAction(action: ReadinessAction) {
  if (action.sessionId)
    studyStore().write({ [currentInterviewKey]: action.sessionId });
  void navigateWithinApp(
    action.target === "topic"
      ? `/topic/${action.slug}`
      : `/${action.target === "journal" ? "evidence" : action.target}`,
  );
}

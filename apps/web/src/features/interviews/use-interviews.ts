import { useEffect, useState } from "react";
import {
  createInterviewActions,
  currentInterviewKey,
  interviewsFromRecords,
} from "@trailbook/learning/interviews";
import { flashcards } from "@/features/practice/data/practice-cards";
import {
  studyStore,
  useStudyRecords,
} from "@/features/account/hooks/use-study-records";
const actions = createInterviewActions(studyStore, flashcards, () =>
  crypto.randomUUID(),
);
export function useInterviews() {
  const records = useStudyRecords();
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const update = () => setNow(Date.now());
    const timer = window.setInterval(update, 1000);
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  const sessions = interviewsFromRecords(records.values);
  const selected =
    sessions.find((s) => s.id === records.values[currentInterviewKey]) ?? null;
  return { ...records, now, sessions, selected, actions };
}

import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { randomUUID } from "expo-crypto";
import { topics } from "@trailbook/content/native";
import { buildPractice } from "@trailbook/learning/practice";
import {
  createInterviewActions,
  currentInterviewKey,
  interviewsFromRecords,
} from "@trailbook/learning/interviews";
import { progress, useProgress } from "@/lib/progress";
const actions = createInterviewActions(
  () => progress,
  buildPractice(topics).flashcards,
  randomUUID,
);
export function useInterviews() {
  const records = useProgress();
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const update = () => setNow(Date.now());
    const timer = setInterval(update, 1000);
    const listener = AppState.addEventListener("change", (state) => {
      if (state === "active") update();
    });
    return () => {
      clearInterval(timer);
      listener.remove();
    };
  }, []);
  const sessions = interviewsFromRecords(records.values);
  const selected =
    sessions.find((s) => s.id === records.values[currentInterviewKey]) ?? null;
  return { ...records, now, sessions, selected, actions };
}

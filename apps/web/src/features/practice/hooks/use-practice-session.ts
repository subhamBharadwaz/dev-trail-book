import { useEffect, useState, type SetStateAction } from "react";
import { savePracticeMistake } from "@/features/mistakes/use-mistakes";
import {
  progress,
  useCloudProgress,
} from "@/features/account/data/progress-store";
import type { PracticeCard } from "../data/practice-cards";
import {
  fresh,
  restoreSession,
  type Session,
} from "@trailbook/learning/practice-session";
function restore(key: string, cards: PracticeCard[], cloudValue?: unknown) {
  try {
    return restoreSession(
      cards,
      cloudValue !== undefined
        ? cloudValue
        : JSON.parse(localStorage.getItem(key) || "null"),
    );
  } catch {
    return fresh(cards.map((card) => card.id));
  }
}
export function usePracticeSession(cards: PracticeCard[], scope: string) {
  const key = `trailbook:practice:v1:${scope}`;
  const cloud = useCloudProgress();
  const recordKey = `practice/session/${scope}`;
  const [localSession, setLocalSession] = useState(() => restore(key, cards));
  const session = cloud.userId
    ? restore(key, cards, progress.values()[recordKey] ?? null)
    : localSession;
  const setSession = (change: SetStateAction<Session>) => {
    if (!cloud.userId) {
      setLocalSession(change);
      return;
    }
    const next = typeof change === "function" ? change(session) : change;
    progress.write({ [recordKey]: JSON.parse(JSON.stringify(next)) });
  };
  useEffect(() => {
    if (cloud.userId) return;
    try {
      localStorage.setItem(key, JSON.stringify(localSession));
    } catch {
      /* Practice remains usable without browser storage. */
    }
  }, [key, localSession, cloud.userId]);
  const current = cards.find((card) => card.id === session.ids[session.index]);
  const answered = !!current && Object.hasOwn(session.results, current.id);
  const correct = Object.values(session.results).filter(Boolean).length;
  const missed = session.ids.filter((id) => session.results[id] === false);
  return {
    session,
    current,
    answered,
    correct,
    missed,
    choose: (selected: string | null) =>
      setSession((state) => ({ ...state, selected })),
    reveal: () => setSession((state) => ({ ...state, revealed: true })),
    check: () => {
      if (!current || !session.selected || answered) return;
      if (session.selected !== current.correctId)
        savePracticeMistake(
          current,
          "quiz",
          current.options.find((option) => option.id === session.selected)
            ?.text ?? "",
        );
      setSession((state) => ({
        ...state,
        revealed: true,
        results: {
          ...state.results,
          [current.id]: state.selected === current.correctId,
        },
      }));
    },
    grade: (known: boolean) => {
      if (!current || !session.revealed || answered) return;
      if (!known) savePracticeMistake(current, "flashcard", "Could not recall");
      setSession((state) => ({
        ...state,
        index: state.index + 1,
        results: { ...state.results, [current.id]: known },
        selected: null,
        revealed: false,
      }));
    },
    next: () => {
      if (!answered) return;
      setSession((state) => ({
        ...state,
        index: state.index + 1,
        selected: null,
        revealed: false,
      }));
    },
    restart: (reviewMissed = false) =>
      setSession(
        fresh(
          reviewMissed && missed.length ? missed : cards.map((card) => card.id),
        ),
      ),
  };
}

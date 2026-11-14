import { useEffect, useState } from "react";
import type { PracticeCard } from "../data/practice-cards";
interface Session {
  version: 1;
  ids: string[];
  index: number;
  results: Record<string, boolean>;
  selected: string | null;
  revealed: boolean;
}
function fresh(ids: string[]): Session {
  return {
    version: 1,
    ids,
    index: 0,
    results: {},
    selected: null,
    revealed: false,
  };
}
function restore(key: string, cards: PracticeCard[]): Session {
  const fallback = fresh(cards.map((card) => card.id));
  try {
    const value = JSON.parse(
      localStorage.getItem(key) || "null",
    ) as Session | null;
    if (
      !value ||
      value.version !== 1 ||
      !Array.isArray(value.ids) ||
      !value.ids.length ||
      new Set(value.ids).size !== value.ids.length ||
      !value.ids.every((id) => cards.some((card) => card.id === id)) ||
      !Number.isInteger(value.index) ||
      value.index < 0 ||
      value.index > value.ids.length ||
      !value.results ||
      typeof value.results !== "object" ||
      Array.isArray(value.results) ||
      !Object.entries(value.results).every(
        ([id, result]) => value.ids.includes(id) && typeof result === "boolean",
      ) ||
      typeof value.revealed !== "boolean"
    )
      return fallback;
    const current = cards.find((card) => card.id === value.ids[value.index]);
    if (
      value.selected !== null &&
      !current?.options.some((option) => option.id === value.selected)
    )
      return fallback;
    if (
      !value.ids
        .slice(0, value.index)
        .every((id) => Object.hasOwn(value.results, id))
    )
      return fallback;
    return value;
  } catch {
    return fallback;
  }
}
export function usePracticeSession(cards: PracticeCard[], scope: string) {
  const key = `trailbook:practice:v1:${scope}`;
  const [session, setSession] = useState(() => restore(key, cards));
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(session));
    } catch {
      /* Practice remains usable without browser storage. */
    }
  }, [key, session]);
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
      if (!current || !session.revealed) return;
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

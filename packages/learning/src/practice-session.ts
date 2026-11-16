import type { PracticeCard } from "./practice";
export interface Session {
  version: 1;
  ids: string[];
  index: number;
  results: Record<string, boolean>;
  selected: string | null;
  revealed: boolean;
}
export function fresh(ids: string[]): Session {
  return {
    version: 1,
    ids,
    index: 0,
    results: {},
    selected: null,
    revealed: false,
  };
}
export function restoreSession(cards: PracticeCard[], input: unknown): Session {
  const fallback = fresh(cards.map((card) => card.id));
  try {
    const value = input as Session | null;
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

import { expect, test } from "bun:test";
import { topics } from "@trailbook/content/native";
import { buildPractice } from "./practice";
import { fresh, restoreSession } from "./practice-session";
test("web and mobile practice sessions use the same question IDs and reject incompatible saved data", () => {
  const { flashcards, quizCards } = buildPractice(topics);
  expect(flashcards.length).toBe(177);
  expect(quizCards.length).toBe(74);
  for (const card of quizCards) {
    expect(
      card.options.some(
        (option) => option.id === card.correctId && option.text === card.answer,
      ),
    ).toBe(true);
  }
  const ids = flashcards.slice(0, 4).map((c) => c.id);
  const saved = { ...fresh(ids), index: 1, results: { [ids[0]]: true } };
  expect(restoreSession(flashcards, saved)).toEqual(saved);
  expect(restoreSession(flashcards, { ...saved, results: {} }).index).toBe(0);
});

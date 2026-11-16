import { expect, test } from "bun:test";
import {
  captureMistake,
  mistakesFromRecords,
  mistakeKey,
  reviewMistake,
  newMistake,
  validDate,
  mistakeRecord,
} from "./mistakes";
import type { PracticeCard } from "./practice";
const now = new Date("2026-11-16T12:00:00");
const card: PracticeCard = {
  id: "quiz-closures",
  question: "What is captured?",
  answer: "A binding",
  topicSlug: "closures",
  category: "javascript",
  topicTitle: "Closures",
  options: [],
  correctId: "a",
};
test("repeated misses reopen a single entry and preserve its reflection", () => {
  const first = mistakesFromRecords(
    captureMistake({}, card, "quiz", "A copy", now),
  )[0];
  const records = mistakeRecord({
    ...first,
    explanation: "Bindings remain live",
    status: "mastered",
    streak: 3,
  });
  const second = mistakesFromRecords(
    captureMistake(records, card, "quiz", "A value", now),
  );
  expect(second).toHaveLength(1);
  expect(second[0]).toMatchObject({
    status: "open",
    streak: 0,
    misses: 2,
    explanation: "Bindings remain live",
    yourAnswer: "A value",
    createdAt: first.createdAt,
  });
});
test("spaced recalls enforce due dates, and a miss resets the streak", () => {
  let m = {
    ...newMistake("manual", now),
    question: "Question",
    answer: "Answer",
  };
  m = reviewMistake(m, true, now);
  expect(m).toMatchObject({ streak: 1, due: "2026-11-17", status: "open" });
  expect(reviewMistake(m, true, now)).toEqual(m);
  const second = reviewMistake(m, true, new Date("2026-11-17T12:00:00"));
  expect(second).toMatchObject({ streak: 2, due: "2026-11-20" });
  expect(
    reviewMistake(second, false, new Date("2026-11-20T12:00:00")),
  ).toMatchObject({ streak: 0, status: "open", due: "2026-11-21", misses: 1 });
  expect(
    reviewMistake(second, true, new Date("2026-11-20T12:00:00")),
  ).toMatchObject({ streak: 3, status: "mastered" });
});
test("damaged records, tombstones and mismatched keys are ignored", () => {
  const m = { ...newMistake("a", now), question: "Question", answer: "Answer" };
  expect(
    mistakesFromRecords({
      [mistakeKey("a")]: null,
      [mistakeKey("bad")]: JSON.parse(JSON.stringify(m)),
      "practice/mistake/broken": { question: "x" },
    }),
  ).toEqual([]);
  expect(validDate("2026-02-30")).toBe(false);
  expect(validDate("2028-02-29")).toBe(true);
});

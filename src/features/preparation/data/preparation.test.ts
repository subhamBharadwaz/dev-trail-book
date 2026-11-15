import { expect, test } from "vitest";
import {
  addDays,
  dailyTasks,
  dueReviews,
  emptyPreparation,
  parsePreparation,
  validDate,
  type Evidence,
} from "./preparation";
const entry: Evidence = {
  id: "attempt",
  kind: "dsa",
  title: "Two Sum",
  date: "2026-11-15",
  notes: "Needed one hint",
  independent: false,
  reviews: ["2026-11-17", "2026-11-22"],
  completedReviews: [],
};
test("routine allocations match the PDF, including both fallback schedules", () => {
  expect(dailyTasks("full").reduce((sum, task) => sum + task.minutes, 0)).toBe(
    360,
  );
  expect(dailyTasks("short").reduce((sum, task) => sum + task.minutes, 0)).toBe(
    120,
  );
  expect(
    dailyTasks("minimum").reduce((sum, task) => sum + task.minutes, 0),
  ).toBe(20);
});
test("reviews use calendar days and completed re-solves leave the due queue", () => {
  expect(addDays("2026-12-30", 7)).toBe("2027-01-06");
  expect(dueReviews([entry], "2026-11-16")).toHaveLength(0);
  expect(dueReviews([entry], "2026-11-17")).toHaveLength(1);
  expect(
    dueReviews([{ ...entry, completedReviews: ["2026-11-17"] }], "2026-11-22"),
  ).toEqual([
    {
      entry: { ...entry, completedReviews: ["2026-11-17"] },
      date: "2026-11-22",
    },
  ]);
});
test("damaged storage recovers and malformed attempts are discarded", () => {
  expect(parsePreparation("broken")).toEqual(emptyPreparation);
  expect(validDate("2026-02-30")).toBe(false);
  expect(
    parsePreparation(
      JSON.stringify({
        version: 1,
        entries: [entry, { ...entry, id: "bad", reviews: ["not-a-date"] }],
        days: {
          "2026-11-15": { routine: "minimum", completed: ["dsa"] },
          invalid: {},
        },
      }),
    ),
  ).toEqual({
    version: 1,
    entries: [entry],
    days: { "2026-11-15": { routine: "minimum", completed: ["dsa"] } },
  });
});

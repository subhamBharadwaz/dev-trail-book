import { expect, test } from "bun:test";
import {
  withReadingDefaults,
  createBackup,
  parseBackup,
  restorePlan,
  validStudyRecord,
} from "./backup";
import { newMistake, mistakeRecord } from "./mistakes";
import { createInterview, interviewRecord, answerKey } from "./interviews";
import { fresh } from "./practice-session";
const now = new Date("2026-11-16T12:00:00Z");
test("portable backups round-trip all study formats while excluding sign-in and device secrets", () => {
  const mock = createInterview("backup-mock", 15, "all", [], now.getTime());
  const result = createBackup(
    {
      "reading/read/closures": true,
      "reading/saved/effects": false,
      "prep/day/2026-11-16/task/recall": true,
      "practice/session/all:quiz": JSON.parse(
        JSON.stringify(fresh(["closures:quiz"])),
      ),
      ...mistakeRecord({
        ...newMistake("gap", now),
        question: "Question",
        answer: "Answer",
      }),
      ...interviewRecord(mock),
      [answerKey(mock.id, mock.prompts[0].id)]: {
        text: "My code",
        rating: null,
        reflection: "",
      },
      "supabase/auth/token": "private",
      "trailbook/theme": "night",
    },
    "web",
    now,
  );
  expect(result.skipped).toBe(2);
  expect(result.text).not.toContain("private");
  expect(result.text).not.toContain("supabase");
  expect(parseBackup(result.text)).toEqual(result.backup);
});
test("missing-only restore preserves existing false values and tombstones; matching restore changes only file records", () => {
  const { backup } = createBackup(
    {
      "reading/read/closures": true,
      "reading/read/effects": false,
      "prep/entry/deleted": null,
    },
    "android",
    now,
  );
  const current = {
    "reading/read/closures": false,
    "prep/entry/deleted": null,
    "reading/read/scope-hoisting": true,
  };
  expect(restorePlan(backup, current, "missing")).toMatchObject({
    added: 1,
    updated: 0,
    kept: 2,
    changes: { "reading/read/effects": false },
  });
  const plan = restorePlan(backup, current, "matching");
  expect(plan).toMatchObject({ added: 1, updated: 1, kept: 1 });
  expect(plan.changes).not.toHaveProperty("reading/read/scope-hoisting");
});
test("invalid versions, private namespaces and malformed records fail before any restore", () => {
  const { backup } = createBackup({}, "web", now);
  for (const value of [
    { ...backup, version: 2 },
    { ...backup, access_token: "secret" },
    { ...backup, records: { "supabase/auth/session": "secret" } },
    { ...backup, records: { "reading/read/closures": "yes" } },
    { ...backup, records: { "practice/interview/bad": { version: 1 } } },
  ])
    expect(() => parseBackup(JSON.stringify(value))).toThrow();
  expect(() => parseBackup("not JSON")).toThrow("valid JSON");
  expect(validStudyRecord("prep/day/2026-02-30/routine", null)).toBe(false);
  expect(validStudyRecord("prep/entry/__proto__", null)).toBe(false);
  const hostile = `{"format":"dev-trailbook-backup","version":1,"exportedAt":"2026-11-16T12:00:00Z","source":"web","records":{"practice/preferences/all":{"category":"all","mode":"quiz","__proto__":{}}}}`;
  expect(() => parseBackup(hostile)).toThrow();
});
test("per-record and file limits reject oversized data", () => {
  expect(
    validStudyRecord("practice/interview-answer/session/prompt", {
      text: "x".repeat(12001),
      rating: null,
      reflection: "",
    }),
  ).toBe(false);
  expect(() => parseBackup("x".repeat(8 * 1024 * 1024 + 1))).toThrow("8 MB");
});

test("complete reading snapshots preserve unread and unbookmarked states for matching restores", () => {
  const records = withReadingDefaults({ "reading/read/closures": true }, [
    "closures",
    "effects",
  ]);
  expect(records["reading/read/effects"]).toBe(false);
  expect(records["reading/saved/closures"]).toBe(false);
  const { backup } = createBackup(records, "web");
  expect(
    restorePlan(backup, { "reading/read/effects": true }, "matching").changes[
      "reading/read/effects"
    ],
  ).toBe(false);
});

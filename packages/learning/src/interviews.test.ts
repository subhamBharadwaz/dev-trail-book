import { expect, test } from "bun:test";
import { createProgressStore, type Json } from "@trailbook/sync";
import type { PracticeCard } from "./practice";
import {
  createInterview,
  remainingMs,
  transitionInterview,
  parseInterview,
  interviewRecord,
  interviewsFromRecords,
  updateInterviewAnswer,
  getAnswer,
  answerKey,
  interviewStats,
  createInterviewActions,
  currentInterviewKey,
  getDebrief,
  interviewPosition,
} from "./interviews";
import { mistakesFromRecords } from "./mistakes";
const cards: PracticeCard[] = Array.from({ length: 12 }, (_, i) => ({
  id: `q-${i}`,
  question: `Explain ${i}`,
  answer: `Reference ${i}`,
  topicSlug: `topic-${i}`,
  topicTitle: `Topic ${i}`,
  category: i < 6 ? "react" : "javascript",
  options: [],
  correctId: "",
}));
const now = 1000000;
test("session plans are deterministic, varied, focused, and contain all three interview formats", () => {
  for (const [duration, count] of [
    [15, 4],
    [30, 7],
    [45, 8],
  ] as const) {
    const s = createInterview("same-seed", duration, "react", cards, now);
    expect(s.prompts).toHaveLength(count);
    expect(
      s.prompts
        .filter((p) => p.kind === "technical")
        .every((p) => p.category === "react"),
    ).toBe(true);
    expect(new Set(s.prompts.map((p) => p.id)).size).toBe(count);
    expect(s.prompts).toEqual(
      createInterview("same-seed", duration, "react", cards, now).prompts,
    );
    expect(s.prompts.some((p) => p.kind === "coding")).toBe(true);
    expect(s.prompts.some((p) => p.kind === "behavioral")).toBe(true);
    expect(parseInterview(JSON.parse(JSON.stringify(s)))).toEqual(s);
  }
  expect(createInterview("other", 15, "all", cards, now).prompts).not.toEqual(
    createInterview("same-seed", 15, "all", cards, now).prompts,
  );
});
test("elapsed time catches up after backgrounding, while explicit pauses survive reloads", () => {
  const s = createInterview("timer", 15, "all", cards, now);
  expect(remainingMs(s, now + 61000)).toBe(839000);
  const paused = transitionInterview(s, "pause", now + 61000);
  expect(remainingMs(paused, now + 6000000)).toBe(839000);
  const restored = parseInterview(JSON.parse(JSON.stringify(paused)))!;
  const resumed = transitionInterview(restored, "resume", now + 6000000);
  expect(remainingMs(resumed, now + 6001000)).toBe(838000);
  expect(remainingMs(s, now + 900000)).toBe(0);
  expect(transitionInterview(s, "pause", now + 900000)).toEqual(s);
  const complete = transitionInterview(s, "finish", now + 900000);
  expect(complete.elapsed).toBe(900000);
  expect(transitionInterview(complete, "resume", now + 900001)).toEqual(
    complete,
  );
});
test("expired, paused and completed sessions reject answer edits; only completed sessions accept assessments", () => {
  const s = createInterview("guards", 15, "all", cards, now),
    p = s.prompts[0].id;
  const record = updateInterviewAnswer(
    {},
    s,
    p,
    { text: "My approach", rating: 3 },
    now + 1000,
  );
  expect(getAnswer(record, s.id, p)).toEqual({
    text: "My approach",
    rating: null,
    reflection: "",
  });
  expect(
    updateInterviewAnswer(record, s, p, { text: "Late edit" }, now + 900000),
  ).toEqual({});
  expect(
    updateInterviewAnswer(
      record,
      transitionInterview(s, "pause", now + 1000),
      p,
      { text: "Paused edit" },
      now + 1001,
    ),
  ).toEqual({});
  const completed = transitionInterview(s, "finish", now + 1001);
  const review = updateInterviewAnswer(
    record,
    completed,
    p,
    { text: "Cheat", rating: 0, reflection: "Missed edge case" },
    now + 1002,
  );
  expect(getAnswer(review, s.id, p)).toEqual({
    text: "My approach",
    rating: 0,
    reflection: "Missed edge case",
  });
  expect(interviewStats(completed, review)).toMatchObject({
    answered: 1,
    rated: 1,
    score: 0,
    total: 4,
  });
  expect(
    updateInterviewAnswer(review, completed, "missing", { rating: 3 }, now),
  ).toEqual({});
  expect(
    updateInterviewAnswer(review, completed, p, { rating: 99 }, now),
  ).toEqual({});
});
test("records restore per-answer progress without leaking across accounts, and notebook handoff is idempotent", () => {
  const cache = new Map<string, string>();
  const store = createProgressStore(
    {
      getItem: (k) => cache.get(k) ?? null,
      setItem: (k, v) => {
        cache.set(k, v);
      },
    },
    () => "nonce",
  );
  store.activate("alice");
  const actions = createInterviewActions(
    () => store,
    cards,
    () => "session-a",
  );
  actions.start(15, "react");
  const s = interviewsFromRecords(store.values())[0],
    p = s.prompts[0];
  actions.answer(p.id, { text: "My answer" });
  actions.goTo(1);
  actions.transition("finish");
  actions.answer(p.id, { rating: 1, reflection: "Need a concrete example" });
  actions.debrief({ strengths: "Clear steps" });
  actions.debrief({ nextStep: "Practice examples" });
  actions.addMistake(p.id);
  expect(mistakesFromRecords(store.values())[0]).toMatchObject({
    source: "interview",
    yourAnswer: "My answer",
    explanation: "Need a concrete example",
  });
  const before = JSON.stringify(store.values());
  actions.addMistake(p.id);
  expect(JSON.stringify(store.values())).toBe(before);
  expect(getDebrief(store.values(), s.id)).toEqual({
    strengths: "Clear steps",
    nextStep: "Practice examples",
  });
  expect(interviewPosition(s, store.values())).toBe(1);
  store.activate("bob");
  expect(interviewsFromRecords(store.values())).toEqual([]);
  expect(store.values()[answerKey(s.id, p.id)]).toBeUndefined();
  store.activate("alice");
  expect(store.values()[currentInterviewKey]).toBe(s.id);
  expect(getAnswer(store.values(), s.id, p.id).text).toBe("My answer");
});
test("malformed session data and mismatched record ids are ignored", () => {
  const s = createInterview("valid", 15, "all", cards, now);
  for (const patch of [
    { version: 2 },
    { duration: "15" },
    { elapsed: -1 },
    { state: "completed", finishedAt: null },
    { prompts: [null] },
    { prompts: [s.prompts[0], s.prompts[0]] },
  ])
    expect(parseInterview({ ...s, ...patch })).toBeNull();
  const records: Record<string, Json> = {
    ...interviewRecord(s),
    "practice/interview/other": JSON.parse(JSON.stringify(s)),
    "practice/interview/deleted": null,
  };
  expect(interviewsFromRecords(records)).toHaveLength(1);
});

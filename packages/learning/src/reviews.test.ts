import { expect, test } from "bun:test";
import {
  buildReviewQueue,
  gradeReview,
  parseQuestionReview,
  questionReviewRecord,
  reviewKey,
  scheduleQuestion,
} from "./reviews";
import { captureMistake, day } from "./mistakes";
import { confidenceRecord } from "./confidence";
import { validStudyRecord } from "./backup";
import type { PracticeCard } from "./practice";
const card: PracticeCard = {
  id: "closures:0",
  topicSlug: "closures",
  topicTitle: "Closures",
  category: "javascript",
  question: "Does a closure copy a binding?",
  answer: "It retains access to the binding.",
  options: [],
  correctId: "correct",
};
const now = new Date(2026, 10, 23, 12);
test("successful due reviews expand through the interval ladder and misses reset to tomorrow", () => {
  let review = scheduleQuestion(card.id, null, true, now);
  expect(review.due).toBe("2026-11-24");
  for (const interval of [3, 7, 14, 30, 60, 60]) {
    const due = new Date(`${review.due}T12:00:00`);
    review = scheduleQuestion(card.id, review, true, due);
    const expected = new Date(due);
    expected.setDate(expected.getDate() + interval);
    expect(review.due).toBe(day(expected));
  }
  const missed = scheduleQuestion(card.id, review, false, now);
  expect(missed.step).toBe(0);
  expect(missed.misses).toBe(1);
  expect(missed.due).toBe("2026-11-24");
});
test("early correct answers do not inflate spacing, including repeated answers the same day", () => {
  const review = scheduleQuestion(card.id, null, true, now);
  expect(scheduleQuestion(card.id, review, true, now)).toBe(review);
  expect(() => scheduleQuestion("other:0", review, true, now)).toThrow();
});
test("only valid review records can be restored and they retain exact card keys", () => {
  const review = scheduleQuestion(card.id, null, true, now);
  expect(validStudyRecord(reviewKey(card.id), review)).toBe(true);
  expect(validStudyRecord(reviewKey("closures:1"), review)).toBe(false);
  expect(validStudyRecord(reviewKey(card.id), null)).toBe(true);
  for (const patch of [
    { due: "2026-02-30" },
    { step: 99 },
    { attempts: -1 },
    { misses: 20 },
    { reviewedAt: "invalid" },
    { cardId: "../private" },
  ])
    expect(parseQuestionReview({ ...review, ...patch })).toBeNull();
});
test("notebook mistakes and their question share one queue item, and grading updates both schedules", () => {
  const records = {
    ...captureMistake({}, card, "quiz", "Wrong", now),
    ...questionReviewRecord(scheduleQuestion(card.id, null, false, now)),
  };
  const queue = buildReviewQueue(records, [card], day(now));
  expect(queue).toHaveLength(1);
  expect(queue[0].kind).toBe("mistake");
  const changes = gradeReview(queue[0], records, true, now);
  expect(Object.keys(changes).sort()).toEqual([
    "practice/mistake/card-closures:0",
    "practice/review/closures:0",
  ]);
  expect(
    buildReviewQueue({ ...records, ...changes }, [card], day(now)).filter(
      (item) => item.due <= day(now),
    ),
  ).toHaveLength(0);
});
test("existing answered sessions seed reviews, unseen and unknown cards are not invented", () => {
  const records = {
    "practice/session/all:quiz": {
      results: { "closures:0": false, "unknown:0": true },
    },
  };
  const queue = buildReviewQueue(records, [card], day(now));
  expect(queue.map((item) => item.id)).toEqual(["question:closures:0"]);
  expect(buildReviewQueue({}, [card], day(now))).toHaveLength(0);
});
test("future reviews are not gradeable and weak confidence only breaks due-date ties", () => {
  const other = { ...card, id: "promises:0", topicSlug: "promises" };
  const records = {
    "practice/session/all:quiz": {
      results: { "closures:0": true, "promises:0": true },
    },
    ...confidenceRecord("promises", "learning", now),
  };
  expect(buildReviewQueue(records, [card, other], day(now))[0].cardId).toBe(
    "promises:0",
  );
  const futureRecords = questionReviewRecord(
    scheduleQuestion(card.id, null, true, now),
  );
  const future = buildReviewQueue(futureRecords, [card], day(now))[0];
  expect(gradeReview(future, futureRecords, false, now)).toEqual({});
});

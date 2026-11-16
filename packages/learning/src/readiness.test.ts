import { expect, test } from "bun:test";
import type { Json } from "@trailbook/sync";
import { buildReadiness } from "./readiness";
import { preparationRecords } from "./preparation-records";
import type { Evidence } from "./preparation";
import { newMistake, mistakeRecord } from "./mistakes";
import {
  createInterview,
  transitionInterview,
  interviewRecord,
  answerKey,
} from "./interviews";
const today = "2026-11-16";
const topics = [
  { slug: "closures", title: "Closures", category: "javascript" },
  { slug: "effects", title: "Effects", category: "react" },
];
const categories = [
  { id: "javascript", name: "JavaScript" },
  { id: "react", name: "React" },
];
const cards = Array.from({ length: 6 }, (_, i) => ({
  id: `q${i}`,
  question: `Explain ${i}`,
  answer: `Answer ${i}`,
  topicSlug: i % 2 ? "effects" : "closures",
  topicTitle: i % 2 ? "Effects" : "Closures",
  category: i % 2 ? "react" : "javascript",
  options: [],
  correctId: "",
}));
function entry(
  id: string,
  date: string,
  patch: Partial<Evidence> = {},
): Evidence {
  return {
    id,
    date,
    kind: "dsa",
    title: `Attempt ${id}`,
    independent: true,
    notes: "",
    reviews: [],
    completedReviews: [],
    ...patch,
  };
}
function mock(id: string, date: string) {
  const now = new Date(`${date}T12:00:00`).getTime();
  return {
    ...transitionInterview(
      createInterview("same-seed", 15, "all", cards, now - 60000),
      "finish",
      now,
    ),
    id,
  };
}
test("weekly activity uses local calendar boundaries, excludes future records, and deduplicates active days", () => {
  const records = {
    ...preparationRecords({
      version: 1,
      entries: [
        entry("start", "2026-11-10"),
        entry("middle", "2026-11-14"),
        entry("today", today),
        entry("previous", "2026-11-09"),
        entry("future", "2026-11-17"),
      ],
      days: {
        "2026-11-11": { routine: "short", completed: ["recall", "recall"] },
        "2026-11-14": { routine: "short", completed: ["dsa"] },
      },
    }),
    ...interviewRecord(mock("current", "2026-11-15")),
    ...interviewRecord(mock("future", "2026-11-17")),
    "reading/read/closures": true,
    "reading/read/not-a-lesson": true,
  };
  const d = buildReadiness(records, topics, categories, today);
  expect(d).toMatchObject({
    start: "2026-11-10",
    previousStart: "2026-11-03",
    previousEnd: "2026-11-09",
    logs: 3,
    previousLogs: 1,
    mocks: 1,
    activeDays: 5,
    read: 1,
    total: 2,
    independentAttempts: 3,
  });
  expect(d.days.find((d) => d.date === "2026-11-11")?.tasks).toBe(1);
  expect(d.days).toHaveLength(7);
  expect(d.completedMocks).toBe(1);
});
test("overdue reviews combine open mistakes and outstanding journal dates without resurrecting completed work", () => {
  const base = {
    ...newMistake("overdue"),
    question: "Closure question",
    answer: "Answer",
    topicSlug: "closures",
    topicTitle: "Closures",
    category: "javascript",
    due: "2026-11-12",
  };
  const records = {
    ...mistakeRecord(base),
    ...mistakeRecord({ ...base, id: "today", due: today }),
    ...mistakeRecord({ ...base, id: "mastered", status: "mastered" }),
    ...preparationRecords({
      version: 1,
      entries: [
        entry("review", "2026-11-10", {
          reviews: ["2026-11-12", "2026-11-15", "2026-11-20"],
          completedReviews: ["2026-11-12"],
        }),
        entry("future", "2026-11-17", { reviews: ["2026-11-14"] }),
      ],
      days: {},
    }),
  };
  const d = buildReadiness(records, topics, categories, today);
  expect(d).toMatchObject({
    overdue: 2,
    dueToday: 1,
    openMistakes: 2,
    masteredMistakes: 1,
  });
  expect(d.reviews).toHaveLength(3);
  expect(d.reviews.find((r) => r.id.startsWith("evidence"))?.target).toBe(
    "journal",
  );
  expect(d.actions[0].target).toBe("mistakes");
  expect(d.weakTopics[0]).toMatchObject({
    slug: "closures",
    mistakes: 2,
    overdue: 1,
  });
});
test("latest rated attempt clears an older mock weakness while unrated answers and zero scores stay distinct", () => {
  const older = mock("older", "2026-11-12"),
    newer = mock("newer", "2026-11-16"),
    prompt = older.prompts[0];
  const records: Record<string, Json> = {
    ...interviewRecord(older),
    ...interviewRecord(newer),
    [answerKey(older.id, prompt.id)]: { text: "", rating: 0, reflection: "" },
  };
  let d = buildReadiness(records, topics, categories, today);
  expect(d.trend[0].score).toBe(0);
  expect(d.trend[1].score).toBeNull();
  expect(d.weakTopics[0].lowRatings).toBe(1);
  records[answerKey(newer.id, prompt.id)] = {
    text: "",
    rating: 3,
    reflection: "",
  };
  d = buildReadiness(records, topics, categories, today);
  expect(d.weakTopics).toHaveLength(0);
});
test("behavioral weaknesses open the source assessment, and old assessments do not stay weak forever", () => {
  const s = mock("behavior", "2026-11-15"),
    prompt = s.prompts.find((p) => p.kind === "behavioral")!;
  const records = {
    ...interviewRecord(s),
    [answerKey(s.id, prompt.id)]: { text: "", rating: 1, reflection: "" },
  };
  const d = buildReadiness(records, topics, categories, today);
  expect(d.weakTopics[0]).toMatchObject({
    title: "Behavioral stories",
    slug: "",
    sessionId: s.id,
  });
  expect(d.actions.find((a) => a.id === "weak")).toMatchObject({
    target: "interviews",
    sessionId: s.id,
  });
  expect(
    buildReadiness(records, topics, categories, "2026-12-16").weakTopics,
  ).toHaveLength(0);
});
test("an empty or damaged history gives practical next steps without invented readiness scores", () => {
  const d = buildReadiness(
    {
      "practice/interview/broken": { invalid: true },
      "practice/mistake/removed": null,
    },
    topics,
    categories,
    today,
  );
  expect(d).toMatchObject({
    activeDays: 0,
    logs: 0,
    mocks: 0,
    read: 0,
    hasEvidence: false,
  });
  expect(d.trend).toEqual([]);
  expect(d.weakTopics).toEqual([]);
  expect(d.actions).toHaveLength(3);
  expect(new Set(d.actions.map((a) => a.id)).size).toBe(3);
});
test("the seven-day window crosses month and year boundaries correctly", () => {
  const d = buildReadiness({}, topics, categories, "2027-01-03");
  expect(d.start).toBe("2026-12-28");
  expect(d.days[6].date).toBe("2027-01-03");
  expect(d.previousEnd).toBe("2026-12-27");
});

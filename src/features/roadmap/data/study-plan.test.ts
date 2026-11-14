import { expect, test } from "vitest";
import { studyWeeks } from "./study-plan";
import {
  topics,
  topicBySlug,
  categories,
} from "@/features/topics/data/content";
import { learningPathById } from "@/features/learning-paths/data/learning-paths";
import { flashcards, quizCards } from "@/features/practice/data/practice-cards";
import { resolveRoute } from "@/app/routes";

test("every roadmap stage links to complete lessons, a learning path, and scoped practice", () => {
  expect(studyWeeks).toHaveLength(10);
  for (const week of studyWeeks) {
    expect(new Set(week.slugs).size).toBe(week.slugs.length);
    for (const slug of week.slugs)
      expect(topicBySlug.has(slug), `${week.id}: missing ${slug}`).toBe(true);
    expect(learningPathById.get(week.id)?.slugs).toEqual(week.slugs);
    expect(resolveRoute(`/practice/path/${week.id}`)).toMatchObject({
      kind: "practice",
      learningPath: { id: week.id },
    });
    expect(week.gate.length).toBeGreaterThan(30);
    expect(week.tasks.length).toBeGreaterThanOrEqual(3);
  }
  expect(resolveRoute("/roadmap").kind).toBe("roadmap");
});

test("every lesson is reachable by category and available in flashcards and quizzes", () => {
  expect(topics.length).toBeGreaterThanOrEqual(65);
  for (const topic of topics) {
    expect(categories.some((category) => category.id === topic.category)).toBe(
      true,
    );
    expect(
      flashcards.filter((card) => card.topicSlug === topic.slug),
    ).toHaveLength(topic.questions.length);
    expect(
      quizCards.some((card) => card.topicSlug === topic.slug),
      `Missing quiz for ${topic.slug}`,
    ).toBe(true);
    if (topic.origin === "study-plan" || topic.origin === "discussion") {
      expect(topic.planWeek).toBeGreaterThanOrEqual(1);
      expect(topic.planWeek).toBeLessThanOrEqual(9);
      expect(topic.planPages?.every((page) => page >= 1 && page <= 6)).toBe(
        true,
      );
    }
  }
});

test("discussion provenance and recorded progress remain distinct from assumed completion", () => {
  expect(topicBySlug.get("redirect-errors")).toMatchObject({
    origin: "discussion",
    discussionSource: { title: "Full Stack Interview prep" },
  });
  expect(topicBySlug.get("search-abort-races")).toMatchObject({
    origin: "discussion",
    discussionSource: { title: "React User Search App" },
  });
  expect(topicBySlug.get("promise-chains")?.planRecordedStatus).toBe("covered");
  expect(topicBySlug.get("two-sum-hashmap")?.planRecordedStatus).toBe(
    "pending",
  );
  expect(topicBySlug.get("heap-basics")?.optional).toBe(true);
  expect(topicBySlug.get("retrieval-evaluation")?.optional).toBe(true);
});

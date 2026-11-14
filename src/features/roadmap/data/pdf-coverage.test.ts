import { expect, test } from "vitest";
import audit from "../../../../docs/pdf-coverage-audit.json";
import { topics, topicBySlug } from "@/features/topics/data/content";
import { studyWeeks } from "./study-plan";
import { flashcards } from "@/features/practice/data/practice-cards";

test("the PDF audit maps all six source pages to reachable lessons", () => {
  expect(new Set(audit.coverage.map((item) => item.page)).size).toBe(6);
  for (const requirement of audit.coverage) {
    expect(requirement.slugs.length).toBeGreaterThan(0);
    for (const slug of requirement.slugs) {
      expect(topicBySlug.has(slug), `${requirement.requirement}: ${slug}`).toBe(
        true,
      );
    }
  }
  for (const slug of audit.newLessons) {
    expect(studyWeeks.some((week) => week.slugs.includes(slug))).toBe(true);
    expect(topicBySlug.get(slug)?.questions.length).toBeGreaterThanOrEqual(3);
    expect(flashcards.some((card) => card.topicSlug === slug)).toBe(true);
  }
  expect(topics).toHaveLength(74);
});

test("the depth audit includes completed examples and explicit practice limitations", () => {
  expect(topicBySlug.get("hashmap-practice")?.searchText).toContain(
    "function validanagram",
  );
  expect(topicBySlug.get("two-pointers")?.searchText).toContain(
    "function isasciipalindrome",
  );
  expect(topicBySlug.get("tree-bfs-dfs")?.searchText).toContain(
    "function preorder",
  );
  expect(
    topicBySlug.get("retrieval-evaluation")?.code.match(/question:/g),
  ).toHaveLength(10);
  expect(topicBySlug.get("dsa-40-problem-bank")?.searchText).toContain(
    "full solutions for every listed problem are not included",
  );
  expect(topicBySlug.get("ai-streaming")?.searchText).toContain(
    "function createstreamcontroller",
  );
});

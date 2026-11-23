import { expect, test } from "bun:test";
import { studyGuides } from "./study-guides";
import { topics } from "./native";
test("every lesson has specific practice, a reference and honest review metadata", () => {
  const slugs = new Set(topics.map((topic) => topic.slug));
  expect(Object.keys(studyGuides).sort()).toEqual([...slugs].sort());
  const tasks = new Set<string>();
  for (const topic of topics) {
    const guide = studyGuides[topic.slug];
    expect(topic.study).toEqual(guide);
    expect(guide.exercise.task.length).toBeGreaterThan(50);
    expect(tasks.has(guide.exercise.task)).toBe(false);
    tasks.add(guide.exercise.task);
    expect(guide.exercise.hint.length).toBeGreaterThan(30);
    expect(guide.exercise.edgeCases.length).toBeGreaterThan(40);
    expect(guide.exercise.solutionNotes.length).toBeGreaterThan(0);
    expect(topic.code.length).toBeGreaterThan(20);
    expect(guide.recall).toContain(topic.questions[0].question);
    const reviewed = new Set([
      "closures",
      "async-await",
      "event-loop",
      "binary-search",
      "discriminated-unions",
    ]);
    if (reviewed.has(topic.slug)) {
      expect(guide.review.reviewedOn).toBe("2026-11-23");
      expect(guide.review.versionNote).toContain("regression checks");
    } else expect(guide.review.reviewedOn).toBeNull();
    expect(guide.review.versionNote.length).toBeGreaterThan(35);
    for (const pre of guide.prerequisites) {
      expect(pre).not.toBe(topic.slug);
      expect(slugs.has(pre)).toBe(true);
    }
    if (guide.next) {
      expect(slugs.has(guide.next)).toBe(true);
      expect(guide.next).not.toBe(topic.slug);
    }
  }
});
test("prerequisite and next-lesson graphs have no cycles or backward next steps", () => {
  function visit(slug: string, stack: Set<string>) {
    expect(stack.has(slug)).toBe(false);
    const seen = new Set(stack).add(slug);
    for (const pre of studyGuides[slug].prerequisites) visit(pre, seen);
  }
  for (const slug of Object.keys(studyGuides)) {
    visit(slug, new Set());
    const chain = new Set<string>();
    let current: string | null = slug;
    while (current) {
      expect(chain.has(current)).toBe(false);
      chain.add(current);
      current = studyGuides[current].next;
    }
  }
  expect(studyGuides["zod-runtime-contracts"].next).toBe(
    "zod-transforms-refinements",
  );
});

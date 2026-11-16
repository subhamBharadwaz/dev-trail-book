import { expect, test } from "vitest";
import { learningPaths, getPathProgress } from "./learning-paths";
import { topicBySlug } from "@/features/topics/data/content";
import { flashcards, quizCards } from "@/features/practice/data/practice-cards";
import { resolveRoute } from "@/app/routes";
test("paths contain existing unique ordered topics and resume after completed ones", () => {
  for (const path of learningPaths) {
    expect(new Set(path.slugs).size).toBe(path.slugs.length);
    for (const slug of path.slugs) expect(topicBySlug.has(slug)).toBe(true);
    expect(getPathProgress(path, []).next?.slug).toBe(path.slugs[0]);
    expect(getPathProgress(path, [path.slugs[0]]).next?.slug).toBe(
      path.slugs[1],
    );
    const done = getPathProgress(path, path.slugs);
    expect(done.percent).toBe(100);
    expect(done.next).toBeUndefined();
    expect(resolveRoute(`/paths/${path.id}`).kind).toBe("learning-paths");
    expect(resolveRoute(`/practice/path/${path.id}`)).toMatchObject({
      kind: "practice",
      learningPath: { id: path.id },
    });
  }
  expect(resolveRoute("/paths/missing").kind).toBe("not-found");
  expect(resolveRoute("/practice/path/missing").kind).toBe("not-found");
});
test("practice cards have stable IDs and quizzes have one correct answer and unique options", () => {
  expect(new Set(flashcards.map((card) => card.id)).size).toBe(
    flashcards.length,
  );
  for (const card of quizCards) {
    expect(
      card.options.filter((option) => option.id === card.correctId),
    ).toHaveLength(1);
    expect(new Set(card.options.map((option) => option.text)).size).toBe(
      card.options.length,
    );
    expect(
      card.options.find((option) => option.id === card.correctId)?.text,
    ).toBe(card.answer);
  }
});

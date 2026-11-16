import { expect, test } from "bun:test";
import { readdir, readFile } from "node:fs/promises";
import { topics, filterTopics } from "./native";
test("every MDX lesson is bundled for mobile, with its full prose and highlighted code", async () => {
  const files = (await readdir(new URL("../lessons", import.meta.url))).filter(
    (file) => file.endsWith(".mdx"),
  );
  expect(topics.length).toBe(files.length);
  expect(new Set(topics.map((t) => t.slug)).size).toBe(topics.length);
  for (const topic of topics) {
    expect(topic.body.type).toBe("root");
    expect(topic.body.children?.length).toBeGreaterThan(0);
    expect(topic.questions.length).toBeGreaterThan(0);
  }
  const closure = topics.find((t) => t.slug === "closures")!;
  expect(JSON.stringify(closure.body)).toContain("tokens");
  expect(
    filterTopics("lexical binding").some((t) => t.slug === "closures"),
  ).toBe(true);
  const source = await readFile(
    new URL("../lessons/closures.mdx", import.meta.url),
    "utf8",
  );
  expect(source).toContain(closure.questions[0].answer);
});

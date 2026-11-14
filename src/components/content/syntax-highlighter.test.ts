import { expect, test } from "vitest";
import { highlightCode } from "./syntax-highlighter";
test("syntax highlighting preserves code, applies token colors, and handles unknown languages", async () => {
  const source = 'const greeting = "<hello>";';
  const lines = await highlightCode(source, "js");
  expect(
    lines
      .flat()
      .map((token) => token.content)
      .join(""),
  ).toBe(source);
  expect(
    new Set(lines.flat().map((token) => token.color)).size,
  ).toBeGreaterThan(1);
  expect(
    (await highlightCode(source, "not-a-language"))
      .flat()
      .map((token) => token.content)
      .join(""),
  ).toBe(source);
});

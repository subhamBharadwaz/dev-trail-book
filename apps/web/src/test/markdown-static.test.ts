import { expect, test } from "vitest";
import { markdown } from "../../astro/markdown";
test("static lesson rendering escapes payloads and rejects executable links", () => {
  expect(
    markdown({ type: "text", value: "<script>alert(1)</script>" }),
  ).toContain("&lt;script&gt;");
  expect(
    markdown({
      type: "link",
      url: "javascript:alert(1)",
      children: [{ type: "text", value: "bad" }],
    }),
  ).toBe("bad");
  expect(
    markdown({
      type: "link",
      url: "#/topic/closures",
      children: [{ type: "text", value: "Closures" }],
    }),
  ).toBe('<a href="/topic/closures">Closures</a>');
});

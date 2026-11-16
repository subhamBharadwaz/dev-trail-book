import { expect, test } from "vitest";
import { resolveRoute } from "./routes";
test("routes resolve known topics and categories and reject missing or extra segments", () => {
  expect(resolveRoute("/")).toMatchObject({ kind: "overview" });
  expect(resolveRoute("/topic/closures")).toMatchObject({
    kind: "topic",
    topic: { slug: "closures" },
  });
  expect(resolveRoute("/category/react")).toMatchObject({
    kind: "collection",
    category: { id: "react" },
  });
  expect(resolveRoute("/saved")).toMatchObject({
    kind: "collection",
    collection: "saved",
  });
  for (const path of [
    "/topic/missing",
    "/category/missing",
    "/topics//extra",
    "/topic/closures/extra",
    "/saved/missing",
  ])
    expect(resolveRoute(path).kind).toBe("not-found");
});

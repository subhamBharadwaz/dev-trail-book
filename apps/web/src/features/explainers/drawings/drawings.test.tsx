import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test } from "vitest";
import { ServerBoundaryDrawing } from "./server-boundary";
import { BoxModelDrawing } from "./box-model";
import { SqlRelationshipDrawing } from "./sql-relationship";
import { boxDimensions, leftJoinExample } from "./drawing-models";
import { TopicWalkthrough } from "../walkthrough";
import { visuals } from "../data/platform";

test("the browser zone contains only the public view model, not server-only fields", () => {
  render(<ServerBoundaryDrawing />);
  const server = screen.getByRole("region", { name: "Server zone" });
  const browser = screen.getByRole("region", { name: "Browser zone" });
  expect(server.textContent).toContain("ownerId");
  expect(server.textContent).toContain("audit");
  expect(server.textContent).toContain("Database credentials");
  expect(browser.textContent).not.toContain("ownerId");
  expect(browser.textContent).not.toContain("audit");
  expect(within(browser).getByLabelText("Public view model").textContent).toBe(
    '{ id: 42,\n  title: "Closures" }',
  );
});
test("the box model distinguishes declared width from padding, borders, and margins", () => {
  expect(boxDimensions(200, 16, 2, 16, "content-box")).toEqual({
    content: 200,
    borderBox: 236,
    outer: 268,
  });
  expect(boxDimensions(200, 16, 2, 16, "border-box")).toEqual({
    content: 164,
    borderBox: 200,
    outer: 232,
  });
  render(<BoxModelDrawing />);
  expect(screen.getByText("236 px")).toBeTruthy();
  expect(screen.getByText("200 px")).toBeTruthy();
  expect(screen.getByText("Margin")).toBeTruthy();
  expect(screen.getByText(/Schematic, not drawn to scale/)).toBeTruthy();
});
test("LEFT JOIN drawing preserves an unmatched note and counts its non-null children correctly", () => {
  const rows = leftJoinExample();
  expect(rows).toHaveLength(3);
  expect(rows.filter((row) => row.noteId === 1).map((row) => row.tag)).toEqual([
    "hooks",
    "state",
  ]);
  const unmatched = rows.filter((row) => row.noteId === 2);
  expect(unmatched).toHaveLength(1);
  expect(unmatched.filter((row) => row.tagId !== null)).toHaveLength(0);
  render(<SqlRelationshipDrawing />);
  const joined = screen.getByRole("table", { name: "Joined result · 3 rows" });
  expect(within(joined).getAllByRole("row")).toHaveLength(4);
  expect(within(joined).getByText("NULL")).toBeTruthy();
  expect(screen.getByRole("table", { name: "notes" })).toBeTruthy();
  expect(screen.getByRole("table", { name: "tags" })).toBeTruthy();
});
test("the existing SQL walkthrough can reveal the relationship diagram without losing the selected example", async () => {
  render(<TopicWalkthrough visual={visuals["sql-joins"]} />);
  const user = userEvent.setup(),
    agent = createAgent();
  for (const entry of agent
    .snapshot()
    .filter((item) => !item.offPage && item.component !== "more"))
    expect(entry.label).toBeTruthy();
  await user.click(
    screen.getByRole("button", { name: "Try example: LEFT JOIN" }),
  );
  await user.click(
    screen.getByRole("button", { name: "See the table relationship" }),
  );
  expect(
    screen.getByRole("table", { name: "Joined result · 3 rows" }),
  ).toBeTruthy();
  expect(
    screen
      .getByRole("button", { name: "Try example: LEFT JOIN" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
  await user.click(
    screen.getByRole("button", { name: "See the table relationship" }),
  );
  expect(
    screen.queryByRole("table", { name: "Joined result · 3 rows" }),
  ).toBeNull();
});

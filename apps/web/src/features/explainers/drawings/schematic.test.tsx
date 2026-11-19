import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { visuals } from "../data/diagrams";
import { TopicDiagram } from "../diagram";
import { SchematicDrawing } from "./schematic";
import type { Schematic } from "./schematic-types";

test("every static lesson has a named drawing; none falls back to text-node cards", () => {
  expect(Object.keys(visuals)).toHaveLength(55);
  for (const [slug, visual] of Object.entries(visuals)) {
    expect(visual.drawing, slug).toBeTruthy();
    const view = render(<TopicDiagram visual={visual} />);
    const figures = screen.getAllByRole("figure");
    expect(figures.length, slug).toBeGreaterThan(0);
    for (const figure of figures)
      expect(
        figure.getAttribute("aria-label") ||
          figure.getAttribute("aria-labelledby"),
        slug,
      ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "A concrete example" }),
      slug,
    ).toBeTruthy();
    expect(
      screen.queryByRole("list", { name: "Concept diagram" }),
      slug,
    ).toBeNull();
    expect(screen.queryByRole("button"), slug).toBeNull();
    view.unmount();
  }
});
test("sequence arrows reference existing distinct actors and recurring cycles have four stages", () => {
  for (const visual of Object.values(visuals)) {
    if (typeof visual.drawing !== "object") continue;
    const spec: Schematic = visual.drawing;
    if (spec.kind === "sequence") {
      expect([2, 3]).toContain(spec.actors.length);
      expect(new Set(spec.actors).size).toBe(spec.actors.length);
      for (const message of spec.messages) {
        expect(message.from).toBeGreaterThanOrEqual(0);
        expect(message.from).toBeLessThan(spec.actors.length);
        expect(message.to).toBeGreaterThanOrEqual(0);
        expect(message.to).toBeLessThan(spec.actors.length);
        expect(message.from).not.toBe(message.to);
        expect(message.label.length).toBeGreaterThan(5);
      }
    }
    if (spec.kind === "cycle") expect(spec.stages).toHaveLength(4);
    if (spec.kind === "funnel") {
      expect(
        Math.max(...spec.stages.map((stage) => stage.count)),
      ).toBeGreaterThan(0);
      for (const stage of spec.stages)
        expect(stage.count).toBeGreaterThanOrEqual(0);
    }
  }
});
test("the pagination picture shows why an insertion repeats an offset record but not the cursor page", () => {
  render(
    <SchematicDrawing spec={visuals["rest-pagination"].drawing as Schematic} />,
  );
  expect(screen.getAllByText("note 8")).toHaveLength(2);
  expect(screen.getByText("cursor")).toBeTruthy();
  expect(screen.getByRole("heading", { name: "Cursor: id < 8" })).toBeTruthy();
  expect(screen.getByText("8 repeats: positions shifted.")).toBeTruthy();
});
test("growth bars label the mathematical functions and independent row scales", () => {
  render(
    <SchematicDrawing
      spec={visuals["dsa-method-complexity"].drawing as Schematic}
    />,
  );
  for (const value of ["4 → 5", "16 → 32", "64 → 160", "256 → 1024"])
    expect(screen.getByText(value)).toBeTruthy();
  expect(screen.getByText(/Each pair of bars uses its own scale/)).toBeTruthy();
});
test("hostile-looking examples are inert diagram text, not executable markup", () => {
  const view = render(
    <SchematicDrawing spec={visuals["web-security"].drawing as Schematic} />,
  );
  expect(screen.getByText("Untrusted text: <script>…</script>")).toBeTruthy();
  expect(view.container.querySelector("script")).toBeNull();
  expect(
    screen.getByText("Owner/tenant constraint refuses access"),
  ).toBeTruthy();
});
test("waterfall comparison distinguishes waiting duration from a measured performance claim", () => {
  render(
    <SchematicDrawing
      spec={visuals["performance-investigation"].drawing as Schematic}
    />,
  );
  expect(screen.getByText("Waiting ≈ 600 ms + overhead")).toBeTruthy();
  expect(screen.getByText("Waiting ≈ 300 ms + overhead")).toBeTruthy();
  expect(
    screen.getByText(/Each read takes an illustrative 300 ms/),
  ).toBeTruthy();
});

test("state alternatives attach independently to the root rather than implying transitions", () => {
  render(
    <SchematicDrawing
      spec={visuals["discriminated-unions"].drawing as Schematic}
    />,
  );
  const outcomes = screen.getByRole("list", { name: "Independent outcomes" });
  expect(outcomes.children).toHaveLength(4);
  for (const status of ["idle", "loading", "success", "error"])
    expect(screen.getByRole("heading", { name: status })).toBeTruthy();
});

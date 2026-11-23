import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { ReadingProvider } from "@/app/reading-provider";
import { RoadmapPage } from "@/pages/roadmap-page";
test("newcomers can start with frontend foundations without a document or calendar", () => {
  render(
    <ReadingProvider>
      <RoadmapPage />
    </ReadingProvider>,
  );
  expect(
    screen.getByRole("heading", { name: "Your learning roadmap." }),
  ).toBeTruthy();
  expect(
    screen
      .getByRole("link", { name: "Start with the foundations" })
      .getAttribute("href"),
  ).toBe("/paths/plan-week-1");
  expect(
    screen.getByRole("heading", { name: "JavaScript essentials" }),
  ).toBeTruthy();
  expect(
    screen.getByRole("heading", { name: "Beyond the frontend" }),
  ).toBeTruthy();
  expect(screen.getAllByText("OPTIONAL EXTENSION")).toHaveLength(2);
  expect(
    screen.getAllByRole("link", { name: "Practice these topics →" }),
  ).toHaveLength(10);
  expect(document.body.textContent).not.toMatch(
    /PDF|December 2026|original schedule|recovered transcripts/i,
  );
  expect(JSON.parse(localStorage.getItem("trailbook:read") || "[]")).toEqual(
    [],
  );
});

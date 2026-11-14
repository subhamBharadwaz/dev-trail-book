import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { ReadingProvider } from "@/app/reading-provider";
import { RoadmapPage } from "@/pages/roadmap-page";

test("the roadmap exposes source limits and lets readers open future stages", async () => {
  const user = userEvent.setup();
  render(
    <ReadingProvider>
      <RoadmapPage />
    </ReadingProvider>,
  );
  expect(
    screen.getByRole("heading", { name: "Your study roadmap." }),
  ).toBeTruthy();
  expect(screen.getByText(/Older unseen chat turns/)).toBeTruthy();
  expect(screen.getByText(/0 marked as read/)).toBeTruthy();
  await user.click(
    screen.getByRole("button", { name: /Full-stack reliability/ }),
  );
  expect(
    screen.getByRole("link", { name: "SQL joins & relationship cardinality" }),
  ).toBeTruthy();
  expect(
    screen
      .getByRole("link", { name: "Practice these topics →" })
      .getAttribute("href"),
  ).toBe("#/practice/path/plan-week-4");
  expect(JSON.parse(localStorage.getItem("trailbook:read") || "[]")).toEqual(
    [],
  );
});

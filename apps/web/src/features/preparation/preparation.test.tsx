import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test } from "vitest";
import { TodayPage } from "@/pages/today-page";
import { EvidencePage } from "@/pages/evidence-page";
import { addDays, dateKey } from "./data/preparation";
const agent = createAgent();
test("daily fallback and keyboard checklist survive a remount", async () => {
  const user = userEvent.setup();
  const view = render(<TodayPage />);
  await user.click(screen.getByRole("radio", { name: "20 minutes" }));
  expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  const checkbox = screen.getByRole("checkbox", {
    name: "Complete: Explain one answer aloud",
  });
  checkbox.focus();
  await user.keyboard(" ");
  expect(checkbox.getAttribute("aria-checked")).toBe("true");
  view.unmount();
  render(<TodayPage />);
  expect(
    screen
      .getByRole("radio", { name: "20 minutes" })
      .getAttribute("aria-checked"),
  ).toBe("true");
  expect(
    screen
      .getByRole("checkbox", { name: "Complete: Explain one answer aloud" })
      .getAttribute("aria-checked"),
  ).toBe("true");
});
test("an agent can log evidence, schedule reviews, and undo removing an attempt", async () => {
  const user = userEvent.setup();
  render(<EvidencePage />);
  const components = agent
    .snapshot()
    .filter((entry) => !entry.offPage && entry.component !== "more");
  for (const entry of components)
    expect(entry.label, `${entry.component} needs a name`).toBeTruthy();
  for (const label of [
    "Practice type",
    "Attempt date",
    "Attempt title",
    "Evidence and next repair",
    "Save evidence",
  ])
    expect(components.map((entry) => entry.label)).toContain(label);
  await act(async () => {
    const result = await agent.act({
      steps: [
        {
          ref: "Attempt title",
          action: "setValue",
          args: ["Two Sum independently"],
        },
        {
          ref: "Evidence and next repair",
          action: "setValue",
          args: ["Explained O(n), duplicates and no-pair case."],
        },
      ],
    });
    expect(result.ok, result.error?.message).toBe(true);
  });
  await user.click(screen.getByRole("button", { name: "Save evidence" }));
  expect(
    screen.getByRole("heading", { name: "Two Sum independently" }),
  ).toBeTruthy();
  const stored = JSON.parse(localStorage.getItem("trailbook:preparation:v1")!);
  expect(stored.entries[0].reviews).toEqual([
    addDays(dateKey(), 2),
    addDays(dateKey(), 7),
  ]);
  expect(stored.entries[0].independent).toBe(false);
  await user.click(
    screen.getByRole("button", {
      name: "Remove attempt: Two Sum independently",
    }),
  );
  expect(
    screen.queryByRole("heading", { name: "Two Sum independently" }),
  ).toBeNull();
  await user.click(screen.getByRole("button", { name: "Undo removal" }));
  await waitFor(() =>
    expect(
      screen.getByRole("heading", { name: "Two Sum independently" }),
    ).toBeTruthy(),
  );
});

test("due reviews can be completed while future reviews stay scheduled", async () => {
  const user = userEvent.setup();
  const today = dateKey();
  localStorage.setItem(
    "trailbook:preparation:v1",
    JSON.stringify({
      version: 1,
      days: {},
      entries: [
        {
          id: "old-attempt",
          title: "Binary search boundary repair",
          kind: "dsa",
          date: addDays(today, -2),
          independent: false,
          notes: "Check inclusive upper bound",
          reviews: [today, addDays(today, 5)],
          completedReviews: [],
        },
      ],
    }),
  );
  render(<EvidencePage />);
  expect(
    screen.getByRole<HTMLButtonElement>("button", {
      name: `Review scheduled · ${addDays(today, 5)}`,
    }).disabled,
  ).toBe(true);
  await user.click(screen.getByRole("button", { name: /Due reviews/ }));
  await user.click(
    screen.getByRole("button", { name: `Mark reviewed · ${today}` }),
  );
  expect(
    screen.getByRole("heading", { name: "Nothing waiting for a re-solve." }),
  ).toBeTruthy();
  await user.click(screen.getByRole("button", { name: /All attempts/ }));
  expect(
    screen
      .getByRole("button", { name: `Reviewed · ${today}` })
      .getAttribute("aria-pressed"),
  ).toBe("true");
});

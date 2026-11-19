import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { beforeEach, expect, test } from "vitest";
import { ReadinessPage } from "@/pages/readiness-page";
import { ReadingProvider } from "@/app/reading-provider";
import { guestStudy } from "@/features/account/hooks/use-study-records";
import { progress } from "@/features/account/data/progress-store";
import { preparationRecords } from "@trailbook/learning/preparation-records";
import {
  createInterview,
  transitionInterview,
  interviewRecord,
  currentInterviewKey,
  answerKey,
} from "@trailbook/learning/interviews";
import { flashcards } from "@/features/practice/data/practice-cards";
import { newMistake, mistakeRecord, day } from "@trailbook/learning/mistakes";
let counter = 0;
beforeEach(() => {
  progress.activate(null);
  guestStudy.activate(`readiness-test-${++counter}`);
});
const renderPage = () =>
  render(
    <ReadingProvider>
      <ReadinessPage />
    </ReadingProvider>,
  );
test("empty states and named next-action controls work through the agent bridge", async () => {
  const agent = createAgent();
  renderPage();
  expect(
    screen.getByRole("heading", { name: "Know where to put your next hour." }),
  ).toBeTruthy();
  expect(screen.getByText(/Your baseline starts/)).toBeTruthy();
  expect(screen.queryByText("Loading your account records…")).toBeNull();
  const controls = agent
    .snapshot()
    .filter((e) => !e.offPage && e.component !== "more");
  for (const control of controls) expect(control.label).toBeTruthy();
  await act(async () => {
    const result = await agent.act({
      steps: [
        { ref: "Start: Take a 15-minute mock interview", action: "press" },
      ],
    });
    expect(result.ok, result.error?.message).toBe(true);
  });
  expect(location.hash).toBe("#/interviews");
});
test("legacy guest journal and reading data are included alongside new feature records", () => {
  const date = day();
  localStorage.setItem("trailbook:read", JSON.stringify(["closures"]));
  localStorage.setItem(
    "trailbook:preparation:v1",
    JSON.stringify({
      version: 1,
      entries: [
        {
          id: "legacy",
          title: "Legacy coding attempt",
          kind: "dsa",
          date,
          independent: true,
          notes: "",
          reviews: [date],
          completedReviews: [],
        },
      ],
      days: {},
    }),
  );
  guestStudy.write(
    mistakeRecord({
      ...newMistake("guest"),
      question: "Personal gap",
      answer: "Answer",
      due: date,
    }),
  );
  renderPage();
  expect(
    screen.getByRole("heading", { name: "Legacy coding attempt" }),
  ).toBeTruthy();
  expect(screen.getByText(/1 of 84 lessons marked read/)).toBeTruthy();
  expect(
    screen.getByText(/1 independent coding\/build attempts logged/),
  ).toBeTruthy();
});
test("account changes update the dashboard and opening a mock selects the correct session", async () => {
  const user = userEvent.setup();
  progress.activate("alice-readiness");
  const now = Date.now(),
    s = transitionInterview(
      createInterview("dashboard-mock", 15, "react", flashcards, now - 60000),
      "finish",
      now,
    );
  progress.write({
    ...interviewRecord(s),
    [answerKey(s.id, s.prompts[0].id)]: {
      text: "Answer",
      rating: 0,
      reflection: "Gap",
    },
    ...preparationRecords({ version: 1, entries: [], days: {} }),
  });
  const view = renderPage();
  expect(screen.getByText("0% self-rated")).toBeTruthy();
  await user.click(
    screen.getByRole("button", { name: `Review mock 1 from ${day()}` }),
  );
  expect(location.hash).toBe("#/interviews");
  expect(progress.values()[currentInterviewKey]).toBe(s.id);
  act(() => progress.activate("bob-readiness"));
  expect(screen.queryByText("0% self-rated")).toBeNull();
  expect(screen.getByText(/Your baseline starts/)).toBeTruthy();
  view.unmount();
  progress.activate(null);
});

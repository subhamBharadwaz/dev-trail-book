import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { InterviewsPage } from "@/pages/interviews-page";
import { guestStudy } from "@/features/account/hooks/use-study-records";
import { progress } from "@/features/account/data/progress-store";
import { guestRecords } from "@/features/account/data/local-import";
import {
  interviewsFromRecords,
  getAnswer,
  getDebrief,
  interviewStats,
  currentInterviewKey,
} from "@trailbook/learning/interviews";
import { mistakesFromRecords } from "@trailbook/learning/mistakes";
let count = 0;
beforeEach(() => {
  progress.activate(null);
  guestStudy.activate(`mock-tests-${++count}`);
});
afterEach(() => vi.restoreAllMocks());
test("an agent can configure a mock, resume answers, assess honestly and save a gap", async () => {
  const user = userEvent.setup(),
    agent = createAgent();
  let view = render(<InterviewsPage />);
  const entries = agent
    .snapshot()
    .filter((e) => !e.offPage && e.component !== "more");
  for (const entry of entries) expect(entry.label).toBeTruthy();
  await act(async () => {
    const result = await agent.act({
      steps: [
        { ref: "Session length", action: "setValue", args: ["30"] },
        { ref: "Technical focus", action: "setValue", args: ["react"] },
        { ref: "Start mock interview", action: "press" },
      ],
    });
    expect(result.ok, result.error?.message).toBe(true);
  });
  const s = interviewsFromRecords(guestStudy.values())[0];
  expect(s.duration).toBe(30);
  expect(s.prompts).toHaveLength(7);
  expect(screen.queryByText(s.prompts[0].reference)).toBeNull();
  await user.type(
    screen.getByRole("textbox", { name: "Your answer or approach" }),
    "Explain the state owner and test the behavior.",
  );
  await user.click(screen.getByRole("button", { name: "Pause timer" }));
  expect(
    screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: "Your answer or approach",
    }).disabled,
  ).toBe(true);
  view.unmount();
  view = render(<InterviewsPage />);
  expect(
    screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: "Your answer or approach",
    }).value,
  ).toContain("state owner");
  await user.click(screen.getByRole("button", { name: "Resume timer" }));
  await user.click(screen.getByRole("button", { name: "Next question" }));
  expect(
    screen.getByRole("heading", { name: s.prompts[1].question }),
  ).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Previous question" }));
  await user.click(screen.getByRole("button", { name: "Finish session" }));
  await user.click(screen.getByRole("button", { name: "Keep working" }));
  expect(interviewsFromRecords(guestStudy.values())[0].state).toBe("running");
  await user.click(screen.getByRole("button", { name: "Finish session" }));
  await user.click(screen.getByRole("button", { name: "Finish and review" }));
  expect(screen.getByText(s.prompts[0].reference)).toBeTruthy();
  expect(
    screen.queryByRole("textbox", { name: "Your answer or approach" }),
  ).toBeNull();
  await user.click(screen.getByRole("radio", { name: "0 · Not yet" }));
  await user.type(
    screen.getByRole("textbox", {
      name: "What would I improve in this answer?",
    }),
    "Need a concrete example",
  );
  await user.click(
    screen.getByRole("button", { name: "Save this gap to mistake notebook" }),
  );
  expect(mistakesFromRecords(guestStudy.values())[0]).toMatchObject({
    source: "interview",
    explanation: "Need a concrete example",
  });
  expect(
    screen.getByRole<HTMLButtonElement>("button", {
      name: "Added to mistake notebook",
    }).disabled,
  ).toBe(true);
  await act(async () => {
    const result = await agent.act({
      steps: [
        {
          ref: "What went well?",
          action: "setValue",
          args: ["Clear structure"],
        },
        {
          ref: "One concrete next step",
          action: "setValue",
          args: ["Practice one example per concept"],
        },
      ],
    });
    expect(result.ok, result.error?.message).toBe(true);
  });
  expect(getDebrief(guestStudy.values(), s.id)).toEqual({
    strengths: "Clear structure",
    nextStep: "Practice one example per concept",
  });
  expect(
    interviewStats(
      interviewsFromRecords(guestStudy.values())[0],
      guestStudy.values(),
    ),
  ).toMatchObject({ rated: 1, score: 0 });
  expect(Object.keys(guestRecords())).toContain(`practice/interview/${s.id}`);
  await user.click(screen.getByRole("button", { name: "← All mock sessions" }));
  expect(
    screen.getByRole("heading", { name: "Your sessions (1)" }),
  ).toBeTruthy();
});
test("a backgrounded clock expires using wall time and preserves the last answer", async () => {
  let clock = Date.now();
  vi.spyOn(Date, "now").mockImplementation(() => clock);
  const user = userEvent.setup();
  render(<InterviewsPage />);
  await user.click(
    screen.getByRole("button", { name: "Start mock interview" }),
  );
  await user.type(
    screen.getByRole("textbox", { name: "Your answer or approach" }),
    "Saved before expiry",
  );
  const s = interviewsFromRecords(guestStudy.values())[0];
  clock += 15 * 60_000;
  act(() => window.dispatchEvent(new Event("focus")));
  expect(screen.getByRole("timer").textContent).toBe("00:00");
  expect(
    screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: "Your answer or approach",
    }).disabled,
  ).toBe(true);
  expect(getAnswer(guestStudy.values(), s.id, s.prompts[0].id).text).toBe(
    "Saved before expiry",
  );
  await user.click(screen.getByRole("button", { name: "Review my session" }));
  await user.click(screen.getByRole("button", { name: "Finish and review" }));
  expect(screen.getByText("Saved before expiry")).toBeTruthy();
});
test("switching accounts hides another account's interview drafts", async () => {
  const user = userEvent.setup();
  progress.activate("alice-mock");
  const view = render(<InterviewsPage />);
  await user.click(
    screen.getByRole("button", { name: "Start mock interview" }),
  );
  const id = progress.values()[currentInterviewKey];
  await user.type(
    screen.getByRole("textbox", { name: "Your answer or approach" }),
    "Alice private draft",
  );
  act(() => progress.activate("bob-mock"));
  expect(
    screen.getByRole("button", { name: "Start mock interview" }),
  ).toBeTruthy();
  expect(screen.queryByDisplayValue("Alice private draft")).toBeNull();
  act(() => progress.activate("alice-mock"));
  expect(progress.values()[currentInterviewKey]).toBe(id);
  expect(
    screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: "Your answer or approach",
    }).value,
  ).toBe("Alice private draft");
  view.unmount();
  progress.activate(null);
});

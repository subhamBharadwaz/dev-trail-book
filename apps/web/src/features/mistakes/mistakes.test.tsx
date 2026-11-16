import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { beforeEach, expect, test } from "vitest";
import { MistakesPage } from "@/pages/mistakes-page";
import { PracticeSession } from "@/features/practice/components/practice-session";
import { quizCards } from "@/features/practice/data/practice-cards";
import { progress } from "@/features/account/data/progress-store";
import { guestNotebook } from "./use-mistakes";
import {
  captureMistake,
  mistakesFromRecords,
  mistakeRecord,
  newMistake,
} from "@trailbook/learning/mistakes";
let counter = 0;
beforeEach(() => {
  progress.activate(null);
  guestNotebook.activate(`notebook-test-${++counter}`);
});
test("a wrong answer creates a persistent notebook entry with the selected answer", async () => {
  const user = userEvent.setup();
  const card = quizCards[0];
  const view = render(
    <PracticeSession cards={[card]} mode="quiz" scope="notebook-test" />,
  );
  const wrong = card.options.find((o) => o.id !== card.correctId)!;
  await user.click(screen.getByText(wrong.text));
  await user.click(screen.getByRole("button", { name: "Check answer" }));
  view.unmount();
  render(<MistakesPage />);
  expect(screen.getByRole("heading", { name: card.question })).toBeTruthy();
  expect(screen.queryByText(card.answer)).toBeNull();
  await user.click(
    screen.getByRole("button", { name: `Reveal answer for ${card.question}` }),
  );
  expect(screen.getByText(card.answer)).toBeTruthy();
  expect(screen.getByText(wrong.text)).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Recalled it" }));
  expect(mistakesFromRecords(guestNotebook.values())[0].streak).toBe(1);
  expect(screen.queryByRole("heading", { name: card.question })).toBeNull();
  await user.click(screen.getByRole("tab", { name: "Learning" }));
  expect(screen.getByRole("heading", { name: card.question })).toBeTruthy();
});
test("an agent can capture a personal mistake and edit its reflection", async () => {
  const user = userEvent.setup();
  const agent = createAgent();
  render(<MistakesPage />);
  await act(async () => {
    const result = await agent.act({
      steps: [{ ref: "Add a personal mistake", action: "press" }],
    });
    expect(result.ok, result.error?.message).toBe(true);
  });
  const entries = agent
    .snapshot()
    .filter((e) => !e.offPage && e.component !== "more");
  for (const entry of entries) expect(entry.label).toBeTruthy();
  expect(entries.some((e) => e.label === "Question or problem")).toBe(true);
  await act(async () => {
    const result = await agent.act({
      steps: [
        {
          ref: "Question or problem",
          action: "setValue",
          args: ["Why did my request race?"],
        },
        {
          ref: "Correct answer",
          action: "setValue",
          args: ["Cancel or ignore stale responses"],
        },
      ],
    });
    expect(result.ok, result.error?.message).toBe(true);
  });
  await user.type(
    screen.getByRole("textbox", {
      name: "Why I missed it / what I’ll do differently",
    }),
    "I forgot cleanup",
  );
  await user.click(screen.getByRole("button", { name: "Save reflection" }));
  expect(mistakesFromRecords(guestNotebook.values())[0].explanation).toBe(
    "I forgot cleanup",
  );
  await user.click(
    screen.getByRole("button", {
      name: "Edit reflection for Why did my request race?",
    }),
  );
  await user.click(screen.getByRole("button", { name: "Cancel editing" }));
  expect(screen.queryByRole("button", { name: "Save reflection" })).toBeNull();
});
test("account notebooks remain isolated and restored records can be reviewed", () => {
  progress.activate("alice-notebook");
  progress.write(captureMistake({}, quizCards[0], "quiz", "Wrong"));
  const view = render(<MistakesPage />);
  expect(
    screen.getByRole("heading", { name: quizCards[0].question }),
  ).toBeTruthy();
  act(() => progress.activate("bob-notebook"));
  expect(
    screen.queryByRole("heading", { name: quizCards[0].question }),
  ).toBeNull();
  const m = {
    ...newMistake("remote"),
    question: "Remote question",
    answer: "Remote answer",
  };
  act(() =>
    progress.receive([
      {
        key: "practice/mistake/remote",
        value: mistakeRecord(m)["practice/mistake/remote"],
        revision: 1,
      },
    ]),
  );
  expect(screen.getByRole("heading", { name: "Remote question" })).toBeTruthy();
  view.unmount();
  progress.activate(null);
});

import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test } from "vitest";
import { PracticeSession } from "./practice-session";
import { flashcards, quizCards } from "../data/practice-cards";
const agent = createAgent();

test("flashcards require recall, record the session, and revisit only missed cards", async () => {
  const user = userEvent.setup();
  const cards = flashcards.slice(0, 2);
  render(<PracticeSession cards={cards} mode="flashcards" scope="test" />);
  expect(screen.queryByText(cards[0].answer)).toBeNull();
  expect(screen.queryByRole("button", { name: "Got it" })).toBeNull();
  await user.click(screen.getByRole("button", { name: "Reveal answer" }));
  expect(screen.getByText(cards[0].answer)).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Needs another look" }));
  expect(screen.getByRole("heading", { name: cards[1].question })).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Reveal answer" }));
  await user.click(screen.getByRole("button", { name: "Got it" }));
  expect(
    screen.getByRole("heading", { name: "1 of 2 remembered" }),
  ).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Review missed (1)" }));
  expect(screen.getByRole("heading", { name: cards[0].question })).toBeTruthy();
  expect(screen.getByText("FLASHCARD 1 / 1")).toBeTruthy();
});

test("quiz feedback locks the answer and retrying missed questions produces a new score", async () => {
  const user = userEvent.setup();
  const card = quizCards[0];
  render(<PracticeSession cards={[card]} mode="quiz" scope="test" />);
  expect(
    screen.getByRole<HTMLButtonElement>("button", { name: "Check answer" })
      .disabled,
  ).toBe(true);
  const wrong = card.options.find((option) => option.id !== card.correctId)!;
  await user.click(screen.getByText(wrong.text));
  await user.click(screen.getByRole("button", { name: "Check answer" }));
  expect(screen.getByText("A detail to revisit.")).toBeTruthy();
  expect(
    screen
      .getAllByRole("radio")
      .every(
        (radio) =>
          radio.getAttribute("aria-disabled") === "true" ||
          (radio as HTMLInputElement).disabled,
      ),
  ).toBe(true);
  await user.click(screen.getByRole("button", { name: "See results" }));
  expect(screen.getByRole("heading", { name: "0 of 1 correct" })).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Review missed (1)" }));
  await user.click(
    screen.getByText(
      card.options.find((option) => option.id === card.correctId)!.text,
    ),
  );
  await user.click(screen.getByRole("button", { name: "Check answer" }));
  expect(screen.getByText("That’s right.")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "See results" }));
  expect(screen.getByRole("heading", { name: "1 of 1 correct" })).toBeTruthy();
});

test("checked quiz answers and next-question progress survive a remount", async () => {
  const user = userEvent.setup();
  const cards = quizCards.slice(0, 2);
  let view = render(
    <PracticeSession cards={cards} mode="quiz" scope="resume" />,
  );
  await user.click(
    screen.getByText(
      cards[0].options.find((option) => option.id === cards[0].correctId)!.text,
    ),
  );
  await user.click(screen.getByRole("button", { name: "Check answer" }));
  view.unmount();
  view = render(<PracticeSession cards={cards} mode="quiz" scope="resume" />);
  expect(screen.getByText("That’s right.")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Next question" }));
  view.unmount();
  render(<PracticeSession cards={cards} mode="quiz" scope="resume" />);
  expect(screen.getByRole("heading", { name: cards[1].question })).toBeTruthy();
  expect(screen.getByText("1 correct")).toBeTruthy();
});

test("an agent can discover practice controls and select an answer", async () => {
  const card = quizCards[0];
  render(<PracticeSession cards={[card]} mode="quiz" scope="agent" />);
  const entries = agent
    .snapshot()
    .filter((entry) => !entry.offPage && entry.component !== "more");
  console.log("Practice controls:", JSON.stringify(entries));
  for (const entry of entries)
    expect(entry.label, `${entry.component} needs a name`).toBeTruthy();
  const group = entries.find(
    (entry) => entry.actions.includes("setValue") && entry.items?.length === 3,
  )!;
  expect(group).toBeTruthy();
  const option = group.items![0];
  await act(async () => {
    const result = await agent.act({
      steps: [{ ref: group.ref, action: "setValue", args: [option.value] }],
    });
    expect(result.ok, result.error?.message).toBe(true);
  });
  expect(
    screen.getByRole<HTMLButtonElement>("button", { name: "Check answer" })
      .disabled,
  ).toBe(false);
});

test("malformed saved sessions recover with the first question", () => {
  localStorage.setItem(
    "trailbook:practice:v1:broken:quiz",
    JSON.stringify({ version: 1, ids: ["missing"], index: -5, results: null }),
  );
  render(
    <PracticeSession
      cards={quizCards.slice(0, 1)}
      mode="quiz"
      scope="broken"
    />,
  );
  expect(
    screen.getByRole("heading", { name: quizCards[0].question }),
  ).toBeTruthy();
});

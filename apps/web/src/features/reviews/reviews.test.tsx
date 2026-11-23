import { createBackup } from "@trailbook/learning/backup";
import {
  scheduleQuestion,
  questionReviewRecord,
  buildReviewQueue,
} from "@trailbook/learning/reviews";
import { restoreBackup } from "@/features/backup/backup-storage";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test } from "vitest";
import { createAgent } from "@ui-sdk/react/agent";
import { ReviewPage } from "@/pages/review-page";
import { guestStudy } from "@/features/account/hooks/use-study-records";
import { progress } from "@/features/account/data/progress-store";
import { backupRecords } from "@/features/backup/backup-storage";
import { captureMistake, day } from "@trailbook/learning/mistakes";
import { parseQuestionReview } from "@trailbook/learning/reviews";
import { flashcards } from "@/features/practice/data/practice-cards";
let count = 0;
beforeEach(() => {
  progress.activate(null);
  guestStudy.activate(`review-test-${++count}`);
});
test("keyboard review hides the answer, focuses the prompt, and saves the next due date without losing the notebook", async () => {
  const card = flashcards.find((card) => card.id === "closures:0")!;
  guestStudy.write(captureMistake({}, card, "quiz", "My old answer"));
  const user = userEvent.setup();
  render(<ReviewPage />);
  expect(screen.queryByText(card.answer)).toBeNull();
  const start = screen.getByRole("button", { name: /Start 1 review/ });
  start.focus();
  await user.keyboard("{Enter}");
  expect(document.activeElement?.textContent).toBe(card.question);
  const reveal = screen.getByRole("button", { name: "Show reference answer" });
  reveal.focus();
  await user.keyboard(" ");
  expect(screen.getByText(card.answer)).toBeTruthy();
  await user.click(
    screen.getByRole("button", { name: "Recalled without help" }),
  );
  await waitFor(() =>
    expect(
      screen.getByRole("heading", { name: /useful session/ }),
    ).toBeTruthy(),
  );
  const review = parseQuestionReview(
    guestStudy.values()["practice/review/closures:0"],
  );
  if (!review) throw new Error("Review was not saved");
  expect(review.due > day()).toBe(true);
  expect(guestStudy.values()["practice/mistake/card-closures:0"]).toBeTruthy();
  expect(backupRecords()["practice/review/closures:0"]).toEqual(review);
});
test("skipping keeps the date and a different account never inherits a guest queue", async () => {
  const card = flashcards[0];
  guestStudy.write(captureMistake({}, card, "flashcard", "Not sure"));
  const user = userEvent.setup();
  const view = render(<ReviewPage />);
  await user.click(screen.getByRole("button", { name: /Start 1 review/ }));
  await user.click(screen.getByRole("button", { name: "Skip for now" }));
  expect(
    (guestStudy.values()[`practice/mistake/card-${card.id}`] as { due: string })
      .due,
  ).toBe(day());
  view.unmount();
  progress.activate("another-review-account");
  render(<ReviewPage />);
  expect(screen.getByRole("heading", { name: /caught up/ })).toBeTruthy();
  progress.activate(null);
});
test("review controls remain discoverable through the UI SDK agent", async () => {
  const card = flashcards[0];
  guestStudy.write(captureMistake({}, card, "quiz", "miss"));
  render(<ReviewPage />);
  const agent = createAgent();
  const start = agent
    .snapshot()
    .find((entry) => !entry.offPage && entry.label === "Start 1 review");
  expect(start).toBeTruthy();
  for (const entry of agent
    .snapshot()
    .filter((entry) => !entry.offPage && entry.component !== "more"))
    expect(entry.label).toBeTruthy();
});

test("restoring a backup retains review schedules and explicit deletion is not reseeded from old practice", () => {
  const card = flashcards[0];
  const review = scheduleQuestion(card.id, null, true);
  const { backup } = createBackup(questionReviewRecord(review), "web");
  restoreBackup(backup, "matching", "guest");
  expect(backupRecords()[`practice/review/${card.id}`]).toEqual(review);
  const deleted = createBackup({ [`practice/review/${card.id}`]: null }, "web");
  restoreBackup(deleted.backup, "matching", "guest");
  const records = {
    ...guestStudy.values(),
    "practice/session/old:quiz": { results: { [card.id]: true } },
  };
  expect(buildReviewQueue(records, flashcards)).toHaveLength(0);
});

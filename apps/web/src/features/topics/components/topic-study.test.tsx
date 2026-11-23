import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { beforeEach, expect, test } from "vitest";
import { topicBySlug } from "../data/content";
import { TopicWorkshop } from "./topic-workshop";
import { TopicStudyContext } from "./topic-study-context";
import { TopicConfidence } from "./topic-confidence";
import { guestStudy } from "@/features/account/hooks/use-study-records";
import { progress } from "@/features/account/data/progress-store";
const topic = topicBySlug.get("zod-runtime-contracts")!;
let count = 0;
beforeEach(() => {
  progress.activate(null);
  guestStudy.activate(`study-test-${++count}`);
});
test("hints, recall comparison and solutions remain concealed until deliberately opened", async () => {
  const user = userEvent.setup();
  render(<TopicWorkshop topic={topic} />);
  expect(screen.getByText(topic.study!.exercise.task)).toBeTruthy();
  expect(screen.queryByText(topic.study!.exercise.hint)).toBeNull();
  const hint = screen.getByRole("button", { name: "Reveal exercise hint" });
  hint.focus();
  await user.keyboard("{Enter}");
  expect(screen.getByText(topic.study!.exercise.hint)).toBeTruthy();
  await user.keyboard("{Enter}");
  expect(hint.getAttribute("aria-expanded")).toBe("false");
  await user.click(
    screen.getByRole("button", { name: "Compare your explanation" }),
  );
  expect(screen.getByText(topic.questions[0].answer)).toBeTruthy();
  await user.click(
    screen.getByRole("button", { name: "Reveal reference solution" }),
  );
  expect(screen.getByText("Why this approach")).toBeTruthy();
  expect(screen.getByText(/not an automatic grader/)).toBeTruthy();
});
test("review status makes no false technical verification claim and prerequisites link to lessons", async () => {
  render(<TopicStudyContext topic={topic} />);
  expect(
    screen.getByRole("link", { name: /Typed props/ }).getAttribute("href"),
  ).toBe("/topic/typed-props-api");
  const agent = createAgent();
  await act(async () => {
    const result = await agent.act({
      steps: [
        {
          ref: "Content review & version notes",
          action: "setOpen",
          args: [true],
        },
      ],
    });
    expect(result.ok, result.error?.message).toBe(true);
  });
  expect(screen.getByText(/Pending\. The revision date/)).toBeTruthy();
  expect(screen.getByText(/Zod 4 APIs/)).toBeTruthy();
});
test("confidence is keyboard accessible, persists on remount and stays separate from read state", async () => {
  const user = userEvent.setup();
  const view = render(<TopicConfidence slug={topic.slug} />);
  expect(screen.getByText("Not assessed yet.")).toBeTruthy();
  const first = screen.getByRole("radio", { name: "Needs practice" });
  first.focus();
  await user.keyboard(" ");
  await user.keyboard("{ArrowRight}");
  expect(
    screen
      .getByRole("radio", { name: "Can explain" })
      .getAttribute("aria-checked"),
  ).toBe("true");
  expect(guestStudy.values()[`reading/read/${topic.slug}`]).toBeUndefined();
  view.unmount();
  render(<TopicConfidence slug={topic.slug} />);
  expect(
    screen
      .getByRole("radio", { name: "Can explain" })
      .getAttribute("aria-checked"),
  ).toBe("true");
  await user.click(
    screen.getByRole("button", { name: "Clear confidence rating" }),
  );
  expect(screen.getByText("Not assessed yet.")).toBeTruthy();
});
test("an agent can reveal the hint and set named confidence without affecting another lesson", async () => {
  render(
    <>
      <TopicWorkshop topic={topic} />
      <TopicConfidence slug={topic.slug} />
    </>,
  );
  const agent = createAgent();
  for (const entry of agent
    .snapshot()
    .filter((entry) => !entry.offPage && entry.component !== "more"))
    expect(entry.label).toBeTruthy();
  await act(async () => {
    const result = await agent.act({
      steps: [
        { ref: "Reveal exercise hint", action: "setOpen", args: [true] },
        {
          ref: "How well do you know this?",
          action: "setValue",
          args: ["Can implement"],
        },
      ],
    });
    expect(result.ok, result.error?.message).toBe(true);
  });
  expect(screen.getByText(topic.study!.exercise.hint)).toBeTruthy();
  expect(
    screen
      .getByRole("radio", { name: "Can implement" })
      .getAttribute("aria-checked"),
  ).toBe("true");
  expect(guestStudy.values()["reading/confidence/closures"]).toBeUndefined();
});

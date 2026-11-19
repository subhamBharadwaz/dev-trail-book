import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { afterEach, expect, test, vi } from "vitest";
import { topics } from "@/features/topics/data/content";
import { visuals as javascript } from "./data/javascript";
import { visuals as react } from "./data/react";
import { visuals as platform } from "./data/platform";
import {
  visuals as algorithms,
  anagrams,
  binarySearch,
  brackets,
  heapInsert,
  mergeIntervals,
  slidingWindow,
  traversal,
  twoSum,
} from "./data/algorithms";
import { visuals as diagrams } from "./data/diagrams";
import { visualGroups } from "./registry";
import { TopicWalkthrough } from "./walkthrough";
import { TopicDiagram } from "./diagram";
import { TopicVisual } from "./topic-visual";
import type { Diagram, VisualCatalog, Walkthrough } from "./types";
const catalogs: Record<string, VisualCatalog> = {
  javascript,
  react,
  platform,
  algorithms,
  diagrams,
};
const all: VisualCatalog = Object.assign({}, ...Object.values(catalogs));
afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});
test("every lesson has a deliberate visual and every registered visual matches a real lesson", () => {
  const slugs = topics.map((topic) => topic.slug).sort();
  expect([...Object.keys(all), "event-loop"].sort()).toEqual(slugs);
  expect(Object.keys(visualGroups).sort()).toEqual(Object.keys(all).sort());
  for (const [slug, group] of Object.entries(visualGroups))
    expect(catalogs[group][slug], slug).toBeTruthy();
});
test("all worked examples have bounded line highlights, distinct identities, and usable scenes", () => {
  for (const [slug, visual] of Object.entries(all)) {
    expect(visual.title.length, slug).toBeGreaterThan(10);
    expect(visual.takeaway.length, slug).toBeGreaterThan(30);
    if (visual.kind === "diagram") {
      expect(visual.drawing, slug).toBeTruthy();
      expect(visual.example.input.length, slug).toBeGreaterThan(15);
      expect(visual.example.output.length, slug).toBeGreaterThan(15);
    } else {
      const scenarioIds = visual.scenarios.map((item) => item.id);
      expect(new Set(scenarioIds).size, slug).toBe(scenarioIds.length);
      for (const scenario of visual.scenarios) {
        expect(scenario.steps.length, slug).toBeGreaterThanOrEqual(3);
        for (const step of scenario.steps) {
          if (step.line !== undefined) {
            expect(step.line, slug).toBeGreaterThanOrEqual(0);
            expect(step.line, `${slug}: ${step.title}`).toBeLessThan(
              scenario.code.length,
            );
          }
          const ids = step.panels.flatMap((panel) =>
            panel.tokens.map((token) => token.id),
          );
          expect(new Set(ids).size, `${slug}: ${step.title}`).toBe(ids.length);
          if (step.tree) expect(step.tree.values.length).toBeLessThanOrEqual(7);
        }
      }
    }
  }
});
test("two-sum checks earlier indices, including duplicates and no solution", () => {
  for (const [values, target] of [
    [[3, 3], 6],
    [[1, 2, 4], 8],
    [[0, 4, 3, 0], 0],
    [[2, 7, 11, 15], 9],
  ] as [number[], number][]) {
    const result = twoSum(values, target).steps.at(-1)!.result!;
    const match = /return \[(\d+), (\d+)\]/.exec(result);
    if (match) {
      const i = Number(match[1]),
        j = Number(match[2]);
      expect(i).not.toBe(j);
      expect(values[i] + values[j]).toBe(target);
    } else {
      expect(result).toBe("return null");
      expect(
        values.some((x, i) =>
          values.some((y, j) => i !== j && x + y === target),
        ),
      ).toBe(false);
    }
  }
});
test("lower bounds agree with a linear reference for duplicate, absent, and out-of-range targets", () => {
  const values = [1, 3, 3, 5, 8, 12];
  for (const target of [-2, 1, 2, 3, 6, 12, 20]) {
    const result = binarySearch(values, target).steps.at(-1)!.result!;
    const found = values.findIndex((value) => value >= target);
    expect(Number(/lowerBound = (\d+)/.exec(result)![1])).toBe(
      found < 0 ? values.length : found,
    );
  }
});
test("the unique-window trace never moves left backward and matches a brute-force result", () => {
  for (const text of ["abcabcbb", "abba", "aaaa", "abcde"]) {
    const scenario = slidingWindow(text);
    let lastLeft = 0,
      best = 0;
    for (let i = 0; i < text.length; i++)
      for (let j = i + 1; j <= text.length; j++) {
        const part = text.slice(i, j);
        if (new Set(part).size === part.length)
          best = Math.max(best, part.length);
      }
    for (const step of scenario.steps) {
      const left = step.cells?.findIndex((cell) => cell.markers?.includes("L"));
      if (left !== undefined && left >= 0) {
        expect(left).toBeGreaterThanOrEqual(lastLeft);
        lastLeft = left;
      }
    }
    expect(scenario.steps.at(-1)?.result).toBe(`return ${best}`);
  }
});
test("stack, tree, interval, heap and grouping examples end in the correct state", () => {
  expect(brackets("([])").steps.at(-1)?.result).toBe("return true");
  for (const text of ["([)]", "(()", "a"])
    expect(brackets(text).steps.at(-1)?.result).toBe("return false");
  expect(
    traversal("BFS")
      .steps.at(-1)
      ?.panels[1].tokens.map((token) => token.label),
  ).toEqual(["A", "B", "C", "D", "E", "F"]);
  expect(
    traversal("DFS")
      .steps.at(-1)
      ?.panels[1].tokens.map((token) => token.label),
  ).toEqual(["A", "B", "D", "E", "C", "F"]);
  expect(
    mergeIntervals([
      [1, 2],
      [2, 3],
      [5, 7],
    ])
      .steps.at(-1)
      ?.panels[0].tokens.map((token) => token.label),
  ).toEqual(["[1, 3]", "[5, 7]"]);
  for (const value of [1, 8]) {
    const cells = heapInsert(value).steps.at(-1)!.cells!;
    const values = cells.map((cell) => Number(cell.value));
    for (let i = 1; i < values.length; i++)
      expect(values[Math.floor((i - 1) / 2)]).toBeLessThanOrEqual(values[i]);
  }
  expect(
    anagrams(["eat", "tea", "tan"])
      .steps.at(-1)
      ?.panels[0].tokens.map((token) => token.label),
  ).toEqual(["eat, tea", "tan"]);
});
test("an agent can step, switch scenarios without stale state, play, and reset", async () => {
  const visual = react["stale-closures"] as Walkthrough;
  render(<TopicWalkthrough visual={visual} />);
  const agent = createAgent();
  for (const entry of agent
    .snapshot()
    .filter((item) => !item.offPage && item.component !== "more"))
    expect(entry.label).toBeTruthy();
  await act(async () => {
    const result = await agent.act({
      steps: [
        { ref: "Next visual step", action: "press" },
        { ref: "Next visual step", action: "press" },
      ],
    });
    expect(result.ok, result.error?.message).toBe(true);
  });
  expect(
    screen.getByRole("heading", { name: "A separate update sets count to 5" }),
  ).toBeTruthy();
  const user = userEvent.setup();
  await user.click(
    screen.getByRole("button", { name: "Try example: Functional updater" }),
  );
  expect(
    screen.getByRole("heading", { name: "Render with count = 0" }),
  ).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Next visual step" }));
  await user.click(
    screen.getByRole("button", { name: "Reset visual walkthrough" }),
  );
  expect(
    screen.getByRole("heading", { name: "Render with count = 0" }),
  ).toBeTruthy();
});
test("keyboard stepping retains focus and playback stops on pause and unmount", async () => {
  const user = userEvent.setup();
  const view = render(
    <TopicWalkthrough visual={javascript["closures"] as Walkthrough} />,
  );
  const next = screen.getByRole("button", { name: "Next visual step" });
  next.focus();
  await user.keyboard("{Enter}");
  expect(document.activeElement).toBe(next);
  vi.useFakeTimers();
  await act(async () =>
    screen.getByRole("button", { name: "Play visual walkthrough" }).click(),
  );
  await act(async () => vi.advanceTimersByTime(2400));
  expect(screen.getByRole("heading", { name: "Call a once" })).toBeTruthy();
  await act(async () =>
    screen.getByRole("button", { name: "Pause visual playback" }).click(),
  );
  await act(async () => vi.advanceTimersByTime(7200));
  expect(screen.getByRole("heading", { name: "Call a once" })).toBeTruthy();
  await act(async () =>
    screen.getByRole("button", { name: "Play visual walkthrough" }).click(),
  );
  const before = vi.getTimerCount();
  view.unmount();
  expect(vi.getTimerCount()).toBeLessThan(before);
});
test("static diagrams expose their structure and a concrete example without playback controls", () => {
  render(<TopicDiagram visual={diagrams["http-basics"] as Diagram} />);
  expect(
    screen.getByRole("figure", { name: "A 204 response has no JSON body" }),
  ).toBeTruthy();
  expect(screen.getByText("DELETE /notes/42 + request headers")).toBeTruthy();
  expect(
    screen.getByRole("heading", { name: "A concrete example" }),
  ).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Next visual step" })).toBeNull();
});
test("a lesson guide can be hidden and reopened, and changing topics resets the example", async () => {
  const user = userEvent.setup();
  const view = render(<TopicVisual slug="closures" />);
  expect(
    await screen.findByRole("heading", {
      name: "The outer call ends. The binding remains reachable.",
    }),
  ).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Next visual step" }));
  await user.click(screen.getByRole("button", { name: "Visual guide" }));
  expect(screen.queryByRole("button", { name: "Next visual step" })).toBeNull();
  await user.click(screen.getByRole("button", { name: "Visual guide" }));
  expect(
    await screen.findByRole("heading", { name: "Create an environment" }),
  ).toBeTruthy();
  view.rerender(<TopicVisual slug="http-basics" />);
  expect(
    await screen.findByRole("heading", {
      name: "A response status is part of the data contract.",
    }),
  ).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Next visual step" })).toBeNull();
});

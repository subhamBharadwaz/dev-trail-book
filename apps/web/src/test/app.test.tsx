import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { createAgent } from "@ui-sdk/react/agent";
import App from "../App";
import {
  filterTopics,
  topics,
  categories,
} from "../features/topics/data/content";
const agent = createAgent();

test("every note has complete metadata, searchable content, and a valid collection", () => {
  expect(new Set(topics.map((topic) => topic.slug)).size).toBe(topics.length);
  for (const topic of topics) {
    expect(categories.some((category) => category.id === topic.category)).toBe(
      true,
    );
    expect(topic.code.length).toBeGreaterThan(40);
    expect(topic.questions.length).toBeGreaterThan(0);
    expect(topic.facts.length).toBeGreaterThan(0);
    expect(filterTopics(topic.title)).toContain(topic);
    expect(topic.source.startsWith("https://")).toBe(true);
  }
  expect(
    filterTopics("lexical binding").some((topic) => topic.slug === "closures"),
  ).toBe(true);
  expect(filterTopics("no-match-1292")).toHaveLength(0);
});

test("an agent can discover named controls and filter a collection", async () => {
  location.hash = "#/topics";
  render(<App />);
  const components = agent
    .snapshot()
    .filter((entry) => !entry.offPage && entry.component !== "more");
  for (const entry of components)
    expect(entry.label, `${entry.component} lacks a name`).toBeTruthy();
  const labels = components.map((entry) => entry.label);
  expect(labels).toContain("Filter this collection");
  expect(labels).toContain("Dark theme");
  console.log(
    "Agent controls:",
    JSON.stringify(
      components.map(({ label, actions }) => ({ label, actions })),
    ),
  );
  await act(async () => {
    const result = await agent.act({
      steps: [
        {
          ref: "Filter this collection",
          action: "setValue",
          args: ["closure"],
        },
      ],
    });
    expect(result.ok, result.error?.message).toBe(true);
  });
  expect(
    screen.getByLabelText<HTMLInputElement>("Filter this collection").value,
  ).toBe("closure");
  expect(screen.getByRole("link", { name: /Closures, without/ })).toBeTruthy();
  expect(screen.queryByRole("link", { name: /Promises & async/ })).toBeNull();
});

test("topic tabs, answers, bookmarks, and progress are wired and persistent", async () => {
  location.hash = "#/topic/closures";
  const user = userEvent.setup();
  const view = render(<App />);
  await user.click(screen.getByRole("tab", { name: /Q&A/ }));
  await user.click(
    screen.getByRole("button", { name: "Does a closure copy a variable?" }),
  );
  expect(
    screen.getByText(/retains access to the lexical binding/),
  ).toBeTruthy();
  await user.click(
    screen.getByRole("button", { name: "Does a closure copy a variable?" }),
  );
  expect(
    screen.queryByText(/retains access to the lexical binding/),
  ).toBeNull();
  await user.click(screen.getByRole("tab", { name: "Code example" }));
  expect(screen.getByLabelText("js code example").textContent).toContain(
    "function createCounter() {",
  );
  const save = screen.getByRole("button", { name: "Save this topic" });
  save.focus();
  await user.keyboard(" ");
  const read = screen.getByRole("button", { name: "Mark as read" });
  read.focus();
  await user.keyboard(" ");
  expect(save.getAttribute("aria-pressed")).toBe("true");
  expect(read.getAttribute("aria-pressed")).toBe("true");
  expect(JSON.parse(localStorage.getItem("trailbook:saved")!)).toEqual([
    "closures",
  ]);
  view.unmount();
  render(<App />);
  expect(
    screen
      .getByRole("button", { name: "Save this topic" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
  expect(
    screen
      .getByRole("button", { name: "Mark as read" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
});

test("tabs support arrow keys and theme can be changed with Space", async () => {
  location.hash = "#/topic/effects";
  const user = userEvent.setup();
  render(<App />);
  screen.getByRole("tab", { name: "Overview" }).focus();
  await user.keyboard("{ArrowRight}");
  expect(
    screen
      .getByRole("tab", { name: "Code example" })
      .getAttribute("aria-selected"),
  ).toBe("true");
  await user.keyboard("{ArrowLeft}");
  expect(
    screen.getByRole("tab", { name: "Overview" }).getAttribute("aria-selected"),
  ).toBe("true");
  screen.getByRole("button", { name: "Dark theme" }).focus();
  await user.keyboard(" ");
  expect(document.documentElement.classList.contains("dark")).toBe(true);
});

test("search opens, finds body content, and returns focus after Escape", async () => {
  const user = userEvent.setup();
  render(<App />);
  const trigger = screen.getByRole("button", { name: "Search knowledge" });
  await user.click(trigger);
  const input = await screen.findByRole("combobox", { name: "Search topics" });
  await user.type(input, "lexical binding");
  expect(
    screen.getByRole("option", { name: /Closures, without the confusion/ }),
  ).toBeTruthy();
  await user.keyboard("{Escape}");
  expect(
    screen.getByRole<HTMLInputElement>("combobox", { name: "Search topics" })
      .value,
  ).toBe("");
  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  await waitFor(() => expect(document.activeElement).toBe(trigger));
});

test("unknown routes and empty saved collection have useful recovery links", () => {
  location.hash = "#/missing";
  const view = render(<App />);
  expect(
    screen.getByRole("heading", { name: /hasn’t been written/ }),
  ).toBeTruthy();
  view.unmount();
  location.hash = "#/saved";
  render(<App />);
  expect(
    screen.getByRole("heading", { name: "A little space for later" }),
  ).toBeTruthy();
});

test("collection navigation resets filters and preserves saved reading state", async () => {
  location.hash = "#/topic/closures";
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: "Save this topic" }));
  await user.click(screen.getByRole("link", { name: "All topics" }));
  const filter = await screen.findByRole("textbox", {
    name: "Filter this collection",
  });
  await user.type(filter, "react");
  await user.click(screen.getByRole("link", { name: "Questions & answers" }));
  await screen.findByRole("heading", {
    name: "Questions & answers",
  });
  expect(
    screen.getByRole<HTMLInputElement>("textbox", {
      name: "Filter this collection",
    }).value,
  ).toBe("");
  await user.click(screen.getByRole("link", { name: /Saved topics/ }));
  await screen.findByRole("heading", { name: "Saved topics" });
  expect(screen.getByRole("link", { name: /Closures, without/ })).toBeTruthy();
});

test("mobile navigation reuses the sidebar and closes after choosing a page", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: "Open navigation" }));
  const dialog = await screen.findByRole("dialog", { name: "Navigation" });
  const link = Array.from(dialog.querySelectorAll("a")).find(
    (link) => link.textContent === "All topics",
  )!;
  await user.click(link);
  await screen.findByRole("heading", { name: "All topics" });
  await waitFor(() =>
    expect(screen.queryByRole("dialog", { name: "Navigation" })).toBeNull(),
  );
});

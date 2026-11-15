import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test } from "vitest";
import { SearchDialog } from "./search-dialog";
const agent = createAgent();

async function openSearch() {
  const user = userEvent.setup();
  render(<SearchDialog />);
  const trigger = screen.getByRole("button", { name: "Search knowledge" });
  await user.click(trigger);
  const input = await screen.findByRole(
    "combobox",
    { name: "Search topics" },
    { timeout: 5000 },
  );
  return { user, input, trigger };
}

test("keyboard shortcut opens search and arrows choose the page Enter opens", async () => {
  const user = userEvent.setup();
  render(<SearchDialog />);
  await user.keyboard("{Control>}k{/Control}");
  const input = await screen.findByRole(
    "combobox",
    { name: "Search topics" },
    { timeout: 5000 },
  );
  await user.type(input, "react");
  const first = input.getAttribute("aria-activedescendant");
  await user.keyboard("{ArrowDown}");
  const second = input.getAttribute("aria-activedescendant");
  expect(second).not.toBe(first);
  await user.keyboard("{ArrowUp}");
  expect(input.getAttribute("aria-activedescendant")).toBe(first);
  await user.keyboard("{ArrowDown}");
  const selected = screen
    .getAllByRole("option")
    .find(
      (option) => option.id === input.getAttribute("aria-activedescendant"),
    )!;
  const href = selected.getAttribute("href");
  expect(href).toMatch(/^#\/topic\//);
  await user.keyboard("{Enter}");
  expect(window.location.hash).toBe(href);
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
});

test("empty results recover and closing resets the next search", async () => {
  const { user, input, trigger } = await openSearch();
  await user.type(input, "no-matches-1292");
  expect(screen.getByText("No matching notes yet")).toBeTruthy();
  expect(screen.queryAllByRole("option")).toHaveLength(0);
  await user.clear(input);
  expect(screen.queryByText("No matching notes yet")).toBeNull();
  expect(screen.getAllByRole("option").length).toBeGreaterThan(0);
  await user.type(input, "lexical binding");
  await user.click(screen.getByRole("button", { name: "Close search" }));
  await waitFor(() => expect(document.activeElement).toBe(trigger));
  await user.click(trigger);
  expect(
    (
      await screen.findByRole<HTMLInputElement>("combobox", {
        name: "Search topics",
      })
    ).value,
  ).toBe("");
});

test("an agent can name, search, and highlight a UI SDK result", async () => {
  await openSearch();
  const components = agent
    .snapshot()
    .filter((entry) => !entry.offPage && entry.component !== "more");
  console.log("Search agent snapshot:", JSON.stringify(components));
  for (const entry of components)
    expect(entry.label, `${entry.component} needs a name`).toBeTruthy();
  const command = components.find((entry) => entry.component === "command")!;
  expect(command).toBeTruthy();
  await act(async () => {
    const result = await agent.act({
      steps: [
        { ref: command.ref, action: "setQuery", args: ["lexical binding"] },
      ],
    });
    expect(result.ok, result.error?.message).toBe(true);
  });
  expect(
    screen.getByRole<HTMLInputElement>("combobox", { name: "Search topics" })
      .value,
  ).toBe("lexical binding");
  const current = agent.snapshot().find((entry) => entry.ref === command.ref)!;
  expect(current.items?.length).toBeGreaterThan(0);
  const choice = current.items!.find((item) =>
    item.label.includes("Closures"),
  )!;
  expect(choice).toBeTruthy();
  await act(async () => {
    const result = await agent.act({
      steps: [{ ref: command.ref, action: "setValue", args: [choice.value] }],
    });
    expect(result.ok, result.error?.message).toBe(true);
  });
  expect(
    agent.snapshot().find((entry) => entry.ref === command.ref)?.value,
  ).toBe(choice.value);
  expect(
    screen
      .getByRole("option", { name: /Closures, without the confusion/ })
      .getAttribute("aria-selected"),
  ).toBe("true");
});

import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test, vi } from "vitest";
import { resolveRoute } from "@/app/routes";
import { navigateWithinApp } from "@/app/navigation";
import { SidebarTopics } from "./sidebar-topics";
vi.mock("@/app/navigation", () => ({ navigateWithinApp: vi.fn() }));

test("current lesson opens its category and route changes reveal another branch", () => {
  const view = render(
    <SidebarTopics route={resolveRoute("/topic/closures")} />,
  );
  const tree = screen.getByRole("tree", { name: "Topics by category" });
  expect(
    within(tree)
      .getByRole("link", { name: "Closures, without the confusion" })
      .getAttribute("href"),
  ).toBe("/topic/closures");
  expect(tree.querySelector('[aria-current="page"]')?.textContent).toContain(
    "Closures",
  );
  view.rerender(
    <SidebarTopics route={resolveRoute("/topic/zod-runtime-contracts")} />,
  );
  expect(tree.querySelector('[aria-current="page"]')?.textContent).toContain(
    "Zod",
  );
});

test("branches expand with the keyboard and lesson activation closes the drawer and navigates", async () => {
  const user = userEvent.setup();
  const close = vi.fn();
  render(<SidebarTopics route={resolveRoute("/")} onNavigate={close} />);
  const category = screen.getByRole("treeitem", {
    name: "JavaScript",
  });
  category.focus();
  await user.keyboard("{ArrowRight}");
  expect(category.getAttribute("aria-expanded")).toBe("true");
  expect(close).not.toHaveBeenCalled();
  const link = screen.getByRole("link", {
    name: "Closures, without the confusion",
  });
  await user.click(link);
  expect(navigateWithinApp).toHaveBeenCalledWith("/topic/closures");
  expect(close).toHaveBeenCalledTimes(1);
  const agent = createAgent();
  await act(async () => {
    const result = await agent.snapshot();
    expect(JSON.stringify(result)).toContain("Topics by category");
  });
});

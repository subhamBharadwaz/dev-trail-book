import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { PageBoundary } from "./page-boundary";

function BrokenPage(): never {
  throw new Error("A lesson chunk failed to load");
}

test("a page failure offers recovery and navigation resets the error state", () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  try {
    const { rerender } = render(
      <PageBoundary key="broken">
        <BrokenPage />
      </PageBoundary>,
    );
    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Reload page" })).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: "Back to overview" })
        .getAttribute("href"),
    ).toBe("#/");
    rerender(
      <PageBoundary key="healthy">
        <h1>A readable note</h1>
      </PageBoundary>,
    );
    expect(screen.queryByRole("alert")).toBeNull();
    expect(
      screen.getByRole("heading", { name: "A readable note" }),
    ).toBeTruthy();
  } finally {
    log.mockRestore();
  }
});

import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { PublicPage } from "@/pages/public-page";
import { FirstSession } from "@/features/platform/components/first-session";
import { SiteFooter } from "@/features/platform/components/site-footer";
import { publicPages, repository } from "@/features/platform/data/public-pages";
import { resolveRoute } from "@/app/routes";
for (const [page, info] of Object.entries(publicPages)) {
  test(`${page} is a real public route with readable content and navigation`, () => {
    const route = resolveRoute(`/${page}`);
    expect(route.kind).toBe("public-page");
    if (route.kind !== "public-page") throw new Error("Expected public page");
    render(<PublicPage page={route.page} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      info.title,
    );
    expect(screen.getAllByRole("link").length).toBeGreaterThan(1);
  });
}
test("new visitors can find a starting point without being forced to sign in", () => {
  render(<FirstSession />);
  expect(
    screen
      .getByRole("link", { name: /Find your starting point/ })
      .getAttribute("href"),
  ).toBe("/start-here");
  expect(screen.getByText(/Read and practice without an account/)).toBeTruthy();
});
test("support links point to the intended public pages and issue forms", () => {
  const view = render(<SiteFooter />);
  expect(
    screen.getByRole("navigation", { name: "About and support" }),
  ).toBeTruthy();
  expect(
    screen.getByRole("link", { name: "Privacy & data" }).getAttribute("href"),
  ).toBe("/privacy");
  view.unmount();
  render(<PublicPage page="feedback" />);
  expect(
    screen.getByRole("link", { name: /Report a bug/ }).getAttribute("href"),
  ).toBe(`${repository}/issues/new?template=bug_report.yml`);
  expect(screen.getByText(/GitHub issues are public/)).toBeTruthy();
});

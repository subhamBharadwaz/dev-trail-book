import { act, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { expect, test } from "vitest";
import App from "@/App";

test("the real public layout hydrates without replacing it or losing saved reading", async () => {
  localStorage.setItem("trailbook:read", JSON.stringify(["closures"]));
  localStorage.setItem("trailbook:theme", "dark");
  history.replaceState(null, "", "/topics");
  const html = renderToString(<App initialPath="/topics" />);
  expect(html).toContain("Main navigation");
  expect(html).toContain("All topics");
  expect(html).not.toContain("Restoring your account");
  const host = document.createElement("div");
  host.innerHTML = html;
  document.body.append(host);
  const main = host.querySelector("main");
  const errors: unknown[] = [];
  const root = hydrateRoot(host, <App initialPath="/topics" />, {
    onRecoverableError: (error) => errors.push(error),
  });
  try {
    await waitFor(() =>
      expect(document.documentElement.classList.contains("dark")).toBe(true),
    );
    expect(host.querySelector("main")).toBe(main);
    expect(JSON.parse(localStorage.getItem("trailbook:read")!)).toEqual([
      "closures",
    ]);
    expect(errors).toEqual([]);
  } finally {
    await act(async () => root.unmount());
    host.remove();
  }
});

import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import App from "@/App";
afterEach(() => vi.restoreAllMocks());
test("an open tablet drawer closes when the permanent desktop sidebar becomes available", async () => {
  let resize: ((event: MediaQueryListEvent) => void) | undefined;
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener(
          _type: string,
          listener: (event: MediaQueryListEvent) => void,
        ) {
          if (query === "(min-width: 1280px)") resize = listener;
        },
        removeEventListener() {},
        addListener() {},
        removeListener() {},
        dispatchEvent: () => true,
      }) as unknown as MediaQueryList,
  );
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: "Open navigation" }));
  expect(
    await screen.findByRole("dialog", { name: "Navigation" }),
  ).toBeTruthy();
  act(() => resize?.({ matches: true } as MediaQueryListEvent));
  await waitFor(() =>
    expect(screen.queryByRole("dialog", { name: "Navigation" })).toBeNull(),
  );
});

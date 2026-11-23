import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  oauth: vi.fn().mockResolvedValue({ error: null }),
  signIn: vi.fn().mockResolvedValue({ error: null }),
}));
vi.mock("./data/supabase", () => ({
  cloudConfigured: true,
  getSupabase: async () => ({
    auth: { signInWithOtp: mocks.signIn, signInWithOAuth: mocks.oauth },
  }),
}));
import { AccountPage } from "@/pages/account-page";
const agent = createAgent();
test("sign-in has named agent controls, validates email and sends only on submission", async () => {
  const user = userEvent.setup();
  render(<AccountPage />);
  const controls = agent
    .snapshot()
    .filter((entry) => !entry.offPage && entry.component !== "more");
  for (const entry of controls)
    expect(entry.label, `${entry.component} needs a name`).toBeTruthy();
  expect(controls.map((entry) => entry.label)).toContain("Email address");
  await user.click(
    screen.getByRole("button", { name: "Email me a sign-in link" }),
  );
  expect(mocks.signIn).not.toHaveBeenCalled();
  await act(async () => {
    const result = await agent.act({
      steps: [
        {
          ref: "Email address",
          action: "setValue",
          args: ["learner@example.com"],
        },
      ],
    });
    expect(result.ok).toBe(true);
  });
  await user.click(
    screen.getByRole("button", { name: "Email me a sign-in link" }),
  );
  expect(mocks.signIn).toHaveBeenCalledWith({
    email: "learner@example.com",
    options: { emailRedirectTo: `${location.origin}/` },
  });
  expect(
    await screen.findByText(/Check your email for a sign-in link/),
  ).toBeTruthy();
});

test("signed-in import requires review and keeps existing cloud records", async () => {
  const { AccountContext } = await import("./hooks/use-account");
  const { progress } = await import("./data/progress-store");
  const user = userEvent.setup();
  progress.activate("alice");
  progress.receive([
    { key: "reading/read/closures", value: false, revision: 1 },
  ]);
  progress.publish({ phase: "saved", lastSynced: new Date().toISOString() });
  localStorage.setItem(
    "trailbook:read",
    JSON.stringify(["closures", "effects"]),
  );
  const view = render(
    <AccountContext
      value={{
        user: {
          id: "alice",
          email: "learner@example.com",
        } as import("@supabase/supabase-js").User,
        loading: false,
        error: "",
        retry() {},
        async signOut() {},
      }}
    >
      <AccountPage />
    </AccountContext>,
  );
  expect(
    screen.queryByRole("button", { name: "Import into my account" }),
  ).toBeNull();
  await user.click(screen.getByRole("button", { name: "Review local import" }));
  await user.click(screen.getByRole("button", { name: "Cancel import" }));
  expect(progress.getSnapshot().pending).toEqual({});
  await user.click(screen.getByRole("button", { name: "Review local import" }));
  await user.click(
    screen.getByRole("button", { name: "Import into my account" }),
  );
  expect(progress.values()["reading/read/closures"]).toBe(false);
  expect(progress.values()["reading/read/effects"]).toBe(true);
  view.unmount();
  progress.activate(null);
});

test("GitHub sign-in starts only on explicit click and reports provider failure", async () => {
  const user = userEvent.setup();
  mocks.oauth.mockResolvedValueOnce({ error: new Error("Provider disabled") });
  render(<AccountPage />);
  await user.click(
    screen.getByRole("button", { name: "Continue with GitHub" }),
  );
  expect(mocks.oauth).toHaveBeenCalledWith({
    provider: "github",
    options: { redirectTo: `${window.location.origin}/` },
  });
  expect(screen.getByRole("alert").textContent).toContain(
    "GitHub sign-in could not start",
  );
  expect(
    screen
      .getByRole("button", { name: "Continue with GitHub" })
      .hasAttribute("disabled"),
  ).toBe(false);
});

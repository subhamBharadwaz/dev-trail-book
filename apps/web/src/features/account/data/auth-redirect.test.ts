import { expect, test } from "vitest";
import { isAuthReturn, shouldOpenAccount } from "./auth-redirect";
test("session restoration cannot redirect a normal home or lesson visit", () => {
  for (const path of ["/", "/topic/closures/", "/paths", "/account/"])
    expect(shouldOpenAccount("SIGNED_IN", isAuthReturn(""), path)).toBe(false);
  expect(isAuthReturn("#/topic/closures")).toBe(false);
  expect(isAuthReturn("#main-content")).toBe(false);
  expect(isAuthReturn("#error=access_denied")).toBe(false);
});
test("only a real implicit sign-in callback opens account once", () => {
  const callback = isAuthReturn(
    "#access_token=test-access&refresh_token=test-refresh&type=signup",
  );
  expect(callback).toBe(true);
  expect(shouldOpenAccount("SIGNED_IN", callback, "/")).toBe(true);
  expect(shouldOpenAccount("TOKEN_REFRESHED", callback, "/")).toBe(false);
  expect(shouldOpenAccount("SIGNED_IN", callback, "/account/")).toBe(false);
  expect(isAuthReturn("#access_token=incomplete")).toBe(false);
});

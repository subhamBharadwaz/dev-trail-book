import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { beforeEach, expect, test } from "vitest";
import { BackupPage } from "@/pages/backup-page";
import { createBackup } from "@trailbook/learning/backup";
import { progress } from "@/features/account/data/progress-store";
import { guestStudy } from "@/features/account/hooks/use-study-records";
import { backupRecords, restoreBackup } from "./backup-storage";
let counter = 0;
beforeEach(() => {
  progress.activate(null);
  guestStudy.activate(`backup-test-${++counter}`);
});
test("an agent can review a backup without applying it, and cancel keeps existing data", async () => {
  const user = userEvent.setup(),
    agent = createAgent();
  render(<BackupPage />);
  await user.click(
    screen.getByRole("button", { name: "Paste backup JSON instead" }),
  );
  const controls = agent
    .snapshot()
    .filter((e) => !e.offPage && e.component !== "more");
  for (const control of controls) expect(control.label).toBeTruthy();
  const { text } = createBackup({ "reading/read/closures": true }, "android");
  await act(async () => {
    const result = await agent.act({
      steps: [
        { ref: "Backup text contents", action: "setValue", args: [text] },
        { ref: "Review pasted backup", action: "press" },
      ],
    });
    expect(result.ok, result.error?.message).toBe(true);
  });
  expect(
    screen.getByRole("heading", { name: "Review this restore" }),
  ).toBeTruthy();
  expect(screen.getByText(/1 to add/)).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Cancel restore" }));
  expect(backupRecords()["reading/read/closures"]).toBeUndefined();
});
test("guest restore maps legacy reading and quiz data correctly and remains exportable", () => {
  localStorage.setItem("trailbook:read", JSON.stringify(["closures"]));
  const { backup } = createBackup(
    {
      "reading/read/closures": false,
      "reading/read/effects": true,
      "practice/preferences/all": { category: "react", mode: "quiz" },
    },
    "android",
  );
  const result = restoreBackup(backup, "matching", "guest");
  expect(result.reload).toBe(true);
  expect(JSON.parse(localStorage.getItem("trailbook:read")!)).toEqual([
    "effects",
  ]);
  expect(backupRecords()["reading/read/closures"]).toBeUndefined();
  expect(backupRecords()["reading/read/effects"]).toBe(true);
  expect(
    JSON.parse(localStorage.getItem("trailbook:practice:preferences:all")!),
  ).toEqual({ category: "react", mode: "quiz" });
});
test("restore protects account switching and only queues reviewed values for the current account", () => {
  const { backup } = createBackup({ "reading/read/closures": true }, "web");
  progress.activate("alice-backup");
  expect(() => restoreBackup(backup, "missing", "bob-backup")).toThrow(
    "account changed",
  );
  expect(progress.values()).toEqual({});
  restoreBackup(backup, "missing", "alice-backup");
  expect(progress.values()["reading/read/closures"]).toBe(true);
  progress.activate("bob-backup");
  expect(progress.values()).toEqual({});
  progress.activate(null);
});

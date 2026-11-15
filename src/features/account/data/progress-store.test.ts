import { afterEach, expect, test } from "vitest";
import { progress } from "./progress-store";
import {
  preparationChanges,
  preparationRecords,
  recordsPreparation,
} from "./preparation-records";
import { guestRecords } from "./local-import";
afterEach(() => progress.activate(null));
test("guest records stay out of a new account until explicitly imported", () => {
  localStorage.setItem("trailbook:read", JSON.stringify(["closures"]));
  progress.activate("alice");
  expect(progress.values()).toEqual({});
  expect(guestRecords()["reading/read/closures"]).toBe(true);
  progress.write(guestRecords());
  expect(progress.values()["reading/read/closures"]).toBe(true);
  progress.activate("bob");
  expect(progress.values()).toEqual({});
  progress.activate("alice");
  expect(progress.values()["reading/read/closures"]).toBe(true);
});
test("different journal entries merge and a same-record conflict keeps the pending version", () => {
  progress.activate("alice");
  progress.receive([
    { key: "prep/entry/first", value: { title: "Before" }, revision: 1 },
  ]);
  progress.write({ "prep/entry/first": { title: "Local" } });
  progress.receive([
    {
      key: "prep/entry/second",
      value: { title: "Another device" },
      revision: 1,
    },
    { key: "prep/entry/first", value: { title: "Cloud" }, revision: 2 },
  ]);
  expect(progress.values()["prep/entry/second"]).toEqual({
    title: "Another device",
  });
  expect(progress.values()["prep/entry/first"]).toEqual({ title: "Local" });
  expect(progress.getSnapshot().conflicts["prep/entry/first"].revision).toBe(2);
  progress.resolve("prep/entry/first", "local");
  expect(progress.getSnapshot().pending["prep/entry/first"].base).toBe(2);
});
test("a new edit during an in-flight save survives its older acknowledgement", () => {
  progress.activate("alice");
  progress.write({ "reading/read/closures": true });
  const sent = progress.getSnapshot().pending["reading/read/closures"];
  progress.write({ "reading/read/closures": false });
  progress.acknowledge("reading/read/closures", sent, {
    key: "reading/read/closures",
    value: true,
    revision: 1,
  });
  expect(progress.values()["reading/read/closures"]).toBe(false);
  expect(progress.getSnapshot().pending["reading/read/closures"].base).toBe(1);
});
test("a committed write with a lost response is recognized without duplicate work", () => {
  progress.activate("alice");
  progress.write({ "reading/read/closures": true });
  progress.receive([
    { key: "reading/read/closures", value: true, revision: 1 },
  ]);
  expect(progress.getSnapshot().pending).toEqual({});
  expect(progress.getSnapshot().conflicts).toEqual({});
});
test("choosing cloud clears only the conflicting local record", () => {
  progress.activate("alice");
  progress.write({
    "reading/read/closures": true,
    "reading/saved/effects": true,
  });
  progress.receive([
    { key: "reading/read/closures", value: false, revision: 1 },
  ]);
  progress.resolve("reading/read/closures", "cloud");
  expect(progress.values()["reading/read/closures"]).toBe(false);
  expect(progress.getSnapshot().pending["reading/saved/effects"]).toBeTruthy();
});
test("daily task changes create individual records and undo writes a tombstone", () => {
  const before = {
    version: 1 as const,
    entries: [],
    days: {
      "2026-11-15": { routine: "full" as const, completed: ["recall", "dsa"] },
    },
  };
  const after = {
    ...before,
    days: { "2026-11-15": { routine: "full" as const, completed: ["dsa"] } },
  };
  expect(preparationChanges(before, after)).toEqual({
    "prep/day/2026-11-15/task/recall": null,
  });
  expect(recordsPreparation(preparationRecords(before))).toEqual(before);
});

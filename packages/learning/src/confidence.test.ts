import { expect, test } from "bun:test";
import { confidenceRecord, parseConfidence } from "./confidence";
import { createBackup, parseBackup, validStudyRecord } from "./backup";
const now = new Date("2026-11-19T08:00:00.000Z");
test("confidence preserves explicit self-assessment without changing completion", () => {
  const records = confidenceRecord("closures", "explain", now);
  expect(records["reading/read/closures"]).toBeUndefined();
  expect(parseConfidence(records["reading/confidence/closures"])).toEqual({
    level: "explain",
    updatedAt: now.toISOString(),
  });
  expect(confidenceRecord("closures", null, now)).toEqual({
    "reading/confidence/closures": null,
  });
  expect(() => confidenceRecord("../private", "learning", now)).toThrow();
});
test("malformed stored confidence is ignored and cannot enter portable backups", () => {
  for (const value of [
    null,
    true,
    "implement",
    {},
    { level: "expert", updatedAt: now.toISOString() },
    { level: "learning", updatedAt: "bad" },
  ]) {
    expect(parseConfidence(value)).toBeNull();
    if (value !== null)
      expect(validStudyRecord("reading/confidence/closures", value)).toBe(
        false,
      );
  }
});
test("confidence and cleared ratings round-trip through existing backup contracts", () => {
  const records = {
    ...confidenceRecord("closures", "implement", now),
    ...confidenceRecord("effects", null, now),
    "reading/read/closures": false,
  };
  const exported = createBackup(records, "web", now);
  expect(exported.skipped).toBe(0);
  const restored = parseBackup(JSON.stringify(exported.backup));
  expect(restored.records).toEqual(records);
});

import { expect, test } from "bun:test";
import { reminderSchedule, studyLine } from "./study-nudges";
test("reminders stay at 9, 13, 17 and 21 India time, regardless of device-local timezone", () => {
  const now = Date.parse("2026-11-15T18:30:00Z"),
    slots = reminderSchedule(now);
  expect(slots).toHaveLength(56);
  expect(new Set(slots.map((s) => s.line)).size).toBe(8);
  for (const slot of slots) {
    const ist = new Date(slot.at + 330 * 60000);
    expect([9, 13, 17, 21]).toContain(ist.getUTCHours());
    expect(ist.getUTCMinutes()).toBe(0);
    expect(slot.at).toBeGreaterThan(now);
  }
  expect(slots[0].at).toBe(Date.parse("2026-11-16T03:30:00Z"));
  expect(slots[1].at - slots[0].at).toBe(4 * 3600000);
});
test("late-night scheduling starts tomorrow and refreshes never schedule past alerts", () => {
  const now = Date.parse("2026-11-16T17:00:00Z");
  const slots = reminderSchedule(now);
  expect(slots[0].at).toBe(Date.parse("2026-11-17T03:30:00Z"));
  expect(slots.every((s) => s.at > now + 60000)).toBe(true);
  expect(new Set(slots.map((s) => s.id)).size).toBe(slots.length);
  expect(studyLine(now)).toBe(studyLine(now + 1000));
});

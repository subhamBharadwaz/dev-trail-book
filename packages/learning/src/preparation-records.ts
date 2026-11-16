import {
  emptyPreparation,
  parsePreparation,
  type Preparation,
} from "./preparation";
import type { Json } from "@trailbook/sync";
export function preparationRecords(value: Preparation): Record<string, Json> {
  const records: Record<string, Json> = {};
  for (const entry of value.entries)
    records[`prep/entry/${entry.id}`] = JSON.parse(JSON.stringify(entry));
  for (const [date, day] of Object.entries(value.days)) {
    records[`prep/day/${date}/routine`] = day.routine;
    for (const id of day.completed)
      records[`prep/day/${date}/task/${id}`] = true;
  }
  return records;
}
export function recordsPreparation(records: Record<string, Json>): Preparation {
  const value: Preparation = { ...emptyPreparation, entries: [], days: {} };
  for (const [key, record] of Object.entries(records)) {
    if (
      key.startsWith("prep/entry/") &&
      record &&
      typeof record === "object" &&
      !Array.isArray(record)
    )
      value.entries.push(record as unknown as Preparation["entries"][number]);
    const parts = key.split("/");
    if (parts[0] !== "prep" || parts[1] !== "day" || !record) continue;
    const day = (value.days[parts[2]] ??= { routine: "full", completed: [] });
    if (
      parts[3] === "routine" &&
      (record === "full" || record === "short" || record === "minimum")
    )
      day.routine = record;
    if (parts[3] === "task" && parts[4] && record === true)
      day.completed.push(parts[4]);
  }
  return parsePreparation(JSON.stringify(value));
}
export function preparationChanges(before: Preparation, after: Preparation) {
  const a = preparationRecords(before),
    b = preparationRecords(after),
    changes: Record<string, Json> = {};
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)]))
    if (JSON.stringify(a[key]) !== JSON.stringify(b[key]))
      changes[key] = b[key] ?? null;
  return changes;
}

import { parsePreparation } from "@/features/preparation/data/preparation";
import { preparationRecords } from "./preparation-records";
import type { Json } from "./progress-store";
export function guestRecords(): Record<string, Json> {
  const records: Record<string, Json> = {};
  try {
    for (const type of ["saved", "read"]) {
      const list = JSON.parse(
        localStorage.getItem(`trailbook:${type}`) || "[]",
      );
      if (Array.isArray(list))
        for (const slug of list)
          if (typeof slug === "string")
            records[`reading/${type}/${slug}`] = true;
    }
    Object.assign(
      records,
      preparationRecords(
        parsePreparation(localStorage.getItem("trailbook:preparation:v1")),
      ),
    );
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index)!;
      if (key.startsWith("trailbook:practice:v1:"))
        records[
          `practice/session/${key.slice("trailbook:practice:v1:".length)}`
        ] = JSON.parse(localStorage.getItem(key)!);
      if (key.startsWith("trailbook:practice:preferences:"))
        records[
          `practice/preferences/${key.slice("trailbook:practice:preferences:".length)}`
        ] = JSON.parse(localStorage.getItem(key)!);
    }
  } catch {
    /* Readable records can still be imported when one legacy value is damaged. */
  }
  return records;
}

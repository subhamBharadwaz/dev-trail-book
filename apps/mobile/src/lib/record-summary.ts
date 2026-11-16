import { categories, topicBySlug } from "@trailbook/content/native";
import type { Json } from "@trailbook/sync";
export function recordTitle(key: string) {
  const parts = key.split("/");
  if (parts[0] === "reading")
    return `${parts[1] === "read" ? "Lesson completion" : "Bookmark"} · ${topicBySlug.get(parts[2])?.title ?? "Lesson"}`;
  if (parts[0] === "prep" && parts[1] === "day")
    return `Daily plan · ${parts[2]}`;
  if (parts[0] === "prep") return "Practice journal entry";
  if (parts[1] === "preferences") return "Practice preferences";
  return "Practice session";
}
export function recordSummary(key: string, value: Json | undefined): string {
  if (value === null || value === undefined) return "Removed or not saved";
  if (key.startsWith("reading/read/"))
    return value === true ? "Lesson completed" : "Not completed";
  if (key.startsWith("reading/saved/"))
    return value === true ? "Bookmarked" : "Not bookmarked";
  if (typeof value === "boolean") return value ? "Done" : "Not done";
  if (typeof value === "string")
    return (
      (
        {
          full: "6-hour routine",
          short: "2-hour routine",
          minimum: "20-minute routine",
        } as Record<string, string>
      )[value] ?? value
    );
  if (typeof value !== "object" || Array.isArray(value))
    return "Saved progress";
  if (typeof value.title === "string")
    return [
      value.title,
      value.date,
      typeof value.notes === "string" ? value.notes.slice(0, 240) : "",
    ]
      .filter(Boolean)
      .join(" · ");
  if (Array.isArray(value.ids) && typeof value.index === "number") {
    const results =
      value.results &&
      typeof value.results === "object" &&
      !Array.isArray(value.results)
        ? Object.values(value.results)
        : [];
    return `${Math.min(value.index + 1, value.ids.length)} of ${value.ids.length} questions · ${results.filter((v) => v === true).length} recalled · ${results.filter((v) => v === false).length} to revisit`;
  }
  if (typeof value.category === "string")
    return `${categories.find((c) => c.id === value.category)?.name ?? "All categories"} · ${value.mode === "quiz" ? "Quiz" : "Flashcards"}`;
  return "Saved progress";
}

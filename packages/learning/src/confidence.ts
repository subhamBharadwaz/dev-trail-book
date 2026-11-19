import type { Json } from "@trailbook/sync";
export const confidenceLevels = ["learning", "explain", "implement"] as const;
export type ConfidenceLevel = (typeof confidenceLevels)[number];
export interface TopicConfidence {
  level: ConfidenceLevel;
  updatedAt: string;
}
export function parseConfidence(value: unknown): TopicConfidence | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (
    !confidenceLevels.includes(record.level as ConfidenceLevel) ||
    typeof record.updatedAt !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T/.test(record.updatedAt) ||
    !Number.isFinite(Date.parse(record.updatedAt))
  )
    return null;
  return {
    level: record.level as ConfidenceLevel,
    updatedAt: record.updatedAt,
  };
}
export function confidenceRecord(
  slug: string,
  level: ConfidenceLevel | null,
  now = new Date(),
): Record<string, Json> {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error("Invalid topic slug");
  return {
    [`reading/confidence/${slug}`]:
      level === null ? null : { level, updatedAt: now.toISOString() },
  };
}

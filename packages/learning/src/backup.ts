import { parseConfidence } from "./confidence";
import type { Json } from "@trailbook/sync";
import { parseMistake } from "./mistakes";
import { parseInterview } from "./interviews";
import { recordsPreparation } from "./preparation-records";
import { validDate } from "./preparation";
export const maxBackupBytes = 8 * 1024 * 1024;
export interface StudyBackup {
  format: "dev-trailbook-backup";
  version: 1;
  exportedAt: string;
  source: "web" | "android";
  records: Record<string, Json>;
}
export type RestoreMode = "missing" | "matching";
function object(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}
function safeJson(v: unknown, depth = 0): v is Json {
  if (depth > 20) return false;
  if (v === null || typeof v === "boolean" || typeof v === "string")
    return true;
  if (typeof v === "number") return Number.isFinite(v);
  if (Array.isArray(v))
    return v.length <= 10000 && v.every((item) => safeJson(item, depth + 1));
  return (
    object(v) &&
    Object.entries(v).every(
      ([k, value]) =>
        !["__proto__", "constructor", "prototype"].includes(k) &&
        !/(^|_)(access_token|refresh_token|password|secret|authorization|cookie)($|_)/i.test(
          k,
        ) &&
        safeJson(value, depth + 1),
    )
  );
}
const id = "[a-zA-Z0-9_.:-]+";
export function validStudyRecord(key: string, value: unknown): value is Json {
  if (
    key.length > 300 ||
    key
      .split("/")
      .some((p) => ["__proto__", "constructor", "prototype"].includes(p)) ||
    !safeJson(value) ||
    JSON.stringify(value).length > 60000
  )
    return false;
  const confidence = /^reading\/confidence\/[a-z0-9-]+$/.test(key);
  const reading = /^reading\/(read|saved)\/[a-z0-9-]+$/.test(key);
  const entry = new RegExp(`^prep/entry/${id}$`).test(key);
  const day =
    /^prep\/day\/(\d{4}-\d{2}-\d{2})\/(routine|task\/[a-z0-9-]+)$/.exec(key);
  const practice = new RegExp(
    `^practice/(session|preferences|mistake|interview|interview-position|interview-debrief)/${id}$`,
  ).test(key);
  const answer = new RegExp(`^practice/interview-answer/${id}/${id}$`).test(
    key,
  );
  if (
    !reading &&
    !confidence &&
    !entry &&
    !day &&
    !practice &&
    !answer &&
    key !== "practice/interview-current"
  )
    return false;
  if (day && !validDate(day[1])) return false;
  if (value === null) return true;
  if (confidence) return parseConfidence(value) !== null;
  if (reading) return typeof value === "boolean";
  if (entry)
    return recordsPreparation({ [key]: value }).entries.some(
      (e) => e.id === key.split("/")[2],
    );
  if (day)
    return (
      validDate(day[1]) &&
      (day[2] === "routine"
        ? ["full", "short", "minimum"].includes(String(value))
        : typeof value === "boolean")
    );
  if (key === "practice/interview-current")
    return typeof value === "string" && new RegExp(`^${id}$`).test(value);
  if (key.startsWith("practice/interview-position/"))
    return (
      typeof value === "number" &&
      Number.isInteger(value) &&
      value >= 0 &&
      value < 8
    );
  if (!object(value)) return false;
  if (key.startsWith("practice/mistake/"))
    return parseMistake(value)?.id === key.split("/")[2];
  if (key.startsWith("practice/interview/"))
    return parseInterview(value)?.id === key.split("/")[2];
  if (key.startsWith("practice/interview-answer/"))
    return (
      typeof value.text === "string" &&
      value.text.length <= 12000 &&
      typeof value.reflection === "string" &&
      value.reflection.length <= 4000 &&
      (value.rating === null ||
        (typeof value.rating === "number" &&
          Number.isInteger(value.rating) &&
          value.rating >= 0 &&
          value.rating <= 3))
    );
  if (key.startsWith("practice/interview-debrief/"))
    return (
      typeof value.strengths === "string" &&
      typeof value.nextStep === "string" &&
      value.strengths.length <= 4000 &&
      value.nextStep.length <= 4000
    );
  if (key.startsWith("practice/preferences/"))
    return (
      typeof value.category === "string" &&
      ["quiz", "flashcards"].includes(String(value.mode))
    );
  if (key.startsWith("practice/session/"))
    return (
      value.version === 1 &&
      Array.isArray(value.ids) &&
      value.ids.length <= 1000 &&
      value.ids.every((v) => typeof v === "string") &&
      new Set(value.ids).size === value.ids.length &&
      typeof value.index === "number" &&
      Number.isInteger(value.index) &&
      value.index >= 0 &&
      value.index <= value.ids.length &&
      object(value.results) &&
      Object.entries(value.results).every(
        ([id, result]) =>
          value.ids instanceof Array &&
          value.ids.includes(id) &&
          typeof result === "boolean",
      ) &&
      (value.selected === null || typeof value.selected === "string") &&
      typeof value.revealed === "boolean"
    );
  return false;
}
export function createBackup(
  records: Record<string, Json>,
  source: StudyBackup["source"],
  now = new Date(),
) {
  const valid = Object.entries(records).filter(([key, value]) =>
    validStudyRecord(key, value),
  );
  const backup: StudyBackup = {
    format: "dev-trailbook-backup",
    version: 1,
    exportedAt: now.toISOString(),
    source,
    records: Object.fromEntries(valid),
  };
  if (valid.length > 10000)
    throw new Error("This backup contains too many records.");
  const text = JSON.stringify(backup, null, 2);
  if (new TextEncoder().encode(text).length > maxBackupBytes)
    throw new Error("This backup exceeds the 8 MB file limit.");
  return {
    backup,
    text,
    skipped: Object.keys(records).length - valid.length,
    filename: `dev-trailbook-${now.toISOString().replace(/[:.]/g, "-")}.json`,
  };
}
export function parseBackup(text: string): StudyBackup {
  if (new TextEncoder().encode(text).length > maxBackupBytes)
    throw new Error("Choose a backup smaller than 8 MB.");
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error("This file is not valid JSON.");
  }
  if (
    !object(value) ||
    value.format !== "dev-trailbook-backup" ||
    value.version !== 1 ||
    typeof value.exportedAt !== "string" ||
    !Number.isFinite(Date.parse(value.exportedAt)) ||
    !["web", "android"].includes(String(value.source)) ||
    !object(value.records) ||
    Object.keys(value).some(
      (k) =>
        !["format", "version", "exportedAt", "source", "records"].includes(k),
    )
  )
    throw new Error("Choose a supported Dev Trailbook version 1 backup.");
  if (Object.keys(value.records).length > 10000)
    throw new Error("This backup contains too many records.");
  if (
    !Object.entries(value.records).every(([key, value]) =>
      validStudyRecord(key, value),
    )
  )
    throw new Error(
      "This backup contains an unsupported or damaged study record. Nothing was restored.",
    );
  return value as unknown as StudyBackup;
}
export function restorePlan(
  backup: StudyBackup,
  current: Record<string, Json>,
  mode: RestoreMode,
) {
  const changes: Record<string, Json> = {};
  let added = 0,
    updated = 0,
    kept = 0;
  for (const [key, value] of Object.entries(backup.records)) {
    if (!Object.hasOwn(current, key)) {
      changes[key] = value;
      added++;
    } else if (
      JSON.stringify(current[key]) === JSON.stringify(value) ||
      mode === "missing"
    )
      kept++;
    else {
      changes[key] = value;
      updated++;
    }
  }
  return {
    changes,
    added,
    updated,
    kept,
    total: Object.keys(backup.records).length,
  };
}
export function backupGroups(backup: StudyBackup) {
  const keys = Object.keys(backup.records);
  return [
    {
      label: "Reading & bookmarks",
      count: keys.filter((k) => k.startsWith("reading/")).length,
    },
    {
      label: "Practice journal & daily tasks",
      count: keys.filter((k) => k.startsWith("prep/")).length,
    },
    {
      label: "Flashcards & quiz sessions",
      count: keys.filter((k) => /^practice\/(session|preferences)\//.test(k))
        .length,
    },
    {
      label: "Mistake notebook",
      count: keys.filter((k) => k.startsWith("practice/mistake/")).length,
    },
    {
      label: "Mock interviews & assessments",
      count: keys.filter((k) => k.startsWith("practice/interview")).length,
    },
  ];
}

export function withReadingDefaults(
  records: Record<string, Json>,
  slugs: string[],
) {
  const result = { ...records };
  for (const slug of slugs)
    for (const kind of ["read", "saved"]) {
      const key = `reading/${kind}/${slug}`;
      if (!Object.hasOwn(result, key)) result[key] = false;
    }
  return result;
}

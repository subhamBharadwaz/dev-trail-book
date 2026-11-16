import type { Json } from "@trailbook/sync";
import type { TopicMeta } from "@trailbook/content/types";
import { addDays, dateKey, dueReviews, evidenceKinds } from "./preparation";
import { recordsPreparation } from "./preparation-records";
import { mistakesFromRecords } from "./mistakes";
import {
  getAnswer,
  getDebrief,
  interviewsFromRecords,
  interviewStats,
} from "./interviews";
export interface ReadinessAction {
  id: string;
  title: string;
  detail: string;
  target:
    "mistakes" | "evidence" | "journal" | "topic" | "interviews" | "practice";
  slug?: string;
  sessionId?: string;
}
export interface WeakTopic {
  id: string;
  title: string;
  slug: string;
  category: string;
  mistakes: number;
  overdue: number;
  lowRatings: number;
  sessionId?: string;
  priority: number;
}
function timestampDay(timestamp: number) {
  const date = new Date(timestamp);
  return Number.isFinite(date.getTime()) ? dateKey(date) : null;
}
export function buildReadiness(
  records: Record<string, Json>,
  topics: Pick<TopicMeta, "slug" | "title" | "category">[],
  categories: { id: string; name: string }[],
  today = dateKey(),
) {
  const start = addDays(today, -6),
    previousStart = addDays(today, -13),
    previousEnd = addDays(today, -7);
  const prep = recordsPreparation(records),
    mistakes = mistakesFromRecords(records);
  const sessions = interviewsFromRecords(records)
    .filter((s) => {
      const date = s.finishedAt === null ? null : timestampDay(s.finishedAt);
      return s.state === "completed" && date !== null && date <= today;
    })
    .sort((a, b) => b.finishedAt! - a.finishedAt!);
  const openMistakes = mistakes.filter((m) => m.status === "open");
  const mistakeDue = openMistakes.filter((m) => m.due <= today);
  const evidenceDue = dueReviews(
    prep.entries.filter((e) => e.date <= today),
    today,
  );
  const reviews = [
    ...mistakeDue.map((m) => ({
      id: `mistake-${m.id}`,
      title: m.question,
      date: m.due,
      target: "mistakes" as const,
      detail: m.topicTitle,
    })),
    ...evidenceDue.map((r) => ({
      id: `evidence-${r.entry.id}-${r.date}`,
      title: r.entry.title,
      date: r.date,
      target: "journal" as const,
      detail: "Practice journal review",
    })),
  ].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  function activity(from: string, to: string) {
    const entries = prep.entries.filter((e) => e.date >= from && e.date <= to);
    const completed = sessions.filter((s) => {
      const date = timestampDay(s.finishedAt!)!;
      return date >= from && date <= to;
    });
    const active = new Set(entries.map((e) => e.date));
    completed.forEach((s) => active.add(timestampDay(s.finishedAt!)!));
    for (const [date, day] of Object.entries(prep.days))
      if (date >= from && date <= to && day.completed.length) active.add(date);
    return { entries, completed, active };
  }
  const week = activity(start, today),
    previous = activity(previousStart, previousEnd);
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i);
    return {
      date,
      active: week.active.has(date),
      logs: week.entries.filter((e) => e.date === date).length,
      mocks: week.completed.filter((s) => timestampDay(s.finishedAt!) === date)
        .length,
      tasks: new Set(prep.days[date]?.completed ?? []).size,
    };
  });
  const topicBySlug = new Map(topics.map((t) => [t.slug, t]));
  const weak = new Map<string, WeakTopic>();
  function weakTopic(slug: string, title: string, category: string) {
    const topic = topicBySlug.get(slug),
      validSlug = topic ? slug : "",
      id = validSlug || `category-${category}`;
    let row = weak.get(id);
    if (!row) {
      row = {
        id,
        title:
          topic?.title ??
          (category === "behavioral"
            ? "Behavioral stories"
            : title || "Personal notes"),
        slug: validSlug,
        category: topic?.category ?? category,
        mistakes: 0,
        overdue: 0,
        lowRatings: 0,
        priority: 0,
      };
      weak.set(id, row);
    }
    return row;
  }
  for (const m of openMistakes) {
    const row = weakTopic(m.topicSlug, m.topicTitle, m.category);
    row.mistakes++;
    if (m.due < today) row.overdue++;
  }
  const latestPrompts = new Set<string>(),
    recentStart = addDays(today, -29);
  for (const session of sessions) {
    if (timestampDay(session.finishedAt!)! < recentStart) continue;
    for (const prompt of session.prompts) {
      const rating = getAnswer(records, session.id, prompt.id).rating;
      if (rating === null || latestPrompts.has(prompt.id)) continue;
      latestPrompts.add(prompt.id);
      if (rating < 2) {
        const row = weakTopic(
          prompt.topicSlug,
          prompt.topicTitle,
          prompt.category,
        );
        row.lowRatings++;
        row.sessionId ??= session.id;
      }
    }
  }
  const weakTopics = [...weak.values()]
    .map((t) => ({
      ...t,
      priority: t.mistakes + t.overdue * 3 + t.lowRatings * 2,
    }))
    .sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title));
  const coverage = categories
    .map((category) => {
      const collection = topics.filter((t) => t.category === category.id);
      return {
        ...category,
        total: collection.length,
        read: collection.filter(
          (t) => records[`reading/read/${t.slug}`] === true,
        ).length,
        gaps: weakTopics
          .filter((t) => t.category === category.id)
          .reduce((n, t) => n + t.mistakes + t.lowRatings, 0),
      };
    })
    .filter((c) => c.total > 0);
  const trend = sessions
    .slice(0, 5)
    .reverse()
    .map((session) => ({
      id: session.id,
      date: timestampDay(session.finishedAt!)!,
      duration: session.duration,
      focus: session.focus,
      ...interviewStats(session, records),
    }));
  const actions: ReadinessAction[] = [];
  const due = reviews[0];
  if (due)
    actions.push({
      id: "due",
      title:
        due.date < today
          ? "Clear the oldest overdue review"
          : "Make time for today’s review",
      detail: `${due.title} · due ${due.date}`,
      target: due.target,
    });
  const weakest = weakTopics[0];
  if (weakest) {
    const target = weakest.slug
      ? "topic"
      : weakest.mistakes
        ? "mistakes"
        : "interviews";
    if (
      !actions.some(
        (a) => a.target === target && (a.slug ?? "") === weakest.slug,
      )
    )
      actions.push({
        id: "weak",
        title: `Revisit ${weakest.title}`,
        detail: `${weakest.mistakes} open notebook gaps · ${weakest.lowRatings} low self-ratings. Explain it closed-book, then check an example.`,
        target,
        slug: weakest.slug || undefined,
        sessionId: target === "interviews" ? weakest.sessionId : undefined,
      });
  }
  const pending = sessions.find(
    (s) =>
      interviewStats(s, records).rated < s.prompts.length ||
      !getDebrief(records, s.id).nextStep.trim(),
  );
  if (pending)
    actions.push({
      id: "assess",
      title: "Finish reviewing a mock interview",
      detail: "Assess the remaining answers and record one concrete next step.",
      target: "interviews",
      sessionId: pending.id,
    });
  const hasCoding = week.entries.some(
    (e) => e.kind === "dsa" || e.kind === "build",
  );
  if (actions.length < 3 && !hasCoding)
    actions.push({
      id: "coding",
      title: "Make one independent coding attempt",
      detail:
        "Try a problem or a small build, test an edge case, and record what happened.",
      target: "evidence",
    });
  if (actions.length < 3 && !week.completed.length)
    actions.push({
      id: "mock",
      title: "Take a 15-minute mock interview",
      detail: "Set a baseline for technical, coding, and behavioral answers.",
      target: "interviews",
    });
  if (actions.length < 3)
    actions.push({
      id: "recall",
      title: "Explain one answer without notes",
      detail: "Use recall practice, then capture the detail you missed.",
      target: "practice",
    });
  return {
    today,
    start,
    previousStart,
    previousEnd,
    days,
    activeDays: week.active.size,
    previousActiveDays: previous.active.size,
    logs: week.entries.length,
    previousLogs: previous.entries.length,
    mocks: week.completed.length,
    previousMocks: previous.completed.length,
    practice: evidenceKinds.map((kind) => ({
      ...kind,
      count: week.entries.filter((e) => e.kind === kind.value).length,
    })),
    independentAttempts: week.entries.filter(
      (e) => e.independent && (e.kind === "dsa" || e.kind === "build"),
    ).length,
    reviews,
    overdue: reviews.filter((r) => r.date < today).length,
    dueToday: reviews.filter((r) => r.date === today).length,
    openMistakes: openMistakes.length,
    masteredMistakes: mistakes.filter((m) => m.status === "mastered").length,
    weakTopics,
    coverage,
    read: topics.filter((t) => records[`reading/read/${t.slug}`] === true)
      .length,
    total: topics.length,
    trend,
    actions: actions.slice(0, 3),
    completedMocks: sessions.length,
    hasEvidence:
      prep.entries.length > 0 ||
      sessions.length > 0 ||
      mistakes.length > 0 ||
      Object.values(prep.days).some((d) => d.completed.length > 0),
  };
}
export type Readiness = ReturnType<typeof buildReadiness>;

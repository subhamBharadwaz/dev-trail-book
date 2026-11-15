export const evidenceKinds = [
  { value: "dsa", label: "DSA attempt" },
  { value: "build", label: "Timed build / debugging" },
  { value: "mock", label: "Mock interview" },
  { value: "recall", label: "Closed-book explanation" },
  { value: "application", label: "Application / outreach" },
] as const;
export type EvidenceKind = (typeof evidenceKinds)[number]["value"];
export type Routine = "full" | "short" | "minimum";
export interface Evidence {
  id: string;
  kind: EvidenceKind;
  title: string;
  date: string;
  independent: boolean;
  notes: string;
  reviews: string[];
  completedReviews: string[];
}
export interface Preparation {
  version: 1;
  entries: Evidence[];
  days: Record<string, { routine: Routine; completed: string[] }>;
}
export const emptyPreparation: Preparation = {
  version: 1,
  entries: [],
  days: {},
};
export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function addDays(date: string, days: number) {
  const next = new Date(`${date}T12:00:00`);
  next.setDate(next.getDate() + days);
  return dateKey(next);
}
export function validDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(new Date(`${value}T12:00:00`).getTime()) &&
    dateKey(new Date(`${value}T12:00:00`)) === value
  );
}
export function parsePreparation(raw: string | null): Preparation {
  try {
    const value = JSON.parse(raw || "null");
    if (
      !value ||
      value.version !== 1 ||
      !Array.isArray(value.entries) ||
      !value.days ||
      typeof value.days !== "object" ||
      Array.isArray(value.days)
    )
      return emptyPreparation;
    const entries: Evidence[] = value.entries.filter(
      (entry: Evidence) =>
        entry &&
        typeof entry.id === "string" &&
        typeof entry.title === "string" &&
        entry.title.trim() &&
        validDate(entry.date) &&
        evidenceKinds.some((kind) => kind.value === entry.kind) &&
        typeof entry.independent === "boolean" &&
        typeof entry.notes === "string" &&
        Array.isArray(entry.reviews) &&
        entry.reviews.every(validDate) &&
        Array.isArray(entry.completedReviews) &&
        entry.completedReviews.every((date) => entry.reviews.includes(date)),
    );
    const days: Preparation["days"] = {};
    for (const [date, day] of Object.entries(value.days)) {
      const item = day as Preparation["days"][string];
      if (
        validDate(date) &&
        item &&
        ["full", "short", "minimum"].includes(item.routine) &&
        Array.isArray(item.completed) &&
        item.completed.every((id) => typeof id === "string")
      )
        days[date] = item;
    }
    return {
      version: 1,
      entries: [...new Map(entries.map((entry) => [entry.id, entry])).values()],
      days,
    };
  } catch {
    return emptyPreparation;
  }
}
export function dueReviews(entries: Evidence[], today: string) {
  return entries.flatMap((entry) =>
    entry.reviews
      .filter((date) => date <= today && !entry.completedReviews.includes(date))
      .map((date) => ({ entry, date })),
  );
}
export const routineOptions = [
  { value: "full", label: "6 hours" },
  { value: "short", label: "2 hours" },
  { value: "minimum", label: "20 minutes" },
];
export function dailyTasks(routine: Routine) {
  if (routine === "minimum")
    return [
      {
        id: "recall",
        title: "Explain one answer aloud",
        minutes: 5,
        detail: "Close your notes. Explain the idea, then check one gap.",
        href: "#/practice",
        action: "Open flashcards",
      },
      {
        id: "dsa",
        title: "Code or re-solve one problem",
        minutes: 10,
        detail:
          "Use a familiar problem. Explain your invariant and one edge case.",
        href: "#/topic/dsa-40-problem-bank",
        action: "Open problem bank",
      },
      {
        id: "next",
        title: "Write your next action",
        minutes: 5,
        detail:
          "Record one gap and the smallest next step. Resume your routine tomorrow.",
        href: "#/evidence",
        action: "Record evidence",
      },
    ];
  return [
    {
      id: "recall",
      title: "Recall, then repair a concept",
      minutes: routine === "full" ? 90 : 45,
      detail: "Explain without notes, check the gap, then build a small proof.",
      href: "#/roadmap",
      action: "Choose a topic",
    },
    ...(routine === "full"
      ? [
          {
            id: "build",
            title: "Build or debug something small",
            minutes: 90,
            detail:
              "Use an existing project. Cover loading, empty, error and keyboard behavior.",
            href: "#/topic/debug-build-spec",
            action: "Open a task spec",
          },
        ]
      : []),
    {
      id: "dsa",
      title: "Attempt a problem or a due re-solve",
      minutes: routine === "full" ? 60 : 25,
      detail:
        "Attempt independently. Record hints, complexity and boundary cases.",
      href: "#/topic/dsa-40-problem-bank",
      action: "Open problem bank",
    },
    {
      id: "spoken",
      title: "Practice a spoken interview answer",
      minutes: routine === "full" ? 60 : 20,
      detail:
        "Rehearse a real project decision or run a short mock. Record what you missed.",
      href: "#/topic/mock-company-prep",
      action: "Open mock prompts",
    },
    {
      id: "applications",
      title: "Apply and follow up",
      minutes: routine === "full" ? 60 : 30,
      detail:
        "Choose suitable roles, tailor your evidence and follow the agreed timelines.",
      href: "#/topic/application-scorecard",
      action: "Open application guide",
    },
  ];
}

import type { Json, ProgressStore } from "@trailbook/sync";
import type { PracticeCard } from "./practice";
import {
  codingPrompts,
  behavioralPrompts,
  type InterviewPrompt,
} from "./interview-prompts";
import { newMistake, mistakeRecord } from "./mistakes";
export type { InterviewPrompt } from "./interview-prompts";
export type Duration = 15 | 30 | 45;
export interface Interview {
  version: 1;
  id: string;
  duration: Duration;
  focus: string;
  prompts: InterviewPrompt[];
  state: "running" | "paused" | "completed";
  startedAt: number;
  resumedAt: number;
  elapsed: number;
  finishedAt: number | null;
}
export interface InterviewAnswer {
  text: string;
  rating: number | null;
  reflection: string;
}
export interface InterviewDebrief {
  strengths: string;
  nextStep: string;
}
export const interviewKey = (id: string) => `practice/interview/${id}`;
export const answerKey = (id: string, prompt: string) =>
  `practice/interview-answer/${id}/${prompt}`;
export const debriefKey = (id: string) => `practice/interview-debrief/${id}`;
export const positionKey = (id: string) => `practice/interview-position/${id}`;
export const currentInterviewKey = "practice/interview-current";
export const durations: {
  value: Duration;
  label: string;
  description: string;
}[] = [
  {
    value: 15,
    label: "15 minutes",
    description: "2 technical · 1 coding · 1 behavioral",
  },
  {
    value: 30,
    label: "30 minutes",
    description: "3 technical · 2 coding · 2 behavioral",
  },
  {
    value: 45,
    label: "45 minutes",
    description: "4 technical · 2 coding · 2 behavioral",
  },
];
export const focuses = [
  { value: "all", label: "Mixed topics" },
  { value: "javascript", label: "JavaScript" },
  { value: "react", label: "React" },
  { value: "typescript", label: "TypeScript" },
];
export const ratings = [
  { value: "0", label: "0 · Not yet" },
  { value: "1", label: "1 · Partial" },
  { value: "2", label: "2 · Solid" },
  { value: "3", label: "3 · Strong" },
];
function shuffled<T>(items: T[], seed: string): T[] {
  let state = 2166136261;
  for (const char of seed)
    state = Math.imul(state ^ char.charCodeAt(0), 16777619);
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    state = Math.imul(state ^ (state >>> 15), 2246822519);
    const index = (state >>> 0) % (i + 1);
    [result[i], result[index]] = [result[index], result[i]];
  }
  return result;
}
export function createInterview(
  id: string,
  duration: Duration,
  focus: string,
  cards: PracticeCard[],
  now = Date.now(),
): Interview {
  const technical = shuffled(
    cards.filter((c) => focus === "all" || c.category === focus),
    id,
  );
  const seen = new Set<string>();
  const unique = technical.filter((c) => {
    if (seen.has(c.topicSlug)) return false;
    seen.add(c.topicSlug);
    return true;
  });
  const count = duration === 15 ? 2 : duration === 30 ? 3 : 4;
  const code = shuffled(codingPrompts, id);
  const matching = code.filter((p) => focus === "all" || p.category === focus);
  const coding = [
    ...matching,
    ...code.filter((p) => !matching.includes(p)),
  ].slice(0, duration === 15 ? 1 : 2);
  return {
    version: 1,
    id,
    duration,
    focus,
    state: "running",
    startedAt: now,
    resumedAt: now,
    elapsed: 0,
    finishedAt: null,
    prompts: [
      ...unique
        .slice(0, count)
        .map((c) => ({
          id: `technical-${c.id}`,
          kind: "technical" as const,
          question: c.question,
          reference: c.answer,
          topicSlug: c.topicSlug,
          topicTitle: c.topicTitle,
          category: c.category,
          criteria: [
            "Answers the actual question accurately",
            "Explains the reasoning in clear steps",
            "Uses a concrete example and mentions a limitation",
          ],
        })),
      ...coding,
      ...shuffled(behavioralPrompts, id).slice(0, duration === 15 ? 1 : 2),
    ],
  };
}
export function remainingMs(session: Interview, now = Date.now()) {
  const elapsed =
    session.elapsed +
    (session.state === "running" ? Math.max(0, now - session.resumedAt) : 0);
  return Math.max(0, session.duration * 60_000 - elapsed);
}
export function transitionInterview(
  session: Interview,
  action: "pause" | "resume" | "finish",
  now = Date.now(),
): Interview {
  if (session.state === "completed") return session;
  if (action === "resume")
    return session.state === "paused" && remainingMs(session, now) > 0
      ? { ...session, state: "running", resumedAt: now }
      : session;
  if (
    action === "pause" &&
    (session.state !== "running" || remainingMs(session, now) === 0)
  )
    return session;
  return {
    ...session,
    state: action === "finish" ? "completed" : "paused",
    elapsed: session.duration * 60_000 - remainingMs(session, now),
    finishedAt: action === "finish" ? now : null,
  };
}
export function formatRemaining(ms: number) {
  const total = Math.ceil(Math.max(0, ms) / 1000);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
function object(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}
function validPrompt(value: unknown): value is InterviewPrompt {
  if (!object(value)) return false;
  return (
    [
      value.id,
      value.question,
      value.reference,
      value.topicSlug,
      value.topicTitle,
      value.category,
    ].every((v) => typeof v === "string") &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.question === "string" &&
    value.question.length > 0 &&
    ["technical", "coding", "behavioral"].includes(String(value.kind)) &&
    Array.isArray(value.criteria) &&
    value.criteria.every((c) => typeof c === "string")
  );
}
export function parseInterview(value: unknown): Interview | null {
  if (
    !object(value) ||
    value.version !== 1 ||
    typeof value.id !== "string" ||
    !value.id ||
    ![15, 30, 45].includes(Number(value.duration)) ||
    typeof value.duration !== "number" ||
    typeof value.focus !== "string" ||
    !["running", "paused", "completed"].includes(String(value.state)) ||
    !finite(value.startedAt) ||
    !finite(value.resumedAt) ||
    !finite(value.elapsed) ||
    value.elapsed > value.duration * 60_000 ||
    (value.finishedAt !== null && !finite(value.finishedAt)) ||
    !Array.isArray(value.prompts) ||
    value.prompts.length < 1 ||
    value.prompts.length > 8 ||
    !value.prompts.every(validPrompt) ||
    new Set(value.prompts.map((p) => p.id)).size !== value.prompts.length
  )
    return null;
  if ((value.state === "completed") !== (value.finishedAt !== null))
    return null;
  return value as unknown as Interview;
}
export function interviewsFromRecords(
  records: Record<string, Json>,
): Interview[] {
  return Object.entries(records)
    .flatMap(([key, value]) => {
      if (!key.startsWith("practice/interview/")) return [];
      const session = parseInterview(value);
      return session && key === interviewKey(session.id) ? [session] : [];
    })
    .sort((a, b) => b.startedAt - a.startedAt);
}
export function interviewRecord(session: Interview): Record<string, Json> {
  return { [interviewKey(session.id)]: JSON.parse(JSON.stringify(session)) };
}
export function getAnswer(
  records: Record<string, Json>,
  session: string,
  prompt: string,
): InterviewAnswer {
  const value = records[answerKey(session, prompt)];
  if (!object(value)) return { text: "", rating: null, reflection: "" };
  return {
    text: typeof value.text === "string" ? value.text.slice(0, 12000) : "",
    rating:
      typeof value.rating === "number" &&
      Number.isInteger(value.rating) &&
      value.rating >= 0 &&
      value.rating <= 3
        ? value.rating
        : null,
    reflection:
      typeof value.reflection === "string"
        ? value.reflection.slice(0, 4000)
        : "",
  };
}
export function getDebrief(
  records: Record<string, Json>,
  id: string,
): InterviewDebrief {
  const v = records[debriefKey(id)];
  return {
    strengths:
      object(v) && typeof v.strengths === "string"
        ? v.strengths.slice(0, 4000)
        : "",
    nextStep:
      object(v) && typeof v.nextStep === "string"
        ? v.nextStep.slice(0, 4000)
        : "",
  };
}
export function interviewStats(
  session: Interview,
  records: Record<string, Json>,
) {
  const answers = session.prompts.map((p) =>
    getAnswer(records, session.id, p.id),
  );
  const rated = answers.filter((a) => a.rating !== null);
  return {
    answered: answers.filter((a) => a.text.trim()).length,
    rated: rated.length,
    total: session.prompts.length,
    score: rated.length
      ? Math.round(
          (rated.reduce((sum, a) => sum + a.rating!, 0) / (rated.length * 3)) *
            100,
        )
      : null,
  };
}
export function interviewMistake(
  session: Interview,
  prompt: InterviewPrompt,
  answer: InterviewAnswer,
  now = new Date(),
) {
  return mistakeRecord({
    ...newMistake(`interview-${session.id}-${prompt.id}`, now),
    source: "interview",
    question: prompt.question,
    answer: `${prompt.reference}\n\nReview checklist:\n${prompt.criteria.map((c) => `• ${c}`).join("\n")}`,
    yourAnswer: answer.text,
    explanation: answer.reflection,
    topicSlug: prompt.topicSlug,
    topicTitle: prompt.topicTitle,
    category: prompt.category,
    misses: 1,
  });
}

export function updateInterviewAnswer(
  records: Record<string, Json>,
  session: Interview,
  prompt: string,
  patch: Partial<InterviewAnswer>,
  now = Date.now(),
): Record<string, Json> {
  if (!session.prompts.some((p) => p.id === prompt)) return {};
  const before = getAnswer(records, session.id, prompt);
  const next = { ...before };
  if (
    typeof patch.text === "string" &&
    session.state === "running" &&
    remainingMs(session, now) > 0
  )
    next.text = patch.text.slice(0, 12000);
  if (session.state === "completed") {
    if (
      patch.rating === null ||
      (typeof patch.rating === "number" &&
        Number.isInteger(patch.rating) &&
        patch.rating >= 0 &&
        patch.rating <= 3)
    )
      next.rating = patch.rating;
    if (typeof patch.reflection === "string")
      next.reflection = patch.reflection.slice(0, 4000);
  }
  return JSON.stringify(before) === JSON.stringify(next)
    ? {}
    : { [answerKey(session.id, prompt)]: { ...next } };
}
export function createInterviewActions(
  getStore: () => ProgressStore,
  cards: PracticeCard[],
  uuid: () => string,
) {
  const current = () => {
    const store = getStore(),
      records = store.values();
    const id = records[currentInterviewKey];
    return {
      store,
      records,
      session:
        typeof id === "string"
          ? parseInterview(records[interviewKey(id)])
          : null,
    };
  };
  return {
    start(duration: Duration, focus: string) {
      const session = createInterview(uuid(), duration, focus, cards);
      getStore().write({
        ...interviewRecord(session),
        [currentInterviewKey]: session.id,
      });
    },
    open(id: string | null) {
      getStore().write({ [currentInterviewKey]: id });
    },
    goTo(index: number) {
      const { store, session } = current();
      if (
        session &&
        Number.isInteger(index) &&
        index >= 0 &&
        index < session.prompts.length
      )
        store.write({ [positionKey(session.id)]: index });
    },
    transition(action: "pause" | "resume" | "finish") {
      const { store, session } = current();
      if (session)
        store.write(interviewRecord(transitionInterview(session, action)));
    },
    answer(prompt: string, patch: Partial<InterviewAnswer>) {
      const { store, records, session } = current();
      if (session)
        store.write(updateInterviewAnswer(records, session, prompt, patch));
    },
    debrief(patch: Partial<InterviewDebrief>) {
      const { store, records, session } = current();
      if (session?.state === "completed") {
        const before = getDebrief(records, session.id);
        store.write({
          [debriefKey(session.id)]: {
            strengths: (patch.strengths ?? before.strengths).slice(0, 4000),
            nextStep: (patch.nextStep ?? before.nextStep).slice(0, 4000),
          },
        });
      }
    },
    addMistake(promptId: string) {
      const { store, records, session } = current();
      if (session?.state !== "completed") return;
      const prompt = session.prompts.find((p) => p.id === promptId);
      if (!prompt) return;
      const changes = interviewMistake(
        session,
        prompt,
        getAnswer(records, session.id, promptId),
      );
      const key = Object.keys(changes)[0];
      if (!records[key]) store.write(changes);
    },
  };
}
export function interviewPosition(
  session: Interview,
  records: Record<string, Json>,
) {
  const value = records[positionKey(session.id)];
  return typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value < session.prompts.length
    ? value
    : 0;
}

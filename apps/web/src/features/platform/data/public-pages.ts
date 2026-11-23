export const repository = "https://github.com/subhamBharadwaz/dev-trail-book";
export const publicPages = {
  "start-here": {
    title: "Start here",
    description:
      "Your first frontend study session: choose a path, trace a visual lesson, then practice recalling and rebuilding it.",
  },
  about: {
    title: "About Dev Trailbook",
    description:
      "A personal study workbook opened to everyone: frontend lessons, interactive explanations and deliberate practice.",
  },
  privacy: {
    title: "Privacy & your data",
    description:
      "Understand device-only study records, optional Supabase account sync, GitHub sign-in and backup choices.",
  },
  feedback: {
    title: "Feedback & corrections",
    description:
      "Report a broken feature, suggest a lesson or help improve an explanation in Dev Trailbook.",
  },
} as const;
export type PublicPageId = keyof typeof publicPages;

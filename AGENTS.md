# Dev Trailbook — agent instructions

## Product direction

Dev Trailbook is a frontend-first, self-paced learning platform. Start with web foundations, JavaScript, TypeScript and React; backend, AI, algorithms and career preparation are optional extensions. Write for newcomers without assuming a private PDF, previous chat, personal deadline or prior completion. Never promise a job or label self-assessment as measured mastery.

## Before changing code

- Read this file and [docs/style-guide.md](docs/style-guide.md). Check for more specific AGENTS.md files in the area being edited. `apps/mobile/AGENTS.md` applies to mobile work.
- Inspect the actual implementation, package scripts and current Git diff. Preserve unrelated user changes.
- Keep topic slugs, path IDs and study record keys stable. Some legacy IDs contain `plan-week`, `pdf` or `december`; those are compatibility identifiers, not public copy.
- Do not reset reading, confidence, notebook or account data as part of content or design changes.

## Architecture

- `apps/web`: Astro static pages with a React + TypeScript interactive workspace. Public routes are generated in `astro/pages`; the real app layout is pre-rendered and hydrates as a persisted React island. Keep the initial path explicit for server rendering; never read or write personal browser records during prerendering. Features live under `src/features`, route pages under `src/pages`, shared components under `src/components`.
- `apps/mobile`: Expo Android app. Consult its instructions and version-matched Expo docs before native changes.
- `packages/content/lessons`: trusted MDX lesson sources. Metadata drives topics, search and practice. `src/study-guides.json` adds prerequisites, exercises and review scope.
- `packages/content/src/topics.json`: generated offline content; regenerate with `bun run content`, never edit by hand.
- `packages/learning`: shared study logic and validation. `packages/sync`: account-aware offline records and synchronization.

## Implementation rules

- Use Astro navigation for programmatic route changes; preserve real anchor URLs, route metadata, theme and browser history scroll. Keep full-text search out of the eager topic index.
- Use Bun and existing dependencies. Prefer small feature components and shared helpers over large route files.
- Use Tailwind utilities and existing semantic tokens. Do not add or edit CSS files for feature styling. The deployed palette and shadcn aliases live on the body in `apps/web/astro/pages/[...path].astro`; `index.html` is the retained Vite test harness. Keep their tokens aligned when changing the theme.
- Use ui-sdk primitives for composite controls. Read the installed component docs under `node_modules/@ui-sdk/react/docs` before changing behavior. Keep accessible names, keyboard interaction and agent bridge support.
- Do not copy the web palette into native theme files unless mobile work is requested.
- Keep external payloads unknown until checked; preserve server authorization, account isolation and secret boundaries.
- Do not launch paid services, builds, deployments or publish messages without task authorization. Commit and push only when requested.

## Validation

- Run `bun run check` for cross-cutting changes. It regenerates content, typechecks web/mobile, lints, tests and builds Cloudflare output into root `dist/`.
- For a focused change, use relevant package scripts; tests should verify real behavior rather than mirror class strings.
- Visually inspect affected pages in light and dark modes and at phone/tablet/desktop widths. Check text wrapping, contrast, focus, selected states and overflow. Include a screenshot when presenting UI changes.
- Run `git diff --check`. Report what was checked, any limits, and whether work is local or pushed. Do not imply successful deployment from a successful build alone.

## Content additions

Supply explanations, a worked example, mistakes, an exercise, interview questions, facts and an authoritative source. Add study guidance and an appropriate visual. Connect the lesson to a self-paced path and prerequisites without introducing cycles. Review dates certify an actual technical review; a prose edit alone does not justify a new reviewed date.

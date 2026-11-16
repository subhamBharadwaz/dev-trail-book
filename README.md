# Dev Trailbook

A developer interview-preparation workspace: the existing Vite/React website and an Android-first Expo SDK 58 app, managed with Bun workspaces and Turborepo. Both apps share their lesson source, question banks, preparation rules, and conflict-aware Supabase sync engine.

## Run locally

```sh
bun install
bun run dev
```

Open the local URL printed by Vite.

```sh
bun run test
bun run build
bun run preview
```

## What is included

- Responsive sidebar and category collections.
- 74 shared MDX lessons, 177 flashcards, and 74 quizzes with code examples, must-know facts, and references.
- Full-text search (Ctrl+K / Cmd+K), including prose, metadata, code, and answers.
- Saved topics, read status, and theme persisted in browser local storage.
- Keyboard-accessible tabs, dialogs, and accordions.
- UI SDK agent bridge and WebMCP registration when supported by the browser.

Content includes the confirmed study-plan coverage and the discussions previously supplied to this project. Guest progress stays on each device; signing in enables cross-device Supabase sync, with an explicit reviewed import for guest progress. Code examples are readable and copyable, not an execution environment.

## Add a topic

Create a `.mdx` file under `packages/content/lessons/`. Copy an existing file and update its exported `meta` object:

```mdx
export const meta = {
  category: "react",
  slug: "your-topic",
  title: "Your topic",
  description: "A short explanation of what the reader will learn.",
  minutes: 5,
  level: "Fundamentals",
  tags: ["react"],
  questions: [{ question: "Why does this matter?", answer: "Your answer." }],
  facts: ["One useful detail to remember."],
  source: "https://react.dev/learn",
  code: 'const message = "Hello";',
};

## The idea

Write your explanation here.

## Why it matters

Connect it to a practical use.

## A practical example

Add a fenced code block here.

## Try it yourself

Add a small exercise.

## Keep exploring

Link to the official documentation.
```

The file is discovered automatically. The Vite plugin generates searchable text from the MDX source at build time. No search index or manual navigation entry needs updating. Run `bun run content` after editing lessons to regenerate the mobile bundle. Category IDs live in `packages/content/src/categories.ts`. Use the headings above to match the article contents navigation.

Only compile trusted repository-owned MDX: it can contain JavaScript and React components.

## Deploy the website

Import this project into Vercel and choose the Vite preset:

- Install: `bun install --frozen-lockfile`
- Build: `bun run build`
- Output: `dist`

The MVP uses hash routes, so static hosting works without a route rewrite. The existing Cloudflare Pages project can keep its repository-root build and `dist` output. `bun run build` builds only the website and copies its output to root `dist/`; mobile bundles are built separately.

## Project structure

```text
apps/
  web/                 Existing Vite, React, Tailwind, shadcn, and UI SDK website
  mobile/              Expo Router Android-first app, native Expo UI controls
packages/
  content/             Canonical MDX lessons, category metadata, generated native syntax trees
  learning/            Preparation, review dates, question banks, and session validation
  sync/                Platform-independent progress store and CAS sync engine
scripts/               Cloudflare-compatible root output preparation
supabase/              Database migrations and security verification
```

`App.tsx` only composes the provider, layout, and route view. Route resolution is a typed, pure function; hash changes are subscribed to with `useSyncExternalStore`. Collection filters belong to the collection page and reset on navigation. Saved topics and reading progress live in the shared reading provider.

Keep reusable primitives in `components/`, domain behavior in `features/`, and page composition in `pages/`. Components depend on the content domain and hooks; the domain does not depend on page markup. Use the `@/` import alias for shared imports. Avoid barrel files that load unrelated features.

Search uses UI SDK `CommandInput`, `CommandList`, `CommandItem`, and `CommandEmpty` inside `Dialog`. UI SDK owns focus, highlight, keyboard behavior, result announcements, and the shortcut. Full-text matching uses the same content filter as collection pages. The command UI is loaded on demand when its dialog opens.

The agent bridge remains in `apps/web/src/lib/agent.ts`. Tests next to a feature cover its behavior; `apps/web/src/test/app.test.tsx` verifies integration across the app.

Run `bun run format` to format the source.

## Learning paths and practice

- `#/paths`: three curated sequences. Path progress shares the existing “Mark as read” state; the next unread topic is the resume point.
- `#/practice`: flashcards and quick quizzes, filtered by collection.
- `#/practice/path/<path-id>`: practice only the topics in one learning path.

Practice sessions save the current card, checked answer, and results in browser local storage. Flashcards and quizzes have separate sessions for each collection or path. At the end, review only missed items or start a new session. This is local progress, without account synchronization.

Path definitions live in `src/features/learning-paths/data/learning-paths.ts`. Flashcards come from topic Q&A. Quizzes use the first question for each supported topic plus curated distractors in `src/features/practice/data/practice-cards.ts`; add distractors when adding a quiz topic.

Code examples use Shiki with the GitHub Dark theme. The highlighter and each supported grammar load on demand. Unknown languages fall back to readable plain text. Set `codeLanguage` in MDX metadata for the separate code-example tab. All new feature and code-block presentation uses Tailwind utilities; no CSS-file changes are required.

## Content coverage and provenance

The library includes 65 notes: the original ten foundations plus 55 syllabus/discussion lessons. `#/roadmap` maps every stage of the user-confirmed six-page December 2026 job plan to notes, weekly evidence gates, learning paths, and practice. Dates describe the original schedule and do not automatically mark content as read.

Discussion recaps are based only on accessible excerpts of **Full Stack Interview prep**, **JavaScript Closures Explained**, and **React User Search App**. Full older chat history was not available. Plan-derived articles are original educational expansions, not transcripts or claims that a lesson was already discussed. `docs/content-sources.json` records that distinction. The original private PDF is not copied into public assets.

`origin`, `planWeek`, `planPages`, `planRecordedStatus`, `optional`, and `discussionSource` describe provenance. Recorded prior study from PDF page 1 stays separate from browser reading state. The two unnamed HashMap and Two Pointer slots are offered as explicit equivalents, not asserted original exercise names.

Add `quizDistractors` to an MDX topic to include its first Q&A question in quizzes. Flashcards include every Q&A item automatically. Future notes follow the same MDX structure; adding a note does not require changing search or sidebar counts.

### PDF depth audit — 14 November 2026

74 MDX topics now include a linked PDF coverage checklist, nine added depth/practice lessons and twelve expanded lessons. The audit maps all six PDF pages to lessons in `docs/pdf-coverage-audit.json`. The 40-problem DSA bank is a practice inventory with original problem links, not 40 worked solutions. Reading progress is separate from demonstrated interview readiness. No CSS files were edited.

## Code quality and styling

Run `bun run check` for strict TypeScript, lint, tests and a production build. Component and page presentation uses Tailwind utilities, with semantic theme colors such as `bg-page`, `text-ink`, `border-line` and `text-green`. The only stylesheet is `apps/web/src/index.css`, which holds Tailwind/shadcn imports and theme tokens. The legacy app/search stylesheets have been removed. Shiki supplies runtime syntax-token colors; layout and interactions use Tailwind.

Lesson metadata and searchable text are indexed at build time; each MDX body loads on demand when its note opens. Keep the exported metadata block at the beginning of a lesson. Route failures display recovery options while keeping the site navigation available.

## Daily preparation and evidence

- `#/today` provides the PDF’s six-hour routine, two-hour fallback and 20-minute minimum. Checklists and the selected routine are saved per local calendar date.
- `#/evidence` records DSA, timed builds, mocks, spoken recall and applications. Record independence and hints honestly; reading a note does not create evidence.
- DSA reviews are scheduled two and seven calendar days after the attempt. Builds, mocks and recall return the next day. Future reviews cannot be marked complete early.
- The journal shows the last seven days of activity, overdue reviews, reversible attempt removal and JSON backup export. Data stays in this browser; accounts and device synchronization are not included. If storage is blocked, the current visit keeps data in memory and displays an export reminder.
- Presentation remains in Tailwind classes. Warm paper and muted teal light colors, slate dark colors, 16px lesson text, 14px supporting text and larger navigation targets improve mobile reading. Existing theme stylesheets are unchanged.

### Reading themes

Paper & indigo light mode pairs warm paper surfaces with dark graphite text and indigo accents. Night reading mode uses warm charcoal surfaces, off-white text and muted lavender accents on desktop and mobile. A new visit follows the device’s color preference. The sun/moon control selects and remembers a manual override; the monitor control restores device following. The saved preference is applied before the first paint to avoid a bright flash on a dark device. All palette changes use Tailwind classes; no stylesheets were edited.

### Responsive layout

Phones and tablets below 1280px use a sticky compact header and a scrollable navigation drawer. Desktop screens from 1280px use a permanent 256px sidebar. An open drawer closes when the desktop layout becomes available. Main content is a Tailwind query container: card grids follow the available content width, including after sidebar space is deducted. Lesson contents appear beside the article only when the main area has at least 1120px. Search results and code stay scrollable within their own panels; search inputs retain 16px text on touch devices.

## Accounts and cross-device sync

The Vite frontend remains deployable to Cloudflare Pages. Supabase provides email-link sign-in and the shared PostgreSQL backend; no separate frontend server or Next.js migration is required.

1. Create a Supabase project and apply `supabase/migrations/20261115000100_progress_sync.sql` in its SQL editor or using your migration pipeline.
2. Copy `.env.example` to `.env.local` and supply the project URL and **publishable** key. Never put database passwords, secret keys or service-role keys in a `VITE_` variable.
3. Under Supabase Authentication → URL Configuration, set the production site URL and allow the exact frontend origins with a trailing slash. For local development include `http://127.0.0.1:4173/`, `http://localhost:4173/` and your Vite development origins. Email links return to `/`; the app consumes the auth fragment and opens the account page.
4. Run `bun run check`, then build with those variables available. Vite embeds these public connection values at build time. Add them to your CI build environment if building through GitHub Actions or Cloudflare’s Git integration. Direct upload deploys the already configured `dist` folder.
5. Open `#/account` and request a sign-in link. Open the link on the browser where you want to sign in. Supabase’s default mail service has recipient and sending limits; configure your own SMTP provider before opening sign-in to the public.

Signed-in reading flags, bookmarks, evidence, daily checklist tasks, practice sessions and practice preferences are stored as separate versioned records. The server derives ownership from the authenticated user; it never accepts a client-supplied owner. Row-level security allows reads of only that user’s records. Direct client writes are denied; the write function uses an expected revision to prevent silent overwrites. Deletions are tombstones so disconnected devices cannot resurrect old records automatically.

Changes are cached and queued under each account on the device. Sync runs after edits, on sign-in, when returning to the app, when reconnecting, and every 60 seconds while visible. Conflicting edits to the same record are shown on `#/account` for an explicit local/cloud choice. Different topics, journal entries and daily tasks merge independently. A practice session is one record per scope; simultaneous changes to that same session require a choice. Offline work can be used after the site has loaded; this is not a service-worker/PWA offline installation.

Guest records remain in their existing browser keys and are not uploaded automatically. The account page offers an explicit, reviewed import that adds only missing keys after an initial cloud sync. Signing out returns to guest records; another account gets a separate cache. Theme remains device-specific. Local caches use browser storage and should not be treated as encrypted storage on a shared device. Export and complete cloud sync before clearing browser data.

`supabase/verify-progress-security.sql` checks isolation, anonymous denial, direct-write denial, and revision conflicts in a transaction that rolls back its test users and records. Local tests use blank cloud configuration and mocks, so they never send authentication emails or touch your live database.

## Android app

See [the mobile guide](docs/mobile-app.md) for architecture, account redirects, build commands, and the real-device acceptance checklist.

```sh
bun run dev:mobile        # Expo development server, scan with a development build
bun run android          # Launch a connected Android device / emulator
bun run build:android    # Verify and export the Android Hermes bundle (not an APK)
```

The Android app is in `apps/mobile/src`. Route files only compose screens. Reusable native components live in `components/`, complete screens in `screens/`, device adapters in `lib/`, and all visual tokens in `theme/`. The app uses native styles in TypeScript; no mobile CSS files are required. The website retains its Tailwind styling.

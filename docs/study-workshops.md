# Lesson study workshops

The website provides a study workshop for every shared lesson. Definitions live in `packages/content/src/study-guides.json`, keyed by permanent topic slug. Web metadata and generated Android offline content both include the structured guidance. The workshop controls are currently implemented in the website topic reader.

## Authoring standard

Each lesson needs a clear explanation and worked code in MDX, interview questions and facts in metadata, and these study fields:

- Prerequisite slugs: suggested reading, never access restrictions.
- A recall question that can be answered before revealing its comparison answer.
- A specific reconstruction task, a hidden hint, and a concrete edge-case challenge.
- The lesson code as the hidden worked reference, with reasoning and acceptance checks. Extensions are practice challenges, not claims of complete solved implementations.
- A suggested next lesson with no loops in the reading sequence.
- A study-guidance revision date, a nullable technical-review date, and honest version scope.

The November 19 additions standardize practice around existing examples; they do not certify execution or technical accuracy of every historical snippet. Technical-review dates remain unset until a reviewer actually checks the example against the cited reference and relevant environment. Update version scope and review date when performing that work, rather than setting a fresh date merely because formatting changed.

## Confidence

The website records `learning`, `explain`, or `implement` at `reading/confidence/{slug}` through the existing account-aware study store. Ratings are self-assessments, not measured skill scores; read flags, readiness scoring and practice results remain independent. Clearing a rating writes a null tombstone. Invalid stored ratings are ignored. Ratings use the existing offline queue and account sync, and portable backups validate and preserve them.

No new schema migration, service or dependency is required. The existing backend accepts the reading namespace. Shared content regeneration is required after guidance edits: `bun run content`. The full check validates complete coverage, valid links, acyclic prerequisite and next-step graphs, hidden hints and references, keyboard and agent controls, persisted confidence, and backup validation.

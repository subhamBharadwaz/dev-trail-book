# Weekly readiness

Open `#/readiness` on the website. Android has Weekly readiness from Today and Progress.

The dashboard is derived from existing records. It does not write analytics records or use a new service. Web guest preparation and reading data are combined with the newer persisted mistake/interview store; account views use only that account's records. Native uses its current SQLite-backed account or guest snapshot.

## Activity window

The current window is the seven local calendar days ending today, inclusive. Comparisons use the immediately preceding seven days. A day is active if it has a valid journal entry, a completed timed interview, or at least one checked daily task. Several records on one date count as one active day. Future journal dates and future completed sessions are excluded. A mock counts on its completion date, not its start date.

Practice logs, completed timed mocks, and independent coding/build logs are separate metrics. A user may journal a mock they also completed in the interview tool; those two metrics are not summed into a claimed count of unique interviews. Reading records have no completion timestamp, so they are shown as current coverage, never as weekly gains.

## Current signals

- Reviews combine open mistakes due on or before today and incomplete scheduled journal dates. Each outstanding journal date is a review. Native journal links open Progress, where existing review controls live; recording a new attempt opens the evidence form.
- Weak topics combine open mistakes with the latest rated occurrence of each mock prompt in the last 30 local days. Ratings of 0 or 1 indicate a gap; unrated answers are not zeroes. A newer rating of 2 or 3 clears that prompt's old mock signal, while an unresolved notebook mistake remains open.
- Priority uses open gaps plus three additional points per overdue notebook gap and two per low mock rating. The number is only an internal ordering rule, not a readiness score.
- The last five completed mocks are displayed oldest to newest, with assessed count and self-rated percentage. Different question sets are not a matched benchmark. Unrated mocks remain unassessed.
- Current lesson coverage is grouped by category. Reading completion is exposure, not proof of interview proficiency.

## Next actions

Up to three suggestions prioritize the oldest due review, a weak topic, and a mock needing assessment or a concrete next step. Remaining slots suggest a coding attempt, a first weekly mock, or closed-book recall. Behavioral gaps without a lesson or notebook entry open their source mock assessment. Actions to a particular mock select its id before navigating, so an unrelated current session is not opened by mistake.

The views use existing Tailwind classes on web and theme tokens on native. There are no new dependencies, CSS files, database migrations, paid APIs, deployment actions, or cloud APK builds. A standalone installation needs a later APK rebuild; development clients can load the JavaScript change from Metro.

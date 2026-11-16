# Mistake notebook

Open `#/mistakes` on the website, or use Mistake notebook from Today, Practice, or Progress on Android.

- Wrong quiz answers and flashcards graded “Needs another look” are captured automatically from new practice attempts. Existing session history is not backfilled.
- Each practice card has one notebook record. Repeated misses reopen it, preserve the reflection, and increase the miss count.
- Personal entries support a question, correct answer, previous answer, reflection, and local calendar retry date.
- Reveal only after trying to recall. A successful due review schedules the next attempt in one day, then three days. The third consecutive successful review marks it mastered. Early practice does not advance the streak. A miss resets the streak and schedules tomorrow.
- Search questions, topic names, categories, and reflections. Filter due, learning, mastered, or all entries. Reopen mastered entries or snooze an open entry.
- Entries use `practice/mistake/<id>` records within the existing Supabase RLS and compare-and-swap sync. No migration, new service, or dependency is required.
- Web guests use an isolated persisted notebook store. Account & sync can import missing guest entries after review. Native guests use the existing SQLite-backed progress store and reviewed guest import. Account records stay separate from guest data.
- Concurrent account edits use the existing conflict-resolution flow. Offline changes stay queued until connection returns.

The website uses Tailwind classes and UI SDK controls. Native screens reuse theme tokens and existing controls; the notebook list is virtualized. Both platforms share record validation, capture, and review rules in `packages/learning/src/mistakes.ts`.

A development client receives this change from Metro. Existing standalone APK installations need a newly built APK; no cloud build is started for this feature. Combine releases across features to conserve free build usage.

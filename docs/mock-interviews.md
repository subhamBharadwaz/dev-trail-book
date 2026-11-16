# Timed mock interviews

Open `#/interviews` on the website, or Mock interviews from Today, Practice, or Progress on Android.

## Session plans

- 15 minutes: two technical, one coding, one behavioral prompt.
- 30 minutes: three technical, two coding, two behavioral prompts.
- 45 minutes: four technical, two coding, two behavioral prompts.
- Mixed, JavaScript, React, and TypeScript focuses are available. Technical prompts come from the existing shared study bank. Coding prompts prioritize the focus and fall back to broader frontend exercises; behavioral prompts ask for real experience.
- Seeded selection varies sessions without changing a saved session. Prompts, reference guidance, and review criteria are snapshotted in each session so later content changes do not change old reviews.

## Timing and drafts

The shared model records elapsed active time and a resume timestamp. A running clock catches up after backgrounding, route navigation, or reload. Explicit pause freezes elapsed time. At zero, answer writes are rejected by the shared model as well as disabled in the UI. Users finish explicitly to enter review; time expiry never discards or submits drafts externally.

Answers save per prompt, independently of timer and navigation records. The existing local caches and Supabase compare-and-swap engine queue offline writes and flag concurrent edits. Web guest data remains in the same persisted study store used by the mistake notebook; existing guest notes are preserved. Reviewed account import includes both features.

## Review

Finishing requires an inline confirmation and locks original answers. Reference guidance and three review criteria become visible. Users rate each answer 0–3, write a reflection, and record session strengths and one next step. The summary reports a self-assessed percentage across rated answers only; zero ratings count, unrated answers do not.

A review can create one linked mistake-notebook entry per prompt. Repeated clicks cannot duplicate or overwrite that reflection. Technical and coding entries link to the original lesson where available. No automated or AI scoring, microphone access, code execution, paid API, or new database migration is used.

## Storage

- `practice/interview/<session-id>`: plan and clock state
- `practice/interview-answer/<session-id>/<prompt-id>`: answer and assessment
- `practice/interview-debrief/<session-id>`: strengths and next step
- `practice/interview-position/<session-id>`: current question
- `practice/interview-current`: selected session

These records reuse existing account isolation, RLS, conflict handling, and sync. Assessment and debrief fields remain editable after completion. No cloud APK build or deployment is started for this feature; the development client can load the JavaScript changes, and standalone installations need a future APK rebuild.

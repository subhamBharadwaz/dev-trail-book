# Backups, personal app updates, and study alerts

## Backup and restore

Web: Account & sync → Export & restore, or `#/backup`. Android: Your space → Export & restore study data.

JSON version 1 exports contain reading and bookmark values, preparation entries and daily tasks, flashcard/quiz sessions and preferences, notebook entries, and interview sessions, answers, positions, and debriefs. Known lessons include explicit false reading/bookmark values so matching restores preserve unread states. Exports include queued local edits. Authentication sessions, tokens, theme preferences, notification permissions, and credentials are excluded. Notes and interview answers are personal data; keep the file private.

Android can save to a user-selected local folder, share a copy, or select a JSON file to restore. Web downloads JSON and accepts a file or pasted JSON. There is an 8 MB file limit, 10,000-record limit, per-record limits, schema validation, and a study-key whitelist. A malformed file does not partially apply.

Restore defaults to missing records only. The optional matching mode uses backup values for matching keys, including tombstones, without deleting records absent from the file. The preview states additions, replacements, and records kept. Account changes invalidate the preview; changes are recalculated against the current records when applying. Unresolved sync conflicts block import/export until reviewed. Account writes retain the existing compare-and-swap sync behavior. Guest web restores map old reading/journal/practice storage and newer feature records, then offer a reload for legacy hooks. A storage failure attempts to restore the previous values and retains the input file for retry.

## In-app updates

The new 1.1.0 APK bootstraps `expo-updates`. An older APK without this native module must be replaced once. Both build variants retain their existing Android package ids and signing keys.

- Personal standalone profile: `preview`, channel `personal`, environment `preview`, `APP_VARIANT=preview`.
- Development client: channel `development`; Metro handles development changes.
- Production profile: separate `production` channel.
- Runtime policy: `fingerprint`, so updates must match native code/configuration.
- Updates are checked/downloaded on launch, with an additional throttled foreground check and a manual check in Your space. A downloaded update shows a notice and changes the tab header account icon. Restart is explicit in Your space, with a confirmation. No automatic restart interrupts an answer or timed session. Downloaded updates can also apply on a later cold start.
- Saved records and drafts persist before restart. A storage error blocks an explicit reload and directs the user to export a backup.

Publish a compatible Android update from the repository root:

```sh
bun run content
bun run check
bun run update:android --message "Describe the update"
```

The script uses the personal channel and preview environment to match the standalone APK. Do not add secrets to the update bundle; only the public Supabase client configuration belongs there. New native modules, SDK upgrades, or native permission/config changes require a replacement APK, not an OTA-only release. Expo's free tier currently supports updates for 1,000 monthly active users; no paid plan or paid Expo Workflow is enabled here.

## India-time local study notifications

Your space → No more “later” → Enable India-time study alerts. Android asks for notification permission only when enabled. Slots are 09:00, 13:00, 17:00, and 21:00 Asia/Kolkata, four hours apart within the requested 09:00–22:00 window. UTC timestamps are calculated explicitly so the scheduled instants do not follow the phone's timezone.

The next 14 days (up to 56 alerts) are scheduled on the device, including while the app is closed or offline. Opening the app renews the rolling schedule, throttled to six hours. If the app is never opened for 14 days, the finite schedule runs out. Android battery saving, reboot behavior, force-stop, and permission settings affect delivery; actual Android delivery timing still needs a device check. No push token, Firebase setup, Supabase cron job, paid service, or remote tracking is needed.

Foreground notifications are suppressed. Tapping an alert opens Today. Repeated schedules preserve existing identifiers and remove obsolete owned alerts; disabling only cancels this app's study alerts. The old single daily reminder is removed on startup to avoid duplicate notifications. Motivational lines are firm, task-focused, and rotated. The app's native navigation header has separate short lines, enabled by default and switchable to a quiet title in Your space. The Vite website does not show these motivational headers or schedule notifications.

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

## Standalone APK release notices

The Android app also checks public GitHub Releases on launch and when returning to the foreground, at most once per six hours. Your space → Android APK releases provides a manual retry, the installed native build number, release notes, and a Download latest APK button. A newer release shows a dismissible in-app notice; choosing Later hides that build’s notice, while its download remains in Your space. A subsequent newer build gets its own notice. Checks do not run on the website or in the development client, and do not send study records or credentials to GitHub.

The download button opens the exact standalone APK asset in your browser. Open the downloaded file and approve Android’s installation prompt. Keep the existing app installed to preserve its local data. There is no silent installation and no background push notification for app releases: checks happen while the app is running. Cached release information remains available if a refresh fails; manual checks report network or rate-limit errors without blocking study.

Native build numbers come from the installed ExpoApplication module already bundled through expo-notifications, rather than mutable OTA configuration. No new native module is needed for this checker. The existing update-enabled 1.1.0 standalone app can receive it as a compatible Expo update; older APKs without expo-updates still need the initial standalone upgrade.

### Publish a future APK release

1. Build the `preview` profile in EAS. Its remote Android version code increments automatically; retain the same package ID and signing key.
2. Write release notes in a local Markdown file.
3. From the repository root, run:

```sh
bun run release:android --build EAS_BUILD_ID --notes /path/to/release-notes.md --publish
```

Omit `--publish` to prepare a draft for review. This requires your existing Expo and GitHub CLI logins, not a paid service. The script rejects development profiles, other projects, and unfinished builds. It downloads the existing signed APK through EAS, checks the archive, creates a draft GitHub Release, uploads its APK and SHA-256 checksum, then publishes when requested. It does not build a new APK. Published assets should not be replaced: create a new build/release instead.

Only stable releases in `subhamBharadwaz/dev-trail-book` matching `android-vVERSION-BUILD` with the matching uploaded `dev-trailbook-vVERSION-BUILD.apk` asset are eligible. The app checks the newest 20 GitHub releases and selects the highest eligible native build number. Source-only releases, drafts, prereleases, development APK names, and foreign download URLs are ignored. GitHub hosting provides transport; Android verifies the installed package’s signing identity during upgrade.

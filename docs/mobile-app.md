# Dev Trailbook Android app

## Experience

Android first, with iOS-compatible screens. Expo SDK 58 / React Native 0.88 / React 19.3. Expo Router provides Material native tabs on phones and a navigation rail at 768 points and wider. Native stacks provide back navigation and Android predictive back. Expo UI renders buttons, checkboxes, switches, and pickers through Jetpack Compose on Android.

Today leads with the next task. Learn offers full-text search, categories, bookmarks, and unread filtering. Lessons render the generated Markdown syntax tree as native text, lists, tables, and syntax-colored code with copying. Practice shares the website’s exact card IDs, answer options, and resumable-session schema. Progress offers evidence logging and the same delayed review dates as the website.

Light: warm paper, dark ink, indigo accent. Night: warm charcoal, cream text, muted lavender. Device preference is the default. Reading size is adjustable from 17 to 23, in addition to system font scaling. Themes and reminder choices stay on each device. Touch controls have at least 48-point targets where implemented in React Native; Expo UI controls follow platform sizing. Screen bodies have a bounded reading width; code and tables scroll inside their own regions.

No decorative loading animations or invented readiness scores. Local content opens without a network request. Sign-in, empty search, account failures, conflict resolution, and missing lessons have deliberate states.

## Shared content

Edit `packages/content/lessons/*.mdx`, then run `bun run content`. This evaluates only trusted repository-owned metadata during the build, parses Markdown into a syntax tree, and precomputes GitHub Dark syntax token colors. Unsupported executable MDX components must be given a native renderer before adding them: the current corpus uses text, headings, code, lists, links, and one table.

The generated `packages/content/src/topics.json` is committed so Metro can bundle every lesson offline. The web still compiles original MDX and lazy-loads bodies. Content tests enforce source coverage and valid questions.

## Storage and accounts

Native reading/practice/evidence progress uses synchronous SQLite key-value storage. Supabase sessions use SecureStore, split into small chunks with a generation manifest to handle native per-item limits. The web preview uses localStorage for progress and sessionStorage for authentication; it is a layout/testing target, not the public Vite website.

`packages/sync` contains the shared progress store and sync engine. Platform adapters supply storage, network status, and lifecycle events. Mobile syncs after edits, on foreground, reconnect, and every minute while active. Writes use the existing `trailbook_write_record` RPC and expected revisions. Conflicts require an explicit local/cloud choice. Guest data and each account have isolated caches. Guest import is reviewed and adds only keys absent from the account after a successful initial sync.

The app performs no new database migration. It uses the existing Supabase RLS and ownership-enforcing RPC.

## Environment and authentication

Copy `apps/mobile/.env.example` to `apps/mobile/.env.local` and supply only the public Supabase URL and publishable key. Never place a service-role key or database password in an app build.

Supabase Authentication → URL Configuration must allow the exact native callback:

`devtrailbook://auth/callback`

Keep the website’s existing redirects. For the optional browser preview, add its exact origin plus `/auth/callback`, such as `http://127.0.0.1:8082/auth/callback`. PKCE email links must be opened on the device that requested the link. Native link completion must be tested in an installed build. The app validates the callback scheme, host, and path before exchanging its code.

## Cloud builds

Run EAS commands from `apps/mobile`. The workspace uses one Bun lockfile at the repository root and hoisted installs to avoid duplicate native-module instances.

```sh
bunx eas-cli@latest login
bunx eas-cli@latest init
bunx eas-cli@latest build --platform android --profile preview
```

The `preview` profile produces a standalone installable APK with bundled lessons and no development server requirement. `development` produces a development client for local coding. `production` uses the store build format; store submission is a separate step.

Configure the public Supabase environment values for the preview build environment, or pass them through the preview profile’s public `env` fields. `.env.local` is ignored and must not be relied on for cloud uploads. Check `eas build:inspect --stage archive` before uploading if changing ignore rules.

## Verification

```sh
bun run check
bun run build:android
cd apps/mobile
bunx expo-doctor
```

Before calling the app release-ready, install the APK on Android and check:

- Sign in through the email link and verify a marked lesson appears on the website.
- Edit offline, force-close, reopen, reconnect, and verify the queued edit syncs.
- Change the same practice session on two devices and choose the intended conflict version.
- Sign out and sign into a second account; verify there is no cross-account progress leak.
- Check phone and tablet layouts, system large text, TalkBack, keyboard avoidance, and predictive back.
- Enable a reminder, change its hour, turn it off, and test a notification tap from a closed app.

A successful Hermes export verifies bundling; it does not replace an APK compilation or device testing.

## Developing on your phone

The SDK 58 development build installs as **Dev Trailbook Dev** (`com.devtrailbook.app.dev`) alongside the standalone app. Supabase uses the same backend, while each installed app has its own local guest cache and secure session. The development callback is `devtrailbook-dev://auth/callback`.

Install the development APK once, then from the repository root:

```sh
bun run dev:mobile
```

Open Dev Trailbook Dev and scan the QR code. Your phone and computer need a reachable connection, normally the same Wi-Fi network. If the LAN connection is blocked, run `bun run --cwd apps/mobile start --tunnel` instead. React/TypeScript changes use Fast Refresh. Native dependency changes, SDK upgrades, and native configuration changes need a new development APK.

The default local app config is the development variant. EAS `preview` and `production` explicitly select their own variant; inspect a standalone config with `APP_VARIANT=preview bunx expo config --type public`.

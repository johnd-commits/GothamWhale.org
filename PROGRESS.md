# Tide Line progress

## Phases 5 through 15 - Play, observer, web, and release notes

Status: complete on branch `phase-05-rest`.

### Built

- My Whale lists sample cards when the catalog is empty, follows a whale once, caches cards, and can read a tale aloud on the device.
- A whale card opens a detail screen that is not a tab. The map uses rounded sample spots until a research-grade row exists.
- Play matches one tail against three or four choices, shows the mascot hint, and raises difficulty with a streak. A careful-matcher flag stays off the kid badge shelf.
- Harbor quests check a circle on the device only after a grown-up allows location. The save is a quest id and a date. An at-home quest needs no location.
- Calm offers a one-minute breath, a two-minute song, and a three-minute noticing exercise. Only the minutes are saved.
- Badges use the event rules, including a top-explorer flag after seven days and five badges.
- Observer mode is behind the PIN. It checks the date, photo time, harbor water, and duplicates, then queues the adult report on the device. Staying 100 yards away is a separate note. No points are given for being close.
- The website map shows rounded spots. Science review exports Darwin Core from the public view. The teacher desk shows this device's progress. Adopt a Whale pledges through a placeholder and lists the app-store payment questions.
- `PRIVACY_AUDIT.md`, `STORE_LISTINGS.md`, `DEPLOY.md`, and `eas.json` are in the repo.

### Packages

- `expo-speech` speaks with the device voice. This app does not send the tale to a speech server.
- `expo-location` reads a foreground position for a quest circle. It does not save the child's coordinates and it does not phone home with them.

### Files changed

- `src/app/(kids)`, `src/app/(observer)`, `src/app/(web)`, `src/app/(grown-ups)/grown-ups.tsx`
- `src/lib/harbor.ts`, `src/lib/fluke-match.ts`, `src/lib/ocean-minutes.ts`, `src/lib/quests.ts`, `src/lib/badges.ts`, `src/lib/sighting-checks.ts`, `src/lib/darwin-core.ts`, `src/lib/payments.ts`, `src/lib/play-progress.ts`, `src/lib/location-preference.ts`, `src/lib/sighting-queue.ts`
- `src/components/adult-gate.tsx`, `src/components/sighting-map.tsx`
- `PRIVACY_AUDIT.md`, `STORE_LISTINGS.md`, `DEPLOY.md`, `eas.json`, `README.md`, `app.json`

### Checks

- tsc: pass
- expo lint: pass
- expo-doctor: 21/21 pass
- tests: 31 passed
- export: iOS, Android, and web bundles created, then `dist/` deleted
- database: schema unchanged

### Known issues

- EAS is not logged in on this machine, so a preview phone build was not started.
- The Supabase CLI is not logged in here, so hosted advisors were not pulled. The privacy audit lists that gap.
- Sample catalog rows are still not loaded in production. Empty tables fall back to sample cards.
- The consent step and the payment step are still placeholders.
- The grown-up PIN is an unsalted hash of four digits on the device.
- `gh` is not installed, so this branch was not opened as a pull request from this shell.

### Next

No further phase in the master plan. Vercel still deploys `main`. This work is on `phase-05-rest`.

## Phase 4 - Adult sign-up, consent, and child profiles

Status: checkpoint posted. Waiting for "continue".

### Built

- Grown-up email sign-up and sign-in, with a plain-language privacy notice.
- ConsentProvider interface and a placeholder that records granted consent and the time. It does not send the email anywhere.
- Child profiles use a nickname list, an avatar list, and an age band. Kids switch profiles without an account.
- PIN gate for grown-ups. Sound, notices, account, and delete-this-child are behind it.
- Delete is a hard delete. The database cascades the child's follows, badges, quest completions, dex entries, and class memberships.

### Files changed

- `src/lib/adult-account.ts`, `src/lib/consent.ts`, `src/lib/child-records.ts`, `src/lib/pin.ts`
- `src/app/(grown-ups)`, `src/app/(kids)/index.tsx`, `src/components`
- `README.md`, `PROGRESS.md`

### Checks

- tsc: pass
- expo lint: pass
- expo-doctor: 21/21 pass
- tests: 21 passed
- export: iOS, Android, and web bundles created, then dist/ deleted
- database: schema unchanged

### Known issues

- The consent step is a placeholder until a real provider is chosen.
- The PIN is a hash of 4 digits stored only on the device.
- Notices are an on/off setting on the device. The app does not request a push token.
- Sign-up needs the public Supabase URL and anon key in the environment. No account was created during the browser check.

### Next phase

Phase 5. Do not start until the user replies "continue".

## Phase 3 - Database schema and security

Status: complete.

### Built

- Tables for adults, children, whales, flukes, sightings, follows, badges, quests, tales, ocean dex, classes, and adoptions.
- Row level security on every table. A public sightings view rounds coordinates to 2 decimals.
- pgTAP tests for cross-family access, child location columns, and verification updates.
- Sample seed for a local reset. It is not part of the migration.

### Files changed

- `supabase/migrations/20260927150000_tide_line_schema.sql`
- `supabase/seed.sql`
- `supabase/tests/rls_and_privacy.sql`
- `supabase/config.toml`
- `src/lib/__tests__/schema.test.ts`
- `README.md`, `PROGRESS.md`

### Checks

- tsc: pass
- expo lint: pass
- expo-doctor: 21/21 pass
- tests: 12 passed
- export: iOS, Android, and web bundles created, then dist/ deleted
- database: migration 20260927150000_tide_line_schema.sql applied to production on 2026-09-27. Sample seed was not loaded.

### Known issues

- The direct database host is IPv6-only. The migration went through the us-west-2 pooler. Browser login is still unavailable in this shell, so the project is not linked in the CLI.
- Docker is not installed, so local `supabase db reset` cannot run the pgTAP file.
- Scientist and admin roles cannot be chosen at signup. Those rows are created by the database owner.
- The sample seed stays out of production until it is run on purpose.

### Next phase

Phase 4 - Grown-up lock. Do not start until the user replies "continue".

## Phase 2 - Design system and juice

Status: complete.

### Built

- Ocean palette, Nunito, spacing, and 48px tap targets.
- SquishButton, OceanBackground, Celebration, Mascot, and WhaleCard.
- Sound on/off saved only on the device, controlled from Grown-ups.
- Motion follows the device reduce-motion setting.
- Hidden component preview at `/dev`.

### Files changed

- `src/theme`, `src/components`, `src/app`, `src/lib`
- `assets/sounds`, `assets/lottie`, `assets/images/sample-fluke.png`
- `jest.setup.js`, `package.json`, `package-lock.json`, `app.json`, `README.md`, `PROGRESS.md`

### Checks

- tsc: pass
- expo lint: pass
- expo-doctor: 21/21 pass
- tests: 8 passed
- export: iOS, Android, and web bundles created, then `dist/` deleted
- database: not changed

### Known issues

- `expo-av` is gone in SDK 57. Sound uses `expo-audio`.
- The mascot file slot in `src/components/mascot-file.ts` is empty until the illustrator file arrives. The drawn whale shows idle, happy, thinking, and cheer. The Rive view needs a development build, not Expo Go.
- Web export is still one client bundle.
- There is still no dev Supabase project.

### Next phase

Phase 3 - Database schema and security. Do not start until the user replies "continue".

## Phase 1 - Scaffold and navigation

Status: complete.

### Built

- Expo SDK 57 app with Expo Router and TypeScript strict mode.
- Kid tabs: Home, My Whale, Play, Calm, Badges.
- Separate areas for grown-ups, Observer mode, and web pages (teacher, science review, public map, adopt a whale).
- Supabase client that reads only the public URL and anon key.
- ESLint, Prettier, and Jest. Four tests pass.

### Files changed

- Expo app under `src/app`, `src/components`, and `src/lib`
- `package.json`, `package-lock.json`, `app.json`, `tsconfig.json`, `eslint.config.js`, `.prettierrc.json`
- `README.md`, `.gitignore`, `assets/images/*`, `PROGRESS.md`

### Checks

- tsc: pass
- expo lint: pass
- expo-doctor: 21/21 pass
- tests: 4 passed
- export: iOS, Android, and web bundles created, then `dist/` deleted
- database: not changed

### Known issues

- Web export is a single client bundle. Static pre-render crashed in Node with `requestAnimationFrame is not defined`.
- npm warns that `react-native-worklets` 0.13, pulled in by Expo Router, does not match the optional 0.10 range of `expo-modules-core`. Expo Doctor did not fail.
- Grown-ups is reachable from Home. The PIN lock is Phase 4. The screen has no forms and no purchase buttons.
- Kid tabs show a default chevron until Phase 2 adds real icons.
- This branch includes Phase 0 because that branch is not on `main` yet.
- GitHub CLI is still missing, so the pull request was not opened.

### Next phase

Phase 2 - Design system and juice. Do not start until the user replies "continue".

## Phase 0 — Environment check and project rules

Status: complete. Phase 1 is the next checkpoint.

### Built

- Cursor rule with the non-negotiable privacy, security, and tech-stack rules.
- Environment template and gitignore. No app code.

### Files changed

- `.cursor/rules/tideline.mdc`
- `.env.example`
- `.gitignore`
- `PROGRESS.md`

### Checks

No app code, so TypeScript, lint, Expo Doctor, tests, and export were not run.

| Check | Result |
| --- | --- |
| Node | v24.14.0 (`C:\Program Files\nodejs\node.exe`) |
| npm | 11.12.1 |
| git | 2.55.0, remote `https://github.com/johnd-commits/GothamWhale.org.git`, branch tracking works |
| Expo CLI | Not installed globally. `npx expo --version` resolved to 57.0.27 (temporary download, not a project dependency) |
| EAS CLI | eas-cli 18.4.0 installed. `eas whoami` reports not logged in |
| Supabase CLI | Missing |
| Vercel CLI | Missing. No `~/.vercel` login |
| Docker | Missing |
| GitHub CLI (`gh`) | Missing, so a pull request was not opened |
| Supabase env | `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are not set |
| Linked Supabase project | None. `~/.supabase` has telemetry only, no project ref |

DEV vs PRODUCTION, from the dashboards on 2026-09-27:

- PRODUCTION Supabase project ref: `uylisptwrzyqrijzxs` (GothamWhale.org, Free plan). The dashboard labels the database `main (PRODUCTION)`. GitHub integration was not enabled in the screenshot. Do not run migrations against this project unless the user types "production".
- DEV Supabase project: still missing. A second project is required before Phase 3.
- Vercel project `gotham-whale-org` (team johnd-1094's projects) is connected to this GitHub repo. Production deployment of `f31941c` is Ready at https://gotham-whale-org.vercel.app. No custom domain. The empty page is expected because the repo is still a README.

### Known issues

- There is still no DEV Supabase project. Do not enable Supabase GitHub integration while "Deploy to production" is on, because merges to `main` would change the production database.
- EAS is installed but nobody is logged in.
- Supabase CLI, Vercel CLI, Docker, and GitHub CLI are still missing on this machine. The Vercel project exists in the dashboard even though the CLI is not installed locally.
- Pull request was not opened because `gh` is not installed.

### Next phase

Phase 1 — Scaffold and navigation. Do not start until the user replies "continue".

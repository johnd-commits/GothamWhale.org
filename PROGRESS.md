# Tide Line progress

## Phase 0 — Environment check and project rules

Status: checkpoint posted. Waiting for "continue".

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

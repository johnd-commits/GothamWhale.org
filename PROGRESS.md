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

DEV vs PRODUCTION: not identified. There is no Supabase CLI, no project link, and no keys.

### Known issues

- Cannot name the DEV Supabase project until the CLI is installed and a project is linked, or env values are provided.
- EAS is installed but nobody is logged in.
- Vercel is not installed or logged in.
- Docker is missing, so local `supabase db reset` cannot run until both Docker and the Supabase CLI exist.
- Pull request was not opened because `gh` is not installed.

### Next phase

Phase 1 — Scaffold and navigation. Do not start until the user replies "continue".

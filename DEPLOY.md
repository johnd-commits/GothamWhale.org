# Deploying Tide Line

## App

```bash
npm install
copy .env.example .env.local
npx expo start
```

Put only `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in the env file. Do not put the service role key in the app.

Web export is one client bundle because `web.output` is `single`. Delete `dist/` after `npx expo export`.

## Database

Schema lives in `supabase/migrations`. Apply a new migration to the production project with the session pooler in `us-west-2`, user `postgres.<project-ref>`, and `--dns-resolver native`. Do not include the sample seed. Do not run `supabase db reset` against production.

The direct database host is IPv6-only. This network could not resolve it. The pooler path worked on 2026-09-27 for `20260927150000_tide_line_schema.sql`.

The Supabase CLI is not logged in from this shell, and `gh` is not installed.

## Website

The Vercel project `gotham-whale-org` deploys the `main` branch. These phase branches are not that deployment. A preview appears when the branch is pushed and Vercel builds it. Do not turn on a Supabase GitHub integration that deploys database changes on every merge to `main`.

## Phone builds

`eas.json` has `preview` and `production` profiles. A preview build was not started here because the EAS account is not logged in on this machine. From a logged-in shell:

```bash
npx eas-cli build --profile preview --platform android
```

That command needs an Expo account. It is not required to run the app locally.

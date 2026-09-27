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

The Supabase CLI is not logged in from this shell. GitHub CLI is installed for the `johnd-commits` account.

## Temporary website

The kid app and the grown-up web pages are already in this repo. Home, My Whale, Play, Calm, and Badges work in the browser. `/map` is public. `/teacher`, `/admin`, and `/donate` ask for the grown-up PIN.

This side project does not use the organization's `gothamwhale.org` domain. Publish it as its own Vercel project and leave that domain off until you have access to add it.

1. In Vercel, choose Add New Project and import `johnd-commits/GothamWhale.org`.
2. Leave the framework preset as Other. `vercel.json` supplies the build command and the `dist` output.
3. Add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` for Production. Use the public project URL and the anon key. Leave the service role key out.
4. Set the production branch to `phase-05-rest` for the temporary site.
5. Deploy. The address will be a `*.vercel.app` URL that belongs to this project.
6. When you have access to `gothamwhale.org`, add that domain in the Vercel project's Domains settings. Until then, leave it off this project.

Do not turn on a Supabase GitHub integration that deploys database changes on every merge.

## Phone builds

`eas.json` has `preview` and `production` profiles. A preview build was not started here because the EAS account is not logged in on this machine. From a logged-in shell:

```bash
npx eas-cli build --profile preview --platform android
```

That command needs an Expo account. It is not required to run the app locally.

# Tide Line

Tide Line is a free Gotham Whale app. Kids follow New York humpback whales, practice tail matching, take quiet ocean minutes, and earn badges on the device. Grown-ups use Observer mode. Phone builds use Expo EAS, not Vercel. The website routes for the teacher desk, science review, public map, and Adopt a Whale are in this same Expo app.

## Setup

1. Install Node.js and npm.
2. Install dependencies:

```bash
npm install
```

3. Copy the environment template and fill in the public Supabase values:

```bash
copy .env.example .env.local
```

`EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are the public project URL and the public anon key. Do not put the Supabase service role key in this app.

The linked production project ref is `uylijsptwrzyygrjzxas`.

4. Start the app:

```bash
npx expo start
```

Press `w` for web.

## Routes

Kids tabs: Home, My Whale, Play, Calm, Badges.

A whale card opens `/whale/[id]`. That screen is not a tab.

Separate areas:

- `/grown-ups` for parents and teachers
- `/observer` for adult sightings
- `/teacher`, `/admin`, `/map`, and `/donate` open on the website. On a phone they return home.
- `/dev` is the component preview. Open it from Grown-ups. It is not a kid tab.
- Grown-ups asks for a 4-digit PIN. The account, child profiles, sound, notices, quest location, Observer, science review, teacher desk, and Adopt a Whale are behind that PIN. The public map is not.

Quest location stays off until a grown-up allows it. A quest check does not save where the child is.

## Packages added for speech and quests

`expo-speech` speaks a tale with the device voice. It does not send the story to a server from this app.

`expo-location` reads a foreground position only after a grown-up allows quest checks and the operating system grants permission. The reading is compared with a quest circle on the device and is not written to storage.

## Checks

```bash
npx tsc --noEmit
npx expo lint
npx expo-doctor
npm test
npx expo export --platform ios --platform android --platform web
```

Delete the `dist/` folder after export. It is gitignored.

Web export uses one client bundle (`web.output` is `single`). Pre-rendering each page in Node failed because `requestAnimationFrame` is missing there. The phone bundles are unchanged.

## Database

Schema and row level security live in `supabase/migrations`. `supabase/seed.sql` is sample catalog data for a local reset. `supabase db push` does not load that seed.

This environment has one Supabase project, and it is production. On 2026-09-27 the project owner said to work on the main line and to apply schema changes there. The app still uses only the public anon key.

See `DEPLOY.md`, `PRIVACY_AUDIT.md`, and `STORE_LISTINGS.md`.
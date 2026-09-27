# Tide Line

Tide Line is a free Gotham Whale app. Kids follow New York humpback whales. Grown-ups use Observer mode. This repo is the Expo app. Vercel will host the teacher, science, map, and donation pages later. Phone builds use Expo EAS, not Vercel.

## Setup

1. Install Node.js and npm.
2. Install dependencies:

```bash
npm install
```

3. Copy the environment template and fill in the **dev** Supabase project only:

```bash
copy .env.example .env.local
```

`EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are the public project URL and the public anon key. Do not put the Supabase service role key in this app. Do not point local development at the production project (`uylisptwrzyqrijzxs`) unless you explicitly decide to.

4. Start the app:

```bash
npx expo start
```

Press `w` for web.

## Routes

Kids tabs: Home, My Whale, Play, Calm, Badges.

Separate areas:

- `/grown-ups` for parents and teachers
- `/observer` for adult sightings
- `/teacher`, `/admin`, `/map`, and `/donate` open on the website. On a phone they return home.
- /dev is the component preview. Open it from Grown-ups. It is not a kid tab.

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

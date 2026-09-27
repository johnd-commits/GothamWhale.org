# Tide Line privacy audit

Checked on 2026-09-27 against the app in this repo and the production schema migration `20260927150000_tide_line_schema.sql`.

## What stays off the app

- Children do not get accounts, email addresses, free-text fields, chat, ads, or an analytics or crash SDK.
- The app does not call `getExpoPushTokenAsync`. `expo-notifications` is not installed. The notices switch is a boolean stored on the device.
- Quest saves store a quest id and a date. They do not store a child's coordinates.
- Calm saves store a session id and the minutes completed.
- The public map reads `public_sightings`, which keeps research-grade and published rows and rounds latitude and longitude to two decimals.
- `expo-speech` speaks a tale on the device. The tale text is not sent to a speech service by this app.
- `expo-location` runs only after a grown-up turns quest location on and the operating system allows it. The reading is used for a radius check and then dropped.
- The payment screen uses a placeholder. It records a pledge in memory and does not charge a card.
- The client uses the public Supabase URL and anon key. The service role key is not in client code.

## What is stored

- A grown-up session can be stored by the Supabase client in AsyncStorage.
- The grown-up PIN is a SHA-256 hash of four digits, stored only on the device. It is not salted, so a four-digit PIN can be guessed offline from that hash.
- Child profiles store a nickname from a fixed list, an avatar from a fixed list, and an age band.
- Follows, fluke practice, calm minutes, tales, quests, badges, and the careful-matcher flag are stored on the device.
- After a grown-up allows a precise spot, Observer mode keeps that adult report in AsyncStorage under `tideline-sighting-queue`. That queue has no child id.
- Whale cards, the weekly tale, and public map points can be cached on the device so the screens still open offline.

## Fixes already in the app

- Kid quest and calm records have no location fields. Unit tests check that shape.
- The grown-up area, Observer, science review, the teacher desk, and Adopt a Whale sit behind the on-device PIN.
- The public website map does not sit behind the PIN, and it uses the rounded view.
- Wildlife copy tells families to go with a grown-up and to stay at least 100 yards from whales. Matching a sighting does not award points for being close.

## Still open

- The consent step records granted consent and a timestamp on the device. It does not yet call a consent vendor.
- Browser login for the Supabase CLI is unavailable in this shell, so the hosted advisor report was not pulled.
- A parent who already knows a class id can enroll their own child. That rule is in the database policies.
- Sample whale cards are shown when the catalog is empty. They are labeled in the app as the follow list, and the detail map uses sample rounded points until a live research-grade row exists.
- EAS is not logged in on this machine, so a store build was not produced from here.

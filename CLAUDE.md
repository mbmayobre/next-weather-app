# CLAUDE.md

## Project

Next.js + Tailwind weather app. Live data comes from OpenWeatherMap (One Call 3.0,
Air Pollution, and Geocoding APIs), proxied through Next.js Route Handlers in
`src/app/api/{weather,air-quality,geocode}` (shared helpers in
`src/app/lib/openweather.ts`) so the API key stays server-side. The browser calls
those routes from `src/app/weather/weather.tsx`. The routes rate-limit per IP
(`src/app/lib/rate-limit.ts`) and cache upstream responses server-side in Next's
Data Cache (10 min weather/AQI, 1 day geocoding); there is no client-side cache.
`weather.tsx` is the single
stateful data-fetching hub; components under `src/app/features/` are dumb,
prop-driven cards that derive their own display/background variant from the shared
`weather`/`aqi` objects via helpers in `src/app/service/`.

## Conventions

### Keep documentation and comments current with every change

Any code change must carry its documentation with it, in the same commit:

- **`README.md`** — update it whenever behavior, structure, setup, scripts, env
  vars, API routes or known gaps change. It is written for a developer seeing
  the repo for the first time; keep the architecture section, the data-flow
  diagram and the route table true.
- **`.env.example`** — update it whenever an env var is added, renamed or
  removed. Never put real secrets in it.
- **Comments in the code** — every file opens with a block comment saying what
  it is for and how it fits the whole. Keep it accurate when the file's job
  changes, and comment any non-obvious decision inline: unit conversions, API
  quirks, why a workaround exists. Explain *why*, not *what* the line does.
- **This file and `AGENTS.md`** — they are identical except for the H1. Apply
  every edit to both, and record finished work under Done and new findings
  under Left to do.

If a change makes an existing comment or doc wrong, fixing it is part of the
change, not follow-up work.

## Status (2026-09-30)

### Done
- Reviewed the repo end-to-end and identified improvement areas (analysis only —
  no code changes made).
- Walked through the full data flow: OpenWeatherMap → `weather.tsx` state →
  `features/*` presentational components.
- **Bug fix:** `service/image-requests.ts` — `getIconFromCode`'s thunderstorm
  range check now reads `code >= 200 && code < 210` (was `code === 200 && ...`),
  so codes 201/202 map to a thunder icon instead of falling through to
  `default: 'clear-day'`.
- **Bug fix:** `weather.tsx` reverse-geocoding URL's stray double `&&`
  (`limit=5&&appid=...`) is now a single `&`.
- **Cleanup:** `handleFetchWeatherData` in `weather.tsx` now fires its three
  fetches via `Promise.all([...])` instead of three unawaited calls.
- **Cleanup:** `fetchWeather`, `fetchAirQuality`, `fetchLocationName` in
  `weather.tsx` now share a generic `fetchJson<T>(url, errorMessage, setData)`
  helper (`start`/`stop`/`setError` live inside it) instead of repeating the
  fetch/try/catch block three times. `fetchLocationName` passes an inline
  `(data: location[]) => setLocation(data[0])` setter since only that endpoint
  returns an array — `fetchJson` itself stays shape-agnostic. Each wrapper
  function `return`s the `fetchJson(...)` call so `Promise.all` in
  `handleFetchWeatherData` actually waits on the real requests, not
  already-resolved promises. Committed as `2813a60`.
- **Security:** OpenWeatherMap calls now go through Route Handlers
  (`/api/weather`, `/api/air-quality`, `/api/geocode`); env vars dropped the
  `NEXT_PUBLIC_` prefix so the key is no longer in the client bundle. The server
  validates lat/lon (numeric, in range → else 400). `/api/geocode` always returns a
  single `location` object for `?q=<zip|city>` or `?lat&lon` (404 if no match).
  Pending: user will rotate the OpenWeatherMap key after deploying.
- **Docs:** `README.md` rewritten from the create-next-app boilerplate into a
  full guide (setup, env vars, data-flow diagram, directory map, a "Next.js
  concepts used here" section, per-layer reference, common tasks, known gaps).
  Added `.env.example` (with a `!.env.example` exception in `.gitignore`, since
  `.env*` was ignoring it). Added file-header block comments to every file under
  `src/` plus inline comments for the non-obvious parts (unit conversions, the
  Tailwind dynamic-class trap, day/night icon selection, the loading counter).
- **Cost/abuse protection for the API proxy** (branch
  `feature/add-caching-and-rate-limiting-to-api-proxy`):
  - *Caching:* `fetchOpenWeather` now takes a `revalidateSeconds` argument and
    passes `next: { revalidate }` (Next 15+ doesn't cache Route Handler fetches
    by default). `WEATHER_CACHE_SECONDS = 600` for weather/AQI,
    `GEOCODE_CACHE_SECONDS = 86_400` for geocoding. `parseCoords` rounds lat/lon
    to 2 decimals (~1.1 km) because the cache key is the full upstream URL and
    raw geolocation coords would almost never hit. Next only caches 200s, so
    upstream errors aren't stored.
  - *Rate limiting:* new `lib/rate-limit.ts`; every route starts with
    `const limited = rateLimit(req); if (limited) return limited;`. Fixed window,
    60 requests/min per IP (≈15 searches, since one search = 4 calls), in-memory
    `Map` with a sweep once it passes 10k keys. Rejected requests don't count.
    429 uses the usual `{ error }` shape plus `Retry-After`. IP from the
    left-most `x-forwarded-for`, else `x-real-ip`, else a shared `"unknown"`
    bucket. Done in the handlers rather than `proxy.ts` (Next 16's renamed
    middleware), following Next's backend-for-frontend guide.
  - Verified against `next start`: nearby coords hit the cache (0.57s → 0.01s);
    request 61 from one IP gets a 429 with `Retry-After`; other IPs are
    unaffected.

### Left to do
- **Lint:** `npm run lint` is broken — it runs `next lint`, which Next 16 removed,
  and `npx eslint` also fails on the current `eslint.config.mjs`.
- **Tests:** No test runner is installed. `service/dictionary.ts` and
  `service/image-requests.ts` are pure and easily unit-testable
  (threshold-to-band mappings, icon selection, sunrise-icon-index math) but
  currently untested.
- **CI:** No `.github/workflows` — nothing runs lint/build/tests on PRs.
- **Rate limit is per instance:** counters are in memory, so they reset on
  restart and aren't shared across serverless instances; `x-forwarded-for` can
  be spoofed when no trusted proxy overwrites it. For production, enable the
  host's firewall rate limiting or move buckets to a shared store (e.g. Redis).
- **429 message on the client:** `fetchJson` in `weather.tsx` shows its generic
  "Unable to fetch weather data" instead of the server's "Too many requests"
  text (`fetchLocation` already surfaces the server message).
- **Client-side race conditions / all-or-nothing rendering** in `weather.tsx`
  (no request cancellation; one failed fetch hides every card). Candidate fix:
  TanStack Query (keyed queries, `keepPreviousData`, per-query errors).

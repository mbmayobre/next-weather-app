# CLAUDE.md

## Project

Next.js + Tailwind weather app. Live data comes from OpenWeatherMap (One Call 3.0,
Air Pollution, and Geocoding APIs), proxied through Next.js Route Handlers in
`src/app/api/{weather,air-quality,geocode}` (shared helpers in
`src/app/lib/openweather.ts`) so the API key stays server-side. The browser calls
those routes from `src/app/weather/weather.tsx`; there is no caching layer. `weather.tsx` is the single
stateful data-fetching hub; components under `src/app/features/` are dumb,
prop-driven cards that derive their own display/background variant from the shared
`weather`/`aqi` objects via helpers in `src/app/service/`.

## Status (2026-09-21)

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

### Left to do
- **DX:** Add a `.env.example` documenting the four required env vars
  (`WEATHER_API_KEY`, `WEATHER_API_URL`, `GEOCODING_API_URL`,
  `AIR_POLLUTION_API_URL` — server-only, no `NEXT_PUBLIC_` prefix).
- **Lint:** `npm run lint` is broken — it runs `next lint`, which Next 16 removed,
  and `npx eslint` also fails on the current `eslint.config.mjs`.
- **Tests:** No test runner is installed. `service/dictionary.ts` and
  `service/image-requests.ts` are pure and easily unit-testable
  (threshold-to-band mappings, icon selection, sunrise-icon-index math) but
  currently untested.
- **CI:** No `.github/workflows` — nothing runs lint/build/tests on PRs.
- **Docs:** `README.md` is still the unedited `create-next-app` boilerplate; needs
  a real project description and env var setup instructions.

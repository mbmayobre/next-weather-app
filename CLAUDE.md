# CLAUDE.md

## Project

Next.js + Tailwind weather app. Live data comes from OpenWeatherMap (One Call 3.0,
Air Pollution, and Geocoding APIs), fetched directly from the browser in
`src/app/weather/weather.tsx` with no caching layer. `weather.tsx` is the single
stateful data-fetching hub; components under `src/app/features/` are dumb,
prop-driven cards that derive their own display/background variant from the shared
`weather`/`aqi` objects via helpers in `src/app/service/`.

## Status (2026-09-17)

### Done
- Reviewed the repo end-to-end and identified improvement areas (analysis only —
  no code changes made).
- Walked through the full data flow: OpenWeatherMap → `weather.tsx` state →
  `features/*` presentational components.

### Left to do
- **Security:** API key is exposed client-side via `NEXT_PUBLIC_WEATHER_API_KEY`
  and used directly in browser fetches. Proxy the three OpenWeatherMap calls
  through Next.js Route Handlers so the key stays server-side.
- **Bug:** `service/image-requests.ts` — `getIconFromCode`'s
  `case code === 200 && code < 210` is effectively just `code === 200`; codes
  201/202 fall through to the `default: 'clear-day'` icon instead of a thunder icon.
- **Bug:** `weather.tsx` reverse-geocoding URL has a stray double `&&`
  (`limit=5&&appid=...`).
- **Cleanup:** `handleFetchWeatherData` in `weather.tsx` fires its three fetches
  without awaiting them relative to each other — works today because the loading
  counter is additive, but `Promise.all([...])` would be clearer.
- **Cleanup:** `fetchWeather`, `fetchAirQuality`, `fetchLocationName` in
  `weather.tsx` are near-duplicate fetch/try/catch/start/stop blocks — extract a
  shared `fetchJson(url, errorMessage)` helper.
- **DX:** Add a `.env.example` documenting the four required env vars
  (`NEXT_PUBLIC_WEATHER_API_KEY`, `NEXT_PUBLIC_WEATHER_API_URL`,
  `NEXT_PUBLIC_GEOCODING_API_URL`, `NEXT_PUBLIC_AIR_POLLUTION_API_URL`).
- **Tests:** No test runner is installed. `service/dictionary.ts` and
  `service/image-requests.ts` are pure and easily unit-testable
  (threshold-to-band mappings, icon selection, sunrise-icon-index math) but
  currently untested.
- **CI:** No `.github/workflows` — nothing runs lint/build/tests on PRs.
- **Docs:** `README.md` is still the unedited `create-next-app` boilerplate; needs
  a real project description and env var setup instructions.

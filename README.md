# Weather App — Next.js + Tailwind

A weather dashboard built with the Next.js App Router. Search a US zip code or a
city name, or use your browser's location, and the app shows current conditions,
an hourly and 7-day forecast, government weather alerts, and cards for
precipitation, humidity, wind, pressure, sunrise/sunset, visibility, UV index and
air quality. The page background and every card's artwork change with the weather.

Data comes from [OpenWeatherMap](https://openweathermap.org/api): the **One Call
3.0**, **Air Pollution** and **Geocoding** APIs.

---

## Contents

1. [Quick start](#quick-start)
2. [Environment variables](#environment-variables)
3. [How one search flows through the app](#how-one-search-flows-through-the-app)
4. [Project structure](#project-structure)
5. [The Next.js concepts this app uses](#the-nextjs-concepts-this-app-uses)
6. [The API layer (`src/app/api`)](#the-api-layer-srcappapi)
7. [The client data hub (`weather.tsx`)](#the-client-data-hub-weathertsx)
8. [Presentational components (`features/`)](#presentational-components-features)
9. [The service layer (`service/`)](#the-service-layer-service)
10. [Styling, theming and background images](#styling-theming-and-background-images)
11. [Types (`lib/definitions.ts`)](#types-libdefinitionsts)
12. [Common tasks](#common-tasks)
13. [Known gaps](#known-gaps)
14. [Deploying](#deploying)

---

## Quick start

You need Node.js 20+ and a free OpenWeatherMap API key with **One Call 3.0**
enabled (it's a separate subscription on their site, free for 1,000 calls/day).

```bash
npm install
```

Copy the example env file and paste your key in:

```bash
cp .env.example .env.local
```

Then start the dev server:

```bash
npm run dev
```

Open http://localhost:3000.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build (also type-checks the whole project) |
| `npm run start` | Serves the production build — run `build` first |
| `npm run lint` | **Currently broken.** It calls `next lint`, which Next 16 removed |

---

## Environment variables

All four live in `.env.local`, which is gitignored and never committed. See
`.env.example` for the template.

| Variable | Example value |
| --- | --- |
| `WEATHER_API_KEY` | your OpenWeatherMap key |
| `WEATHER_API_URL` | `https://api.openweathermap.org/data/3.0/onecall` |
| `GEOCODING_API_URL` | `https://api.openweathermap.org/geo/1.0` |
| `AIR_POLLUTION_API_URL` | `https://api.openweathermap.org/data/2.5/air_pollution` |

**None of these have a `NEXT_PUBLIC_` prefix, and that is deliberate.** In
Next.js, any env var named `NEXT_PUBLIC_*` is substituted into the JavaScript
bundle at build time, so it ships to every visitor's browser. Variables without
the prefix are readable only in code that runs on the server — Route Handlers,
Server Components, `next.config.ts`. This app previously called OpenWeatherMap
straight from the browser with a `NEXT_PUBLIC_` key, which meant anyone could
open DevTools and take it. That's why the `/api` proxy layer described below
exists.

`GEOCODING_API_URL` is a **base** path with no endpoint on the end; the geocode
route appends `/direct`, `/zip` or `/reverse` itself.

---

## How one search flows through the app

Typing "Chicago" and pressing Search triggers exactly four network requests, and
every one of them goes to this app's own server, never to OpenWeatherMap
directly:

```
 [browser]                          [your Next.js server]              [OpenWeatherMap]

 SearchBar onSubmit
   └─▶ fetchLocation("Chicago")
         └─▶ GET /api/geocode?q=Chicago ───▶ geocode/route.ts ──(+appid)──▶ /geo/1.0/direct
                                                   │
             { name, lat, lon, country } ◀─────────┘   (first match only)
         │
         └─▶ handleFetchWeatherData(lat, lon)  — Promise.all of three:
               ├─▶ GET /api/weather?lat&lon ────▶ weather/route.ts ───────▶ /data/3.0/onecall
               ├─▶ GET /api/air-quality?lat&lon ▶ air-quality/route.ts ───▶ /data/2.5/air_pollution
               └─▶ GET /api/geocode?lat&lon ────▶ geocode/route.ts ───────▶ /geo/1.0/reverse

 setWeather / setAqi / setLocation  →  React re-renders  →  feature cards fill in
                                    →  useEffect sends the new background up to page.tsx
```

The "current location" button skips the first step: `navigator.geolocation` gives
coordinates directly, and the same three parallel requests run.

Three things are worth noticing in that diagram:

- **The API key only ever exists on the middle column.** The browser sends plain
  `lat`/`lon`, and the server attaches `appid`.
- **The three data requests run in parallel** via `Promise.all`, not one after
  another, so a search takes about as long as the slowest single request.
- **Reverse geocoding is a separate call** because One Call 3.0 returns weather
  for coordinates but no place name. The app needs "Chicago, US" for the header.

---

## Project structure

```
src/app/
├── layout.tsx             Root layout: <html>/<body>, fonts, global CSS. Server Component.
├── page.tsx               Home route "/". Owns the page background, renders <Weather>.
├── globals.css            Tailwind directives + CSS variables for light/dark.
│
├── api/                   Server-only Route Handlers (the OpenWeatherMap proxy)
│   ├── weather/route.ts       GET /api/weather?lat&lon
│   ├── air-quality/route.ts   GET /api/air-quality?lat&lon
│   └── geocode/route.ts       GET /api/geocode?q=  |  ?lat&lon
│
├── weather/
│   └── weather.tsx        THE data hub. All fetching and app state lives here.
│
├── features/              Presentational cards. Props in, JSX out. No fetching.
│   ├── current-weather.tsx  hourly.tsx     daily.tsx      alerts.tsx
│   ├── precipitation.tsx    humidity.tsx   wind.tsx       pressure.tsx
│   └── sunrise-sunset.tsx   visibility.tsx uv-index.tsx   air-quality.tsx
│
├── components/            Reusable UI, not weather-specific
│   ├── searchbar.tsx          Input + search + geolocation buttons
│   ├── dark-mode-toggle.tsx   Adds/removes .dark on <html>, persists to localStorage
│   └── loading-spinner.tsx    Full-screen overlay spinner
│
├── hooks/
│   └── loading-counter.tsx  useLoadingCounter(): counts in-flight requests
│
├── lib/
│   ├── definitions.ts     TypeScript shapes of the OpenWeatherMap responses
│   └── openweather.ts     Server-only helpers: validation, key injection, proxying
│
└── service/               Pure functions — no React, no I/O, easy to unit test
    ├── dictionary.ts        Union types + literal Tailwind class maps
    └── image-requests.ts    Weather code / value → icon or background name

public/
├── icons/                 SVGs: weather icons, gauge artwork, sunrise stages
└── background-images/     Full-page .webp backgrounds
```

The architectural rule to keep: **`weather.tsx` is the only component that
fetches or owns server data.** Everything in `features/` receives a `weather` or
`aqi` object as a prop and derives its own display from it. If you need new data,
fetch it in `weather.tsx` and pass it down.

---

## The Next.js concepts this app uses

If you're new to Next.js, this section is the map. Everything here is the **App
Router** (the `app/` directory), which is the modern Next.js model — older
tutorials showing `pages/` and `getServerSideProps` describe the previous one.

### 1. Files become routes

In the App Router, the folder path *is* the URL, and specially-named files give
that folder behavior:

| File | Meaning | Here |
| --- | --- | --- |
| `page.tsx` | A visitable page | `app/page.tsx` → `/` |
| `layout.tsx` | Wraps pages; persists across navigation | `app/layout.tsx` wraps everything |
| `route.ts` | An HTTP endpoint instead of a page | `app/api/weather/route.ts` → `/api/weather` |

A folder without one of these files, like `app/features/` or `app/service/`, is
just a folder. It does **not** become a URL. That's why this app can keep
components inside `app/` without accidentally exposing `/features`.

### 2. Server Components vs. Client Components

This is the concept that trips up most newcomers. In the App Router, **every
component is a Server Component by default**: it runs only on the server during
rendering, its code is never sent to the browser, and it cannot use `useState`,
`useEffect`, or event handlers like `onClick`.

Adding `'use client'` at the top of a file opts that file — and everything it
imports — into being a **Client Component**: it's rendered on the server for the
initial HTML, then its JavaScript is shipped to the browser and "hydrated" so it
can hold state and respond to clicks.

In this app:

- `layout.tsx` has **no** `'use client'`, so it's a Server Component. It only
  sets up the document shell, which needs no interactivity.
- `page.tsx` has `'use client'` because it holds `useState` for the background.
- Everything under `weather/`, `features/` and `components/` is a Client
  Component. They all use state, effects, or click handlers.

Practical consequence: **never import `lib/openweather.ts` into a Client
Component.** It reads `process.env.WEATHER_API_KEY`, which is only populated on
the server. In the browser it would be `undefined`, and the fetch would fail. The
`/api` routes are the boundary between the two worlds.

> A more advanced refactor would make `page.tsx` a Server Component and push
> `'use client'` further down the tree, so less JavaScript ships. Not required
> for an app this size, but it's the direction the App Router is designed for.

### 3. Route Handlers are your backend

`app/api/weather/route.ts` exports an async function named after the HTTP verb:

```ts
export async function GET(req: NextRequest) { ... }
```

Next.js calls it for `GET /api/weather`. It runs on the server in Node.js, so it
can read secrets, hit databases, and call third-party APIs. It returns a standard
web `Response`, usually built with `NextResponse.json(...)`.

This is what lets a frontend-only project have a backend without a separate
Express server — the same `npm run build` produces both.

### 4. Static vs. dynamic rendering

At the end of `npm run build`, Next.js prints a legend:

```
Route (app)
┌ ○ /                     ○  (Static)   prerendered as static content
├ ƒ /api/air-quality      ƒ  (Dynamic)  server-rendered on demand
├ ƒ /api/geocode
└ ƒ /api/weather
```

`/` is **static**: its HTML is generated once at build time and served from a CDN
edge. That works because the page starts empty — there is no weather to render
until the user searches, and that search happens in the browser.

The three API routes are **dynamic**: they read query parameters, so they must
run per-request.

### 5. Environment variables

Covered above, and it's the security backbone of the app: `NEXT_PUBLIC_*` is
public, everything else is server-only.

### 6. `public/` is served as-is

Anything in `public/` is served from the site root. `public/icons/rain.svg`
becomes `/icons/rain.svg`. That's why components can write
`src={`/icons/${weatherIcon}.svg`}` with no import — the file is fetched by URL at
runtime, which is what makes the dynamic icon selection possible.

### 7. `next/font`

`layout.tsx` imports `Geist` from `next/font/google`. Next downloads the font at
build time and self-hosts it, so there's no request to Google's servers at
runtime and no layout shift while the font loads. It exposes a CSS variable
(`--font-geist-sans`) that gets attached to `<body>`.

> Note: `globals.css` currently sets `font-family: Arial, Helvetica, sans-serif`
> on `body`, which overrides the Geist setup. Worth cleaning up one way or the
> other.

---

## The API layer (`src/app/api`)

Three routes, all `GET`, all returning JSON.

| Route | Query | Success | Errors |
| --- | --- | --- | --- |
| `/api/weather` | `lat`, `lon` | Raw One Call 3.0 payload (`units=imperial`) | 400 invalid coords; upstream status; 500 |
| `/api/air-quality` | `lat`, `lon` | Raw Air Pollution payload | same |
| `/api/geocode` | `q` **or** `lat`+`lon` | **One** `location` object | 400 bad input; 404 no match; 500 |

Every error response has the same shape, so the client can always read
`data.error`:

```json
{ "error": "Valid numeric lat and lon are required" }
```

### Shared helpers — `lib/openweather.ts`

- **`parseCoords(params)`** — the validation gate. Returns `null` unless both
  `lat` and `lon` are present, numeric (`Number.isFinite`, which rejects `"abc"`
  and `Infinity`), and physically possible (|lat| ≤ 90, |lon| ≤ 180). This
  matters for more than tidiness: without it, any junk query string would cost a
  billed OpenWeatherMap call.
- **`fetchOpenWeather(baseUrl, params)`** — the only place the API key is read.
  It builds the query with `URLSearchParams`, which percent-encodes every value,
  so a city named `Salt Lake City & more` can't break the URL.
- **`proxyCoordsRequest(...)`** — the entire body of the weather and air-quality
  routes: validate, call upstream, forward the JSON or an error. Those two route
  files are three lines each because of it.

### Why `/api/geocode` normalizes its response

OpenWeatherMap's three geocoding endpoints disagree with each other. `/direct`
and `/reverse` return an **array** of matches; `/zip` returns a **single
object**. The old client code had to branch on `Array.isArray(data)` to cope.

The route now hides that: it picks `data[0]` when it gets an array and returns
one `location` object in every case. One endpoint, one response shape, and the
client just reads `data.lat`. Pushing inconsistencies down into the server layer
like this is usually worth it — the messy code exists once instead of at every
call site.

---

## The client data hub (`weather.tsx`)

One component owns all the state:

| State | Holds | Set by |
| --- | --- | --- |
| `weather` | Full One Call payload | `/api/weather` |
| `aqi` | Air pollution payload | `/api/air-quality` |
| `location` | Place name/country for the header | `/api/geocode` reverse |
| `error` | User-facing message, or `null` | any failed fetch |
| `isLoading` | Derived from the loading counter | `useLoadingCounter` |

### `fetchJson<T>` — one helper, five call sites

Every request needs the same wrapper: mark loading started, clear the old error,
fetch, throw if the response isn't OK, hand the parsed body to a setter, catch
and report, mark loading finished. `fetchJson` is that shape written once, and
it's generic so each caller keeps its own typed setter:

```ts
fetchJson(url, "Unable to fetch weather data", setWeather)
```

Note that `fetchWeather` and friends **return** the `fetchJson(...)` promise.
That's what makes `Promise.all` in `handleFetchWeatherData` actually wait — an
`async` function that forgets to return its inner promise resolves immediately,
and the loading state would flicker off before any data arrived.

### `useLoadingCounter` — why a counter, not a boolean

Three requests run at once. With a plain `isLoading` boolean, the first one to
finish sets it to `false` while the other two are still in flight, and the
spinner disappears too early. The hook keeps an integer instead: `start()`
increments, `stop()` decrements, and `isLoading` is `count > 0`. The overlay
stays up until the last request settles.

### The background lifting pattern

The page background belongs to `<main>` in `page.tsx`, but only `weather.tsx`
knows what the weather is. So `page.tsx` owns the state and passes the setter
down as `onBackgroundChange`; `weather.tsx` runs a `useEffect` on `weather` and
calls it. This is plain "lifting state up" — the state lives at the lowest common
ancestor of everyone who needs it.

---

## Presentational components (`features/`)

Each card takes the shared `weather` (or `aqi`) object and renders one slice of
it. None of them fetch anything. The conversions they do are worth knowing,
because OpenWeatherMap returns a mix of units even in `imperial` mode:

| Card | Shows | Conversion / logic |
| --- | --- | --- |
| `current-weather` | Temp, description, today's high/low | Icon via `getIconFromIcon` |
| `hourly` | Next 25 hours | `slice(0, 25)`; `pop` fraction → % |
| `daily` | 7 days (index 0 labeled "Today") | Same icon helper per day |
| `alerts` | Government alerts, collapsible | Renders `null` when there are none |
| `precipitation` | Today's total rain | mm ÷ 25.4 → inches |
| `humidity` | % + dew point | Value picks one of 5 gauge images |
| `wind` | Speed + compass direction | Degrees ÷ 45 → 8-point compass; arrow rotated `deg + 180` so it points the way the wind is *going* |
| `pressure` | inHg | hPa × 0.02953; value picks a gauge image |
| `sunrise-sunset` | Sunrise/sunset times | Formatted in the **location's** timezone, not yours |
| `visibility` | Miles | metres ÷ 1609.344 |
| `uv-index` | Index + band | 5 bands, low → extreme |
| `air-quality` | AQI 1–5 + label | 5 bands, good → very poor |

A quirk you'll see repeated: several cards copy a prop into state inside a
`useEffect` (`setBg(getHumidityBackgroundFromValue(...))`). Since the value is
derived purely from props, it could just be computed during render — `const bg =
getHumidityBackgroundFromValue(weather.current.humidity)`. `sunrise-sunset.tsx`
already does it the simpler way with `useMemo`. Not a bug, just an easy cleanup.

---

## The service layer (`service/`)

Pure functions. No React, no network, no DOM — give them a number, get a string
back. That makes them the easiest part of the codebase to unit test (there's no
test runner installed yet; see [Known gaps](#known-gaps)).

### `image-requests.ts` — picking artwork

OpenWeatherMap describes conditions with a numeric **condition ID** and a short
**icon code** ending in `d` or `n` for day/night:

```
id: 802, icon: "02d"  →  scattered clouds, daytime
```

- `getIconFromCode(id)` maps ranges of IDs (200s thunderstorm, 300s drizzle, 500s
  rain, 600s snow, 700s atmosphere, 800s clouds) to an SVG filename.
- `getIconFromIcon(icon, id)` wraps it to handle day/night: for clear and lightly
  cloudy skies it returns `clear-night` / `few-clouds-night` etc., and otherwise
  defers to the code-only version. Rain looks the same at night, so most
  conditions don't need a variant.
- `getBackgroundFromCode` / `getBackgroundFromIcon` do the same for the
  full-page background, with a smaller set of images.
- The threshold functions (`getPressureBackgroundFromValue`,
  `...Humidity...`, `...AirQuality...`, `...UVIndex...`) turn a measurement into
  one of five band names.
- `getSunriseIconIndex(now, sunrise, sunset)` returns 0–15 for the sun-position
  artwork: 0–2 for the run-up to sunrise, 3–13 spread proportionally across
  whatever daylight that location gets, 14–15 around sunset. Because daytime is
  divided by *proportion* rather than clock hours, it works in June in Alaska and
  in December in Florida.

All of these use `switch (true)`, which is an idiom for matching ranges instead
of exact values — each `case` is a boolean expression, and the first true one
wins.

### `dictionary.ts` — union types and class maps

Two jobs:

1. **Union types** (`Background`, `WeatherIcon`, …) so TypeScript rejects
   `'sunny'` when the only valid value is `'clear-day'`. Every icon function
   returns one of these, so a typo is a compile error rather than a missing
   image at runtime.
2. **Class maps** (`bgClassMap`, `humidityClassMap`, …) that map each union
   member to its literal Tailwind class name. The reason those exist is
   explained next — it's the single least obvious thing in the codebase.

---

## Styling, theming and background images

Tailwind CSS v3, configured in `tailwind.config.ts`.

### The dynamic class-name trap

Tailwind doesn't parse your JavaScript. At build time it **scans your source
files for strings that look like class names** and generates CSS only for the
ones it finds. So this looks fine and silently produces no CSS:

```tsx
<div className={`bg-${bg}`} />        // ✗ Tailwind never sees "bg-cloudy"
```

That's the entire reason `dictionary.ts` exists. It writes every class name out
in full:

```ts
export const bgClassMap: Record<Background, string> = {
  'cloudy': 'bg-cloudy',   // ✓ the literal string "bg-cloudy" is in a file Tailwind scans
  ...
};
```

Components then do `className={bgClassMap[bg]}` — dynamic at runtime, fully
static to the scanner.

**One live exception:** `sunrise-sunset.tsx` builds `` `bg-sunrise-${idx}` ``
inline. It works only because `sunriseClassMap` in `dictionary.ts` already spells
out `'bg-sunrise-0'` through `'bg-sunrise-15'`, so Tailwind generates them
anyway. It's a fragile coupling — delete that map as "unused" and the sunrise
artwork disappears with no error. Using the map directly would be safer.

### Where the images are wired up

`tailwind.config.ts` → `theme.extend.backgroundImage` defines every
`bg-<name>` utility as a `url(...)` into `public/`. Adding new artwork means
adding it in three places: the file in `public/`, the entry in the Tailwind
config, and the union member plus class-map entry in `dictionary.ts`.

### Dark mode

`darkMode: "class"` means dark styles apply when `<html>` carries the `dark`
class, rather than following the OS setting. `dark-mode-toggle.tsx` adds and
removes that class and saves the choice to `localStorage`, so it survives a
reload. Components then use Tailwind's `dark:` prefix. The system-preference
fallback is written but commented out in that file.

---

## Types (`lib/definitions.ts`)

Hand-written TypeScript mirrors of the OpenWeatherMap responses: `weather`
(with `current`, `hourly`, `daily`, `minutely`, `alerts`), `air_quality`, and
`location`. They're lowercase because they mirror the API's own naming.

Two caveats to keep in mind, since these types are a promise TypeScript can't
verify at runtime:

- `fetchJson` casts the parsed JSON to `T` without validating it. If
  OpenWeatherMap changes a field, TypeScript will still be happy and the app will
  break at runtime. A schema validator such as Zod in the Route Handlers would
  close that gap.
- Some fields are genuinely optional in the API but typed as required —
  `daily[].rain` only exists when rain is forecast, which is why
  `precipitation.tsx` checks for it before using it. `alerts` is absent entirely
  when there's nothing to report.

---

## Common tasks

### Add a new data card

1. Add the component in `features/`, taking `weather` (or `aqi`) as a prop. Start
   with `'use client'`.
2. Render it from the grid in `weather.tsx`. The cards sit in rows of two
   (`w-1/2` each).
3. If it needs artwork that varies with a value: add the SVGs to `public/icons/`,
   add `backgroundImage` entries in `tailwind.config.ts`, add a union type and
   class map in `dictionary.ts`, and add the threshold function in
   `image-requests.ts`.

### Add a new upstream API call

1. Add the base URL to `.env.local` **and** `.env.example` (no `NEXT_PUBLIC_`).
2. Create `app/api/<name>/route.ts`. If it's a lat/lon endpoint, the whole body
   can be one `proxyCoordsRequest(...)` call.
3. Add state and a `fetchJson` wrapper in `weather.tsx`, and include it in the
   `Promise.all`.
4. Add the response type to `lib/definitions.ts`.

### Change how a condition maps to an icon

Edit `getIconFromCode` in `image-requests.ts` and make sure the returned name
exists both in the `WeatherIcon` union and as a file in `public/icons/`.
[OpenWeatherMap's condition-code list](https://openweathermap.org/weather-conditions)
is the reference.

---

## Known gaps

Honest list of what isn't done, so nobody assumes otherwise:

- **`npm run lint` doesn't run.** `next lint` was removed in Next 16, and
  `npx eslint` also fails on the current `eslint.config.mjs`. Needs migrating to
  the flat-config ESLint CLI.
- **No tests and no test runner.** `service/dictionary.ts` and
  `service/image-requests.ts` are pure and would be straightforward to cover.
- **No CI.** Nothing runs build or lint on a PR.
- **No caching.** Every search hits OpenWeatherMap. Adding
  `next: { revalidate: 600 }` to the upstream `fetch` in `lib/openweather.ts`
  would let repeat searches for the same coordinates share a response.
- **No rate limiting.** The API key is safe now, but `/api/*` is open to anyone
  who finds the deployed URL, and each call costs quota.
- **No runtime validation of upstream responses** (see [Types](#types-libdefinitionsts)).

---

## Deploying

Any host that runs a Node.js server works; Vercel is the path of least
resistance. Two things matter:

1. **Set all four environment variables in the host's dashboard**, using the
   non-prefixed names. If the host still has the old `NEXT_PUBLIC_*` names, every
   `/api` route will return 500 because `WEATHER_API_KEY` will be undefined.
2. **This app cannot be exported as a purely static site.** `next export` /
   `output: 'export'` would drop the Route Handlers, and the API key would have
   nowhere to live.

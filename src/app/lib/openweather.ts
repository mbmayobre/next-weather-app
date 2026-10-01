import { NextResponse } from "next/server";

/**
 * SERVER-ONLY helpers shared by the three Route Handlers in app/api.
 *
 * Never import this file from a Client Component (anything with 'use client').
 * It reads process.env.WEATHER_API_KEY, which Next.js only populates on the
 * server: an env var WITHOUT the NEXT_PUBLIC_ prefix is deliberately absent
 * from the browser bundle. That absence is the whole security model here — the
 * browser sends plain lat/lon to our own /api routes, and the key is attached
 * on this side of the wire.
 *
 * It is also where upstream responses are cached. Every OpenWeatherMap fetch
 * goes through fetchOpenWeather, which opts into Next.js's server-side Data
 * Cache, so repeat lookups from ANY visitor are served without a billed call.
 */

type Coords = { lat: string; lon: string };

// Cache lifetimes, in seconds. Weather and air quality change on the order of
// minutes, so 10 minutes keeps them fresh while absorbing repeat searches.
// Geocoding (a city's coordinates, a coordinate's place name) almost never
// changes, so it can be kept for a day.
export const WEATHER_CACHE_SECONDS = 600;
export const GEOCODE_CACHE_SECONDS = 86_400;

// Coordinates are rounded to this many decimal places (0.01° ≈ 1.1 km). The
// Data Cache keys on the full upstream URL, and browser geolocation reports
// ~6 decimals, so unrounded coordinates would make almost every request a
// cache miss. One Call's forecast grid is far coarser than 1 km, so nothing
// visible is lost.
const COORD_PRECISION = 100;
const roundCoord = (n: number) => Math.round(n * COORD_PRECISION) / COORD_PRECISION;

/**
 * Validation gate for every coordinate that reaches an upstream call.
 *
 * Returns normalized coordinates, or null if either value is missing,
 * non-numeric, or outside the valid lat (-90..90) / lon (-180..180) range.
 * "Normalized" means rounded to COORD_PRECISION, so that nearby requests share
 * a cache entry. String() of the rounded number also turns -0 into "0", so
 * points just south of the equator don't get a separate "-0" cache key.
 *
 * Number.isFinite is the right check rather than !isNaN: it also rejects
 * "Infinity", and (unlike a bare truthiness test) it accepts "0".
 *
 * This is about cost as much as correctness — without it, any junk query
 * string would turn into a billed OpenWeatherMap request.
 */
export const parseCoords = (params: URLSearchParams): Coords | null => {
  const lat = params.get("lat")?.trim();
  const lon = params.get("lon")?.trim();
  if (!lat || !lon) return null;

  const latNum = Number(lat);
  const lonNum = Number(lon);
  if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) return null;
  if (Math.abs(latNum) > 90 || Math.abs(lonNum) > 180) return null;

  return { lat: String(roundCoord(latNum)), lon: String(roundCoord(lonNum)) };
};

export const jsonError = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

/**
 * The only place the API key is read. Builds the upstream URL and calls it.
 *
 * URLSearchParams percent-encodes every value, so a city name containing "&"
 * or "?" cannot break out of its parameter.
 *
 * Throws if the env vars are missing, which the callers turn into a 500 — that
 * is the failure you will see if a deploy is missing its environment config.
 *
 * `revalidateSeconds` opts the request into the Data Cache. Since Next 15,
 * fetch in a Route Handler is NOT cached unless you ask. Next only stores
 * 200 responses, so an upstream 401/429 is never cached. In `next dev`, a
 * request sent with `cache-control: no-cache` (DevTools "Disable cache", or a
 * hard refresh) skips the cache, so test with that setting off.
 */
export const fetchOpenWeather = (
  baseUrl: string | undefined,
  params: Record<string, string>,
  revalidateSeconds: number
) => {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!baseUrl || !apiKey) {
    throw new Error("OpenWeatherMap environment variables are not configured");
  }

  const url = new URL(baseUrl);
  url.search = new URLSearchParams({ ...params, appid: apiKey }).toString();
  return fetch(url, { next: { revalidate: revalidateSeconds } });
};

/**
 * The entire body of the weather and air-quality routes: validate the
 * coordinates, call upstream, and forward the JSON (or an error) back.
 *
 * Upstream failures are reported with the upstream's own status code but our
 * own message, so OpenWeatherMap's wording is never shown to users.
 */
export const proxyCoordsRequest = async (
  params: URLSearchParams,
  baseUrl: string | undefined,
  extraParams: Record<string, string> = {}
) => {
  const coords = parseCoords(params);
  if (!coords) return jsonError("Valid numeric lat and lon are required", 400);

  try {
    const res = await fetchOpenWeather(baseUrl, { ...coords, ...extraParams }, WEATHER_CACHE_SECONDS);
    if (!res.ok) return jsonError("OpenWeatherMap request failed", res.status);
    return NextResponse.json(await res.json());
  } catch (error) {
    console.error(error);
    return jsonError("Internal server error", 500);
  }
};

import { NextRequest, NextResponse } from "next/server";
import { fetchOpenWeather, GEOCODE_CACHE_SECONDS, jsonError, parseCoords } from "../../lib/openweather";
import { rateLimit } from "../../lib/rate-limit";

/**
 * GET /api/geocode?q=<zip or city>  → forward lookup  (name -> coordinates)
 * GET /api/geocode?lat=..&lon=..    → reverse lookup  (coordinates -> name)
 *
 * Always responds with ONE location object, or { error } with a 400/404/500.
 *
 * Why this route normalizes: OpenWeatherMap's three geocoding endpoints
 * disagree with each other. /direct and /reverse return an ARRAY of matches
 * while /zip returns a single OBJECT, and the client used to branch on
 * Array.isArray to cope. Absorbing that here means the messy code exists once,
 * on the server, and every caller just reads data.lat.
 *
 * The app calls this route twice per search, for opposite reasons: once to
 * turn what the user typed into coordinates, and once (reverse) to get a
 * display name for the header, since One Call returns weather but no place
 * name.
 *
 * Results are cached for a day (GEOCODE_CACHE_SECONDS), since a city's
 * coordinates don't change. A search with no match still comes back from
 * /direct as a 200 with an empty array, so that "no match" is cached too.
 */
export async function GET(req: NextRequest) {
  const limited = rateLimit(req);
  if (limited) return limited;

  const params = req.nextUrl.searchParams;
  const baseUrl = process.env.GEOCODING_API_URL;
  const q = params.get("q")?.trim();

  let path: string;
  let query: Record<string, string>;

  if (q) {
    // All-digits input is treated as a US zip code; anything else is a city
    // name. ",US" is required by the zip endpoint, which is why non-US postal
    // codes are not supported today.
    const isZip = /^\d+$/.test(q);
    path = isZip ? "zip" : "direct";
    query = isZip ? { zip: `${q},US` } : { q, limit: "1" };
  } else {
    const coords = parseCoords(params);
    if (!coords) return jsonError("Provide q, or valid numeric lat and lon", 400);
    path = "reverse";
    query = { ...coords, limit: "1" };
  }

  try {
    const res = await fetchOpenWeather(baseUrl && `${baseUrl}/${path}`, query, GEOCODE_CACHE_SECONDS);
    if (res.status === 404) return jsonError("No location found", 404);
    if (!res.ok) return jsonError("Failed to fetch location", res.status);

    // /zip returns an object; /direct and /reverse return an array. Collapse
    // both into a single object so callers never have to care which.
    const data = await res.json();
    const match = Array.isArray(data) ? data[0] : data;
    if (!match) return jsonError("No location found", 404);

    return NextResponse.json(match);
  } catch (error) {
    console.error(error);
    return jsonError("Internal server error", 500);
  }
}

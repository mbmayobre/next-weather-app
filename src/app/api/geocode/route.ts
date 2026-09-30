import { NextRequest, NextResponse } from "next/server";
import { fetchOpenWeather, jsonError, parseCoords } from "../../lib/openweather";

// GET /api/geocode?q=<zip or city>  → forward lookup
// GET /api/geocode?lat=..&lon=..    → reverse lookup
//
// Always responds with a single location object (the best match), hiding the
// fact that OpenWeatherMap's zip endpoint returns an object while the direct
// and reverse endpoints return arrays.
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const baseUrl = process.env.GEOCODING_API_URL;
  const q = params.get("q")?.trim();

  let path: string;
  let query: Record<string, string>;

  if (q) {
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
    const res = await fetchOpenWeather(baseUrl && `${baseUrl}/${path}`, query);
    if (res.status === 404) return jsonError("No location found", 404);
    if (!res.ok) return jsonError("Failed to fetch location", res.status);

    const data = await res.json();
    const match = Array.isArray(data) ? data[0] : data;
    if (!match) return jsonError("No location found", 404);

    return NextResponse.json(match);
  } catch (error) {
    console.error(error);
    return jsonError("Internal server error", 500);
  }
}

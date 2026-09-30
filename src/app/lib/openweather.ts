import { NextResponse } from "next/server";

// Server-only helpers for the /api Route Handlers. The API key is read from a
// non-NEXT_PUBLIC_ env var, so it is never inlined into the client bundle.

type Coords = { lat: string; lon: string };

// Returns normalized coordinates, or null if either value is missing,
// non-numeric, or outside the valid lat (-90..90) / lon (-180..180) range.
export const parseCoords = (params: URLSearchParams): Coords | null => {
  const lat = params.get("lat")?.trim();
  const lon = params.get("lon")?.trim();
  if (!lat || !lon) return null;

  const latNum = Number(lat);
  const lonNum = Number(lon);
  if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) return null;
  if (Math.abs(latNum) > 90 || Math.abs(lonNum) > 180) return null;

  return { lat: String(latNum), lon: String(lonNum) };
};

export const jsonError = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

// Calls an OpenWeatherMap endpoint with the API key appended server-side.
export const fetchOpenWeather = (baseUrl: string | undefined, params: Record<string, string>) => {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!baseUrl || !apiKey) {
    throw new Error("OpenWeatherMap environment variables are not configured");
  }

  const url = new URL(baseUrl);
  url.search = new URLSearchParams({ ...params, appid: apiKey }).toString();
  return fetch(url);
};

// Shared GET body for the lat/lon-only endpoints (weather, air quality).
export const proxyCoordsRequest = async (
  params: URLSearchParams,
  baseUrl: string | undefined,
  extraParams: Record<string, string> = {}
) => {
  const coords = parseCoords(params);
  if (!coords) return jsonError("Valid numeric lat and lon are required", 400);

  try {
    const res = await fetchOpenWeather(baseUrl, { ...coords, ...extraParams });
    if (!res.ok) return jsonError("OpenWeatherMap request failed", res.status);
    return NextResponse.json(await res.json());
  } catch (error) {
    console.error(error);
    return jsonError("Internal server error", 500);
  }
};

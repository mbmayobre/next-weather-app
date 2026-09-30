import { NextRequest } from "next/server";
import { proxyCoordsRequest } from "../../lib/openweather";

/**
 * GET /api/air-quality?lat=..&lon=..
 *
 * Proxies the OpenWeatherMap Air Pollution API. Same shape as the weather
 * route — validation, key injection and error handling all live in
 * proxyCoordsRequest.
 */
export async function GET(req: NextRequest) {
  return proxyCoordsRequest(req.nextUrl.searchParams, process.env.AIR_POLLUTION_API_URL);
}

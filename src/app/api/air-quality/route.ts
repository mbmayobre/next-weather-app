import { NextRequest } from "next/server";
import { proxyCoordsRequest } from "../../lib/openweather";
import { rateLimit } from "../../lib/rate-limit";

/**
 * GET /api/air-quality?lat=..&lon=..
 *
 * Proxies the OpenWeatherMap Air Pollution API. Same shape as the weather
 * route — rate limiting first, then validation, key injection, caching and
 * error handling, which all live in proxyCoordsRequest.
 */
export async function GET(req: NextRequest) {
  const limited = rateLimit(req);
  if (limited) return limited;

  return proxyCoordsRequest(req.nextUrl.searchParams, process.env.AIR_POLLUTION_API_URL);
}

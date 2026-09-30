import { NextRequest } from "next/server";
import { proxyCoordsRequest } from "../../lib/openweather";
import { rateLimit } from "../../lib/rate-limit";

/**
 * GET /api/weather?lat=..&lon=..
 *
 * Proxies OpenWeatherMap One Call 3.0, adding the API key server-side, and
 * returns the payload unchanged (typed as `weather` in lib/definitions.ts).
 *
 * A file named route.ts makes its folder an HTTP endpoint instead of a page:
 * this one answers GET /api/weather. It runs on the server for every request,
 * which is why it can read secrets that the browser never sees.
 *
 * `units=imperial` gives Fahrenheit and mph — but NOT inches for rain or
 * pressure, which the feature cards convert themselves.
 *
 * Rate limited per IP (lib/rate-limit.ts), and upstream responses are cached
 * for 10 minutes per rounded coordinate (lib/openweather.ts).
 */
export async function GET(req: NextRequest) {
  const limited = rateLimit(req);
  if (limited) return limited;

  return proxyCoordsRequest(req.nextUrl.searchParams, process.env.WEATHER_API_URL, { units: "imperial" });
}

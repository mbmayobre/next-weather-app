import { NextRequest } from "next/server";
import { proxyCoordsRequest } from "../../lib/openweather";

// GET /api/weather?lat=..&lon=.. → One Call 3.0
export async function GET(req: NextRequest) {
  return proxyCoordsRequest(req.nextUrl.searchParams, process.env.WEATHER_API_URL, { units: "imperial" });
}

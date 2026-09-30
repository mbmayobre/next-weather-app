import { NextRequest } from "next/server";
import { proxyCoordsRequest } from "../../lib/openweather";

// GET /api/air-quality?lat=..&lon=.. → Air Pollution API
export async function GET(req: NextRequest) {
  return proxyCoordsRequest(req.nextUrl.searchParams, process.env.AIR_POLLUTION_API_URL);
}

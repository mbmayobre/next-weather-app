import { NextRequest } from "next/server";
import { jsonError } from "./openweather";

/**
 * SERVER-ONLY per-IP rate limiting for the /api routes.
 *
 * Why it exists: the routes proxy a billed API. Hiding the key stopped people
 * stealing it, but anyone can still call /api/weather in a loop and spend the
 * quota. Every Route Handler calls rateLimit(req) before doing anything else,
 * so a limited client never reaches the cache or OpenWeatherMap.
 *
 * Why in the Route Handlers and not proxy.ts (the Next 16 name for
 * middleware): Next's own guidance puts rate limiting in the handler, and it
 * keeps all the API-layer logic in lib/ next to openweather.ts.
 *
 * LIMITATION — this is best-effort. The counters live in this server process's
 * memory, so they reset on restart, and on serverless hosts every instance
 * keeps its own counts. It stops casual abuse on a single server. For real
 * protection in production, turn on your host's firewall rate limiting, or
 * move the buckets to a shared store such as Redis.
 */

// One search makes 4 API calls (forward geocode, then weather + air quality +
// reverse geocode), so 60 per minute allows roughly 15 searches a minute —
// far more than a person clicking Search, far less than a script.
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;

// Upper bound on tracked clients before expired buckets are swept, so the Map
// can't grow without limit on a long-running server.
const SWEEP_THRESHOLD = 10_000;

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

type RateLimitResult = { allowed: boolean; retryAfterSec: number };

/**
 * Records one request from `key` at time `now` (ms) and decides whether to
 * allow it. `retryAfterSec` is only meaningful when `allowed` is false; it
 * becomes the Retry-After header so a well-behaved client knows when to retry.
 */
function consume(key: string, now: number): RateLimitResult {
  // TODO(human): implement the rate-limit decision using `buckets`,
  // WINDOW_MS and MAX_REQUESTS. Placeholder: allow everything.
  return { allowed: true, retryAfterSec: 0 };
}

/**
 * Best guess at the caller's IP.
 *
 * Next 16 has no `request.ip`, so this reads the headers a reverse proxy sets.
 * The left-most x-forwarded-for entry is the original client, but a client can
 * send that header itself. It is only trustworthy behind a host that
 * overwrites it (Vercel does). Self-hosted without such a proxy, a determined
 * attacker can rotate fake IPs to dodge the limit, which is another reason to
 * rely on the host's firewall in production.
 *
 * Requests with no IP headers at all share one "unknown" bucket. That fails
 * safe: they're limited together rather than not at all.
 */
function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

// Deletes buckets whose window has already ended. Only runs once the Map is
// large, so the common case pays nothing.
function sweepExpired(now: number) {
  if (buckets.size < SWEEP_THRESHOLD) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Call at the top of every Route Handler:
 *
 *   const limited = rateLimit(req);
 *   if (limited) return limited;
 *
 * Returns null when the request may proceed, or a ready-made 429 response in
 * the app's usual { error } shape, with a Retry-After header.
 */
export function rateLimit(req: NextRequest) {
  const now = Date.now();
  sweepExpired(now);

  const { allowed, retryAfterSec } = consume(getClientIp(req), now);
  if (allowed) return null;

  const res = jsonError("Too many requests. Please wait a moment and try again.", 429);
  res.headers.set("Retry-After", String(retryAfterSec));
  return res;
}

// Lightweight in-memory rate limiter. Per-instance only — adequate for a
// single Vercel function instance. For multi-region production, swap in
// Upstash Redis. Keys are caller-provided (typically `${ip}:${bucket}`).
//
// Each key gets a sliding window of timestamps. We trim entries older than
// the window on every check, so memory grows with active keys only.

interface Window {
  hits: number[];
  // Earliest timestamp we still trust. Used for cheap garbage collection
  // across calls.
  trimmed: number;
}

const buckets = new Map<string, Window>();
const SWEEP_INTERVAL_MS = 60_000;
let lastSweep = 0;

function sweep(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  const cutoff = now - 60 * 60 * 1000; // drop anything inactive for 1h
  for (const [key, win] of buckets) {
    if (win.trimmed < cutoff) buckets.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * @param key      Stable identifier. Typically `${ip}:${action}`.
 * @param limit    Max hits permitted in the window.
 * @param windowMs Window length, in ms.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const cutoff = now - windowMs;
  const win = buckets.get(key) ?? { hits: [], trimmed: now };
  // Drop hits older than the window
  win.hits = win.hits.filter((t) => t > cutoff);
  win.trimmed = now;

  if (win.hits.length >= limit) {
    buckets.set(key, win);
    return {
      allowed: false,
      remaining: 0,
      resetAt: win.hits[0] + windowMs,
    };
  }

  win.hits.push(now);
  buckets.set(key, win);
  return {
    allowed: true,
    remaining: limit - win.hits.length,
    resetAt: now + windowMs,
  };
}

/**
 * Best-effort caller IP. Trusts standard proxy headers; falls back to a
 * generic bucket so the limiter still applies if no header is present.
 */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("cf-connecting-ip") ??
    "anonymous"
  );
}

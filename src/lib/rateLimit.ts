interface Entry {
  hits: number[];
  windowMs: number;
}

const store = new Map<string, Entry>();

/**
 * Beyond this many tracked keys the store is cleared outright. A sweep already
 * runs regularly; this is the last resort if one ever gets flooded faster than
 * it can be pruned. Clearing is safe — it only forgives existing counters.
 */
const MAX_KEYS = 20_000;
const SWEEP_EVERY = 250;

let callsSinceSweep = 0;

/**
 * Drop keys whose window has fully elapsed.
 *
 * The previous implementation never removed anything: every distinct IP left a
 * permanent entry, so the map grew without bound for the life of the process.
 * On serverless that was masked by short-lived instances; on a long-running
 * server it is a leak.
 */
function sweep(now: number) {
  for (const [key, entry] of store) {
    const newest = entry.hits.length > 0 ? entry.hits[entry.hits.length - 1] : 0;
    if (now - newest >= entry.windowMs) store.delete(key);
  }
}

/**
 * In-memory sliding-window rate limiter.
 * Returns true if the request is allowed, false if the limit is exceeded.
 *
 * Best-effort by design: the state is per-process, so it resets on every
 * serverless cold start and each concurrent instance keeps its own counters.
 * Treat it as a brake, not a guarantee — a shared store (Redis/Upstash) is
 * what would make it authoritative.
 *
 * `key`      — per-caller identifier (e.g. "contact:1.2.3.4")
 * `max`      — maximum allowed requests in the window
 * `windowMs` — window duration in milliseconds
 */
export function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();

  if (++callsSinceSweep >= SWEEP_EVERY) {
    callsSinceSweep = 0;
    sweep(now);
    if (store.size > MAX_KEYS) store.clear();
  }

  const existing = store.get(key);
  const hits = (existing?.hits ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= max) {
    store.set(key, { hits, windowMs });
    return false;
  }

  hits.push(now);
  store.set(key, { hits, windowMs });
  return true;
}

/**
 * A ceiling across every caller, not just one IP.
 *
 * Per-IP limits do nothing against traffic spread over many browsers — a hidden
 * form on a busy third-party page produces one request each from thousands of
 * different addresses. This is the circuit breaker for that: if the whole
 * endpoint suddenly sees far more traffic than the business could plausibly
 * generate, something is wrong and shedding is better than filling the CRM.
 *
 * Check it *after* the per-IP limit so a single abusive caller cannot spend
 * the shared budget.
 *
 * Be honest about its reach: the counter is per-process like everything else
 * here, so on a serverless platform the real ceiling is `max` multiplied by
 * however many instances happen to be warm — and the distributed case is
 * precisely the one that spreads across instances. It is a brake, not a cap.
 * Making it a true ceiling needs a shared store (Redis/Upstash), which is the
 * same change `production enhancments.md` already recommends for the per-IP
 * limits.
 */
export function checkGlobalLimit(name: string, max: number, windowMs: number): boolean {
  return checkRateLimit(`global:${name}`, max, windowMs);
}

/** Test seam — clears all counters. */
export function resetRateLimits() {
  store.clear();
  callsSinceSweep = 0;
}

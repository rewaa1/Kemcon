const store = new Map<string, number[]>();

/**
 * In-memory sliding-window rate limiter.
 * Returns true if the request is allowed, false if the limit is exceeded.
 * `key`      — per-caller identifier (e.g. "contact:1.2.3.4")
 * `max`      — maximum allowed requests in the window
 * `windowMs` — window duration in milliseconds
 */
export function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (store.get(key) ?? []).filter((t) => now - t < windowMs);
  if (timestamps.length >= max) return false;
  timestamps.push(now);
  store.set(key, timestamps);
  return true;
}

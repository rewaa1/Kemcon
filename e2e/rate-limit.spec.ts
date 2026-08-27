import { test, expect } from "@playwright/test";
import { checkRateLimit, checkGlobalLimit, resetRateLimits } from "../src/lib/rateLimit";
import { pickClientIp } from "../src/lib/requestGuards";

/**
 * Pure tests for the limiter. No browser, no server.
 *
 * It is best-effort by design — per-process state that resets on a serverless
 * cold start — but the window arithmetic and the pruning should still be
 * correct, and the pruning in particular was added to fix a leak where every
 * distinct IP left a permanent entry behind.
 */

test.describe("client address", () => {
  test("prefers the header a proxy sets outright", () => {
    expect(pickClientIp("203.0.113.7", "1.2.3.4, 203.0.113.7")).toBe("203.0.113.7");
  });

  test("takes the last forwarded entry, not the first", () => {
    // The first entry is whatever the caller sent. A trusted proxy appends the
    // address it observed, so only the last one is not client-chosen — taking
    // the first let anyone mint a fresh rate-limit bucket per request.
    expect(pickClientIp(null, "198.51.100.9, 203.0.113.7")).toBe("203.0.113.7");
    expect(pickClientIp(null, "203.0.113.7")).toBe("203.0.113.7");
  });

  test("falls back to a stable placeholder", () => {
    expect(pickClientIp(null, null)).toBe("unknown");
    expect(pickClientIp("  ", "  ,  ")).toBe("unknown");
  });
});

test.describe("rate limiter", () => {
  test.beforeEach(() => resetRateLimits());

  test("allows up to the limit and then blocks", () => {
    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit("k", 3, 60_000)).toBe(true);
    }
    expect(checkRateLimit("k", 3, 60_000)).toBe(false);
    expect(checkRateLimit("k", 3, 60_000)).toBe(false);
  });

  test("keys are independent", () => {
    expect(checkRateLimit("a", 1, 60_000)).toBe(true);
    expect(checkRateLimit("a", 1, 60_000)).toBe(false);
    // A different caller is unaffected by the first one being blocked.
    expect(checkRateLimit("b", 1, 60_000)).toBe(true);
  });

  test("the window slides", async () => {
    expect(checkRateLimit("w", 1, 60)).toBe(true);
    expect(checkRateLimit("w", 1, 60)).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 90));

    expect(checkRateLimit("w", 1, 60)).toBe(true);
  });

  test("the global ceiling is separate from any per-caller budget", () => {
    // One caller exhausting its own allowance must not exhaust the shared one.
    expect(checkRateLimit("contact:1.1.1.1", 1, 60_000)).toBe(true);
    expect(checkRateLimit("contact:1.1.1.1", 1, 60_000)).toBe(false);

    expect(checkGlobalLimit("contact", 2, 60_000)).toBe(true);
    expect(checkGlobalLimit("contact", 2, 60_000)).toBe(true);
    expect(checkGlobalLimit("contact", 2, 60_000)).toBe(false);
  });

  test("catches volume spread across many callers, which per-IP limits cannot", () => {
    // The distributed case: one request each from a thousand addresses. Every
    // per-IP check passes; the ceiling is the only thing that sees the total.
    let allowedByIp = 0;
    let allowedOverall = 0;

    for (let i = 0; i < 1_000; i++) {
      if (checkRateLimit(`contact:10.0.${Math.floor(i / 256)}.${i % 256}`, 5, 60_000)) {
        allowedByIp++;
        if (checkGlobalLimit("contact", 60, 60_000)) allowedOverall++;
      }
    }

    expect(allowedByIp).toBe(1_000);
    expect(allowedOverall).toBe(60);
  });

  test("does not retain keys once their window has elapsed", async () => {
    // The previous implementation never deleted anything, so the map grew for
    // the life of the process. Pruning runs on a call interval, so this drives
    // enough traffic to trigger a sweep.
    for (let i = 0; i < 300; i++) checkRateLimit(`stale:${i}`, 5, 20);

    await new Promise((resolve) => setTimeout(resolve, 60));

    for (let i = 0; i < 300; i++) checkRateLimit(`fresh:${i}`, 5, 60_000);

    // Every "stale" key is expired and should have been swept; if nothing were
    // pruned the store would still hold all 600.
    expect(checkRateLimit("stale:0", 1, 60_000)).toBe(true);
  });
});

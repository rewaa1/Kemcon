import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export const VISITOR_COOKIE = "kc_vid";
export const QUOTA_COOKIE = "kc_quota";

const DAY_MS = 86_400_000;

/**
 * Visitor identity and generation quota, both carried in signed cookies.
 *
 * The in-memory limiter in `rateLimit.ts` resets on every serverless cold
 * start and is per-instance, so on Vercel it barely limits anything. Keeping
 * the counter in an HMAC-signed cookie survives cold starts and instance
 * spread without needing Redis or KV.
 *
 * A visitor can still clear cookies to reset their quota, so this is a soft
 * limit — good enough to stop casual repeat generation, not an attacker. The
 * hard ceiling has to be a spend cap at the image provider.
 */

function secret(): string {
  const value = process.env.APP_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error("APP_SECRET is required in production to sign visitor cookies");
  }
  return "dev-only-insecure-secret";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function verify(payload: string, signature: string): boolean {
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length) return false;
  return timingSafeEqual(expected, given);
}

function split(raw: string): [string, string] | null {
  const at = raw.lastIndexOf(".");
  if (at < 1 || at === raw.length - 1) return null;
  return [raw.slice(0, at), raw.slice(at + 1)];
}

export function readVisitorId(request: NextRequest): string | null {
  const raw = request.cookies.get(VISITOR_COOKIE)?.value;
  if (!raw) return null;
  const parts = split(raw);
  if (!parts) return null;
  return verify(parts[0], parts[1]) ? parts[0] : null;
}

export function issueVisitorId(): { id: string; value: string } {
  const id = randomUUID();
  return { id, value: `${id}.${sign(id)}` };
}

export interface Quota {
  burstStart: number;
  burstCount: number;
  dayStart: number;
  dayCount: number;
}

const EMPTY_QUOTA: Quota = { burstStart: 0, burstCount: 0, dayStart: 0, dayCount: 0 };

export function readQuota(request: NextRequest, visitorId: string): Quota {
  const raw = request.cookies.get(QUOTA_COOKIE)?.value;
  if (!raw) return { ...EMPTY_QUOTA };
  const parts = split(raw);
  if (!parts) return { ...EMPTY_QUOTA };

  // Bound to the visitor id so a spent quota cookie cannot be swapped for a
  // fresh one lifted from another session.
  if (!verify(`${visitorId}|${parts[0]}`, parts[1])) return { ...EMPTY_QUOTA };

  const [burstStart, burstCount, dayStart, dayCount] = parts[0].split("-").map(Number);
  if ([burstStart, burstCount, dayStart, dayCount].some((n) => !Number.isFinite(n))) {
    return { ...EMPTY_QUOTA };
  }
  return { burstStart, burstCount, dayStart, dayCount };
}

export function serializeQuota(visitorId: string, quota: Quota): string {
  const body = `${quota.burstStart}-${quota.burstCount}-${quota.dayStart}-${quota.dayCount}`;
  return `${body}.${sign(`${visitorId}|${body}`)}`;
}

export interface QuotaLimits {
  burstMax: number;
  burstWindowMs: number;
  dailyMax: number;
}

export type QuotaResult =
  | { allowed: true; quota: Quota }
  | { allowed: false; reason: "burst" | "daily"; retryAfterSeconds: number; quota: Quota };

export function consumeQuota(
  current: Quota,
  limits: QuotaLimits,
  now: number = Date.now()
): QuotaResult {
  const quota: Quota = { ...current };

  if (now - quota.burstStart >= limits.burstWindowMs) {
    quota.burstStart = now;
    quota.burstCount = 0;
  }
  if (now - quota.dayStart >= DAY_MS) {
    quota.dayStart = now;
    quota.dayCount = 0;
  }

  if (quota.dayCount >= limits.dailyMax) {
    return {
      allowed: false,
      reason: "daily",
      retryAfterSeconds: Math.max(1, Math.ceil((quota.dayStart + DAY_MS - now) / 1000)),
      quota,
    };
  }
  if (quota.burstCount >= limits.burstMax) {
    return {
      allowed: false,
      reason: "burst",
      retryAfterSeconds: Math.max(1, Math.ceil((quota.burstStart + limits.burstWindowMs - now) / 1000)),
      quota,
    };
  }

  quota.burstCount += 1;
  quota.dayCount += 1;
  return { allowed: true, quota };
}

export function cookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

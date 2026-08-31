import type { NextRequest } from "next/server";

/**
 * Analytics consent.
 *
 * Deliberately free of `node:crypto` and of any server-only import, because
 * both `proxy.ts` and the browser banner read this module. Nothing here is
 * signed: a visitor forging their own consent cookie only affects whether we
 * measure them, which is not a boundary worth defending.
 *
 * The decision covers the `kc_vid` identifier and every journey event. It does
 * **not** cover the brief stored in `localStorage` or the `kc_quota` counter —
 * one is the visitor's own work in progress and the other is abuse prevention,
 * and neither is used to build a profile.
 */

export const CONSENT_COOKIE = "kc_consent";

/**
 * Bump when the categories or their meaning change. An old value stops
 * matching, the banner reappears, and consent is asked for again rather than
 * being silently inherited across a policy change.
 */
export const CONSENT_VERSION = 1;

/** A year, matching `kc_vid` — re-asking sooner is nagging, later is stale. */
export const CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type ConsentDecision = "granted" | "denied";

export function serializeConsent(decision: ConsentDecision): string {
  return `${CONSENT_VERSION}:${decision}`;
}

/**
 * Parses a cookie value, returning null for absent, malformed or outdated.
 *
 * The value is decoded first. Cookie writers percent-encode the separator, so
 * what comes back is `1%3Agranted` rather than `1:granted` — reading it raw
 * would fail to parse, the banner would reappear on every page, and analytics
 * would never start no matter how many times the visitor accepted.
 */
export function parseConsent(raw: string | undefined | null): ConsentDecision | null {
  if (!raw) return null;

  let value = raw;
  try {
    value = decodeURIComponent(raw);
  } catch {
    // A malformed escape sequence — fall through and let the parse below fail.
  }

  const [version, decision] = value.split(":");
  if (Number(version) !== CONSENT_VERSION) return null;
  return decision === "granted" || decision === "denied" ? decision : null;
}

/** Server-side read, for `proxy.ts` and route handlers. */
export function readConsent(request: NextRequest): ConsentDecision | null {
  return parseConsent(request.cookies.get(CONSENT_COOKIE)?.value);
}

/** Browser-side read. Returns null before a choice is made — show the banner. */
export function readConsentClient(): ConsentDecision | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${CONSENT_COOKIE}=`));
  return parseConsent(match?.slice(CONSENT_COOKIE.length + 1));
}

/**
 * Asks the banner to show itself again, so a visitor can change their mind.
 * Dispatched by the footer’s "Cookie settings" link.
 */
export const CONSENT_REOPEN_EVENT = "kc-consent-reopen";

/**
 * Announces that analytics were just accepted. `JourneyProvider` listens so the
 * page the visitor consented on is still recorded — without it tracking would
 * only begin at the next navigation and every first landing page would be lost.
 */
export const CONSENT_GRANTED_EVENT = "kc-consent-granted";

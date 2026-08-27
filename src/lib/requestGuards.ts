import type { NextRequest } from "next/server";

/**
 * Cheap guards for the public POST endpoints.
 *
 * Neither of these is spam protection — a determined script can omit an Origin
 * header and leave the honeypot blank. They stop the two cheapest attacks:
 * a form on somebody else's site submitting through your visitors' browsers,
 * and bots that fill every field they find.
 */

/**
 * True when a request carries a browser Origin that is not ours.
 *
 * Missing Origin is treated as **allowed**, deliberately. Browsers always send
 * it on cross-origin POSTs, so its absence means the caller is not a browser —
 * curl, a server, a test — and cross-site request forgery is not the threat
 * there. Rejecting those would block legitimate non-browser clients while
 * stopping nothing, since a script can simply omit the header anyway.
 */
export function isCrossOriginRequest(request: NextRequest): boolean {
  // Origin only. A `Referer` fallback looked like extra coverage but was the
  // opposite: `Referer` is routinely stripped by privacy tools and proxies
  // while `Origin` is not, so falling back to it only added a way for a
  // legitimate non-browser client to be judged foreign for sending one.
  const stated = request.headers.get("origin");
  if (!stated) return false;

  let statedHost: string;
  try {
    statedHost = new URL(stated).host;
  } catch {
    return true; // unparseable Origin — treat as foreign
  }

  const allowed = new Set<string>();

  // The Host header is what the browser resolved for *us*. In a forged request
  // Host is still our domain while Origin is the attacker's, which is exactly
  // the comparison that matters. Using it also means preview deployments and
  // localhost work with no configuration.
  const host = request.headers.get("host");
  if (host) allowed.add(host);

  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    try {
      allowed.add(new URL(configured).host);
    } catch {
      /* ignore a malformed env value */
    }
  }

  return !allowed.has(statedHost);
}

/**
 * Pick the client address from proxy headers.
 *
 * `x-forwarded-for.split(",")[0]` — the previous approach — takes the *first*
 * entry, which is whatever the caller put there. Anyone can send their own
 * `X-Forwarded-For` and get a fresh rate-limit bucket on every request; the
 * route tests in `contact-api.spec.ts` rely on exactly that to keep their
 * buckets separate, which is a neat demonstration of the hole.
 *
 * A trusted proxy *appends* the address it observed, so the **last** entry is
 * the one the client could not choose. `x-real-ip`, which the proxy sets
 * outright, is preferred where present.
 *
 * This assumes the app is reached through one trusted proxy — true on Vercel.
 * Served directly, these headers mean nothing and neither does the limit.
 */
export function pickClientIp(
  realIp: string | null,
  forwardedFor: string | null
): string {
  const direct = realIp?.trim();
  if (direct) return direct;

  const chain = (forwardedFor ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return chain.length > 0 ? chain[chain.length - 1] : "unknown";
}

export function clientIp(request: NextRequest): string {
  return pickClientIp(
    request.headers.get("x-real-ip"),
    request.headers.get("x-forwarded-for")
  );
}

/**
 * Name of the decoy field.
 *
 * Deliberately **not** `company`, `organization`, `website` or anything else in
 * a browser's address-profile vocabulary. The first version used `company`,
 * which is a textbook match for Chrome's autofill and for password managers —
 * a visitor autofilling their name could have had this filled too, and a
 * filled honeypot means the enquiry is discarded. Silently losing real leads
 * is far worse than letting a few bots through.
 *
 * `subject_line` is plausible enough on a contact form that a naive bot fills
 * it, while matching no profile-autofill heuristic.
 */
export const HONEYPOT_FIELD = "subject_line";

/** True when the decoy came back filled, which no human can do. */
export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

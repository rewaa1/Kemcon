import { NextRequest, NextResponse, after } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { sendJourneyToCrm, type CrmJourneyEvent } from "@/lib/crm";
import { isKnownEventType } from "@/lib/journey/events";
import { readVisitorId } from "@/lib/visitor";

/**
 * Journey beacons from the browser.
 *
 * Posted by `navigator.sendBeacon`, which means nothing is waiting on the
 * response and nothing the visitor sees depends on it. Every failure path here
 * returns 204: a dropped batch of page views is not worth an error, and a
 * beacon that retries in a loop is worse than one that gives up.
 *
 * The visitor id is read from the signed `kc_vid` cookie rather than the body,
 * so a caller cannot write events onto somebody else's journey.
 */

/** Matches the client's cap in `lib/journey/track.ts`. */
const MAX_EVENTS = 50;

/** Generous for 50 small events; stops a body that is trying to be a problem. */
const MAX_BODY_BYTES = 32_768;

/** Payload keys are ids and counts — this is far above anything legitimate. */
const MAX_STRING = 200;

const NO_CONTENT = new NextResponse(null, { status: 204 });

interface RawEvent {
  t?: unknown;
  at?: unknown;
  [key: string]: unknown;
}

/**
 * Strips an event down to what is safe to store: a known type, a plausible
 * timestamp, and scalar payload values. Returns null for anything unrecognised.
 *
 * Unknown types are dropped rather than rejected — during a deploy an older
 * client may still be sending an event this build no longer knows, and failing
 * the whole batch over it would lose the events that are still good.
 */
function sanitize(raw: RawEvent, now: number): CrmJourneyEvent | null {
  if (!isKnownEventType(raw.t)) return null;

  const at = typeof raw.at === "number" && Number.isFinite(raw.at) ? raw.at : now;
  // A clock-skewed or forged timestamp would land the event in the wrong day's
  // bucket on the analytics page. Clamp rather than discard.
  const clamped = Math.min(Math.max(at, now - 86_400_000), now);

  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (key === "t" || key === "at") continue;
    if (typeof value === "string") payload[key] = value.slice(0, MAX_STRING);
    else if (typeof value === "number" && Number.isFinite(value)) payload[key] = value;
    else if (typeof value === "boolean" || value === null) payload[key] = value;
    // Objects and arrays are dropped: no event in the union carries one, so
    // anything nested arrived from somewhere it should not have.
  }

  return { type: raw.t, at: clamped, payload };
}

export async function POST(request: NextRequest) {
  const visitorId = readVisitorId(request);
  // No signed cookie means no journey to attach this to. `proxy.ts` issues one
  // on the first page view, so this is a beacon from a client that blocked it.
  if (!visitorId) return NO_CONTENT;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRateLimit(`journey:${ip}`, 30, 60_000)) return NO_CONTENT;

  const text = await request.text().catch(() => "");
  if (!text || text.length > MAX_BODY_BYTES) return NO_CONTENT;

  let parsed: { events?: unknown };
  try {
    parsed = JSON.parse(text) as { events?: unknown };
  } catch {
    return NO_CONTENT;
  }

  if (!Array.isArray(parsed.events)) return NO_CONTENT;

  const now = Date.now();
  const events = parsed.events
    .slice(0, MAX_EVENTS)
    .map((raw) => sanitize(raw as RawEvent, now))
    .filter((event): event is CrmJourneyEvent => event !== null);

  if (events.length === 0) return NO_CONTENT;

  // The locale the visitor is browsing in, taken from the first page-ish event
  // that carries one, so the CRM can split traffic EN/AR.
  const locale =
    events.find((e) => typeof e.payload.locale === "string")?.payload.locale ?? "en";

  /**
   * Forwarded after the response, not before it.
   *
   * Nothing is waiting on this 204 — it answers a `sendBeacon` — but the
   * connection was still being held open for as long as the CRM took to
   * answer. When the CRM was slow that meant the browser had a beacon in
   * flight for the whole timeout, and the next flush piled up behind it. The
   * page views are worth recording; they are not worth holding a request open
   * for, so `after` hands them off once this handler has already replied.
   */
  after(() =>
    sendJourneyToCrm({
      visitorId,
      locale: String(locale),
      referrer: request.headers.get("referer"),
      // Vercel resolves this at the edge; absent in local development.
      country: request.headers.get("x-vercel-ip-country"),
      events,
    })
  );

  return NO_CONTENT;
}

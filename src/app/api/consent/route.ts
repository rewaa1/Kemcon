import { NextResponse, type NextRequest } from "next/server";
import {
  CONSENT_COOKIE,
  CONSENT_COOKIE_MAX_AGE,
  serializeConsent,
  type ConsentDecision,
} from "@/lib/consent";
import {
  VISITOR_COOKIE,
  VISITOR_COOKIE_MAX_AGE,
  cookieOptions,
  issueVisitorId,
  readVisitorId,
} from "@/lib/visitor";

/**
 * Records the visitor's analytics choice.
 *
 * The decision is written here rather than from the browser because granting
 * it also has to mint `kc_vid`, and that cookie is HMAC-signed with
 * `APP_SECRET` — a secret the client must never see. Doing both in one
 * response also means tracking can begin on the next event instead of after a
 * reload.
 *
 * Withdrawing is the interesting half: "denied" actively deletes `kc_vid`, so
 * a visitor who accepts and later changes their mind stops being identifiable
 * rather than merely stopping being recorded.
 */

function isDecision(value: unknown): value is ConsentDecision {
  return value === "granted" || value === "denied";
}

export async function POST(request: NextRequest) {
  let decision: unknown;
  try {
    decision = (await request.json())?.decision;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!isDecision(decision)) {
    return NextResponse.json({ error: "decision must be granted or denied" }, { status: 400 });
  }

  const response = NextResponse.json({ decision });

  // Readable by the banner, so not httpOnly. It records a choice; there is
  // nothing in it worth hiding from the person who made it.
  response.cookies.set(CONSENT_COOKIE, serializeConsent(decision), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CONSENT_COOKIE_MAX_AGE,
  });

  if (decision === "granted") {
    // Only mint one if they do not already carry a valid id — re-issuing would
    // split one person's history in two.
    if (!readVisitorId(request)) {
      response.cookies.set(
        VISITOR_COOKIE,
        issueVisitorId().value,
        cookieOptions(VISITOR_COOKIE_MAX_AGE)
      );
    }
  } else {
    // Withdrawal. The quota counter stays: it is abuse prevention, carries no
    // identity beyond a count, and clearing it would hand out free generations.
    response.cookies.set(VISITOR_COOKIE, "", { ...cookieOptions(0), maxAge: 0 });
  }

  return response;
}

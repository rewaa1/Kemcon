import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { readConsent } from "./lib/consent";
import {
  VISITOR_COOKIE,
  VISITOR_COOKIE_MAX_AGE,
  cookieOptions,
  issueVisitorId,
  readVisitorId,
} from "./lib/visitor";

const intl = createMiddleware(routing);

/**
 * Locale routing, plus the visitor id — but only once we are allowed one.
 *
 * The id used to be minted on every visitor's first page view. It is a
 * year-long analytics identifier and nothing on the site needs it to function,
 * so it now waits for consent: no `kc_consent=granted` cookie, no `kc_vid`.
 * A visitor who never answers the banner, or answers no, is never assigned one.
 *
 * Consent is granted through `/api/consent`, which mints the id in the same
 * response, so the only thing left for this to do is re-issue one that expired
 * or was cleared while consent still stands.
 *
 * `Set-Cookie` is only attached when there is something to set, so a returning
 * visitor's response stays cacheable.
 *
 * This works because Next 16 runs proxy on the Node.js runtime — the cookie is
 * HMAC-signed with `node:crypto`, which the old Edge default could not do.
 */
export default function proxy(request: NextRequest) {
  const response = intl(request);

  if (readConsent(request) === "granted" && !readVisitorId(request)) {
    const issued = issueVisitorId();
    response.cookies.set(
      VISITOR_COOKIE,
      issued.value,
      cookieOptions(VISITOR_COOKIE_MAX_AGE)
    );
  }

  return response;
}

export const config = {
  matcher: ["/", "/(en|ar)/:path*"],
};

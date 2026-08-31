"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  CONSENT_GRANTED_EVENT,
  CONSENT_REOPEN_EVENT,
  readConsentClient,
  type ConsentDecision,
} from "@/lib/consent";
import { discardQueue } from "@/lib/journey/track";

/**
 * The analytics consent banner.
 *
 * Accept and Decline are given equal visual weight on purpose. A banner whose
 * only real button is "Accept" does not collect a free choice, and a choice
 * that was not free is not consent — which would leave us in a worse position
 * than having no banner at all.
 *
 * Nothing is tracked until this is answered: `proxy.ts` withholds `kc_vid` and
 * `track()` is a no-op. Declining is therefore the status quo, not an action
 * that has to undo anything — except a queue left over from a previous
 * acceptance, which `discardQueue()` clears.
 *
 * Rendered only after mount. The server cannot know the stored decision
 * without varying cached HTML on a cookie, so the banner is deliberately
 * client-only and absent from the first paint.
 */
export function CookieBanner() {
  const t = useTranslations("cookies");
  const locale = useLocale();
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // No stored decision — ask. A stored one, either way, stays respected.
    if (readConsentClient() === null) setVisible(true);

    // The footer's "Cookie settings" link reopens this.
    const reopen = () => setVisible(true);
    window.addEventListener(CONSENT_REOPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, reopen);
  }, []);

  async function decide(decision: ConsentDecision) {
    setBusy(true);
    try {
      // The server sets the cookies: granting also mints the signed `kc_vid`,
      // which needs APP_SECRET and so cannot happen in the browser.
      await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      if (decision === "denied") discardQueue();
      else window.dispatchEvent(new Event(CONSENT_GRANTED_EVENT));
    } catch {
      // A failed request must not trap the visitor behind the banner. Hiding it
      // is safe: without the cookie nothing is tracked, so a failure lands in
      // the same place as declining.
    } finally {
      setBusy(false);
      setVisible(false);
    }
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t("title")}
      className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6"
    >
      <div className="mx-auto max-w-3xl rounded-sm border border-border bg-card p-5 shadow-lg sm:p-6">
        <h2 className="mb-2 text-sm font-medium uppercase tracking-[0.15em] text-heading">
          {t("title")}
        </h2>
        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
          {t("body")}{" "}
          <Link
            href={`/${locale}/privacy`}
            className="underline underline-offset-4 hover:text-accent"
          >
            {t("readMore")}
          </Link>
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => decide("granted")}
            disabled={busy}
            className="h-11 flex-1 rounded-sm bg-accent px-6 text-xs font-medium uppercase tracking-[0.15em] text-dark transition-colors duration-300 hover:bg-accent-hover disabled:opacity-60"
          >
            {t("accept")}
          </button>
          <button
            type="button"
            onClick={() => decide("denied")}
            disabled={busy}
            className="h-11 flex-1 rounded-sm border border-border px-6 text-xs font-medium uppercase tracking-[0.15em] text-foreground transition-colors duration-300 hover:border-accent hover:text-accent disabled:opacity-60"
          >
            {t("decline")}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import {
  CONSENT_DENIED_EVENT,
  CONSENT_GRANTED_EVENT,
  readConsentClient,
} from "@/lib/consent";

/**
 * Google Analytics 4, gated on the same consent as everything else.
 *
 * The gate is placed where `track()` puts it — at the entry point, not at the
 * send. Until the visitor accepts, `gtag.js` is not requested at all: no
 * script, no cookie, no network call to Google. That is stricter than Consent
 * Mode, which loads the tag and asks it to behave, and it matches what the
 * cookie banner actually promises.
 *
 * Unset `NEXT_PUBLIC_GA_ID` renders nothing, so a fork or a preview deploy
 * without the variable is silently analytics-free rather than broken.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * The consent cookie read as an external store rather than mirrored into
 * state. It is exactly that — a value owned outside React, changed by the
 * banner — and subscribing to it directly avoids the mount-time render pass
 * that copying it into `useState` would cost on every page.
 */
function subscribeToConsent(onChange: () => void) {
  window.addEventListener(CONSENT_GRANTED_EVENT, onChange);
  window.addEventListener(CONSENT_DENIED_EVENT, onChange);
  return () => {
    window.removeEventListener(CONSENT_GRANTED_EVENT, onChange);
    window.removeEventListener(CONSENT_DENIED_EVENT, onChange);
  };
}

const isGranted = () => readConsentClient() === "granted";

/** The server has no cookie to read, and must not guess: assume no consent. */
const notGrantedOnServer = () => false;

function setKillSwitch(value: boolean) {
  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = value;
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const granted = useSyncExternalStore(
    subscribeToConsent,
    isGranted,
    notGrantedOnServer
  );

  useEffect(() => {
    if (!GA_ID) return;

    if (!granted) {
      /**
       * `gtag.js` cannot be unloaded once the browser has run it, so a visitor
       * who accepts and then changes their mind would keep being measured
       * until they happened to reload. `ga-disable-<id>` is Google's documented
       * kill switch: the tag checks it before every send. Unmounting the
       * `<Script>` below stops nothing on its own — this is what does the work.
       */
      setKillSwitch(true);
      return;
    }

    // Cleared on grant so that accept → withdraw → accept again resumes,
    // rather than leaving the tag permanently muted by its own kill switch.
    setKillSwitch(false);

    /**
     * The bootstrap lives here rather than in an inline `<Script>` because
     * order matters and the two do not have a guaranteed one. `config` has to
     * reach `dataLayer` before the first `page_view`; an `afterInteractive`
     * script can run after this effect, which would queue the view first and
     * lose it. Pushing both from the same effect makes the order explicit.
     *
     * `gtag.js` replays whatever is already in `dataLayer` when it loads, so
     * queueing before the script arrives is not just safe, it is the mechanism.
     */
    const w = window;
    w.dataLayer = w.dataLayer || [];

    if (!w.gtag) {
      // Must stay a plain function: the real `gtag` pushes its `arguments`
      // object, and `arguments` is a syntax error in a function with rest
      // parameters. An array pushed in its place is not read the same way.
      w.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        w.dataLayer!.push(arguments);
      };
      w.gtag("js", new Date());
      // Automatic page views only fire on a full load, which would miss every
      // client-side navigation and double-count the first page. Sent below.
      w.gtag("config", GA_ID, { send_page_view: false });
    }

    w.gtag("event", "page_view", {
      page_path: pathname,
      page_location: w.location.href,
      page_title: document.title,
    });
  }, [pathname, granted]);

  if (!GA_ID || !granted) return null;

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      strategy="afterInteractive"
    />
  );
}

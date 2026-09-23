"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { beginDwell, endDwell, stopDwellTracking } from "@/lib/journey/dwell";
import { CONSENT_GRANTED_EVENT } from "@/lib/consent";
import { flush, registerFlushOnHide, track } from "@/lib/journey/track";

/**
 * The only automatic part of journey tracking: page views and time on page.
 *
 * Everything else is emitted imperatively by the component that knows what
 * happened — a fabric being picked, a gallery being closed. Mounted once in
 * the locale layout, above the routes, so it survives client-side navigation.
 */
export function JourneyProvider() {
  const pathname = usePathname();
  const locale = useLocale();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    /**
     * Until consent is given, `track()` is a no-op — so the page view fired
     * on mount went nowhere. Re-fire it when the visitor accepts, or the
     * page they were actually looking at when they said yes would be the one
     * page missing from their journey.
     */
    const onGranted = () => {
      track({ t: "page_view", path: pathname, locale });
      beginDwell(pathname);
    };
    window.addEventListener(CONSENT_GRANTED_EVENT, onGranted);

    const stopFlushOnHide = registerFlushOnHide();
    return () => {
      // Leaving for good — a full page navigation or a tab close. Bank the
      // last page's time before the listeners and the queue go away.
      endDwell();
      stopDwellTracking();
      flush();
      stopFlushOnHide();
      window.removeEventListener(CONSENT_GRANTED_EVENT, onGranted);
    };
    // `pathname`/`locale` are read inside the listener rather than closed over
    // at mount, so this stays a mount-once effect and the listener is not
    // rebound on every navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, locale]);

  useEffect(() => {
    /**
     * The page view is guarded; the dwell timer deliberately is not.
     *
     * React mounts, unmounts and remounts effects in development's strict
     * mode. The guard stops that counting as two visits — but the unmount in
     * between also tears the dwell timer down, so restarting it has to happen
     * on every run of this effect or time on page would silently stop being
     * recorded in development.
     */
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      track({ t: "page_view", path: pathname, locale });
    }

    // Closes the previous page's measurement and emits its `page_dwell`.
    beginDwell(pathname);
  }, [pathname, locale]);

  return null;
}

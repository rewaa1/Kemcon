"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis is created imperatively (rather than via `<ReactLenis>`) so it
 * initialises after paint and adds no wrapper element — that was a deliberate
 * performance fix.
 *
 * The trade-off is that `useLenis()` from `lenis/react` has no context to read
 * and always returns `undefined`, which silently disabled every
 * `lenis.stop()` call in the app. These module-level accessors give overlays a
 * working handle without reintroducing the wrapper.
 */
let instance: Lenis | null = null;

/** Pause smooth scrolling — call when a modal or drawer opens. */
export function stopLenis() {
  instance?.stop();
}

/** Resume smooth scrolling — call when the overlay closes. */
export function startLenis() {
  instance?.start();
}

/**
 * Jump to the top of the page. Goes through Lenis when it is running —
 * a bare `window.scrollTo` fights the smooth-scroll loop and snaps back.
 */
export function scrollToTop(immediate = true) {
  if (instance) instance.scrollTo(0, { immediate });
  else window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.5,
      smoothWheel: true,
    });
    instance = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return <>{children}</>;
}

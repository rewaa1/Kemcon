import { flush, track } from "./track";

/**
 * How long a visitor actually spent on a page, and how far down it they got.
 *
 * The measure is **engaged time**, not wall-clock. Time only accrues while the
 * tab is visible and the window has focus, so a page left open in a background
 * tab overnight reports the thirty seconds someone read it rather than eight
 * hours. Without that distinction "average time on the clients page" is
 * dominated by abandoned tabs and means nothing.
 *
 * A page reports one `page_dwell` per continuous engaged stretch — see
 * `report` — so the CRM sums stretches per visitor and path before averaging.
 */

/** Below this, the reading is navigation noise rather than a visit. */
const MIN_REPORTABLE_MS = 1_000;

interface Session {
  path: string;
  /** Milliseconds banked from previous visible stretches. */
  engagedMs: number;
  /** When the current visible stretch began, or null while paused. */
  since: number | null;
  maxScrollPct: number;
}

let session: Session | null = null;
let listening = false;

/**
 * Whether the window currently has focus.
 *
 * Tracked as state updated by `focus`/`blur` rather than read from
 * `document.hasFocus()` on demand, because that call answers "right now" and
 * is unreliable at the moment a page loads — it commonly reports false before
 * the browser has settled focus, and no `focus` event follows to correct it.
 * Reading it directly meant a freshly opened page could sit at zero engaged
 * time forever.
 *
 * Starting at `true` is the honest default: a page that is visible is being
 * looked at until the browser tells us otherwise, which a real switch-away
 * always does by firing `blur`.
 */
let focused = true;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function isEngaged(): boolean {
  return document.visibilityState === "visible" && focused;
}

/** How far down the page the viewport bottom has reached, 0–100. */
function scrollPct(): number {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - window.innerHeight;
  // A page shorter than the viewport was seen in full by definition.
  if (scrollable <= 0) return 100;
  const pct = ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;
  return Math.min(100, Math.max(0, Math.round(pct)));
}

function pause() {
  if (!session || session.since === null) return;
  session.engagedMs += Date.now() - session.since;
  session.since = null;
}

function resume() {
  if (!session || session.since !== null) return;
  session.since = Date.now();
}

/**
 * Bank whatever has accumulated and report it, keeping the page open for more.
 *
 * This is what makes closing a tab measurable. Most visits end by closing the
 * tab or switching away for good, never by navigating — so a dwell that were
 * only emitted on route change would silently lose the majority of real
 * readings, and the ones it did keep would be biased towards people who
 * happened to click something else afterwards.
 *
 * A page therefore reports one `page_dwell` per continuous engaged stretch, not
 * one per page view. Analytics sums the stretches per visitor and path before
 * taking a median, so a visitor who tabs away and comes back is still counted
 * once, with their total.
 */
function report() {
  if (!session) return;
  pause();
  if (session.engagedMs < MIN_REPORTABLE_MS) return;

  track({
    t: "page_dwell",
    path: session.path,
    engagedMs: Math.round(session.engagedMs),
    maxScrollPct: session.maxScrollPct,
  });
  session.engagedMs = 0;

  /**
   * Send it now, rather than leaving it for the queue's own hide handler.
   *
   * Both modules listen for `visibilitychange`, and the queue registers first,
   * so its flush has already run by the time this one is called — the dwell
   * would sit in the queue until some later flush that, on a closing tab, never
   * comes. Flushing here is what actually gets the reading off the page.
   */
  flush();
}

function onFocus() {
  focused = true;
  if (isEngaged()) resume();
}

function onBlur() {
  focused = false;
  // Losing focus is a pause, not an ending: the page is still on screen and
  // the visitor is very likely coming back to it.
  pause();
}

function onVisibility() {
  if (isEngaged()) {
    resume();
    return;
  }
  // Going away — this may be the last moment we get, so report now rather than
  // hope for a later navigation that may never come.
  report();
}

function onScroll() {
  if (!session) return;
  const pct = scrollPct();
  if (pct > session.maxScrollPct) session.maxScrollPct = pct;
}

/**
 * Close the current page's measurement and emit whatever is left unreported.
 *
 * Safe to call repeatedly: `report` zeroes the accumulator, so a tab-hide
 * followed by a route change reports the time once, not twice.
 */
export function endDwell() {
  if (!isBrowser() || !session) return;
  report();
  session = null;
}

/** Close the previous page's measurement, if any, and start a new one. */
export function beginDwell(path: string) {
  if (!isBrowser()) return;

  endDwell();

  session = {
    path,
    engagedMs: 0,
    since: isEngaged() ? Date.now() : null,
    maxScrollPct: scrollPct(),
  };

  if (listening) return;
  listening = true;
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("focus", onFocus);
  window.addEventListener("blur", onBlur);
  // The only reliable "this page is going away" signal on mobile, where a
  // backgrounded tab can be killed without ever firing unload.
  window.addEventListener("pagehide", report);
  window.addEventListener("scroll", onScroll, { passive: true });
}

/** Tear down the listeners registered by `beginDwell`. */
export function stopDwellTracking() {
  if (!isBrowser() || !listening) return;
  listening = false;
  document.removeEventListener("visibilitychange", onVisibility);
  window.removeEventListener("focus", onFocus);
  window.removeEventListener("blur", onBlur);
  window.removeEventListener("pagehide", report);
  window.removeEventListener("scroll", onScroll);
}

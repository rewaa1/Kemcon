import type { JourneyEvent, QueuedEvent } from "./events";
import { readConsentClient } from "@/lib/consent";

/**
 * The journey queue.
 *
 * Deliberately a plain module, not a React context: events fire from event
 * handlers, from the Zustand brief store, and from effects, and threading a
 * hook through all three would be far more invasive than the feature is worth.
 * `track()` is safe to call from anywhere, including during SSR, where it is
 * a no-op.
 *
 * Nothing here is allowed to affect the visitor. Every failure path drops
 * events silently — an analytics beacon that breaks a page is worse than no
 * analytics at all.
 *
 * Everything below is gated on analytics consent. Until the visitor accepts,
 * `track()` is a no-op and nothing is queued, mirrored or sent — the check sits
 * at the entry point rather than at the send, so a visitor who declines never
 * has their activity written to `sessionStorage` in the first place.
 */

const ENDPOINT = "/api/journey";

/** Flush once the queue reaches this many events. */
const BATCH_SIZE = 10;

/** …or once this long has passed since the last event, whichever comes first. */
const IDLE_FLUSH_MS = 5_000;

/**
 * Matches the server's cap. Trimming here rather than letting the route reject
 * the batch means a burst of activity loses its oldest events, not all of them.
 */
const MAX_QUEUE = 50;

/**
 * Survives a hard navigation. `sendBeacon` is reliable for the tab-close case
 * but a full page load can still tear down mid-flush, so the queue is mirrored
 * and replayed on the next page rather than lost.
 */
const STORAGE_KEY = "kemcon_journey_v1";

let queue: QueuedEvent[] = [];
let idleTimer: ReturnType<typeof setTimeout> | null = null;
let restored = false;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/** Persist the pending queue. Storage can throw (Safari private mode, quota). */
function mirror() {
  if (!isBrowser()) return;
  try {
    if (queue.length === 0) sessionStorage.removeItem(STORAGE_KEY);
    else sessionStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // A queue we cannot mirror is still a queue we can flush. Carry on.
  }
}

/** Replay whatever the previous page failed to send. Runs once per page load. */
function restore() {
  if (restored || !isBrowser()) return;
  restored = true;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) queue = parsed.slice(-MAX_QUEUE) as QueuedEvent[];
  } catch {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing further to try.
    }
  }
}

/**
 * Hand the batch to the browser.
 *
 * `sendBeacon` is the right primitive: it survives the page being torn down,
 * which a plain `fetch` does not. `keepalive` is the fallback for the handful
 * of browsers without it. Either way the response is ignored — the server has
 * nothing to tell us that the visitor should wait for.
 */
function send(batch: QueuedEvent[]): boolean {
  const body = JSON.stringify({ events: batch });

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      // A typed Blob rather than a bare string: without it the browser sends
      // `text/plain`, and the route reads JSON.
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(ENDPOINT, blob)) return true;
    }

    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
    return true;
  } catch {
    return false;
  }
}

/** Send everything pending. Called on batch size, idle, route change and tab-hide. */
export function flush() {
  if (!isBrowser()) return;

  // Consent can be withdrawn between queueing and flushing.
  if (!allowed()) {
    discardQueue();
    return;
  }

  if (idleTimer) {
    clearTimeout(idleTimer);
    idleTimer = null;
  }

  if (queue.length === 0) return;

  const batch = queue;
  queue = [];
  mirror();

  if (!send(batch)) {
    // Put it back so the next flush — or the next page, via the mirror — can
    // try again. Newest events win if this pushes us over the cap.
    queue = [...batch, ...queue].slice(-MAX_QUEUE);
    mirror();
  }
}

/** True only once the visitor has actively accepted analytics. */
function allowed(): boolean {
  return readConsentClient() === "granted";
}

/**
 * Drop anything a previous session left behind.
 *
 * A visitor can accept, browse, then withdraw. Without this the queue mirrored
 * before the withdrawal would still be sitting in `sessionStorage`, and the
 * next flush would send events they have since said no to.
 */
export function discardQueue() {
  queue = [];
  if (!isBrowser()) return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing further to try.
  }
}

/** Record one event. Cheap, synchronous, and safe to call during SSR. */
export function track(event: JourneyEvent) {
  if (!isBrowser() || !allowed()) return;

  restore();

  queue.push({ ...event, at: Date.now() });
  if (queue.length > MAX_QUEUE) queue = queue.slice(-MAX_QUEUE);
  mirror();

  if (queue.length >= BATCH_SIZE) {
    flush();
    return;
  }

  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(flush, IDLE_FLUSH_MS);
}

/**
 * Flush when the tab goes away. `visibilitychange` is the reliable signal —
 * `beforeunload` and `unload` are unreliable on mobile, where a backgrounded
 * tab may simply be killed. Returns a cleanup function.
 */
export function registerFlushOnHide(): () => void {
  if (!isBrowser()) return () => {};

  const onHidden = () => {
    if (document.visibilityState === "hidden") flush();
  };

  document.addEventListener("visibilitychange", onHidden);
  window.addEventListener("pagehide", flush);

  return () => {
    document.removeEventListener("visibilitychange", onHidden);
    window.removeEventListener("pagehide", flush);
  };
}

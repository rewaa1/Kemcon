import type { CategoryType } from "@/types/configurator";

/**
 * Everything the site records about how a visitor moved through it.
 *
 * This union is the contract for the whole feature: the client emits it, the
 * CRM stores `t` as the event type and the rest as an opaque payload, and the
 * analytics page reads it back. Adding a variant here is the only place a new
 * event needs declaring on this side.
 *
 * **Ids and labels only — never free text the visitor typed.** There is
 * deliberately no `customDescription`, no notes and no contact detail in any
 * variant. The lead record already holds all of that, and copying typed prose
 * into an event log is exactly what turns a useful journey into a privacy
 * problem. Payloads are ids we can resolve ourselves and numbers we counted.
 */
export type JourneyEvent =
  // ── generic ─────────────────────────────────────────────────────────────
  | { t: "page_view"; path: string; locale: string }
  /**
   * Engaged time, not wall-clock — see `dwell.ts`. `maxScrollPct` is how far
   * down the page they actually got, which separates "read it" from "landed
   * and left".
   */
  | { t: "page_dwell"; path: string; engagedMs: number; maxScrollPct: number }

  // ── products & configurator ─────────────────────────────────────────────
  | { t: "product_view"; category: CategoryType; productId?: string }
  | { t: "intake_answer"; question: string; answer: string }
  /**
   * The visitor has specified enough of a product for it to be quotable.
   *
   * This replaced the retired configurator's `configurator_open` /
   * `configurator_step` pair when every category moved to a single form: there
   * are no steps left to emit, so without it a visitor would jump straight
   * from `product_view` to `form_start` and the CRM's "configured" funnel
   * stage would lose everyone who specified a piece and then left. The CRM
   * still counts the two retired types toward that stage so historical
   * journeys keep reading correctly.
   */
  | { t: "enquiry_configured"; category: CategoryType }
  | { t: "fabric_select"; fabricId: string; familyId?: string }
  | { t: "color_select"; colorId: string }
  | { t: "pattern_select"; patternId: string }

  // ── clients / showcase ──────────────────────────────────────────────────
  | { t: "client_gallery_open"; clientId: string; region: string }
  /**
   * One event per gallery rather than one per image: a 30-photo gallery would
   * flood the queue, and "viewed 12 of 30 over 2m10s" is the answer the
   * business actually wants. `imagesViewed` counts *distinct* indices, so
   * arrowing back and forth does not inflate it.
   */
  | {
      t: "client_gallery_close";
      clientId: string;
      region: string;
      imagesViewed: number;
      totalImages: number;
      maxIndex: number;
      dwellMs: number;
    }
  | { t: "clients_filter"; region: string }
  | { t: "clients_load_more"; visibleCount: number }

  // ── brief & conversion ──────────────────────────────────────────────────
  | { t: "brief_item_add"; category: CategoryType; quantity: number }
  | { t: "brief_item_remove"; category: CategoryType }
  | { t: "brief_open" }
  | { t: "form_start"; formType: string }
  | { t: "whatsapp_click"; formType: string }
  | { t: "form_submit"; formType: string; briefType?: string | null };

/** The event as it goes on the wire, stamped client-side. */
export type QueuedEvent = JourneyEvent & { at: number };

/** Every `t` in the union, for the API route to validate against. */
export const JOURNEY_EVENT_TYPES = [
  "page_view",
  "page_dwell",
  "product_view",
  "intake_answer",
  "enquiry_configured",
  "fabric_select",
  "color_select",
  "pattern_select",
  "client_gallery_open",
  "client_gallery_close",
  "clients_filter",
  "clients_load_more",
  "brief_item_add",
  "brief_item_remove",
  "brief_open",
  "form_start",
  "whatsapp_click",
  "form_submit",
] as const satisfies readonly JourneyEvent["t"][];

export type JourneyEventType = (typeof JOURNEY_EVENT_TYPES)[number];

const KNOWN = new Set<string>(JOURNEY_EVENT_TYPES);

export function isKnownEventType(value: unknown): value is JourneyEventType {
  return typeof value === "string" && KNOWN.has(value);
}

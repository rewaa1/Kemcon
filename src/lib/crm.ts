/**
 * Lead delivery to the Kemcon CRM.
 *
 * Every enquiry the site accepts is recorded in the CRM, whatever channel the
 * visitor picked to hear back on. Email and WhatsApp are how *they* reach us;
 * this is how the business keeps the record — previously a WhatsApp enquiry
 * left no trace anywhere but a phone.
 *
 * Called server-side only, so `CRM_INGEST_SECRET` never reaches the browser.
 * See docs/crm-lead-intake.md and the CRM's `/api/leads/ingest`.
 */

export type LeadChannel = "email" | "whatsapp";

export interface CrmLead {
  /** How the visitor asked to be followed up. */
  channel: LeadChannel;
  /** Which form produced it — "contact" | "brief" | "quick". */
  formType: string;
  /** For briefs: standard | bulk | design. */
  briefType?: string | null;
  name: string;
  phone?: string | null;
  email?: string | null;
  /** The full formatted enquiry, identical to what was emailed / sent. */
  message: string;
  locale: string;
  /** Cloudinary URLs of photos the visitor attached. */
  attachments?: string[];
  /** Structured brief data, so a configured order survives as more than prose. */
  meta?: Record<string, unknown> | null;
  /**
   * The visitor's signed-cookie id, read server-side from the same request that
   * carried the form. Lets the CRM attach everything they did before enquiring
   * to the lead itself. Null when the cookie is missing or fails verification.
   */
  visitorId?: string | null;
}

export type CrmResult =
  | { ok: true; id: string }
  | { ok: false; reason: "unconfigured" | "rejected" | "unreachable"; detail: string };

const TIMEOUT_MS = 8_000;

/**
 * POSTs a payload to a CRM ingest endpoint.
 *
 * Never throws and never retries a 4xx: a rejected payload will be rejected
 * again. One retry covers the case worth covering — a cold start or a dropped
 * connection. Callers decide what a failure means for them; this only reports.
 */
async function postToCrm(url: string, secret: string, body: string, label: string): Promise<CrmResult> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-kemcon-ingest-secret": secret,
        },
        body,
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: "no-store",
      });

      if (response.ok) {
        const json = (await response.json().catch(() => ({}))) as { id?: string };
        return { ok: true, id: json.id ?? "" };
      }

      const detail = await response.text().catch(() => "");
      // 4xx means the CRM understood us and said no. Retrying cannot help.
      if (response.status < 500) {
        console.error(`[crm] ${label} rejected (${response.status}):`, detail.slice(0, 500));
        return { ok: false, reason: "rejected", detail: `HTTP ${response.status}` };
      }

      console.error(`[crm] ${label} attempt ${attempt} failed (${response.status}):`, detail.slice(0, 500));
    } catch (error) {
      console.error(`[crm] ${label} attempt ${attempt} could not reach the CRM:`, error);
    }
  }

  return { ok: false, reason: "unreachable", detail: `CRM did not accept the ${label}` };
}

/**
 * Records a lead in the CRM.
 *
 * The caller's own channel (an email that already sent, a WhatsApp window about
 * to open) is the fallback copy of the enquiry, so a failure here is reported
 * rather than thrown — see the fallback logic in `/api/contact`.
 */
export async function sendLeadToCrm(lead: CrmLead): Promise<CrmResult> {
  const url = process.env.CRM_INGEST_URL;
  const secret = process.env.CRM_INGEST_SECRET;

  if (!url || !secret) {
    console.warn("[crm] CRM_INGEST_URL / CRM_INGEST_SECRET not set — lead not recorded");
    return { ok: false, reason: "unconfigured", detail: "Missing CRM env vars" };
  }

  const body = JSON.stringify({
    source: "website",
    channel: lead.channel === "whatsapp" ? "WHATSAPP" : "EMAIL",
    formType: lead.formType,
    briefType: lead.briefType ?? null,
    name: lead.name,
    phone: lead.phone || null,
    email: lead.email || null,
    message: lead.message,
    locale: lead.locale === "ar" ? "ar" : "en",
    attachments: lead.attachments ?? [],
    meta: lead.meta ?? null,
    vid: lead.visitorId ?? null,
  });

  return postToCrm(url, secret, body, "Lead");
}

/** One tracked event, as `/api/journey` forwards it. */
export interface CrmJourneyEvent {
  type: string;
  at: number;
  payload: Record<string, unknown>;
}

export interface CrmJourneyBatch {
  visitorId: string;
  locale: string;
  referrer?: string | null;
  country?: string | null;
  events: CrmJourneyEvent[];
}

/**
 * The journey endpoint lives beside the lead one and shares its secret, so it
 * is derived rather than configured separately — one URL and one secret to keep
 * in sync instead of two. `CRM_JOURNEY_URL` overrides for the unusual case of
 * the two endpoints not being siblings.
 */
function journeyUrl(ingestUrl: string): string {
  return process.env.CRM_JOURNEY_URL || ingestUrl.replace(/\/ingest\/?$/, "/journey");
}

/**
 * Records a batch of journey events.
 *
 * Failure is genuinely unimportant here — unlike a lead, a dropped batch of
 * page views costs nothing and there is nobody to tell. Logged and swallowed.
 */
export async function sendJourneyToCrm(batch: CrmJourneyBatch): Promise<CrmResult> {
  const ingestUrl = process.env.CRM_INGEST_URL;
  const secret = process.env.CRM_INGEST_SECRET;

  if (!ingestUrl || !secret) {
    // Deliberately quieter than the lead path: this fires on every beacon, and
    // a site running without a CRM would otherwise flood its own logs.
    return { ok: false, reason: "unconfigured", detail: "Missing CRM env vars" };
  }

  const body = JSON.stringify({
    vid: batch.visitorId,
    locale: batch.locale === "ar" ? "ar" : "en",
    referrer: batch.referrer ?? null,
    country: batch.country ?? null,
    events: batch.events,
  });

  return postToCrm(journeyUrl(ingestUrl), secret, body, "Journey");
}

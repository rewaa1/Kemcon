# CRM lead intake

Every enquiry the website accepts is recorded in the Kemcon CRM, **and** delivered
on whichever channel the visitor chose. The two are independent: the CRM is the
business's record, the channel is how the visitor expects to be answered.

Before this, an emailed enquiry lived only in an inbox and a WhatsApp enquiry left
no trace on our side at all — clicking "Prefer WhatsApp?" opened a chat and that
was the entire audit trail.

---

## The flow

```
Visitor fills a form
        │
        ├─ clicks "Send"            → POST /api/contact  { channel: "email" }
        └─ clicks "Prefer WhatsApp?" → POST /api/contact  { channel: "whatsapp" }
                                       (not awaited — the wa.me tab opens immediately)
                     │
              /api/contact
                     │
                     ├─ 1. sendLeadToCrm()  → CRM  POST /api/leads/ingest   ← always
                     │
                     └─ 2. channel === "email"  → SMTP to CONTACT_TO
                           channel === "whatsapp" → nothing; the browser has
                                                    already handed off to wa.me
```

If the CRM write fails on a WhatsApp lead, the email is sent anyway as a fallback,
flagged `CRM: NOT RECORDED`. An enquiry should never exist in only one place.

### Which forms

| Form | `formType` | Entry point |
|---|---|---|
| Contact page | `contact` | [contact-client.tsx](../src/app/[locale]/contact/contact-client.tsx) |
| Brief (configurator, design plan, mass production) | `brief` | [ContactSubmit.tsx](../src/components/shared/ContactSubmit.tsx) via [brief-client.tsx](../src/app/[locale]/products/brief/brief-client.tsx) |

`ContactSubmit` defaults to `formType="brief"`; pass `formType` explicitly if it is
ever reused for something else.

---

## The payload

`POST <CRM_INGEST_URL>` with `x-kemcon-ingest-secret: <CRM_INGEST_SECRET>`:

```jsonc
{
  "source": "website",
  "channel": "EMAIL" | "WHATSAPP",
  "formType": "contact" | "brief" | "quick",
  "briefType": "standard" | "bulk" | "design" | null,
  "name": "Sara Fahmy",
  "phone": "+20 12 3456789",        // phone or email required — at least one
  "email": "sara@example.com",
  "message": "…the full formatted brief, identical to the emailed copy…",
  "locale": "en" | "ar",
  "attachments": ["https://res.cloudinary.com/…"],  // uploaded photos
  "meta": { /* structured brief — line items, options, project fields */ },
  "vid": "…"                        // the visitor's id, or null
}
```

`vid` links the enquiry to everything the person browsed before sending it — see
[journey-tracking.md](journey-tracking.md). It is read server-side from the signed
`kc_vid` cookie on the same request that carried the form, so no form has to send
it and the browser cannot forge it. Null when the visitor blocked the cookie.

`message` is the human-readable brief. `meta` is the same brief structured, with
fabric and colour ids already resolved to English labels — raw ids mean nothing
outside this codebase, and a lead you can only read by re-parsing a paragraph is
not much of a record.

Responses: `201 { ok, id }` · `401` bad secret · `422 { issues }` invalid payload ·
`503` the CRM has no `LEADS_INGEST_SECRET` set.

---

## Environment

Website (`.env.local` and Vercel):

```
CRM_INGEST_URL=https://<crm-host>/api/leads/ingest
CRM_INGEST_SECRET=<same value as the CRM's LEADS_INGEST_SECRET>
```

CRM (`.env.local` and its host):

```
LEADS_INGEST_SECRET=<generate with: openssl rand -base64 32>
```

Both are **server-side only** — never `NEXT_PUBLIC_`. The website calls the CRM
from its own route handler, never from the browser, which is what keeps the secret
out of client bundles. There is deliberately no CORS header on the CRM endpoint.

With the vars unset the site still works: forms send by email and WhatsApp exactly
as before, and `sendLeadToCrm` logs a warning instead of recording.

---

## Failure behaviour

| What failed | Visitor sees | Where the lead ends up |
|---|---|---|
| CRM unreachable, channel `email` | success | email only, flagged `CRM: NOT RECORDED` |
| CRM unreachable, channel `whatsapp` | success | their WhatsApp message **and** a fallback email |
| SMTP fails, channel `email` | error, can retry | CRM |
| SMTP fails, channel `whatsapp` | success | CRM |

`sendLeadToCrm` retries once on a timeout or 5xx, never on a 4xx, and never throws.

---

## CRM side

Implemented in `C:\Users\HP\kemcon-crm` — see its `Lead` model, `/api/leads/ingest`
route, and the **Website Leads** page under the Website group in the sidebar. The
CRM resolves `vid` to a `Visitor` row and stores it on `Lead.visitorId`, which is
what the journey timeline on the lead reads.

The ingest route needs no signed-in session, so `src/proxy.ts` skips the whole
`/api` prefix before both the auth guard and next-intl —
without that bypass the request is 307'd to `/en/login` before the handler runs.

# Visitor journey tracking

Every visitor to the public site gets an anonymous id, and what they do is
recorded against it: which products they configured, which fabrics and colours
they tried, which hotel galleries they studied and for how long. When they
enquire, that trail is attached to the lead.

Built in-house rather than on PostHog or GA. The valuable events here are
domain-specific (`fabric_select`, `client_gallery_close`) and would need
hand-instrumenting either way; what a third party would add is storage and a
dashboard, and what it would cost is getting the data back **out** per person
and next to the lead row. Owning the table makes that a foreign key. It also
avoids the 20–40% of beacons ad-blockers eat, and needs no CSP change —
[next.config.ts](../next.config.ts) already allows `connect-src 'self'`.

---

## The flow

```
Browser                        Website (Next)             CRM (Next + Prisma)
───────                        ──────────────             ───────────────────
first page view ────────────►  proxy.ts
                               └─ no kc_vid? issue + Set-Cookie

track({ t: "fabric_select" })
  └─ in-memory queue
     flush on: 10 events │ 5s idle │ route change │ tab hidden
                  │
                  └─ sendBeacon ─►  POST /api/journey
                                    ├─ readVisitorId(request)  ← signed cookie
                                    ├─ rate-limit, cap, sanitise
                                    └─ sendJourneyToCrm() ──►  POST /api/leads/journey
                                                               ├─ upsert Visitor
                                                               └─ createMany VisitorEvent

form submit ────────────────►  POST /api/contact
                               └─ readVisitorId(request) ──►  ingest { …lead, vid }
                                                              └─ Lead.visitorId
```

The lead↔journey link costs **zero client changes**: `kc_vid` is `httpOnly`, so
`/api/contact` reads it server-side from the request that carried the form.

## Identity

[`src/lib/visitor.ts`](../src/lib/visitor.ts) already had the primitive — an
HMAC-signed, `httpOnly`, `SameSite=Lax` cookie used to meter AI generations.
Journey tracking reuses it rather than adding a second id.

It is issued in [`src/proxy.ts`](../src/proxy.ts) on the first page view, not by
the journey endpoint. Beacons fire after the page loads and several can be in
flight at once; minting the id in the endpoint would let them race and give one
person two identities. Issuing it before any page code runs removes the race.

This works because **Next 16 runs proxy on the Node.js runtime** — the signature
needs `node:crypto`, which the old Edge default could not do. `Set-Cookie` is
only attached when the visitor has no valid id, so a returning visitor's
response stays cacheable.

## What is recorded

The union in [`src/lib/journey/events.ts`](../src/lib/journey/events.ts) is the
contract. Adding a variant there is the only declaration a new event needs.

**Ids and labels only — never free text the visitor typed.** There is no
`customDescription`, no notes and no contact detail in any variant. The lead
record already holds those, and copying typed prose into an event log is what
turns a useful journey into a privacy problem. `/api/journey` enforces this
independently: it drops nested values and truncates strings at 200 characters,
so a compromised client cannot widen what gets stored.

Unknown event types are **dropped, not rejected** — during a deploy an older
client may still send an event the current build has retired, and failing the
batch would lose the good events either side of it.

| Group | Events |
|---|---|
| Generic | `page_view`, `page_dwell` |
| Products | `product_view`, `intake_answer`, `configurator_open`, `configurator_step`, `fabric_select`, `color_select`, `pattern_select`, `ai_visualize` |
| Clients page | `client_gallery_open`, `client_gallery_close`, `clients_filter`, `clients_load_more` |
| Conversion | `brief_item_add`, `brief_item_remove`, `brief_open`, `form_start`, `whatsapp_click`, `form_submit` |

### Time on page

`page_dwell` measures **engaged time**, not wall-clock: it accrues only while
the tab is visible and the window focused, so a tab left open overnight reports
the thirty seconds someone read rather than eight hours.

Two consequences worth knowing before reading the numbers:

- A page reports **one `page_dwell` per continuous engaged stretch**, not one per
  page view — someone who reads, tabs away, and comes back produces several. It
  is emitted on tab-hide as well as on navigation, because most visits end by
  closing the tab, and only reporting on navigation would lose the majority of
  real readings and bias the rest towards people who happened to click onward.
- The CRM therefore **sums stretches per visitor and path before averaging**.
  Taking a median straight off the events would report a returning reader as a
  skimmer.

Focus is tracked as state updated by `focus`/`blur` rather than read from
`document.hasFocus()`, which is unreliable at page load — it commonly reports
false before the browser settles focus, with no later event to correct it.

### The clients page

`client_gallery_close` carries `imagesViewed`, `totalImages`, `maxIndex` and
`dwellMs`. `imagesViewed` counts **distinct** photos, held in a `Set`, so
arrowing back and forth does not inflate it.

One event per gallery, not one per image: a 30-photo gallery would otherwise
flood the queue, and "viewed 12 of 30 over 2m10s" is the answer the business
wants. `client_gallery_open` is emitted separately and immediately, so somebody
who navigates away without closing still records the preview.

## Delivery

`track()` never throws and never blocks. Events queue in memory, mirror into
`sessionStorage` so a flush lost to a hard navigation is retried on the next
page, and go out via `navigator.sendBeacon` (falling back to `fetch` with
`keepalive`). The response is ignored — there is nothing the server can say that
a visitor should wait for.

`/api/journey` answers **204 to everything**: no cookie, bad signature, rate
limited, malformed body, unknown events. A dropped batch of page views is not
worth an error, and a beacon that retries in a loop is worse than one that gives
up.

## Retention and privacy

- `kc_vid` is first-party, `httpOnly`, and never shared with anyone.
- The CRM's `/api/leads/prune-visitors` deletes events older than **90 days**,
  then visitors left with no events *and* no lead. A converted lead's journey is
  part of the sales record and outlives the window.
- Add a line to the privacy policy covering the cookie, what it records, the
  retention window, and that nothing is shared with third parties. Because it is
  strictly first-party and minimal, this is a legitimate-interest disclosure
  rather than a consent-banner trigger — confirm that call if Kemcon ever
  markets into the EU.

## Environment

No new variables. The journey endpoint is derived from the existing lead one
(`/api/leads/ingest` → `/api/leads/journey`) and shares `CRM_INGEST_SECRET`, so
there is one URL and one secret to keep in sync rather than two. Set
`CRM_JOURNEY_URL` only if the two endpoints ever stop being siblings.

With the CRM unconfigured the site behaves exactly as before: events are queued,
the forward is skipped, and nothing is surfaced to the visitor.

## Reading the results

**Website Analytics** in the CRM sidebar, under the Website group. The funnel is
the headline: each visitor is counted at the furthest stage they reached, and
every earlier stage counts them too — the stages are not strictly nested (a
contact-form enquiry never touches the configurator), and without that rule a
funnel can read as widening halfway down.

A single lead's trail appears on its detail dialog under **Website journey**,
grouped into sessions on a 30-minute gap.

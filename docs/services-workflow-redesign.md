# Services Workflow — Redesign Options

**Status:** Historical proposal — superseded. Kept as the record of how the
services section got its shape; do not read it as current. Every category is a
single enquiry form now and the step-by-step configurator is gone — see
[product-enquiry-forms.md](product-enquiry-forms.md). The `/bed-sheets` route in
the trees below is `/bed-covers` today.
**Scope:** Everything under `/[locale]/products` — the section the nav labels **"Services"**.
**Date:** 2026-08-27

Three candidate architectures for the services section, documented in full so the
direction can be chosen before any code is written. Options are ordered A → B → C
and are genuinely different bets, not variations: **A optimizes for structure,
B for craft, C for conversion.**

---

## Contents

1. [Why this exists](#1-why-this-exists)
2. [Current state](#2-current-state)
3. [Option A — The Brief Basket](#3-option-a--the-brief-basket)
4. [Option B — The Workbench](#4-option-b--the-workbench)
5. [Option C — Guided Intake](#5-option-c--guided-intake)
6. [Side-by-side comparison](#6-side-by-side-comparison)
7. [Recommendation](#7-recommendation)
8. [Fixes that apply regardless of direction](#8-fixes-that-apply-regardless-of-direction)
9. [Open decisions](#9-open-decisions)

---

## 1. Why this exists

The services section works, but the workflow is hard to follow. Six concrete
problems, all verified against the code:

| # | Problem | Evidence |
|---|---------|----------|
| 1 | **Two entrances silently converge.** "Configure a Product" and "Browse Our Showroom" are presented as unrelated services but both end at `/products/{category}`. The showroom route is strictly better — it deep-links with the fabric preselected. | `showroom-client.tsx` → `?fabric=X&fabricFamily=Y`; `ConfiguratorShell` reads it as `initialFabricId` |
| 2 | **A chooser leading to a chooser.** `/products/configure` has its own route, metadata and OG image, and exists only to render five category cards plus three static labels. No state, no logic. | `configure-client.tsx` |
| 3 | **The terminal step is inconsistent.** Design Plan and Mass Production really submit — photos to `/api/upload`, brief to `/api/contact`, success state. The configurator has **no `fetch()` at all**; it builds a `mailto:` and hands off to the OS. | `InquiryStep.tsx` — verified no network call |
| 4 | **"Custom Solutions" and "Request a Design Plan" overlap.** Both mean "describe what you want in words." Nothing tells a user which is for them. | `/products/custom` vs `/products/design-plan` |
| 5 | **Exiting the configurator loses your place.** The exit always goes to `/products`, so arriving from the showroom and backing out drops you two levels up with your filter gone. | `ConfiguratorShell.tsx:231` |
| 6 | **The page's schema disagrees with the page.** `/products` emits `ItemList` JSON-LD with **9 entries** built from `productCategories.ts`, while the page renders **4 cards**. | `products/page.tsx` + `data/productCategories.ts` |

### The gap nobody has named yet

**A hotel cannot ask for two things at once.** The configurator submits one
product per inquiry. Curtains *and* chairs *and* bed sheets is three separate
`mailto:` sends — or the Mass Production form, which captures quantities but
discards every fabric, colour and pattern choice.

This is the strongest argument for the e-commerce pattern, and it is a
capability gap rather than a polish problem.

---

## 2. Current state

### Route inventory

```
/[locale]/products                    ← nav "Services", 4 bento cards
├── /configure                        ← interstitial: 5 category cards
├── /showroom                         ← fabric catalog + filters + drawer
├── /design-plan                      ← long form  → ContactSubmit  → POST
├── /mass-production                  ← long form  → ContactSubmit  → POST
├── /curtains      ┐
├── /chairs        │
├── /sofas         ├─ ConfiguratorShell → InquiryStep → mailto: / wa.me
├── /bed-sheets    │
└── /custom        ┘
```

### Flow today

```
                    /products  ── "How Can We Help You?"
                             │
        ┌────────────┬───────┴────────┬──────────────────┐
        │            │                │                  │
   FEATURED      design-plan       showroom        mass-production
  "Configure                                                      
   a Product"        │                │                  │
        │            │                │                  │
        ▼            │                ▼                  │
  /products/         │        filter by product          │
   configure         │        + fabric family tabs       │
   ← 2nd chooser     │        → drawer → "Configure"     │
        │            │                │                  │
        └────────────┼────────────────┘                  │
                     │      ▼                            │
                     │  /products/{category}             │
                     │   ?fabric=X&fabricFamily=Y        │
                     │      │                            │
                     │  ConfiguratorShell steps          │
                     │      │                            │
                     ▼      ▼                            ▼
              ┌─────────────────────┐         ┌─────────────────────┐
              │  <ContactSubmit>    │         │   <InquiryStep>     │
              │  POST /api/upload   │         │  mailto: link       │
              │  POST /api/contact  │         │  wa.me link         │
              │  → success state    │         │  Google Maps        │
              └─────────────────────┘         └─────────────────────┘
                  REAL SUBMIT                    NO SERVER CALL
```

### State model today

`ConfiguratorState` is a single `useState` object of ~30 fields living in
`ConfiguratorShell`. It is passed down as `state` + `onChange` and **dies on
navigation**. There is no state above the route.

```ts
// src/types/configurator.ts
interface ConfiguratorState {
  fabricFamilyId, fabricId, colorGroupId, colorId, patternId,
  curtainControl, curtainWidth, curtainHeight, requestMeasurement,
  frameMaterialId, frameFinishId, fillingId,
  cushionAdd, cushionSameFabric, cushionQty,
  pillowAdd, pillowFill, pillowSize,
  customDescription,
  aiImageUrl, aiDetailImageUrl, aiDisplayUrl,
  inspirationImages,
  inquiryName, inquiryPhone, inquiryEmail, inquiryNotes,
}
```

Two properties of this shape are worth preserving in any option:

- **It stores IDs, not display strings.** This is why a brief built in English
  re-renders correctly in Arabic. Keep this discipline.
- **Contact fields are mixed into product state.** In a multi-item world these
  must split — contact details belong to the *brief*, not to a *line item*.

---

## 3. Option A — The Brief Basket

> E-commerce faithful. The catalog is the front door; the brief follows you.

### Concept

Adopt the proven e-commerce navigation model without adopting transactions.
Browse a catalog → open an item → configure it → **add it to a brief** → review
the brief → send once. The word is **"Brief"**, not "cart" — it is already the
domain language throughout `ContactSubmit` ("Send Brief", "Brief Sent!",
"Your brief has been delivered").

### Route map

```
/products                    ← CATALOG. absorbs the showroom entirely.
├── /curtains                ← PDP-equivalent. configure → Add to Brief
├── /chairs                     keeps its own metadata, OG image,
├── /sofas                      Product + BreadcrumbList JSON-LD
├── /bed-sheets
├── /custom                  ← free-text line item
└── /brief                   ← "checkout". one form, ONE POST.

  DELETED:  /configure       ← interstitial, no longer needed
  ABSORBED: /showroom        ← becomes the /products catalog itself
  FOLDED:   /design-plan     ┐ become brief TYPES,
            /mass-production ┘ not separate doors
```

### Desktop

```
/products ── catalog ──────────────────────────────────────────┐
┌──────────────┬────────────────────────────────────┐          │
│  FILTERS     │   ▣ Velvet     ▣ Linen    ▣ Sheer │   [ Brief ③ ] ← persistent,
│              │   Sage         Ivory      Pearl    │    every page
│ ▸ Curtains   │                                    │          │
│   Chairs     │   ▣ Brocade    ▣ Cotton   ▣ Suede │          │
│   Sofas      │   Gold         Natural    Taupe    │          │
│   Bed Sheets │                                    │          │
│ ──────────── │   ▣ Jacquard   ▣ Wool     ▣ Silk  │          │
│   Velvet  12 │   Rust         Charcoal   Champagne│          │
│   Linen    8 │                                    │          │
│   Sheer    6 │                                    │          │
│   Blackout 4 │                                    │          │
└──────────────┴────────────────────────────────────┘          │
        │                                                       │
        ▼ click a fabric                                        │
/products/curtains ── configure ────────────────────────────────┤
┌────────────────────────────────────────────────────┐          │
│  ●━━━━●━━━━●━━━━○━━━━○   fabric · colour · pattern │          │
│                          · options · preview       │          │
│  [ fabric preselected from catalog ]               │          │
│                                                    │          │
│              [  Add to Brief  ]  ───────────────────┘
└────────────────────────────────────────────────────┘
        │
        ▼
/products/brief ── review ──────────────────────────┐
┌────────────────────────────────────────────────────┐
│  YOUR BRIEF                                        │
│  ┌──────────────────────────────────────────────┐  │
│  │ ▣  Curtains — Velvet / Sage / Damask         │  │
│  │    remote control · 240×180cm      [edit][×] │  │
│  ├──────────────────────────────────────────────┤  │
│  │ ▣  Chairs ×6 — Linen / Ivory / Plain         │  │
│  │    oak frame · medium fill        [edit][×]  │  │
│  ├──────────────────────────────────────────────┤  │
│  │ ▣  Custom — "matching runners for the        │  │
│  │    lobby stairs"                  [edit][×]  │  │
│  └──────────────────────────────────────────────┘  │
│  + Add another item                                │
│  ──────────────────────────────────────────────    │
│  Timeline    [ASAP] [1–3m] [3–6m] [6m+]           │
│  Notes       ┌──────────────────────────────┐      │
│              └──────────────────────────────┘      │
│  Photos      [ drag & drop · max 8 ]               │
│  Inspiration [ portfolio picker ]                  │
│  ──────────────────────────────────────────────    │
│  Name  [__________]   Phone [__________]           │
│  Email [_________________________________]         │
│                                                    │
│           [   Send Brief   ]  → POST /api/contact  │
│      or  · Prefer WhatsApp? · Visit Showroom       │
└────────────────────────────────────────────────────┘
```

### Mobile

```
┌─────────────────────┐   ┌─────────────────────┐
│ ☰  KEMCON      [③] │   │ ← Curtains          │
├─────────────────────┤   ├─────────────────────┤
│ [Curtains][Chairs]  │   │ ●━━●━━●━━○━━○      │
│ [Sofas][Bed Sheets] │   │                     │
├─────────────────────┤   │  ▣ selected fabric  │
│  ▣        ▣        │   │                     │
│  Velvet   Linen     │   │  choose a colour    │
│                     │   │  ● ● ● ● ● ● ●     │
│  ▣        ▣        │   │                     │
│  Sheer    Brocade   │   ├─────────────────────┤
│                     │   │ [ Add to Brief ]    │
├─────────────────────┤   └─────────────────────┘
│ ▲ Brief (3)  Send → │   ← sticky bottom bar
└─────────────────────┘      (replaces SelectionBar)
```

The existing `SelectionBar` already occupies this slot and does something close
to this job — it becomes the brief affordance rather than a per-session summary.

### State model

Global client store (Zustand), one level above the routes:

```ts
interface BriefLineItem {
  id: string;                     // nanoid, for edit/remove
  category: CategoryType;
  // everything currently in ConfiguratorState EXCEPT contact fields
  fabricId, colorId, patternId, ...
  quantity?: number;              // new — enables the mass-production case
  aiImageUrl?: string;
}

interface BriefStore {
  type: "standard" | "bulk" | "design";   // replaces the three separate doors
  items: BriefLineItem[];
  timeline?: string;
  notes: string;
  photos: File[];
  inspirationImages: string[];
  contact: { name: string; phone: string; email: string };
}
```

**Two implementation notes specific to this repo:**

1. Store **IDs only**, never display strings — preserves the EN/AR re-render
   behaviour the current state already gets right.
2. If using `persist` middleware, the brief drawer needs a `hasHydrated` guard.
   This site is deliberately SSR-heavy (`home-sections.tsx` was converted *back*
   to a server component for LLM crawlability); an unguarded persisted store
   will produce hydration mismatches.

### What changes

| Area | Change |
|------|--------|
| `/products` | Rebuilt as catalog. Showroom's filter rail + fabric grid + drawer move here. |
| `/products/configure` | **Deleted.** Its five category cards move into the catalog. |
| `/products/showroom` | **Deleted as a route**; redirect to `/products`. |
| `/products/{category}` | Kept. `InquiryStep` replaced by an "Add to Brief" action. |
| `/products/design-plan` | Becomes `type: "design"` on the brief. Route kept as an SEO landing page that seeds the store. |
| `/products/mass-production` | Becomes `type: "bulk"`. Same treatment. |
| `/products/brief` | **New.** The single submit path. |
| `ConfiguratorShell` | Rebuilt from "owns the session" to "configures one line item". |
| `InquiryStep` | Dissolves into `/products/brief`. |
| `ContactSubmit` | Reused as-is on the brief page. Already does upload + POST + success. |

### Submit flow

```
[ Send Brief ]
      │
      ├─ photos.length > 0 ─→ POST /api/upload  (per file, Cloudinary signed)
      │                        └─→ secure_url[]
      │
      └─→ POST /api/contact  (multipart)
             name, phone, email, locale
             message = formatted brief: every line item, all options,
                       quantities, timeline, notes, photo URLs,
                       inspiration URLs, AI preview URLs
             │
             ├─ 200 → success card ✓ + "Prefer WhatsApp?" secondary
             ├─ 429 → rate limited (5/min already enforced)
             └─ 4xx/5xx → inline error, brief preserved in store
```

### Impact

| Dimension | Assessment |
|-----------|------------|
| **SEO** | ✅ Fully preserved. All category routes keep `Product` + `BreadcrumbList` JSON-LD, per-page OG, sitemap entries. `ItemList` on `/products` becomes *accurate* for the first time. |
| **Mobile** | ✅ Good. Sticky bottom brief bar is a well-understood pattern; `SelectionBar` already occupies the slot. |
| **Multi-item** | ✅ Native. The core win. |
| **Familiarity** | ✅ Zero learning curve. Everyone has used a cart. |
| **Perceived novelty** | ⚠️ Low. Fixes the confusion but doesn't feel new. |
| **Effort** | ~2–3 weeks. Configurator refactor is the bulk. |
| **Risk** | Low. Every piece is a known pattern; SEO untouched. |

**Best if** hotels and procurement are the priority buyer.

---

## 4. Option B — The Workbench

> One surface. You never navigate. It feels like a design tool, not a website.

### Concept

Collapse browse + configure + brief into a single persistent three-pane
workspace. Clicking a fabric does not navigate — the right panel *becomes* the
configurator for that item, and on confirm it collapses into a line item. This
is the option that matches the luxury positioning: it reads as a studio tool.

### Route map

```
/products                    ← THE WORKBENCH. all interaction lives here.
├── /curtains                ← SSR landing shells. Server-render real
├── /chairs                     content for crawlers + first paint,
├── /sofas                      then hydrate into the workbench with
├── /bed-sheets                 that category preselected.
└── /custom

  DELETED:  /configure  /showroom  /brief
  FOLDED:   /design-plan  /mass-production  → workbench modes
```

### Desktop

```
/products ── one route, never navigates ────────────────────────────────┐
┌────────────┬──────────────────────────────┬──────────────────────────┐
│  FILTER    │        FABRIC GRID           │      YOUR BRIEF          │
│            │                              │                          │
│ ▸ Curtains │   ▣        ▣        ▣       │  ┌────────────────────┐  │
│   Chairs   │   Velvet   Linen    Sheer    │  │ ▣ Curtains         │  │
│   Sofas    │   Sage     Ivory    Pearl    │  │   velvet / sage    │  │
│   Bed Sh.  │                              │  │   ▸ configure   ×  │  │
│ ────────── │   ▣        ▣        ▣       │  └────────────────────┘  │
│  Velvet 12 │   Brocade  Cotton   Suede    │  ┌────────────────────┐  │
│  Linen   8 │   Gold     Natural  Taupe    │  │ ▣ Chairs ×6        │  │
│  Sheer   6 │                              │  │   linen / ivory  × │  │
│  Blackout4 │   ▣        ▣        ▣       │  └────────────────────┘  │
│  Jacquard7 │   Jacquard Wool     Silk     │                          │
│            │   Rust     Charcoal Champagne│  + add custom item       │
│            │                              │  ──────────────────────  │
│            │        click ────────────────┼─→ opens INLINE           │
│            │                              │                          │
│            │                              │  [   Send Brief   ]      │
└────────────┴──────────────────────────────┴──────────────────────────┘
```

**Inline configuration** — the right panel transforms in place, no navigation:

```
                                  ┌──────────────────────────┐
                                  │  ← back to brief         │
                                  │                          │
                                  │  CURTAINS · Velvet Sage  │
                                  │  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣    │
                                  │                          │
                                  │  Pattern                 │
                                  │  ▨ ▨ ▨ ▨ ▨ ▨            │
                                  │                          │
                                  │  Control                 │
                                  │  ( ) manual  (•) remote  │
                                  │                          │
                                  │  Size                    │
                                  │  [240] × [180] cm        │
                                  │  □ request measurement   │
                                  │                          │
                                  │  ✨ Generate preview     │
                                  │                          │
                                  │  [ Confirm item ]        │
                                  └──────────────────────────┘
```

### Mobile — the hard part

A three-pane desktop idea has to become two sheets:

```
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│ ☰  KEMCON      [③] │   │  ▣  Velvet Sage    │   │  YOUR BRIEF     [×] │
├─────────────────────┤   │                     │   ├─────────────────────┤
│ ⌕ Filter ▾          │   │  Pattern            │   │ ▣ Curtains       ×  │
├─────────────────────┤   │  ▨ ▨ ▨ ▨           │   │   velvet / sage     │
│  ▣        ▣        │   │                     │   │                     │
│  Velvet   Linen     │   │  Control            │   │ ▣ Chairs ×6      ×  │
│                     │   │  ( ) manual         │   │   linen / ivory     │
│  ▣        ▣        │   │  (•) remote         │   │                     │
│  Sheer    Brocade   │   │                     │   │ + add item          │
│                     │   │  Size [240]×[180]   │   ├─────────────────────┤
├─────────────────────┤   ├─────────────────────┤   │ [  Send Brief  ]    │
│ ▲ Brief (3)         │   │ [ Confirm item ]    │   └─────────────────────┘
└─────────────────────┘   └─────────────────────┘
   grid + filter sheet      config bottom sheet      brief bottom sheet
```

Three distinct mobile surfaces where desktop has one. This is the single
biggest cost of the option, and Egypt is a mobile-heavy market.

### Impact

| Dimension | Assessment |
|-----------|------------|
| **SEO** | ⚠️ At risk. The five category routes must become genuine SSR landing pages with real server-rendered content, or nine indexable pages and their `Product` schema are lost. Achievable, but it is real work and easy to get wrong. |
| **Mobile** | ❌ Weakest. Requires a separate design, not a responsive adaptation. |
| **Multi-item** | ✅ Native and the most fluid of the three. |
| **Familiarity** | ⚠️ Novel — has to teach itself. |
| **Perceived novelty** | ✅ By far the strongest. Genuinely differentiating in this market. |
| **Effort** | ~5–7 weeks. Two full designs (desktop + mobile) plus the SSR shell strategy. |
| **Risk** | High. Bets the whole section on a desktop interaction pattern. |

**Best if** desktop B2C and brand differentiation matter more than search reach.

---

## 5. Option C — Guided Intake

> Stop asking people to classify themselves. Derive it from two questions.

### Concept

The root problem is that `/products` asks the visitor to sort themselves into
Kemcon's internal service taxonomy before they can move. A hotel buyer with 300
curtain panels and a villa owner with one living room both arrive thinking
*"I need curtains."*

Invert it. Ask two plain questions about **them**, and let the site decide which
shape of brief to collect.

### Flow

```
/products
  ┌────────────────────────────────────────────┐
  │                                            │
  │        What are you furnishing?            │
  │                                            │
  │   ┌──────────┐  ┌──────────┐              │
  │   │ My home  │  │ A hotel  │              │
  │   └──────────┘  └──────────┘              │
  │   ┌──────────┐  ┌──────────┐              │
  │   │An office │  │Not sure  │              │
  │   └──────────┘  └──────────┘              │
  │                                            │
  │        or  ·  just browse fabrics →        │
  └────────────────────────────────────────────┘
                     │
                     ▼  "A hotel"
  ┌────────────────────────────────────────────┐
  │           How many rooms?                  │
  │                                            │
  │   [ 1–5 ]      [ 6–50 ]      [ 50+ ]      │
  └────────────────────────────────────────────┘
         │             │              │
         ▼             ▼              ▼
   architect      standard        quantities
   brief          brief           & timeline
   (design)       (standard)      (bulk)
         │             │              │
         └─────────────┼──────────────┘
                       ▼
  ┌────────────────────────────────────────────┐
  │  Do you want to pick fabrics now?          │
  │                                            │
  │  ┌────────────────┐  ┌──────────────────┐ │
  │  │ Pick fabrics   │  │   Advise me      │ │
  │  │ myself         │  │   I'd rather you │ │
  │  │ → configurator │  │   recommend      │ │
  │  └────────────────┘  └──────────────────┘ │
  └────────────────────────────────────────────┘
              │                     │
              ▼                     ▼
      configurator flow      straight to contact
              │                     │
              └──────────┬──────────┘
                         ▼
                  ONE BRIEF → POST /api/contact
```

### Why "Advise me" matters

This branch captures a segment the site currently loses entirely. A buyer who
does not want to self-serve has no path today except bouncing or going straight
to WhatsApp — and if they WhatsApp, no structured lead is ever recorded. This
button converts them into a qualified brief in two taps.

### Derivation table

The two answers select the brief shape; the user never sees the taxonomy:

| Furnishing | Scale | Brief type | Fields shown | Replaces today's |
|-----------|-------|-----------|--------------|------------------|
| My home | — | `standard` | fabric/colour/pattern per item | configurator |
| A hotel / office | 1–5 rooms | `design` | scope, style, dimensions, photos | `/design-plan` |
| A hotel / office | 6–50 | `standard` + qty | items with quantities | (nothing today) |
| A hotel / office | 50+ | `bulk` | products needed, quantities, timeline | `/mass-production` |
| Not sure | — | `design` | free description + "advise me" | `/custom` |

### Mobile

```
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│ ☰  KEMCON           │   │ ← What are you...   │   │ ← How many rooms?   │
├─────────────────────┤   ├─────────────────────┤   ├─────────────────────┤
│                     │   │                     │   │                     │
│   What are you      │   │  ┌───────────────┐  │   │  ┌───────────────┐  │
│   furnishing?       │   │  │   My home     │  │   │  │    1 – 5      │  │
│                     │   │  └───────────────┘  │   │  └───────────────┘  │
│  ┌───────────────┐  │   │  ┌───────────────┐  │   │  ┌───────────────┐  │
│  │   My home     │  │   │  │   A hotel  ✓  │  │   │  │   6 – 50      │  │
│  └───────────────┘  │   │  └───────────────┘  │   │  └───────────────┘  │
│  ┌───────────────┐  │   │  ┌───────────────┐  │   │  ┌───────────────┐  │
│  │   A hotel     │  │   │  │  An office    │  │   │  │    50 +       │  │
│  └───────────────┘  │   │  └───────────────┘  │   │  └───────────────┘  │
│                     │   │                     │   │                     │
│  just browse →      │   │                     │   │                     │
└─────────────────────┘   └─────────────────────┘   └─────────────────────┘
```

One question per screen, thumb-reachable targets. This is the strongest mobile
story of the three options.

### Impact

| Dimension | Assessment |
|-----------|------------|
| **SEO** | ⚠️ Mixed. Solves nothing on its own and the intake screen is thin content. **Requires the catalog to remain reachable in parallel** (`just browse fabrics →`) or browsing regresses badly. |
| **Mobile** | ✅ Best of the three. One decision per screen. |
| **Multi-item** | ⚠️ Not solved by C alone — it routes people, it doesn't hold a basket. |
| **Familiarity** | ✅ Very low cognitive load. |
| **Perceived novelty** | ✅ Feels considered and personal, not templated. |
| **Effort** | ~1 week standalone. Smallest by a wide margin. |
| **Risk** | Medium alone — done clumsily it reads as a funnel, which is off-brand for luxury. |

**Best if** lead volume is the goal over browsing.

---

## 6. Side-by-side comparison

| | **A — Brief Basket** | **B — Workbench** | **C — Guided Intake** |
|---|---|---|---|
| **Optimizes for** | Structure | Craft | Conversion |
| Fixes "which door am I?" | Partly | Partly | ✅ Fully |
| Fixes converging entrances | ✅ | ✅ | ⚠️ Partly |
| Fixes `mailto:` lead loss | ✅ | ✅ | ✅ |
| Multi-item briefs | ✅ Native | ✅ Native | ❌ Not alone |
| Fixes custom / design-plan overlap | ✅ | ✅ | ✅ |
| SEO impact | ✅ Preserved | ⚠️ At risk | ⚠️ Needs parallel catalog |
| Mobile quality | ✅ Good | ❌ Separate design | ✅ Best |
| Perceived novelty | ⚠️ Low | ✅ Highest | ✅ Good |
| Learning curve | None | Some | None |
| Effort | ~2–3 weeks | ~5–7 weeks | ~1 week |
| Risk | Low | High | Medium |

### Composability

```
   A  +  C     ✅  Compose cleanly. C is the front door, A is the machinery.
                   C's intake seeds the brief type; A holds and submits it.
                   ~1 extra week on top of A.

   B  +  C     ⚠️  Possible but redundant — the workbench already removes
                   the door problem C exists to solve.

   A  →  B     ✅  A is a valid stepping stone. The store, the brief model
                   and the submit path all survive a later move to B.

   B  first    ❌  Hardest to retreat from. Deleting the category routes
                   is difficult to undo once search rankings settle.
```

---

## 7. Recommendation

**Build A, with C's opening question bolted on.**

Reasoning:

1. **A fixes every structural problem** in section 1 *and* the unnamed
   multi-item gap, without gambling the search presence this project has
   deliberately invested in — per-page OG images, `Product` schema, 28 sitemap
   entries with hreflang.
2. **C's two-question intake is roughly a week** once A exists, and it is the
   only thing that actually solves "which door am I?" — the complaint that
   started this. It also captures the "advise me" segment currently lost.
3. **B is the one to want, not the one to build first.** The mobile cost and
   the SEO cost are both real, and it bets the whole section on a desktop
   interaction pattern in a mobile-heavy market. A is a genuine stepping stone
   to it — the store, brief model and submit path all survive the move.

One thing to preserve in every option: **many Egyptian buyers will never touch
a basket — they will WhatsApp.** Keep that escape hatch on every screen.
Putting WhatsApp everywhere is the most market-correct decision already in the
codebase and it should survive the redesign untouched.

---

## 8. Fixes that apply regardless of direction

These are independent of which option is chosen and can ship immediately.

| Priority | Issue | Location | Fix |
|---|---|---|---|
| 🔴 | **Configurator leads are lost.** No `fetch()` — depends on the user's device having a mail client. Longest payload of any form (AI image URLs + inspiration URLs) stuffed into a `mailto:` body, where it may be truncated. | `InquiryStep.tsx` | POST to `/api/contact` like `ContactSubmit` does. Keep WhatsApp as a secondary. |
| 🟠 | `ItemList` JSON-LD advertises 9 items; the page renders 4. | `products/page.tsx`, `data/productCategories.ts` | Make the schema match what the page actually links to. |
| 🟡 | `opacity-8` is not a valid Tailwind class, so the glow renders at full opacity. `REVIEW.md` logs this as fixed in Wave 1 — only `design-plan` was fixed. | `mass-production-client.tsx:133` | `opacity-[0.08]` |
| 🟡 | Showroom drawer uses `fixed right-0` + `border-l`, so it slides from the right in Arabic too. The rest of the page correctly uses logical properties. | `showroom-client.tsx:307` | `end-0` + `border-s` |
| 🟢 | Three near-duplicate product lists: `PRODUCT_CATEGORIES` (showroom), `categories` (configure), `PRODUCTS_NEEDED` (mass-production). | 3 files | Single source in `src/data/`. |
| 🟢 | `CategoryGrid` slices the last array element as the full-width card — "custom must be last" is implicit. | `CategoryGrid.tsx` | Explicit `featured` flag. |
| 🟢 | Card copy is hardcoded `isAr ? "…" : "…"` in module constants rather than `messages/*.json`. | `products-client.tsx` and 4 others | Move to message files. |

---

## 9. Open decisions

Needed before a build plan can be finalised:

1. **Priority buyer — hotels or homeowners?** This is the single biggest input.
   Hotels favour A's multi-item basket; homeowners favour B's browsing
   experience. The code cannot answer this.
2. **Do the `/design-plan` and `/mass-production` routes survive as SEO landing
   pages** that seed the brief, or are they fully absorbed? Recommendation: keep
   them as thin landing pages — they rank and they cost almost nothing.
3. **Ship the `mailto:` fix independently and immediately**, or fold it into the
   redesign? Recommendation: ship it now. It is losing leads today and the fix
   is small and self-contained.
4. **Is there any analytics?** The featured card asserts *"Where Most Begin"*
   but nothing in the project measures it (only Vercel Speed Insights). That
   label is a hypothesis. Instrumenting before rebuilding would turn the next
   round of decisions from argument into measurement.
5. **Zustand, or Context + `useReducer`?** Recommendation: Zustand — ~1 KB, no
   provider, `persist` middleware for free. Requires the `hasHydrated` guard
   noted in §3.

---

*Related: [product-enquiry-forms.md](product-enquiry-forms.md) (what was
actually built, and what replaced the configurator this document assumes),
`docs/design-plan.md`, `REVIEW.md`, `production enhancments.md`.*

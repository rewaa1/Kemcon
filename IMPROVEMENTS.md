# Kemcon — Improvements Log

## 1. GEO & Crawlability

### Problem
42% of the home page content was invisible to LLM crawlers and search engines. Four sections (`AboutPreview`, `ProductHighlights`, `WhyKemcon`, `CTABanner`) were hidden because:
- `home-sections.tsx` used `dynamic()` with `ssr: false`, preventing server-side rendering
- `LazySection` rendered `null` on initial mount, hiding content from crawlers even in the SSR pass

### Fix — `src/app/[locale]/home-sections.tsx`
Converted to a plain server component. Removed all `dynamic()` imports, `ssr: false`, and `LazySection` wrapping. All sections are now SSR'd and present in the initial HTML.

### Fix — `public/llms.txt`
Created `llms.txt` at the site root following the emerging standard for AI crawler discoverability. Describes Kemcon's pages, product lines, and company background in a structured format readable by LLMs.

---

## 2. Favicon

### Problem
`/icons/icon-192.png` and `/icons/icon-180.png` were referenced in `layout.tsx` but did not exist — causing 404 errors on every page load.

### Fix — `src/app/layout.tsx`
Updated the icons metadata to also reference `/favicon.ico` (preferred by most browsers) with `sizes: "any"`, and added the `shortcut` pointer to `favicon.ico`. The `public/icons/` folder now needs `icon-192.png` and `icon-180.png` dropped in (generated via favicon.io from the existing `favicon.png`).

---

## 3. WhyKemcon Section Rewrite

### Problem
All three value cards were completely generic — identical to what any manufacturer could claim. "Uncompromising Quality", "Expert Craftsmanship", "Premium Materials" contain no information specific to Kemcon.

### Fix — `src/messages/en.json` + `src/messages/ar.json`

| Old | New |
|-----|-----|
| Uncompromising Quality | One Team, Every Step |
| Expert Craftsmanship | Full Property Design |
| Premium Materials | Global Fabrics, 5-Star Standard |

**Card 1 — "One Team, Every Step"**: Leads with factory ownership and ends with on-site installation. Establishes accountability: one team from brief to delivery, no third parties.

**Card 2 — "Full Property Design"**: Names founder and architecture engineer Kamal Soliman directly. Covers both B2B (hotels, resorts) and B2C (private residences). Makes the full-property design service explicit.

**Card 3 — "Global Fabrics, 5-Star Standard"**: References hundreds of suppliers locally and internationally. States the B2C hook: the same materials used in 5-star hotels are available to homeowners.

---

## 4. ClientsShowcase — Logo Marquee

### Problem
The home page had no social proof section. A `ClientsShowcase` component existed but was unused, and used text initials instead of real logos.

### Fix — `src/components/sections/ClientsShowcase.tsx`
Rebuilt to display 16 real hotel brand logos in an infinite scrolling marquee:
Sheraton, Le Méridien, Four Seasons, Hilton, Marriott, Hyatt, Steigenberger, Sofitel, InterContinental, Rotana, Kempinski, Fairmont, Rixos, Mövenpick, St. Regis, Radisson Blu.

Each logo sits in a white card for legibility on the dark background. Includes a "See All Partners" link to the full clients page.

Added to `home-sections.tsx` between `WhyKemcon` and `CompanyIntro`.

### Marquee Fix — `src/app/globals.css`
The original `translateX(-50%)` animation was broken because the flex container was viewport-constrained, not content-sized. `translateX(-50%)` calculated against the wrong width causing visible jumps at the loop point.

- Added `w-max` to the flex track so width equals content width and `-50%` maps correctly to one full set of logos
- Added `will-change: transform` for GPU-layer promotion to prevent repaint stutter
- Added `group-hover:[animation-play-state:paused]` so the marquee pauses on hover
- Slowed speed from 30s → 70s for a more refined feel

---

## 5. Clients Page — Hero Scroll Bug

### Problem
Navigating to `/clients` always landed below the hero section. Users had to scroll up to see it.

### Root Cause — `src/app/[locale]/clients/clients-client.tsx`
A `useEffect` was calling `gridRef.current?.scrollIntoView()` with `activeFilter` as a dependency. React runs all effects on initial mount, so this fired immediately on page load and scrolled the grid into view — past the hero. A `isMounted` ref fix was attempted but failed because React 18 Strict Mode runs effects twice in development, so the second invocation still fired.

### Fix
Removed the `useEffect` entirely. Moved `setVisibleCount(PAGE_SIZE)` and `scrollIntoView` into a `handleFilterChange` handler that is only called when the user actually clicks a filter. The scroll never fires on page load.

---

## 6. ProductHighlights — Card Links

### Problem
Product cards in the "Our Collection" section on the home page were not clickable despite having hover effects suggesting interactivity (`cursor-pointer`).

### Fix — `src/components/sections/ProductHighlights.tsx`
Added an `href` field to each product entry and wrapped each card in a `<Link>`. Routing:

| Card | Route |
|------|-------|
| Curtains | `/products/curtains` |
| Sofas | `/products/sofas` |
| Chairs | `/products/chairs` |
| Bed Sheets | `/products/bed-sheets` |
| Fabrics | `/products/showroom` |
| Custom | `/products/custom` |

### Card Replacement
Replaced `cushions` and `pillows` (accessories with no dedicated pages) with `curtains` (main product, now the large featured card) and `bed-sheets`. The six cards now represent all actual product lines.

Reduced the featured curtains card height: `aspect-[4/3] min-h-[400px]` → `aspect-[16/9] min-h-[300px]`.

---

## 7. Configurator — Cushion & Pillow Add-ons

### New Steps Added
- **`cushionOptions`** — added to the `chairs` and `sofas` flows after `chairOptions`
- **`pillowOptions`** — added to the `bed-sheets` flow after `pattern`

### `src/types/configurator.ts`
- Added `"cushionOptions"` and `"pillowOptions"` to `StepType`
- Updated `CATEGORY_STEPS` for chairs, sofas, and bed-sheets
- Added 6 new fields to `ConfiguratorState`:
  - `cushionAdd: boolean | null`
  - `cushionSameFabric: boolean | null`
  - `cushionQty: number | null`
  - `pillowAdd: boolean | null`
  - `pillowFill: string | null`
  - `pillowSize: string | null`

### `src/components/products/configurator/CushionOptionsStep.tsx` (new)
Step flow:
1. Yes / No toggle — "Include Cushions?"
2. If yes: fabric choice (same as product or specify separately) + quantity per piece (2 / 4 / 6)

`canProceed` logic: `cushionAdd` must not be null; if true, both `cushionSameFabric` and `cushionQty` must be set.

### `src/components/products/configurator/PillowOptionsStep.tsx` (new)
Step flow:
1. Yes / No toggle — "Include Pillows?"
2. If yes: fill type (Cotton / Polyester / Memory Foam / Down) + size (Standard 50×75 / Queen 50×90 / King 50×100 cm)

`canProceed` logic: `pillowAdd` must not be null; if true, both `pillowFill` and `pillowSize` must be set.

### `src/components/products/configurator/ConfiguratorShell.tsx`
- Imported both new step components
- Added `canProceed` cases for `cushionOptions` and `pillowOptions`
- Added `renderStep` cases routing to the correct component (passing `productType` to cushion step)

### `src/components/products/configurator/InquiryStep.tsx`
- Cushion and pillow choices appear in the visible summary card on the inquiry screen
- Both are included in the WhatsApp message and email body sent to the Kemcon team

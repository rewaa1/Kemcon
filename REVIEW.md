# Kemcon Website — Code & Quality Review

**Reviewed:** 2026-05-10  
**Branch:** `ui/ux-enhnacments`  
**Overall Score: 61 / 100**

---

## Score Summary

| Area | Score |
|---|---|
| Architecture & Organization | 8/10 |
| UI/UX Design | 8/10 |
| Feature Completeness | 7/10 |
| Performance | 5/10 |
| SEO | 7/10 |
| Accessibility | 3/10 |
| Internationalization | 8/10 |
| Code Quality | 6/10 |
| Security | 5/10 |
| DevOps & Maintainability | 4/10 |
| **Total** | **61/100** |

---

## 1. Code Architecture & Organization — 8 / 10

**Strengths:**
- Clean server/client component split — pages own data fetching, clients own interactivity
- Domain-organized components (`sections/`, `products/configurator/`, `shared/`)
- Strong TypeScript types in `src/types/configurator.ts` — `CATEGORY_STEPS`, `ConfiguratorState`, `StepType` are well-modeled
- `ContactSubmit` and `InspirationGallery` are genuinely reusable shared components
- Data files (`fabrics.ts`, `colors.ts`, `patterns.ts`, `frames.ts`) properly decoupled from UI

**Issues:**
- Product categories array is hardcoded inside the page component (`src/app/[locale]/products/page.tsx:17–27`) — should live in `src/data/`
- Bed-sheets configurator reads `?fabric=` query params in its server page but never passes `initialFabricId` down to `ConfiguratorShell`

---

## 2. UI/UX Design & Visual Quality — 8 / 10

**Strengths:**
- Luxury dark theme ("Slate & Bone") is cohesive and premium-feeling
- Framer Motion animations are tasteful — slide transitions in configurator correctly flip direction for RTL
- Selection chip bar at the bottom of the configurator is a great UX pattern
- Design Plan's progressive disclosure accordion is elegant and well-executed
- Drag-and-drop photo upload with deduplication logic is polished

**Issues:**
- `<ClientsShowcase />` is commented out on the homepage (`src/app/[locale]/page.tsx:15`) — the section exists and works but is invisible to visitors
- Founder photo on About page is a placeholder with `text-foreground/20` opacity — looks unfinished
- No empty/error states on the AI visualization step if Pollinations.ai is down

---

## 3. Feature Completeness — 7 / 10

**Strengths:**
- 4 full product configurators (curtains, chairs, sofas, bed sheets) each with distinct step flows
- AI visualization with prompt engineering per product category
- Cloudinary photo uploads integrated into Design Plan and Mass Production forms
- WhatsApp fallback on every form — smart UX decision for the target market

**Issues:**
- No 404 page (`not-found.tsx`) or error page (`error.tsx`)
- No loading skeletons (`loading.tsx`) — configurator steps flash in
- Product page has no filtering or search
- Testimonials and partner brands are hardcoded in `src/data/clients.ts` with no way to update them
- Bed sheets configurator ignores the pre-selection query params (`initialFabricId` never passed through)

---

## 4. Performance — 5 / 10

**Strengths:**
- AI image responses include `Cache-Control: max-age=3600`
- Static data (fabrics, colors, patterns) bundled at build time — no fetch overhead

**Issues:**
- Hero and About images are raw Unsplash URLs — bypass Next.js image optimization (no resizing, no WebP, no lazy loading via `<Image />`)
- 4 font families loaded (Playfair Display, Inter, Noto Kufi Arabic, Noto Sans Arabic) with no subsetting — adds ~400 KB+ to first load
- Framer Motion + Lenis + Embla Carousel + shadcn = large client bundle with no explicit code-splitting strategy
- Pollinations.ai is a public free service — no SLA, prone to rate limiting under real traffic

---

## 5. SEO — 7 / 10

**Strengths:**
- Sitemap with 26 entries (13 routes × 2 locales) and `hreflang` alternates
- `robots.txt` correctly blocks `/api/`
- JSON-LD schemas: Organization, AboutPage, LocalBusiness (with opening hours), Product, BreadcrumbList
- `buildPageMetadata()` generates canonical + OpenGraph + Twitter Card metadata on every page
- PWA manifest with correct theme and background colors

**Issues:**
- **No `og:image`** — the single biggest SEO miss. Social shares show no preview image. The `opengraph-image.tsx` file exists but is not wired to all pages
- External Unsplash images are not processed by Next.js so no optimized preview thumbnails are generated
- Facebook profile URL, phone, and email are hardcoded in the root layout schema — duplicated instead of referencing a single config

---

## 6. Accessibility — 3 / 10

This is the weakest area and needs the most attention.

**Issues:**
- Mobile nav toggle has no `aria-expanded`, `aria-controls`, or `aria-label`
- Mobile menu has no focus trap and no scroll lock — keyboard users can tab behind it
- No skip-to-content link
- Configurator "Next" button (`<motion.button>`) has no `aria-disabled` — screen readers cannot tell when it is unavailable
- Optional section toggles in Design Plan have no `aria-expanded` state
- Form `<label>` elements are not associated via `htmlFor`/`id` pairs
- Image alt text on Unsplash images is either empty or non-descriptive

---

## 7. Internationalization — 8 / 10

**Strengths:**
- Full en/ar routing with `next-intl`, correct `lang` and `dir` HTML attributes on `<html>`
- Arabic-specific fonts (Noto Kufi Arabic, Noto Sans Arabic) loaded
- RTL layout flips handled consistently with `isAr` flags and `flex-row-reverse`
- Locale-aware slide animations in the configurator (direction reverses for Arabic)

**Issues:**
- About page leadership section uses hardcoded bilingual JSX strings instead of i18n message keys
- Some inline labels in `ConfiguratorShell` (e.g. "Your picks:" / "اختياراتك:") duplicate content that belongs in `en.json`/`ar.json`
- No locale fallback configured — unsupported locales silently default to English with no 404

---

## 8. Code Quality — 6 / 10

**Strengths:**
- TypeScript strict mode enabled throughout
- `canProceed()` guard function in `ConfiguratorShell` is a clean pattern
- `processFiles()` deduplication logic in `DesignPlanClient` is solid

**Issues:**
- `kemcon@yahoo.com` appears **5+ times** across source files — should be a single env var constant
- WhatsApp number `201223122276` is hardcoded in `ContactSubmit.tsx` (lines 166, 292, 299) — should be an env var
- `.catch(() => ({}))` on `ContactSubmit.tsx:115` silently swallows JSON parse errors
- `<ClientsShowcase />` is imported but the JSX is commented out — dead import
- `"opacity-8"` in `design-plan-client.tsx:259` is not a standard Tailwind class — has no effect

---

## 9. Security — 5 / 10

**Strengths:**
- `escapeHtml()` applied to all contact form fields server-side before email composition
- SMTP credentials loaded from env vars, not hardcoded

**Issues:**
- `/api/contact` has no file size limit — an attacker can upload arbitrarily large files to exhaust server memory
- No rate limiting on either `/api/contact` or `/api/generate-curtain` — trivial to spam
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` is an unsigned upload preset exposed in the client bundle — anyone who finds it can upload files to the Cloudinary account
- `phone` field value is placed into an email body without CRLF stripping — potential email header injection
- No `Content-Security-Policy` header configured

---

## 10. DevOps & Maintainability — 4 / 10

**Issues:**
- No tests of any kind (unit, integration, E2E)
- No error monitoring (Sentry or equivalent)
- No CI/CD pipeline visible
- No error boundaries — a runtime crash in any component takes down the full page with a blank white screen
- Folder typo: `/public/clinets/` (should be `clients/`) — affects `src/data/clients.ts` image paths
- No admin interface for updating clients, testimonials, or partner brands
- No `.env.example` file for onboarding new developers

---

## Top 5 Priorities to Fix

### Priority 1 — Accessibility (High Impact, Legal Risk)
Add `aria-expanded` to the mobile nav toggle, `htmlFor`/`id` pairs to all form labels, a focus trap on the mobile menu, and a skip-to-content link. This affects all users and is a legal requirement in many markets.

### Priority 2 — OpenGraph Image (High Visibility)
Wire up `opengraph-image.tsx` to all key pages. Without `og:image`, every link shared on WhatsApp, LinkedIn, or Twitter shows a blank card — critical for a business that relies on referrals.

### Priority 3 — Centralize Contact Info (Maintenance)
Create a single `src/lib/config.ts` (or populate `.env.local` vars `KEMCON_EMAIL`, `KEMCON_WHATSAPP`) and reference it everywhere. The current duplication means a phone number change requires editing 5+ files.

```ts
// src/lib/config.ts
export const KEMCON_EMAIL = process.env.KEMCON_EMAIL ?? "kemcon@yahoo.com";
export const KEMCON_WHATSAPP = process.env.KEMCON_WHATSAPP ?? "201223122276";
```

### Priority 4 — Rate Limiting + File Validation (Security)
Add rate limiting (e.g. `next-rate-limit` or a simple in-memory counter) to `/api/contact` and `/api/generate-curtain`. Add a 5 MB file size check in the contact API before processing uploads.

### Priority 5 — Error Boundaries + Missing Pages (Stability)
Add a root `error.tsx` and `not-found.tsx` under `src/app/[locale]/`. Wrap the configurator in a React error boundary so a crash in one step doesn't blank the entire page.

---

## Minor Fixes (Low Effort, Quick Wins)

| File | Issue | Fix |
|---|---|---|
| `src/app/[locale]/page.tsx:15` | `<ClientsShowcase />` commented out | Uncomment or remove the dead import |
| `src/app/[locale]/products/mass-production/mass-production-client.tsx` | Same as above | Pass `initialFabricId` from searchParams |
| `src/data/clients.ts` | Folder path `clinets` is a typo | Rename `/public/clinets/` → `/public/clients/` and update all references |
| `src/app/[locale]/products/design-plan/design-plan-client.tsx:259` | `opacity-8` is not a Tailwind class | Replace with `opacity-[0.08]` |
| `src/components/shared/ContactSubmit.tsx:115` | `.catch(() => ({}))` swallows errors | Log the error: `.catch((err) => { console.error(err); return {}; })` |

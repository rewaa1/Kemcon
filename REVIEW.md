# Kemcon Website — Code & Quality Review

**Reviewed:** 2026-05-10  
**Branch:** `ui/ux-enhnacments`  
**Last updated:** 2026-05-11 — Wave 4 i18n fixes applied  

---

## Changelog

### Wave 5 — Applied 2026-05-11

| # | Fix | Files changed |
|---|---|---|
| 1 | Hero images set to `alt=""` (decorative per WCAG); `PageHero` fallback fixed from `alt \|\| title` to `alt ?? ""` | `PageHero.tsx`, `about-client.tsx`, `contact-client.tsx`, `clients-client.tsx` |
| 2 | `AboutPreview` supporting image given descriptive alt text | `AboutPreview.tsx` |
| 3 | `InspirationGallery` lightbox alt updated from `"Inspiration"` to descriptive text | `InspirationGallery.tsx` |
| 4 | AI visualization error state improved — icon, cause explanation, retry button, gallery fallback link | `AIVisualizationStep.tsx` |
| 5 | Per-page OG images via `/api/og` route — photo background + page title/description; all 12 pages wired | `src/app/api/og/route.ts` (new), `src/lib/metadata.ts`, 12 page files |

---

### Wave 4 — Applied 2026-05-11

| # | Fix | Files changed |
|---|---|---|
| 1 | Added CI pipeline — GitHub Actions workflow: type-check, lint, Playwright E2E on every push/PR | `.github/workflows/ci.yml` (new) |

---

### Wave 3 — Applied 2026-05-10

| # | Fix | Files changed |
|---|---|---|
| 1 | Rate limiting: in-memory sliding window (5 req/min contact, 3 req/min generate) | `src/lib/rateLimit.ts` (new), `api/contact/route.ts`, `api/generate-curtain/route.ts` |
| 2 | Font optimization: added explicit `weight` arrays to all 4 fonts; `preload: true` on heading/body EN fonts | `src/app/layout.tsx` |
| 3 | Replaced 4 Unsplash `<img>` tags with local `<Image>` (next/image): about-preview, about-hero, contact-hero, clients-hero | `AboutPreview.tsx`, `PageHero.tsx`, `about-client.tsx`, `contact-client.tsx`, `clients-client.tsx` |
| 4 | Downloaded images to `/public/images/` — no more external Unsplash dependency | `public/images/` (4 new files) |
| 5 | E2E testing: Playwright installed; `playwright.config.ts`, `e2e/configurator.spec.ts`, `e2e/contact-form.spec.ts` | new files |
| 6 | Sentry infrastructure: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `next.config.ts` updated | new files |
| 7 | `.env.example` added for onboarding | `.env.example` (new) |
| 8 | Moved hardcoded `productCategories` array to `src/data/productCategories.ts` | `products/page.tsx`, `src/data/productCategories.ts` (new) |
| 9 | Wired `<ErrorBoundary>` around `<ConfiguratorShell>` in all 4 category pages | `curtains/page.tsx`, `chairs/page.tsx`, `sofas/page.tsx`, `bed-sheets/page.tsx` |
| 10 | Fixed `.catch(() => ({}))` in ContactSubmit — now logs the JSON parse error | `ContactSubmit.tsx` |

### Wave 2 — Applied 2026-05-10

| # | Fix | Files changed |
|---|---|---|
| 1 | Mobile nav: `aria-expanded`, `aria-controls`, `role="dialog"`, `aria-modal` on panel | `Navbar.tsx` |
| 2 | Mobile nav: scroll lock (`body.overflow`) when menu is open | `Navbar.tsx` |
| 3 | Mobile nav: focus trap (Tab cycles inside menu) + Escape key closes and restores focus to toggle | `Navbar.tsx` |
| 4 | Skip-to-content link before `<Navbar />`, `id="main-content"` on `<main>` | `[locale]/layout.tsx` |
| 5 | Configurator Next button: `aria-disabled={!canGoNext}` | `ConfiguratorShell.tsx` |
| 6 | Design Plan accordion: `aria-expanded`, `aria-controls`, and `id` on each section panel | `design-plan-client.tsx` |
| 7 | ContactSubmit form: `htmlFor`/`id` pairs on all three inputs (name, phone, email) | `ContactSubmit.tsx` |
| 8 | OpenGraph image explicitly set in `buildPageMetadata()` and locale layout `generateMetadata` | `metadata.ts`, `[locale]/layout.tsx` |
| 9 | Created `error.tsx` — locale-aware error boundary page with Try Again + Go Home | `[locale]/error.tsx` (new) |
| 10 | Created `not-found.tsx` — 404 page with Back to Home + Browse Products links | `[locale]/not-found.tsx` (new) |
| 11 | Created `ErrorBoundary.tsx` — reusable React class-based error boundary component | `components/shared/ErrorBoundary.tsx` (new) |

### Wave 1 — Applied 2026-05-10

| # | Fix | Files changed |
|---|---|---|
| 1 | Created `src/lib/config.ts` — single source of truth for email, WhatsApp, phone, and map URLs | `config.ts` (new) |
| 2 | Replaced all 9 hardcoded `kemcon@yahoo.com` and `201223122276` occurrences with imports from `config.ts` | `layout.tsx`, `contact/page.tsx`, `contact-client.tsx`, `ContactSubmit.tsx`, `InquiryStep.tsx`, `Footer.tsx`, `design-plan-client.tsx`, `mass-production-client.tsx`, `api/contact/route.ts` |
| 3 | Removed dead `<ClientsShowcase />` import and commented-out JSX from homepage | `[locale]/page.tsx` |
| 4 | Fixed `opacity-8` invalid Tailwind class → `opacity-[0.08]` | `design-plan-client.tsx` |
| 5 | Added 5 MB per-file size validation to `/api/contact` with a descriptive error response | `api/contact/route.ts` |
| 6 | Added CRLF stripping on the `phone` field (both JSON and multipart paths) to prevent email header injection | `api/contact/route.ts` |
| 7 | Renamed `/public/clinets/` → `/public/clients/` and updated all path references | `data/clients.ts`, `lib/galleryData.ts` |

---

## Score Summary

| Area | Original | After Wave 1 | After Wave 2 | After Wave 3 | After Wave 4 |
|---|---|---|---|---|---|
| Architecture & Organization | 8/10 | 8/10 | 8/10 | **9/10** | 9/10 |
| UI/UX Design | 8/10 | 8/10 | 8/10 | 8/10 | 8/10 |
| Feature Completeness | 7/10 | 7/10 | **8/10** | 8/10 | 8/10 |
| Performance | 5/10 | 5/10 | 5/10 | **8/10** | 8/10 |
| SEO | 7/10 | 7/10 | **8/10** | **9/10** | **10/10** |
| Accessibility | 3/10 | 3/10 | **6/10** | 6/10 | **7/10** |
| Internationalization | 8/10 | 8/10 | 8/10 | 8/10 | **9/10** |
| Code Quality | 6/10 | 7/10 | 7/10 | **8/10** | 8/10 |
| Security | 5/10 | 6/10 | 6/10 | **8/10** | 8/10 |
| DevOps & Maintainability | 4/10 | 4/10 | **5/10** | **8/10** | **9/10** |
| **Total** | **61/100** | **63/100** | **68/100** | **80/100** | **84/100** |

---

## 1. Code Architecture & Organization — 8 / 10

**Strengths:**
- Clean server/client component split — pages own data fetching, clients own interactivity
- Domain-organized components (`sections/`, `products/configurator/`, `shared/`)
- Strong TypeScript types in `src/types/configurator.ts` — `CATEGORY_STEPS`, `ConfiguratorState`, `StepType` are well-modeled
- `ContactSubmit` and `InspirationGallery` are genuinely reusable shared components
- Data files (`fabrics.ts`, `colors.ts`, `patterns.ts`, `frames.ts`) properly decoupled from UI

**Remaining issues:**
- ~~Product categories array is hardcoded inside the page component~~ ✅ Fixed Wave 3 — extracted to `src/data/productCategories.ts`
- Bed-sheets configurator reads `?fabric=` query params and correctly passes `initialFabricId` and `initialFabricFamilyId` to `ConfiguratorShell` (already working)

---

## 2. UI/UX Design & Visual Quality — 8 / 10

**Strengths:**
- Luxury dark theme ("Slate & Bone") is cohesive and premium-feeling
- Framer Motion animations are tasteful — slide transitions in configurator correctly flip direction for RTL
- Selection chip bar at the bottom of the configurator is a great UX pattern
- Design Plan's progressive disclosure accordion is elegant and well-executed
- Drag-and-drop photo upload with deduplication logic is polished

**Remaining issues:**
- Founder photo on About page is a placeholder with `text-foreground/20` opacity — looks unfinished
- ~~No empty/error states on the AI visualization step if Pollinations.ai is down~~ ✅ Fixed Wave 5 — error state now shows icon, explains the cause, offers retry button and a "Browse our portfolio" fallback link

---

## 3. Feature Completeness — 8 / 10 ↑

**Strengths:**
- 4 full product configurators (curtains, chairs, sofas, bed sheets) each with distinct step flows
- AI visualization with prompt engineering per product category
- Cloudinary photo uploads integrated into Design Plan and Mass Production forms
- WhatsApp fallback on every form — smart UX decision for the target market
- ~~No 404 page or error page~~ ✅ Fixed Wave 2 — `not-found.tsx` and `error.tsx` created under `[locale]/`
- ~~No error boundary for the configurator~~ ✅ Fixed Wave 2 — `ErrorBoundary` component created in `components/shared/`

**Remaining issues:**
- ~~No loading skeletons (`loading.tsx`) — configurator steps flash in~~ ✅ Already in place — `loading.tsx` + `ConfiguratorSkeleton` exists for all 4 configurator pages — false positive in review
- Product page has no filtering or search
- Testimonials and partner brands are hardcoded in `src/data/clients.ts` with no way to update them
- Bed sheets configurator ignores the pre-selection query params (`initialFabricId` never passed through)

---

## 4. Performance — 5 / 10

**Strengths:**
- AI image responses include `Cache-Control: max-age=3600`
- Static data (fabrics, colors, patterns) bundled at build time — no fetch overhead

**Remaining issues:**
- ~~Hero and About images are raw Unsplash URLs~~ ✅ Fixed Wave 3 — images downloaded to `/public/images/`, all `<img>` tags replaced with `<Image>` (WebP, lazy loading, size optimization via next/image)
- ~~4 font families with no weight subsetting~~ ✅ Fixed Wave 3 — explicit `weight` arrays added to all 4 fonts; `preload: true` on EN heading/body fonts
- Framer Motion + Lenis + Embla Carousel + shadcn = large client bundle with no explicit code-splitting strategy
- Pollinations.ai is a public free service — no SLA, prone to rate limiting under real traffic

---

## 5. SEO — 8 / 10 ↑

**Strengths:**
- Sitemap with 26 entries (13 routes × 2 locales) and `hreflang` alternates
- `robots.txt` correctly blocks `/api/`
- JSON-LD schemas: Organization, AboutPage, LocalBusiness (with opening hours), Product, BreadcrumbList
- `buildPageMetadata()` generates canonical + OpenGraph + Twitter Card metadata on every page
- PWA manifest with correct theme and background colors
- ~~No `og:image` — social shares showed no preview image~~ ✅ Fixed Wave 2 — `images` field now explicitly set in both `buildPageMetadata()` and the locale layout's `generateMetadata`, pointing to the locale-aware `opengraph-image.tsx` generator

**Remaining issues:**
- ~~All pages still share the same generated wordmark OG image — per-page custom OG images would require dedicated artwork per route~~ ✅ Fixed Wave 5 — `/api/og` route renders photo-backed OG images per page; `buildPageMetadata` accepts `ogImage`; all 12 pages wired to their existing card/hero photos

---

## 6. Accessibility — 6 / 10 ↑

**Improvements applied:**
- ~~Mobile nav toggle has no `aria-expanded`, `aria-controls`, or `aria-label`~~ ✅ Fixed Wave 2
- ~~Mobile menu has no focus trap and no scroll lock~~ ✅ Fixed Wave 2 — Tab cycles inside menu, Escape closes and returns focus
- ~~No skip-to-content link~~ ✅ Fixed Wave 2 — skip link added before Navbar, `id="main-content"` on `<main>`
- ~~Configurator "Next" button has no `aria-disabled`~~ ✅ Fixed Wave 2
- ~~Optional section toggles in Design Plan have no `aria-expanded` state~~ ✅ Fixed Wave 2
- ~~Form `<label>` elements not associated via `htmlFor`/`id` in ContactSubmit~~ ✅ Fixed Wave 2

- ~~Image alt text on Unsplash images is either empty or non-descriptive~~ ✅ Fixed Wave 5 — hero images (about, contact, clients) set to `alt=""` (decorative per WCAG); `PageHero` fallback changed from `alt || title` to `alt ?? ""`; `AboutPreview` and `InspirationGallery` lightbox given descriptive alt text
- The `contact-client.tsx` form already has correct `htmlFor`/`id` pairs — ContactSubmit (used on Design Plan and Mass Production) is now fixed

---

## 7. Internationalization — 8 / 10

**Strengths:**
- Full en/ar routing with `next-intl`, correct `lang` and `dir` HTML attributes on `<html>`
- Arabic-specific fonts (Noto Kufi Arabic, Noto Sans Arabic) loaded
- RTL layout flips handled consistently with `isAr` flags and `flex-row-reverse`
- Locale-aware slide animations in the configurator (direction reverses for Arabic)

~~**Remaining issues:**~~
- ~~About page leadership section uses hardcoded bilingual JSX strings instead of i18n message keys~~ ✅ Already fully using `useTranslations("about")` — false positive in review
- ~~Some inline labels in `ConfiguratorShell` (e.g. "Your picks:" / "اختياراتك:") duplicate content that belongs in `en.json`/`ar.json`~~ ✅ Already using `tc("yourPicks")` from `configurator.yourPicks` key — false positive in review
- ~~No locale fallback configured — unsupported locales silently default to English with no 404~~ ✅ Already handled — `request.ts` calls `notFound()` for unsupported locales; `src/proxy.ts` (Next.js 16 renamed Middleware → Proxy) handles locale detection and `/` → `/en` redirect — false positive in review

---

## 8. Code Quality — 7 / 10

**Strengths:**
- TypeScript strict mode enabled throughout
- `canProceed()` guard function in `ConfiguratorShell` is a clean pattern
- `processFiles()` deduplication logic in `DesignPlanClient` is solid
- ~~`kemcon@yahoo.com` and `201223122276` duplicated across 9 source files~~ ✅ Fixed Wave 1
- ~~Dead `<ClientsShowcase />` import and commented JSX~~ ✅ Fixed Wave 1
- ~~`"opacity-8"` invalid Tailwind class~~ ✅ Fixed Wave 1

**Remaining issues:**
- `.catch(() => ({}))` on `ContactSubmit.tsx:115` silently swallows JSON parse errors

---

## 9. Security — 6 / 10

**Strengths:**
- `escapeHtml()` applied to all contact form fields server-side before email composition
- SMTP credentials loaded from env vars, not hardcoded
- ~~No file size limit on `/api/contact`~~ ✅ Fixed Wave 1 — 5 MB per-file limit enforced
- ~~Phone field CRLF injection~~ ✅ Fixed Wave 1 — `\r\n` stripped on both code paths

**Improvements applied:**
- ~~No rate limiting on `/api/contact` or `/api/generate-curtain`~~ ✅ Fixed Wave 3 — in-memory sliding window: 5 req/min on contact, 3 req/min on generate

**Remaining issues:**
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` is an unsigned upload preset exposed in the client bundle
- ~~No `Content-Security-Policy` header configured~~ ✅ Already in place — full CSP configured in `next.config.ts` via `async headers()` — false positive in review

---

## 10. DevOps & Maintainability — 5 / 10 ↑

**Improvements applied:**
- ~~Folder typo `/public/clinets/`~~ ✅ Fixed Wave 1
- ~~No error boundaries — runtime crash blanks the full page~~ ✅ Fixed Wave 2 — `error.tsx` and `ErrorBoundary` component in place
- ~~No 404 page~~ ✅ Fixed Wave 2

**Improvements applied:**
- ~~No tests of any kind~~ ✅ Fixed Wave 3 — Playwright installed; `e2e/configurator.spec.ts` and `e2e/contact-form.spec.ts` created
- ~~No error monitoring~~ ✅ Fixed Wave 3 — Sentry `@sentry/nextjs` installed; client/server/edge configs created; `next.config.ts` wired; `.env.example` documents the required DSN vars
- ~~No `.env.example`~~ ✅ Fixed Wave 3 — `.env.example` added

**Remaining issues:**
- No CI/CD pipeline visible
- No admin interface for updating clients, testimonials, or partner brands

---

## Wave 3 — All priorities completed ✅

| Priority | Item | Status |
|---|---|---|
| 1 | Replace Unsplash images with local `<Image />` | ✅ Done |
| 2 | Rate limiting on `/api/contact` and `/api/generate-curtain` | ✅ Done |
| 3 | Font weight subsetting + preload heading fonts | ✅ Done |
| 4 | Playwright E2E tests (configurator + contact form) | ✅ Done — run `npx playwright install` then `npx playwright test` |
| 5 | Sentry error monitoring | ✅ Done — add `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` to `.env.local` |

---

## Open Minor Issues — All resolved ✅

| File | Issue | Resolution |
|---|---|---|
| `src/components/shared/ContactSubmit.tsx` | `.catch(() => ({}))` silently swallowed JSON parse errors | Fixed Wave 3 — now logs warning |
| `src/app/[locale]/products/bed-sheets/page.tsx` | Reads `?fabric=` query params but never passes `initialFabricId` | Already passing — was a false positive |
| `src/app/[locale]/products/page.tsx` | Product categories array hardcoded in page | Fixed Wave 3 — moved to `src/data/productCategories.ts` |
| `src/components/shared/ErrorBoundary.tsx` | Not wired into configurator pages | Fixed Wave 3 — wraps `<ConfiguratorShell>` in all 4 category pages |

---

## Remaining Low-Priority Items

- ~~No CI/CD pipeline~~ ✅ Fixed Wave 4 — GitHub Actions CI in `.github/workflows/ci.yml`
- No admin interface for clients/testimonials data
- ~~No `Content-Security-Policy` header~~ ✅ Already in `next.config.ts`
- Cloudinary unsigned upload preset exposed in client bundle

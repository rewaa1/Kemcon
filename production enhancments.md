# Kemcon — Production Enhancements & Deployment Readiness

**Audit Date:** 2026-05-12  
**Overall Score: 74 / 100**

---

## Score Breakdown

| Category | Score | Status |
|----------|-------|--------|
| Metadata & SEO | 95/100 | ✅ Excellent |
| UI/UX | 85/100 | ✅ Good |
| Performance | 72/100 | ⚠️ Needs work |
| Security & Config | 60/100 | ❌ Blocker |

---

## 1. Metadata & SEO — 95/100

**What's working:**
- Sitemap: dual-locale (EN/AR), 28 entries, hreflang + x-default, correct priorities
- Robots.txt: proper crawler access, disallows `/api/`, references sitemap
- Open Graph: full OG + Twitter cards on every page, locale-aware (`ar_EG` / `en_US`)
- Canonical URLs: implemented via `pageAlternates()` in `src/lib/metadata.ts`
- Hreflang: all pages expose `en`, `ar`, and `x-default` alternates
- JSON-LD schemas: Organization, WebSite, AboutPage, LocalBusiness, ItemList
- PWA Manifest: adaptive icons, theme color, standalone display

**Gap — resolved ✅:**
- ~~Homepage (`/[locale]/page.tsx`) has no metadata override~~ — `generateMetadata()` added to `src/app/[locale]/page.tsx` using `meta.title` and `meta.description` translation keys via `buildPageMetadata()`. OG + Twitter cards now generated per-locale for the homepage.

---

## 2. Performance — 72/100

**What's working:**
- All fonts loaded via `next/font/google` with `display: swap`
- `next/image` used in all 6 image components; alt text present on all
- Loading skeletons on 4 product category routes
- OG images cached for 7 days; AI generation cached for 1 hour
- Vercel Speed Insights integrated

**Gaps:**

| Priority | Issue | Fix |
|----------|-------|-----|
| ~~High~~ ✅ | ~~No `dynamic()` imports anywhere~~ — `next/dynamic()` added to all 10 heavy page entries: `products`, `clients`, `showroom`, `configure`, `mass-production`, `design-plan`, and all 4 configurator category pages (`curtains`, `chairs`, `sofas`, `bed-sheets`). Named export `ConfiguratorShell` uses `.then(m => ({ default: m.ConfiguratorShell }))` pattern. SSR preserved on all. | Done |
| Medium | `framer-motion` and `lenis` imported globally — limited tree-shaking | Import only the specific sub-modules needed |
| Low | 4 font families (Playfair Display, Inter, Noto Sans Arabic, Noto Kufi Arabic) add weight | Acceptable, but consider subsetting if LCP is slow |

---

### PageSpeed Insights — Mobile Audit (2026-05-12)

**URL tested:** `https://kemcon.vercel.app/en`

| Metric | Score |
|--------|-------|
| Performance | 64 ⚠️ |
| Accessibility | 95 ✅ |
| Best Practices | 100 ✅ |
| SEO | 100 ✅ |

**Core Web Vitals:**

| Metric | Value | Status |
|--------|-------|--------|
| First Contentful Paint (FCP) | 1.0s | ✅ Good |
| Largest Contentful Paint (LCP) | 9.8s | 🔴 Poor |
| Total Blocking Time (TBT) | 300ms | ⚠️ Needs improvement |
| Cumulative Layout Shift (CLS) | 0 | ✅ Perfect |
| Speed Index | 5.6s | ⚠️ Needs improvement |

**Root Cause Analysis:**

| Priority | Issue | Detail | File | Fix |
|----------|-------|--------|------|-----|
| ~~🔴 Critical~~ ✅ | ~~Hero LCP = 9.8s~~ — replaced CSS `backgroundImage` with `<Image fill priority sizes="100vw">` in `Hero.tsx`. Browser preload scanner now discovers the image at parse time; Next.js injects `<link rel="preload">` in `<head>`; image served as WebP/AVIF. `scale-105` wrapper and parallax `motion.div` preserved. | `src/components/sections/Hero.tsx` | Done |
| ~~🔴 Critical~~ ✅ | ~~Image delivery — 740 KiB savings~~ — all 5 raw `<img>` tags replaced with `next/image`: lightbox in `clients-client.tsx` (1200×900 + auto sizing), fabric swatches in `FabricTypeStep.tsx` (fill + sizes), material thumbnail in `ChairOptionsStep.tsx` (56×56), AI preview + inspiration thumbnails in `InquiryStep.tsx` (fill). Added `remotePatterns` for `image.pollinations.ai` and `res.cloudinary.com` to `next.config.ts`. | All 4 files + `next.config.ts` | Done |
| ~~🟠 High~~ ✅ | ~~Render-blocking requests — 570ms~~ — root cause was Sentry double-initialisation (`instrumentation-client.ts` + `sentry.client.config.ts` both calling `Sentry.init()`) and `tracesSampleRate: 1` on all runtimes. Fixed: `Sentry.init()` removed from `instrumentation-client.ts` (keeps only `onRouterTransitionStart`); `sentry.client.config.ts` is now the single client init with `tracesSampleRate: 0.1` in production; server + edge configs switched to `process.env.SENTRY_DSN` with the same rate fix. | `instrumentation-client.ts`, `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` | Done |
| ~~🟠 High~~ ✅ | ~~Unused JavaScript — 91 KiB savings~~ — (1) `LenisProvider` rewritten to use imperative Lenis API in `useEffect` instead of `ReactLenis` wrapper — initialises after paint, no wrapper div, no blocking. (2) Below-fold homepage sections (`AboutPreview`, `ProductHighlights`, `WhyKemcon`, `CTABanner`) converted to `dynamic()` in `page.tsx`; `Hero` kept eager as the above-fold LCP element. SSR preserved on all sections. | `src/components/providers/LenisProvider.tsx`, `src/app/[locale]/page.tsx` | Done |
| 🟡 Medium | Total Blocking Time — 300ms (8 long tasks) | Framer Motion animation setup + Lenis scroll initialization run at parse time on the main thread | Layout and Hero component initialization | Defer Lenis init; reduce synchronous Framer Motion setup on load |
| 🟡 Medium | Legacy JavaScript — 14 KiB savings | Transpiling modern JS down for old browsers unnecessarily | `next.config.ts` browserslist | Tighten `browserslist` targets to drop IE11 / very old Safari |
| 🟢 Low | Minimize main-thread work — 3.2s total | Cumulative cost of animations, scroll listeners, and third-party scripts | Global layout, Hero, ProductHighlights | Profile with Chrome DevTools; defer non-critical listeners |
| 🟢 Low | Forced reflow | Layout thrashing from reading and writing DOM geometry in the same frame | Likely Framer Motion `useScroll`/`useTransform` in Hero | Use `will-change: transform` and avoid mixing reads/writes |

---

## 3. UI/UX — 85/100

**What's working:**
- Error boundaries: global (`global-error.tsx`), locale-level (`error.tsx`), component-level (`ErrorBoundary.tsx`)
- 404 page: present, localized (EN/AR), provides home/products navigation
- Accessibility: skip-to-main link, `aria-*` in 13+ components, semantic HTML, keyboard-navigable mobile menu, focus trap
- Responsive: Tailwind mobile-first throughout, adaptive grids
- RTL support: `dir` attribute on `<html>`, Arabic locale handled correctly

**Gaps:**

| Priority | Issue | Fix |
|----------|-------|-----|
| Medium | Dark-only theme — no light mode or system preference toggle | Add `prefers-color-scheme` media query or a theme toggle |
| Low | 2 raw `<img>` tags (OG route + configurator thumbnails) | Acceptable as-is; document intent |

---

## 4. Security & Configuration — 60/100

**What's working:**
- Comprehensive CSP headers, production-aware (`upgrade-insecure-requests` only in prod)
- Security headers: `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`
- Rate limiting on all 3 API routes (contact, upload, generate-curtain)
- Input sanitization: `escapeHtml()` on contact form, Cloudinary signed uploads

**Gaps:**

| Severity | Issue | File | Fix |
|----------|-------|------|-----|
| 🔴 CRITICAL | `.env.local` contains live production secrets | `.env.local` | Revoke all credentials immediately, remove from git history, move to hosting provider env vars |
| 🔴 CRITICAL | Cloudinary API key + secret exposed | `.env.local` lines 17–18 | Rotate keys at Cloudinary console |
| 🔴 CRITICAL | Gmail app password exposed | `.env.local` lines 6–8 | Revoke at myaccount.google.com → Security → App passwords |
| 🔴 CRITICAL | GlitchTip/Sentry DSN + auth token exposed | `.env.local` lines 23–26 | Revoke tokens at GlitchTip project settings |
| ~~🟠 High~~ ✅ | ~~Sentry DSN hardcoded in `sentry.server.config.ts` and `sentry.edge.config.ts`~~ — both now use `process.env.SENTRY_DSN`; also fixed in `instrumentation-client.ts` which was removed. | Fixed as part of render-blocking fix above |
| 🟡 Medium | In-memory rate limiter resets on server restart | `src/lib/rateLimit.ts` | Replace with Redis/Upstash for persistent limits across restarts |
| 🟢 Low | `console.error` / `console.warn` calls in production paths (7 instances) | `error.tsx`, `ErrorBoundary.tsx`, API routes | Gate non-critical ones behind `process.env.NODE_ENV === 'development'` |

---

## Pre-Deployment Checklist

### 🔴 Must fix before going live

- [ ] **Revoke Gmail app password** — myaccount.google.com → Security → App passwords
- [ ] **Rotate Cloudinary API key + secret** — console.cloudinary.com → Settings → Access Keys
- [ ] **Revoke GlitchTip/Sentry tokens** — GlitchTip project settings
- [ ] **Remove `.env.local` from git history:**
  ```bash
  git filter-branch --force --index-filter \
    "git rm --cached --ignore-unmatch .env.local" \
    --prune-empty --tag-name-filter cat -- --all
  git push origin --force --all
  ```
  Or use [BFG Repo Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) (faster).
- [ ] **Set all secrets as environment variables** in Vercel (or your host) — never commit them
- [ ] **Fix hardcoded Sentry DSNs** in `sentry.server.config.ts` and `sentry.edge.config.ts`:
  ```ts
  // Replace hardcoded DSN with:
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  ```

### 🟠 Recommended before launch

- [ ] **Add homepage metadata override** — add `generateMetadata()` or a static `metadata` export to `src/app/[locale]/page.tsx`
- [ ] **Add dynamic imports** for heavy components (configurator, gallery, carousel):
  ```ts
  const Configurator = dynamic(() => import('@/components/products/configurator/Configurator'), { ssr: false });
  ```
- [ ] **Switch rate limiter to Redis/Upstash** for persistent rate limits across server restarts
- [ ] **Fix Hero LCP (9.8s → target <2.5s)** — replace CSS `backgroundImage` in `src/components/sections/Hero.tsx` with `<Image fill priority sizes="100vw">` and keep content in a `z-10` overlay div
- [ ] **Add `loading="lazy"` to below-fold `<img>` tags** — `FabricTypeStep.tsx`, `ChairOptionsStep.tsx`, `InquiryStep.tsx`; switch to `next/image` for the fabric/AI visualization images to get WebP + resizing
- [ ] **Lazy-load below-fold Framer Motion sections** — wrap `ProductHighlights`, `AboutPreview`, and other below-fold animated sections with `dynamic(() => ..., { ssr: false })` to remove them from the initial JS bundle
- [ ] **Defer Lenis initialization** — move `LenisProvider` init to run after the page is interactive (`useEffect` with no blocking) to reduce main-thread work on load

### 🟡 Nice to have post-launch

- [ ] Add light mode / system preference theme support
- [ ] Expand E2E test coverage for the configurator and contact form flows
- [ ] Add CSRF protection to API form endpoints
- [ ] Add magic-byte file type validation to the upload API (not just extension check)
- [ ] Implement a service worker for offline support
- [ ] Tighten `browserslist` targets in `next.config.ts` to drop IE11 / old Safari — saves ~14 KiB of legacy JS transpilation

---

## File Reference Map

| Area | Key Files |
|------|-----------|
| Root metadata | `src/app/layout.tsx` |
| Locale metadata | `src/app/[locale]/layout.tsx` |
| Metadata helpers | `src/lib/metadata.ts` |
| Sitemap | `src/app/sitemap.ts` |
| Robots | `src/app/robots.ts` |
| Manifest | `src/app/manifest.ts` |
| JSON-LD component | `src/components/seo/JsonLd.tsx` |
| Security headers + CSP | `next.config.ts` |
| Rate limiting | `src/lib/rateLimit.ts` |
| Sentry (server) | `sentry.server.config.ts` |
| Sentry (edge) | `sentry.edge.config.ts` |
| Sentry (client) | `sentry.client.config.ts` |
| Global error | `src/app/global-error.tsx` |
| 404 page | `src/app/[locale]/not-found.tsx` |
| Error boundary | `src/components/shared/ErrorBoundary.tsx` |

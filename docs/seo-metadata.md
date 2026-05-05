# SEO & Metadata

Documents all metadata infrastructure added to the site. Score at time of writing: **84 / 100** (up from ~22 before).

---

## Architecture

```
src/
├── lib/
│   └── metadata.ts              ← shared helpers (SITE_URL, buildPageMetadata, pageAlternates)
├── components/
│   └── seo/
│       └── JsonLd.tsx           ← reusable JSON-LD script injector
└── app/
    ├── layout.tsx               ← viewport export, icons, Organization + WebSite JSON-LD
    ├── robots.ts                ← robots.txt
    ├── sitemap.ts               ← sitemap.xml (28 entries, hreflang alternates)
    ├── manifest.ts              ← PWA manifest
    └── [locale]/
        ├── layout.tsx           ← metadataBase, title template, OG base, Twitter base
        ├── opengraph-image.tsx  ← dynamic branded OG image (1200×630, edge runtime)
        ├── page.tsx             ← home (inherits locale layout metadata)
        ├── about/
        │   ├── page.tsx         ← generateMetadata + renders AboutClient
        │   └── about-client.tsx ← original "use client" component
        ├── contact/
        │   ├── page.tsx         ← generateMetadata + LocalBusiness JSON-LD + renders ContactClient
        │   └── contact-client.tsx
        ├── clients/
        │   ├── page.tsx         ← generateMetadata + renders ClientsClient
        │   └── clients-client.tsx
        └── products/
            ├── page.tsx             ← generateMetadata + ItemList JSON-LD + renders ProductsClient
            ├── products-client.tsx
            ├── configure/
            │   ├── page.tsx         ← generateMetadata + renders ConfigureClient
            │   └── configure-client.tsx
            ├── showroom/
            │   ├── page.tsx         ← generateMetadata + renders ShowroomClient
            │   └── showroom-client.tsx
            ├── design-plan/
            │   ├── page.tsx         ← generateMetadata + renders DesignPlanClient
            │   └── design-plan-client.tsx
            ├── mass-production/
            │   ├── page.tsx         ← generateMetadata + renders MassProductionClient
            │   └── mass-production-client.tsx
            ├── curtains/page.tsx    ← generateMetadata (server component, no split needed)
            ├── chairs/page.tsx
            ├── sofas/page.tsx
            ├── bed-sheets/page.tsx
            └── custom/page.tsx
```

---

## Environment Variables

| Variable | Purpose | Fallback |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Base URL for all canonical, sitemap, and OG URLs | `https://kemcon.com` |

Set this in your hosting environment before deploying. All metadata derives from it.

---

## Core Helper — `src/lib/metadata.ts`

Central module. All pages import from here.

**`SITE_URL`** — reads `NEXT_PUBLIC_SITE_URL`, falls back to `https://kemcon.com`.

**`pageAlternates(locale, path)`** — builds the `alternates` object for any page:
```ts
pageAlternates("en", "/about")
// → { canonical: "/en/about", languages: { en: "/en/about", ar: "/ar/about", "x-default": "/en/about" } }
```

**`buildPageMetadata({ locale, path, titleKey, descriptionKey })`** — async function that reads from the `meta.pages.*` translation namespace and returns a complete `Metadata` object including title, description, alternates, openGraph, and twitter fields. Used by every page.

---

## Translation Keys

All metadata strings live in `src/messages/en.json` and `src/messages/ar.json` under the `meta` namespace.

```
meta.brand              → "Kemcon" / "كيمكون"       (used in title template)
meta.title              → homepage default title
meta.description        → homepage default description
meta.pages.about.*
meta.pages.contact.*
meta.pages.clients.*
meta.pages.products.*
meta.pages.configure.*
meta.pages.showroom.*
meta.pages.designPlan.*
meta.pages.massProduction.*
meta.pages.curtains.*
meta.pages.chairs.*
meta.pages.sofas.*
meta.pages.bedSheets.*
meta.pages.custom.*
```

Each entry has a `title` and `description` key.

---

## Page Metadata Coverage

Every route exports `generateMetadata`. Pages that were originally `"use client"` were split into a server `page.tsx` (exports metadata) and a `*-client.tsx` sibling (the original client code).

| Route | Title (EN) | Split? |
|---|---|---|
| `/` | Kemcon — Premium Fabrics & Furnishings | No (inherits locale layout) |
| `/about` | About Us \| Kemcon | Yes |
| `/contact` | Contact Us \| Kemcon | Yes |
| `/clients` | Our Clients & Partners \| Kemcon | Yes |
| `/products` | Our Products \| Kemcon | Yes |
| `/products/configure` | Configure Your Product \| Kemcon | Yes |
| `/products/showroom` | Fabric Showroom \| Kemcon | Yes |
| `/products/design-plan` | Design & Plan \| Kemcon | Yes |
| `/products/mass-production` | Mass Production \| Kemcon | Yes |
| `/products/curtains` | Bespoke Curtains \| Kemcon | No |
| `/products/chairs` | Custom Chairs \| Kemcon | No |
| `/products/sofas` | Bespoke Sofas \| Kemcon | No |
| `/products/bed-sheets` | Premium Bed Sheets \| Kemcon | No |
| `/products/custom` | Custom Solutions \| Kemcon | No |

All titles and descriptions are fully localized in both English and Arabic.

---

## Open Graph & Twitter

Set at two levels:

**Locale layout** (`src/app/[locale]/layout.tsx`) — covers the home page and acts as the base:
- `og:type` → `website`
- `og:site_name` → `Kemcon`
- `og:locale` → `en_US` or `ar_EG`
- `og:title` / `og:description` → localized homepage strings
- `twitter:card` → `summary_large_image`

**Per-page** (via `buildPageMetadata`) — overrides the locale layout with page-specific title and description. Since Next.js replaces the entire `openGraph` object when a child sets it, all common fields (`type`, `siteName`, `locale`) are included in every call.

**OG Image** (`src/app/[locale]/opengraph-image.tsx`):
- 1200×630 PNG, edge runtime
- Branded dark background (`#0D0B14`), gold accent (`#B49A5E`), Playfair Display Bold
- Locale-aware layout (RTL for Arabic, English/Arabic copy)
- Applies to every route under `[locale]/` unless overridden by a more specific `opengraph-image` file
- Font fetched from Google Fonts at generation time — see known issues below

---

## Robots

`src/app/robots.ts` → served at `/robots.txt`

```
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://kemcon.com/sitemap.xml
```

---

## Sitemap

`src/app/sitemap.ts` → served at `/sitemap.xml`

- 28 entries: 14 routes × 2 locales (`en`, `ar`)
- Each entry includes `hreflang` alternates for both locales plus `x-default → /en`
- Priorities: home `1.0`, products index `0.9`, main pages `0.8`, product categories `0.7`
- `changeFrequency`: `monthly` across all routes
- `lastModified`: set to `new Date()` at build time — see known issues below

---

## Structured Data (JSON-LD)

### Organization + WebSite — every page
Injected in `src/app/layout.tsx` (root, server component).

```json
[
  {
    "@type": "Organization",
    "@id": "https://kemcon.com/#org",
    "name": "Kemcon",
    "foundingDate": "1985",
    "address": { "addressLocality": "Cairo", "addressCountry": "EG" },
    "contactPoint": {
      "telephone": "+20-12-23122276",
      "email": "kemcon@yahoo.com",
      "areaServed": ["EG", "SA", "AE", "JO"]
    }
  },
  {
    "@type": "WebSite",
    "@id": "https://kemcon.com/#website",
    "publisher": { "@id": "https://kemcon.com/#org" }
  }
]
```

### LocalBusiness — `/contact`
Added to `src/app/[locale]/contact/page.tsx`.

Includes phone, email, Cairo address, and Sunday–Thursday 09:00–18:00 opening hours.

### ItemList — `/products`
Added to `src/app/[locale]/products/page.tsx`.

9 product category entries with locale-correct URLs (e.g. `/ar/products/curtains` for Arabic).

---

## PWA / Branding

| File | Purpose |
|---|---|
| `src/app/manifest.ts` | PWA manifest at `/manifest.webmanifest` — name, short_name, standalone display, dark theme |
| `src/app/layout.tsx` | `viewport` export with `themeColor: "#0D0B14"` (required by Next 15/16, separate from `metadata`) |
| `public/favicon.png` | Referenced as icon, shortcut, and apple-touch-icon in root `metadata` |

---

## Known Issues & Remaining Work

| Priority | Issue | Fix |
|---|---|---|
| High | Arabic text in OG image renders as blank boxes — Playfair Display has no Arabic glyphs | Load Noto Sans Arabic in `opengraph-image.tsx`, or show English copy for all locales |
| Medium | `og:locale:alternate` not set | Add alternate locale to `openGraph` in `buildPageMetadata` and locale layout |
| Medium | `og:url` not explicit | Add `openGraph.url` field in `buildPageMetadata` |
| Medium | Sitemap `lastModified` is always today | Set `NEXT_PUBLIC_DEPLOY_DATE` in CI and derive from it |
| Medium | `Organization` schema missing `logo` and `sameAs` | Add to root layout JSON-LD; `sameAs` lists verified social profiles |
| Low | No `BreadcrumbList` on product category pages | Add to curtains/chairs/sofas/bed-sheets/custom `page.tsx` |
| Low | No `twitter:site` handle | Add to locale layout `twitter` object if handle exists |
| Low | Single favicon, no sized variants, 886KB | Generate 192×192, 512×512, 180×180 variants; consider SVG favicon |
| Low | OG image font fetched from Google at runtime | Self-host `.woff` in `public/fonts/` and remove `runtime = "edge"` to use `fs.readFile` |

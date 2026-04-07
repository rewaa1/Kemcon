# Kemcon — Design Plan

A luxury presentation website for **Kemcon**, a leading provider of premium fabrics, cushions, pillows, and sofas for the hotel industry across Egypt, Saudi Arabia, Emirates, and Jordan. The goal is to establish strong B2C brand presence in Egypt.

---

## Color Palette (Warm Luxury)

### Core Colors

| Role         | Hex       | Description                                            |
| ------------ | --------- | ------------------------------------------------------ |
| Background   | `#F5F1EB` | Soft beige — warm, inviting, luxurious base            |
| Secondary    | `#EAE3D9` | Light sand — subtle differentiation for cards/sections |
| Text Primary | `#1A1A1A` | Charcoal — strong readability without harsh black      |
| Accent       | `#C6A57B` | Muted gold — luxury gold for CTAs and highlights       |
| Deep Accent  | `#8C6B4F` | Bronze — grounding, earthy, premium feel               |

### Extended Palette

| Role         | Hex       | Description                                                                 |
| ------------ | --------- | --------------------------------------------------------------------------- |
| White        | `#FEFDF9` | Warm white — for card surfaces and contrast areas                           |
| Dark Section | `#2C2420` | Warm charcoal-brown — for footer, dark hero overlays, and contrast sections |
| Accent Hover | `#B8956A` | Slightly darker gold — for hover states                                     |
| Light Accent | `#D4B896` | Lighter gold — for backgrounds and subtle fills                             |
| Error/Alert  | `#C25E4D` | Warm red — for form validation (matches the warm palette)                   |

### CSS Custom Properties

```css
:root {
  --color-background: #f5f1eb;
  --color-secondary: #eae3d9;
  --color-text-primary: #1a1a1a;
  --color-accent: #c6a57b;
  --color-deep-accent: #8c6b4f;
  --color-white: #fefdf9;
  --color-dark: #2c2420;
  --color-accent-hover: #b8956a;
  --color-light-accent: #d4b896;
  --color-error: #c25e4d;
}
```

---

## Tech Stack

| Technology            | Purpose                                            |
| --------------------- | -------------------------------------------------- |
| Next.js (App Router)  | Framework — SSR, routing, SEO                      |
| Tailwind CSS v4       | Utility-first CSS — CSS-first config               |
| Framer Motion         | Animations — scroll reveals, transitions, parallax |
| Lenis                 | Smooth scrolling                                   |
| next-intl             | Internationalization — bilingual AR/EN             |
| clsx + tailwind-merge | Conditional class merging                          |
| shadcn/ui             | UI primitives UI primitives(optional)              |
| Cloudinary            | Image hosting/optimization (optional)              |

---

## Typography

### English

- **Headings**: Playfair Display (elegant serif)
- **Body**: Inter (modern sans-serif)

### Arabic

- **Headings**: Noto Kufi Arabic (premium kufi style)
- **Body**: Noto Sans Arabic (clean, readable)

---

## Pages

### 1. Home (`/`)

- **Hero** — Full-viewport with cinematic background, parallax, animated headline, CTA
- **About Preview** — Split layout: image + company story with animated counter
- **Product Highlights** — Horizontal scroll with featured product cards
- **Why Kemcon** — Animated stats (500+ Hotels, 4 Countries, 25+ Years, 10,000+ Products) + value props
- **Clients Showcase** — Auto-scrolling hotel partner logo marquee
- **CTA Banner** — Gold gradient with contact button

### 2. About (`/about`)

- Company timeline/history
- Mission & Vision cards
- Team section
- Full-width parallax image break

### 3. Products (`/products`)

- Category grid: Fabrics, Cushions, Pillows, Sofas, Custom Solutions
- Category hero images + descriptions + feature lists
- Gallery with hover effects
- Premium card animations

### 4. Clients (`/clients`)

- Hotel partner grid with logos and descriptions
- Testimonials carousel
- Regional map (Egypt, Saudi, Emirates, Jordan)
- Stats section

### 5. Contact (`/contact`)

- Split layout: form + company info
- Animated form with validation
- Address, phone, email, social links
- Working hours

---

## Architecture

```
src/
├── app/
│   ├── [locale]/           # Dynamic locale routing (en/ar)
│   │   ├── layout.tsx      # Root layout (RTL/LTR, fonts, Lenis)
│   │   ├── page.tsx        # Home
│   │   ├── about/page.tsx
│   │   ├── products/page.tsx
│   │   ├── clients/page.tsx
│   │   └── contact/page.tsx
│   ├── globals.css         # Tailwind v4 + theme
│   └── layout.tsx          # Base layout
├── components/
│   ├── layout/             # Navbar, Footer, LenisProvider
│   ├── sections/           # Hero, AboutPreview, ProductHighlights, etc.
│   ├── ui/                 # Button, SectionHeading, ProductCard, etc.
│   └── motion/             # FadeIn, SlideIn, ParallaxImage
├── i18n/
│   ├── routing.ts          # Locale routing config
│   └── request.ts          # Server-side i18n
├── messages/
│   ├── en.json             # English translations
│   └── ar.json             # Arabic translations
├── lib/
│   └── utils.ts            # cn() helper
└── middleware.ts            # Locale detection
```

---

## Internationalization

- **Library**: next-intl
- **Locales**: English (`en`) — default, Arabic (`ar`)
- **Routing**: URL prefix (`/en/about`, `/ar/about`)
- **RTL**: Dynamic `dir="rtl"` on `<html>` for Arabic
- **Persistence**: `NEXT_LOCALE` cookie

---

## Animation Strategy

| Effect           | Technology                                 | Usage                           |
| ---------------- | ------------------------------------------ | ------------------------------- |
| Scroll reveals   | Framer Motion `whileInView`                | Section headings, cards, images |
| Parallax         | Framer Motion `useScroll` + `useTransform` | Hero background, image breaks   |
| Smooth scroll    | Lenis                                      | Global page scrolling           |
| Hover effects    | Framer Motion `whileHover`                 | Buttons, cards, nav links       |
| Page transitions | Framer Motion `AnimatePresence`            | Route changes                   |
| Counters         | Framer Motion `useMotionValue`             | Stats section                   |
| Marquee          | CSS animation                              | Client logos                    |

---

## Build Phases

1. **Scaffolding** — Next.js + dependencies
2. **Core Infrastructure** — CSS theme, utilities, providers
3. **i18n** — next-intl routing, middleware, translation files
4. **Layout** — Navbar, Footer, root layout
5. **Motion Components** — Reusable animation wrappers
6. **Home Page** — All sections (Hero → CTA)
7. **Inner Pages** — About, Products, Clients, Contact
8. **Polish** — Responsive testing, RTL verification, performance

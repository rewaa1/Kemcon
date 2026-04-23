# Products Configurator — Implementation Notes

## Overview

The products section is a multi-step fabric configurator. There is no e-commerce or pricing — every flow ends with the user sending an inquiry via **email**, **WhatsApp**, or a **showroom visit**.

---

## Routes

| Route | Description |
|---|---|
| `/[locale]/products` | Category selection landing page |
| `/[locale]/products/curtains` | Curtains configurator |
| `/[locale]/products/chairs` | Chairs configurator |
| `/[locale]/products/sofas` | Sofas configurator |
| `/[locale]/products/bed-sheets` | Bed sheets configurator |
| `/[locale]/products/custom` | Custom solution (free-text description) |

All routes are bilingual (EN/AR) via `next-intl`.

---

## Configurator Step Sequences

Each category has its own step sequence defined in `src/types/configurator.ts`:

| Category | Steps |
|---|---|
| Curtains | Fabric → Color → Pattern → Curtain Options → Inquiry |
| Chairs | Fabric → Color → Pattern → Frame & Fill → Inquiry |
| Sofas | Fabric → Color → Pattern → Frame & Fill → Inquiry |
| Bed Sheets | Fabric → Color → Pattern → Inquiry |
| Custom | Describe → Inquiry |

---

## File Structure

```
src/
├── types/
│   └── configurator.ts          # Shared types, step sequences, initial state
│
├── data/
│   ├── fabrics.ts               # 12 fabric families, 36 individual fabrics
│   ├── colors.ts                # 7 color groups, 70 colors with hex values
│   ├── patterns.ts              # 10 patterns with CSS background previews
│   └── frames.ts                # 8 frame materials, 8 finishes, 7 filling options
│
├── components/products/
│   ├── CategoryCard.tsx         # Single category card (with per-category accent colors)
│   ├── CategoryGrid.tsx         # Responsive grid of CategoryCards
│   ├── SelectionBar.tsx         # Sticky bottom bar showing current selections
│   └── configurator/
│       ├── ConfiguratorShell.tsx      # State manager, step router, nav buttons
│       ├── StepIndicator.tsx          # Animated progress bar at top
│       ├── FabricTypeStep.tsx         # Family filter tabs + fabric swatch grid
│       ├── ColorStep.tsx              # Group filter tabs + color circle grid
│       ├── PatternStep.tsx            # Pattern cards with live colour preview
│       ├── CurtainOptionsStep.tsx     # Manual/remote toggle + size inputs
│       ├── ChairOptionsStep.tsx       # Frame material, finish, and filling grids
│       ├── CustomDescriptionStep.tsx  # Free-text textarea + example prompts
│       └── InquiryStep.tsx            # Summary card + contact form + 3 CTAs
│
└── app/[locale]/products/
    ├── page.tsx                 # Category selection page
    ├── curtains/page.tsx
    ├── chairs/page.tsx
    ├── sofas/page.tsx
    ├── bed-sheets/page.tsx
    └── custom/page.tsx
```

---

## Inquiry Flow

When the user reaches the final **Inquiry** step:

1. A summary card shows all selections (fabric, colour, pattern, and category-specific options).
2. The user fills in Name, Phone, and Email (all required).
3. Three CTA options are available:
   - **Email** — opens a `mailto:` link to `info@kemcon.com` with the full selection pre-filled in the subject and body.
   - **WhatsApp** — opens `wa.me/201234567890` with a pre-filled message containing the full selection summary.
   - **Showroom** — opens Google Maps pointed at Cairo, Egypt.

> To update the WhatsApp number, edit the `wa.me/` link inside `InquiryStep.tsx`.
> To update the email address, edit the `mailto:` link in the same file.

---

## How to Extend the Data

### Add a new fabric family
In `src/data/fabrics.ts`, append to `fabricFamilies`:
```ts
{
  id: "tweed",
  name: "Tweed",
  nameAr: "تويد",
  gradient: "linear-gradient(135deg, #6a5a4a 0%, #8a7a6a 50%, #5a4a3a 100%)",
}
```
Then add individual fabrics with `familyId: "tweed"` to the `fabrics` array.

### Add a new colour
In `src/data/colors.ts`, append to `colors`:
```ts
{ id: "forest-green", name: "Forest Green", nameAr: "أخضر الغابة", hex: "#228B22", groupId: "cool" }
```

### Add a new pattern
In `src/data/patterns.ts`, append to `patterns` with a `cssPattern` string (CSS `background-image` value).

### Add a new frame material or filling
In `src/data/frames.ts`, append to `frameMaterials` or `fillingOptions`.

---

## Translations

Products translations live under the `"products"` key in:
- `src/messages/en.json`
- `src/messages/ar.json`

Keys added in this update:
- `heroTitle`, `heroDescription`
- `categoriesLabel`, `categoriesTitle`, `categoriesDescription`
- `categories.curtains`, `categories.chairs`, `categories.sofas`, `categories.bedSheets`, `categories.custom`

All configurator step labels, option names, and UI strings are **bilingual inline** (using `isAr ? "..." : "..."` pattern) rather than translation files, since the data layer already carries `name` + `nameAr` fields.

---

## Design Notes

- No product photography is used — fabric swatches are rendered via CSS gradients, colour swatches use hex values, and patterns use CSS `background-image` repeating gradients.
- The `SelectionBar` sticks to the bottom of the screen and shows a live summary of current picks as the user configures.
- The `StepIndicator` is sticky to the top of the viewport so progress is always visible.
- Navigation buttons are fixed at the bottom (above the `SelectionBar`). "Next" is disabled until the current step has a valid selection.
- The configurator respects RTL layout — slide animations reverse direction for Arabic, and arrow icons flip.

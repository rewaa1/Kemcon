# Product enquiry forms

Every product category is a **single form**. There is no step-by-step
configurator; it was retired along with `ConfiguratorShell`, its nine step
components, and the Pollinations AI room preview (`/api/generate-curtain`).

Why: the configurator led with fabric swatches across six screens, but what
actually decides a quote is far duller — how many, for what kind of building,
one product answer, and how to reach you. Those are now the required block on
one screen, and everything the wizard collected survives as optional sections
that stay shut until someone wants them.

---

## Routes

| Route | Category | Required product answer |
|---|---|---|
| `/[locale]/products/curtains` | `curtains` | Layers (≥1 of sheer / drapery / blackout) |
| `/[locale]/products/chairs` | `chairs` | Frame material |
| `/[locale]/products/sofas` | `sofas` | Frame material |
| `/[locale]/products/bed-covers` | `bed-covers` | Bed size |
| `/[locale]/products/custom` | `custom` | A description over 10 characters |

All five accept `?fabric=&fabricFamily=` (the fabric catalog deep-links into
them, and the fabric section opens pre-expanded) and `?edit=<lineItemId>` (the
brief page's pencil).

> `/products/bed-sheets` was renamed to `/products/bed-covers` with **no
> redirect**, by decision. The old URL 404s.

---

## Architecture

```
src/components/products/enquiry/
├── ProductEnquiryForm.tsx   # the shell: state, edit mode, tracking,
│                            # validation, submission, layout
├── specs.tsx                # per-category difference — the one required
│                            # question + category-specific sections
├── sharedSections.tsx       # treatments, fabric/colour/pattern, photos, notes
├── types.ts                 # CategorySpec / EnquirySection contracts
├── fields.tsx               # ChipGroup, SelectableRow, OptionCard, Stepper…
├── FabricPicker.tsx         # ex-FabricTypeStep
├── ColorPicker.tsx          # ex-ColorStep
├── PatternPicker.tsx        # ex-PatternStep
├── CurtainSizeRows.tsx      # repeatable window measurements
└── PhotoUploader.tsx
```

**Adding a category is a spec, not a form.** `ProductEnquiryForm` owns the
whole spine; `specs.tsx` supplies the difference. Chairs and sofas are built
from one `seatingSpec()` factory because they are the same enquiry with
different nouns.

### The shared spine

Required on every category: **quantity** → **property type** → (**property
name**, if the type is a named institution — hotel, hospital, school, office,
restaurant, from `src/data/propertyTypes.ts`) → **the category's one product
answer** → **name, phone, email**.

Optional on every category, in order: the category's own sections first, then
fabric **treatments** (anti-fungal/antibacterial, fire-retardant — a property
of the fabric, not the product, so it is offered everywhere), **fabric, colour
& pattern** (skipped for `custom`), **photos**, **notes**.

### Two ways out

- **Send Enquiry** — straight to `/api/contact` via the shared `ContactSubmit`.
- **Add to my brief** — for someone ordering across categories; lands on
  `/products/brief`, which is still the multi-item send point.

`formType` on the lead is the **category slug**, so leads arrive in the CRM as
`curtains` / `chairs` / `sofas` / `bed-covers` / `custom`. Each needs a
`formType.<slug>` label in the CRM's `messages/*.json` — see
[crm-lead-intake.md](crm-lead-intake.md).

---

## Tracking

`product_view` on mount, `fabric_select` / `color_select` on picks, and
`enquiry_configured` once, the moment the required block first becomes
complete. That last one exists purely to keep the CRM funnel's "configured"
stage populated now that there are no `configurator_step` events — see
[journey-tracking.md](journey-tracking.md).

---

## Data

| File | Holds |
|---|---|
| `src/data/curtainLayers.ts` | The three curtain layers, inner to outer |
| `src/data/bedSizes.ts` | Bed sizes with mattress dimensions |
| `src/data/propertyTypes.ts` | Property list + which types have a name worth asking for |
| `src/data/productSeo.ts` | Per-category metadata, breadcrumb and Product schema copy |
| `src/data/fabrics.ts`, `colors.ts`, `patterns.ts`, `frames.ts` | Picker options |

`ConfiguratorState` in `src/types/configurator.ts` is still the working shape a
form collects — the name is historical, the configurator it was named after is
gone.

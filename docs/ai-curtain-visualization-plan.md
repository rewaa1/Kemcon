# AI Curtain Visualization — Implementation & Decisions Log

## Overview

A new `aiVisualization` step was added to the curtains configurator flow, sitting between `curtainOptions` and `inquiry`. It lets users generate AI room renders and fabric close-ups based on their selections before sending an inquiry.

**Flow:**
```
Fabric → Color → Pattern → Options → Preview (AI) → Inquiry
```

**Image generation:** Pollinations.ai (free, no API key, powered by FLUX)
**Architecture:** Browser → Next.js API route → Pollinations (server-side, bypasses Turnstile)

---

## Files Changed

| File | Change |
|------|--------|
| `src/types/configurator.ts` | Added `aiVisualization` step type + `aiImageUrl` to state |
| `src/app/api/generate-curtain/route.ts` | New — proxies image generation to Pollinations |
| `src/components/products/configurator/AIVisualizationStep.tsx` | New — full preview UI |
| `src/components/products/configurator/ConfiguratorShell.tsx` | Wired in new step + `goToStep` for clickable indicator |
| `src/components/products/configurator/InquiryStep.tsx` | Shows AI image thumbnail + URL in inquiry messages |
| `src/components/products/configurator/StepIndicator.tsx` | Clickable completed steps + "Preview / معاينة" label |

---

## Type System (`src/types/configurator.ts`)

```typescript
export type StepType =
  | "fabric" | "color" | "pattern"
  | "curtainOptions" | "chairOptions"
  | "aiVisualization"   // ← added
  | "inquiry" | "customDescription";

// Curtains step sequence
curtains: ["fabric", "color", "pattern", "curtainOptions", "aiVisualization", "inquiry"]

// Added to ConfiguratorState
aiImageUrl: string | null;
```

---

## API Route (`src/app/api/generate-curtain/route.ts`)

**Why a server route?** Pollinations blocks direct browser `fetch()` calls with a Cloudflare Turnstile challenge (403 Forbidden). Server-side Node.js requests bypass this entirely.

**Request body:**
```json
{ "prompt": "...", "seed": 5043136, "negative": "blurry, cartoon, ..." }
```

**How it works:**
1. Receives prompt + seed + optional negative prompt
2. Builds Pollinations URL with `width=1024`, `height=1536`, `nologo=true`
3. Fetches image server-side with a browser User-Agent header
4. Streams the image bytes back to the client
5. Client creates a blob URL from the response

```typescript
const params = new URLSearchParams({
  width: "1024", height: "1536", nologo: "true",
  seed: String(seed),
  ...(negative ? { negative } : {}),
});
const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params}`;
```

---

## AI Visualization Step (`AIVisualizationStep.tsx`)

### Two independent tabs

Each tab generates independently — the user chooses which view to generate rather than waiting for both.

| Tab | Prompt focus | Time |
|-----|-------------|------|
| Room View | Luxury penthouse interior, curtains in context | ~15s |
| Fabric Detail | Macro close-up of fabric texture and drape | ~15s |

**Why not parallel?** Pollinations rate-limits simultaneous requests from the same server IP, returning 502. Sequential (one at a time, user-triggered) is more reliable.

### Tab state machine (per tab)

```
idle → loading → done
             └→ error → idle (retry)
```

- Each tab has its own `genState`, `url`, and `regenerations` counter
- Regeneration limit: 2 per tab
- `aiImageUrl` in `ConfiguratorState` stores the room view URL (falls back to detail if room not generated)

### Prompt engineering

**Fabric visual descriptors** — mapped from fabric family ID:
```typescript
const FABRIC_VISUALS: Record<string, string> = {
  velvet: "rich pile velvet with deep light absorption and lustrous sheen",
  linen: "natural linen with subtle woven texture and organic relaxed drape",
  silk: "smooth silk with fluid drape and soft iridescent sheen",
  cotton: "crisp cotton with clean structured lines and matte finish",
  jacquard: "jacquard with intricate raised woven motifs and dimensional texture",
  chenille: "soft chenille with velvety pile texture and gentle warmth",
  brocade: "brocade with ornate raised pattern and fine metallic thread detail",
  sheer: "translucent sheer fabric gently diffusing natural light",
  blackout: "heavyweight blackout fabric with dense opaque weave",
  wool: "textured wool with warm matte finish and natural flowing drape",
  suede: "suede-effect fabric with soft nap and warm tactile quality",
  synthetic: "technical synthetic blend with refined texture and controlled drape",
};
```

**Pattern visual descriptors** — mapped from pattern name:
```typescript
const PATTERN_VISUALS: Record<string, string> = {
  Solid: "in a clean solid color with no pattern",
  Striped: "with elegant vertical stripes",
  Herringbone: "in a classic herringbone weave",
  Checkered: "with a refined checkered motif",
  Geometric: "with bold geometric motifs",
  Damask: "with ornate damask medallion pattern",
  Floral: "with delicate floral embroidery",
  Paisley: "with intricate paisley motifs",
  Abstract: "with expressive abstract pattern",
  Moroccan: "with traditional Moroccan arabesque motifs",
};
```

**Room View prompt template:**
```
editorial interior design photograph,
luxury penthouse living room with floor-to-ceiling {fabricVisual} curtains,
{patternVisual} in {colorName},
tall ceilings with crown molding, marble floors,
warm golden afternoon light streaming through windows,
sophisticated furniture, high-end interior styling,
shot on Canon EOS R5, 35mm lens, f/2.8,
no people, 8K ultra-detailed
```

**Fabric Detail prompt template:**
```
luxury textile macro photography,
close-up of {fabricVisual} {patternVisual} in {colorName},
soft directional studio lighting highlighting fabric texture and natural drape,
shot on Canon EOS R5, 100mm macro lens, f/4,
crisp fabric detail, professional product photography,
no people, 8K ultra-detailed
```

**Negative prompt (both views):**
```
blurry, low quality, cartoon, illustration, watermark,
ugly, distorted, oversaturated, deformed, text, logo
```

### Navigation

- Bottom nav hidden for `aiVisualization` step (the component manages its own Continue/Skip)
- Before any image generated: "Continue without preview →" (centered)
- After at least one image generated: "Skip →" (left) + "Continue" button (right)

---

## Clickable Step Indicator (`StepIndicator.tsx`)

Completed steps are now clickable — users can jump directly to any previous step rather than clicking back repeatedly.

**Props added:**
```typescript
onStepClick?: (index: number) => void
```

**Behavior:**
- Only completed steps (index < currentStep) are clickable
- Cursor changes to pointer, label turns accent color on hover
- Current and future steps remain non-interactive

**Shell handler (`goToStep`):**
```typescript
const goToStep = (index: number) => {
  if (index >= currentStep) return;
  // Clear stale AI image if jumping back before the preview step
  const previewIndex = steps.indexOf("aiVisualization");
  if (previewIndex !== -1 && index < previewIndex) {
    setState((prev) => ({ ...prev, aiImageUrl: null }));
  }
  setDirection(-1);
  setCurrentStep(index);
};
```

**Why clear the AI image?** If the user jumps back to change fabric/color/pattern, the previously generated image is stale. Clearing `aiImageUrl` prevents a stale thumbnail from appearing in the inquiry summary.

---

## Inquiry Step (`InquiryStep.tsx`)

If an AI image was generated, it appears in the inquiry summary:

- **Thumbnail** — small 56×80px image preview in the selections summary card
- **URL in messages** — Pollinations URL appended to WhatsApp and email messages as `AI Preview: <url>`

---

## Debugging Notes

### Issue 1: 403 Forbidden from Pollinations
**Root cause:** Pollinations requires a Cloudflare Turnstile token for browser fetch requests.
**Fix:** Server-side API route — Node.js requests bypass Turnstile entirely.

### Issue 2: 502 on one image when generating both in parallel
**Root cause:** Pollinations rate-limits concurrent requests from the same server IP.
**Fix:** Per-tab independent generation (user triggers each one separately) instead of parallel `Promise.allSettled()`.

### Issue 3: Double URL encoding (`%2520`)
**Root cause:** `buildPrompt()` was calling `encodeURIComponent()`, then the API route also encoded it.
**Fix:** Prompt strings are passed raw; only the API route encodes once via `encodeURIComponent(prompt)`.

---

## Cost

**Free.** Pollinations.ai has no API key requirement and no per-image cost. The trade-off is ~15s generation time per image and no SLA guarantee. If reliability becomes an issue at higher traffic, DALL-E 3 at $0.08–$0.12/image is the upgrade path.

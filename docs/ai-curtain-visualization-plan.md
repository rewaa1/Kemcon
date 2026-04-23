# AI Curtain Visualization — Implementation Plan

## Overview

Insert a new `aiVisualization` step between `curtainOptions` and `inquiry` in the curtains flow only. The step builds a prompt from the user's selections, calls DALL-E 3, displays the generated room render, and passes the image into the final inquiry.

---

## Step 1 — Dependencies & Environment

**Install:**
```bash
npm install openai
```

**Add to `.env.local`:**
```
OPENAI_API_KEY=sk-...
```

---

## Step 2 — Type System (`src/types/configurator.ts`)

- Add `"aiVisualization"` to `StepType`
- Update `CATEGORY_STEPS.curtains` to: `[fabric, color, pattern, curtainOptions, aiVisualization, inquiry]`
- Add `aiImageUrl: string | null` to `ConfiguratorState`
- Add `aiImageUrl: null` to `initialConfiguratorState`

---

## Step 3 — API Route (`src/app/api/generate-curtain/route.ts`)

A POST endpoint that receives the user's selections and returns a generated image URL.

**Input (request body):**
```json
{
  "fabricName": "Velvet",
  "colorName": "Deep Navy",
  "colorHex": "#1a2e4a",
  "patternName": "Solid",
  "patternDescription": "Clean, uniform color with no pattern",
  "curtainControl": "remote",
  "locale": "en"
}
```

**Prompt template:**
```
Photorealistic luxury interior design photograph.
Floor-to-ceiling [fabricName] curtains in [colorName] ([colorHex])
with a [patternName] pattern ([patternDescription]).
[Remote-controlled / Manual] curtain system.
Elegant living room, soft diffused natural daylight,
high-end interior styling, 4K detail, no people.
```

**Output:** `{ imageUrl: string }`

---

## Step 4 — UI Component (`src/components/products/configurator/AIVisualizationStep.tsx`)

**States:**
- `idle` — show specs summary + "Generate Visualization" button
- `loading` — spinner + estimated time notice (~10s)
- `done` — display generated image, "Regenerate" button, "Continue" button
- `error` — error message + retry button

**Layout:**
1. Heading + short explanation ("See your curtains in a styled room")
2. Compact specs recap (fabric / color / pattern chips)
3. Action area (button or image depending on state)
4. Skip link ("Continue without visualization →")

The generated image URL is passed up to `ConfiguratorShell` via an `onImageGenerated(url)` callback and stored in state.

---

## Step 5 — Shell Integration (`src/components/products/ConfiguratorShell.tsx`)

- Add `aiVisualization` to the step renderer switch
- Pass `state.aiImageUrl` setter as callback to `AIVisualizationStep`
- Pass `state.aiImageUrl` down to `InquiryStep`

---

## Step 6 — Inquiry Update (`src/components/products/configurator/InquiryStep.tsx`)

- If `aiImageUrl` exists, show a thumbnail of the generated image in the summary section
- Include a note in the WhatsApp/email message: "AI visualization attached" (or embed the URL in the message)

---

## Step 7 — Step Indicator (`src/components/products/StepIndicator.tsx`)

Add label for the new step — English: `"Preview"`, Arabic: `"معاينة"`

---

## Step 8 — Translations

**`en.json` additions:**
```json
"configurator.aiVisualization.title": "See Your Curtains",
"configurator.aiVisualization.subtitle": "We'll generate a styled room render based on your selections.",
"configurator.aiVisualization.generate": "Generate Visualization",
"configurator.aiVisualization.regenerate": "Regenerate",
"configurator.aiVisualization.generating": "Generating your preview...",
"configurator.aiVisualization.estimatedTime": "This takes about 10 seconds",
"configurator.aiVisualization.skip": "Continue without preview",
"configurator.aiVisualization.error": "Generation failed. Please try again.",
"configurator.aiVisualization.stepLabel": "Preview"
```

**`ar.json` — matching Arabic keys**

---

## Data Flow

```
CurtainOptionsStep
       ↓
AIVisualizationStep
  → POST /api/generate-curtain
  → DALL-E 3 returns imageUrl
  → stored in ConfiguratorState.aiImageUrl
       ↓
InquiryStep
  → shows image thumbnail in summary
  → includes image URL in WhatsApp/email message
```

---

## Implementation Order

| # | Task | File(s) |
|---|------|---------|
| 1 | Install openai, add env var | terminal / `.env.local` |
| 2 | Update types | `src/types/configurator.ts` |
| 3 | Create API route | `src/app/api/generate-curtain/route.ts` |
| 4 | Create AIVisualizationStep | `src/components/products/configurator/AIVisualizationStep.tsx` |
| 5 | Wire into ConfiguratorShell | `src/components/products/ConfiguratorShell.tsx` |
| 6 | Update InquiryStep | `src/components/products/configurator/InquiryStep.tsx` |
| 7 | Update StepIndicator | `src/components/products/StepIndicator.tsx` |
| 8 | Add translations | `src/messages/en.json`, `src/messages/ar.json` |

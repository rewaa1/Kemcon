# Curtain Reveal — Implementation & Removal Guide

A theatrical curtain-opening animation shown once on the user's first visit. Two dark panels split left/right to reveal the site, with the Kemcon logo centered while the curtain is closed.

---

## Files Added (delete these to remove)

| File | Purpose |
|------|---------|
| `src/components/ui/CurtainReveal.tsx` | The animation component |
| `src/components/ui/CurtainRevealClient.tsx` | Thin `"use client"` wrapper that loads `CurtainReveal` with `ssr: false` |

---

## Changes to Existing Files

### `src/app/layout.tsx`

**1. Added import (line 6):**
```tsx
import { CurtainRevealClient } from "@/components/ui/CurtainRevealClient";
```

**2. Added `suppressHydrationWarning` to `<html>` tag:**
```tsx
<html
  lang={locale}
  dir={direction}
  className={...}
  suppressHydrationWarning   // ← remove this line
>
```

**3. Added `<head>` block (after the `<html>` opening tag):**
```tsx
<head>
  <style dangerouslySetInnerHTML={{ __html: `html[data-curtain]::before{content:'';position:fixed;inset:0;background:#111318;z-index:9998;pointer-events:none}` }} />
  <script dangerouslySetInnerHTML={{ __html: `try{if(!localStorage.getItem('kemcon_intro_v1')){document.documentElement.setAttribute('data-curtain','1')}}catch(e){}` }} />
</head>
```
Remove the entire `<head>` block.

**4. Added component inside `<body>`:**
```tsx
<CurtainRevealClient />
```
Remove this line.

---

## How to Remove Everything

1. Delete `src/components/ui/CurtainReveal.tsx`
2. Delete `src/components/ui/CurtainRevealClient.tsx`
3. In `src/app/layout.tsx`:
   - Remove the import on line 6
   - Remove `suppressHydrationWarning` from the `<html>` tag
   - Remove the entire `<head>` block
   - Remove `<CurtainRevealClient />`

---

## localStorage Key

The animation state is stored under `kemcon_intro_v1`.

To reset it for a user (e.g. after a major redesign):
- Change the key in `CurtainReveal.tsx` to `kemcon_intro_v2` (or any new value) — all users will see the curtain once more on their next visit.

To reset it locally for testing:
```js
localStorage.removeItem('kemcon_intro_v1')
```

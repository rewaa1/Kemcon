/**
 * Word-order correction for Arabic text inside Open Graph images.
 *
 * satori shapes Arabic glyphs correctly — letters join, initial/medial/final
 * forms are right — but it does not implement the bidirectional reordering
 * step, and it ignores `direction: "rtl"`. So a two-word Arabic title comes out
 * back to front: "ستائر مخصصة" renders as "مخصصة ستائر". Verified against real
 * renders; feeding satori pre-reversed words produces the correct image.
 *
 * This is a workaround for the image renderer only. Nothing else on the site
 * needs it — browsers do their own bidi — so it must never be applied to page
 * HTML, only to strings on their way into an `ImageResponse`.
 *
 * Reversing whitespace-separated tokens is the right granularity: it fixes word
 * order without touching the letters inside a word, which satori already got
 * right. Mixed Latin-in-Arabic ("Kemcon ستائر") is approximated rather than
 * solved — full bidi needs the Unicode algorithm — but a Latin run kept intact
 * and moved as one token is much closer than the fully reversed line satori
 * produces on its own.
 */
export function rtlText(value: string, isAr: boolean): string {
  if (!isAr) return value;
  return value.split(/(\s+)/).reverse().join("");
}

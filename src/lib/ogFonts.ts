import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Fonts for the Open Graph images, loaded from files committed to `assets/`.
 *
 * This used to fetch from Google Fonts on every render and parse the returned
 * CSS with `/url\(([^)]+\.woff[^)]*)\)/`. Google stopped serving a URL with a
 * file extension to that request — it now answers the old-IE user agent with
 * `https://fonts.gstatic.com/l/font?kit=…` — so the regex matched nothing, the
 * font list came back empty, and satori threw `No fonts are loaded`. Every
 * `og:image` on the site had been returning HTTP 500, in production, silently:
 * nothing renders these images on the page, so nothing surfaced the failure.
 *
 * Reading committed files removes the failure mode rather than patching it.
 * There is no network call left to break, no CSS format to track, and the
 * fonts cannot drift out from under us on someone else's release schedule.
 *
 * `assets/` rather than `public/`: this is the layout the Next docs use for
 * exactly this job, and `public/` is served by the CDN rather than guaranteed
 * to sit on the serverless filesystem. `outputFileTracingIncludes` in
 * next.config.ts pins the directory into the bundle regardless.
 *
 * TTF, not WOFF2 — satori reads ttf/otf/woff and cannot parse woff2.
 *
 * The Arabic face is Cairo rather than the Noto Sans/Kufi Arabic the site
 * itself uses. Not a preference: satori's font parser rejects both Notos with
 * `lookupType: 5 - substFormat: 3 is not yet supported`, a GSUB contextual
 * substitution table it has not implemented, and the render throws. Cairo
 * parses, shapes Arabic correctly, and is a close enough geometric match for a
 * share card. Anything swapped in here must be checked against a real render —
 * a font loading is not the same as a font working.
 */

const ASSET_DIR = "assets";

/** What `ImageResponse` wants in its `fonts` option. */
export interface OgFont {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
}

async function readFont(filename: string): Promise<ArrayBuffer | null> {
  try {
    const buffer = await readFile(join(process.cwd(), ASSET_DIR, filename));
    return buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    ) as ArrayBuffer;
  } catch {
    return null;
  }
}

/**
 * The font family name to set on the OG image root, per locale.
 *
 * Latin copy renders in Playfair; Arabic copy needs Noto Sans Arabic, which
 * Playfair has no glyphs for.
 */
export function ogFontFamily(isAr: boolean): string {
  return isAr ? '"NotoArabic"' : '"Playfair"';
}

/**
 * Every font an OG image render should register.
 *
 * Playfair is always included so Latin fragments inside Arabic copy — a hotel
 * name, a number — still have glyphs to draw with. Returns whatever loaded:
 * callers must treat an empty array as "cannot render" rather than passing it
 * to satori, which requires at least one font.
 */
export async function loadOgFonts(isAr: boolean): Promise<OgFont[]> {
  const [playfair, arabic400, arabic700] = await Promise.all([
    readFont("playfair-display-700.ttf"),
    isAr ? readFont("arabic-400.ttf") : Promise.resolve(null),
    isAr ? readFont("arabic-700.ttf") : Promise.resolve(null),
  ]);

  const fonts: OgFont[] = [];
  if (playfair) {
    fonts.push({ name: "Playfair", data: playfair, weight: 700, style: "normal" });
  }
  if (arabic400) {
    fonts.push({ name: "NotoArabic", data: arabic400, weight: 400, style: "normal" });
  }
  if (arabic700) {
    fonts.push({ name: "NotoArabic", data: arabic700, weight: 700, style: "normal" });
  }
  return fonts;
}

/**
 * A committed 1200×630 PNG served when an image cannot be rendered at all.
 *
 * The point is that this endpoint must not answer a crawler with a 500. If
 * satori fails for any reason we have not predicted, a plain branded card is a
 * far better answer than an error page, and social platforms cache whatever
 * they get on first fetch.
 */
export async function ogFallbackImage(): Promise<Response | null> {
  try {
    const buffer = await readFile(join(process.cwd(), ASSET_DIR, "og-fallback.png"));
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return null;
  }
}

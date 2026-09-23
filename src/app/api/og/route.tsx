import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { loadOgFonts, ogFallbackImage, ogFontFamily } from "@/lib/ogFonts";
import { rtlText } from "@/lib/ogText";

export const runtime = "nodejs";

async function loadPhoto(imagePath: string): Promise<string | null> {
  if (!imagePath) return null;
  try {
    const buffer = await readFile(path.join(process.cwd(), "public", imagePath));
    const ext = imagePath.split(".").pop()?.toLowerCase();
    const mime = ext === "webp" ? "image/webp" : ext === "png" ? "image/png" : "image/jpeg";
    return `data:${mime};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

async function renderOgImage(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Kemcon";
  const description = searchParams.get("description") ?? "";
  const imagePath = searchParams.get("image") ?? "";
  const locale = searchParams.get("locale") ?? "en";
  const isAr = locale === "ar";

  const [fonts, photoDataUrl] = await Promise.all([
    loadOgFonts(isAr),
    loadPhoto(imagePath),
  ]);

  // satori needs at least one font to lay anything out, so an empty list is
  // not something to hand it and hope — serve the static card instead.
  if (fonts.length === 0) {
    const fallback = await ogFallbackImage();
    if (fallback) return fallback;
  }

  const fontFamily = ogFontFamily(isAr);

  const response = new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          position: "relative",
          display: "flex",
          fontFamily,
          overflow: "hidden",
          background: "#0D0B14",
        }}
      >
        {/* Background photo */}
        {photoDataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoDataUrl}
            alt=""
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        )}

        {/* Dark gradient overlay — stronger on the text side */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: isAr
              ? "linear-gradient(to left, rgba(13,11,20,0.90) 45%, rgba(13,11,20,0.55) 100%)"
              : "linear-gradient(to right, rgba(13,11,20,0.90) 45%, rgba(13,11,20,0.55) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px 80px",
            alignItems: isAr ? "flex-end" : "flex-start",
          }}
        >
          {/* Top: wordmark */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: isAr ? "flex-end" : "flex-start", gap: "0px" }}>
            <div style={{ width: "36px", height: "2px", background: "#B49A5E", marginBottom: "16px" }} />
            <div style={{ fontSize: "18px", fontWeight: 400, color: "#B49A5E", letterSpacing: "0.3em", textTransform: "uppercase" }}>
              {isAr ? "كيمكون" : "KEMCON"}
            </div>
          </div>

          {/* Middle: title + description */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: isAr ? "flex-end" : "flex-start", gap: "14px", maxWidth: "640px" }}>
            <div
              style={{
                fontSize: "58px",
                fontWeight: 700,
                color: "#F5EFE2",
                lineHeight: 1.1,
                textAlign: isAr ? "right" : "left",
              }}
            >
              {rtlText(title, isAr)}
            </div>
            {description && (
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 400,
                  color: "rgba(245,239,226,0.55)",
                  lineHeight: 1.5,
                  textAlign: isAr ? "right" : "left",
                }}
              >
                {rtlText(
                  description.length > 100 ? description.slice(0, 97) + "…" : description,
                  isAr
                )}
              </div>
            )}
          </div>

          {/* Bottom: established */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "28px", height: "1px", background: "rgba(180,154,94,0.5)" }} />
            <div style={{ fontSize: "13px", fontWeight: 400, color: "rgba(245,239,226,0.35)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              {isAr ? rtlText("منذ ١٩٨٥", true) : "EST. 1985"}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
    }
  );

  // Buffer here rather than handing the stream straight back. satori does its
  // work while the body is piped, so a render failure surfaces *after* the
  // handler has returned — which is exactly how the missing-font error reached
  // production as a 500 that no try/catch could see. Awaiting the bytes pulls
  // that failure inside the caller's catch, where it can become a fallback.
  const body = await response.arrayBuffer();

  // Cache for 1 week — OG images are static per route
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=604800, immutable",
    },
  });
}

/**
 * A crawler asking for an `og:image` must never get an error page.
 *
 * This endpoint answered 500 in production for months because a font failed to
 * load and the throw went straight out to the response. Whatever goes wrong
 * now, a branded card beats a stack trace — social platforms cache the first
 * response they get, so one bad minute can poison a link preview for weeks.
 */
export async function GET(request: NextRequest) {
  try {
    return await renderOgImage(request);
  } catch (error) {
    console.error("OG image render failed", error);
    const fallback = await ogFallbackImage();
    if (fallback) return fallback;
    throw error;
  }
}

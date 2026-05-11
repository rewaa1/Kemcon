import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

async function loadLocalFont(filename: string): Promise<ArrayBuffer | null> {
  try {
    const buffer = await readFile(path.join(process.cwd(), "public/fonts", filename));
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
  } catch {
    return null;
  }
}

async function fetchGoogleFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`,
      { headers: { "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)" } }
    ).then((r) => r.text());
    const fontUrl = css.match(/url\(([^)]+\.woff[^)]*)\)/)?.[1];
    if (!fontUrl) return null;
    return fetch(fontUrl).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

async function loadFont(filename: string, family: string, weight: number): Promise<ArrayBuffer | null> {
  return (await loadLocalFont(filename)) ?? (await fetchGoogleFont(family, weight));
}

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Kemcon";
  const description = searchParams.get("description") ?? "";
  const imagePath = searchParams.get("image") ?? "";
  const locale = searchParams.get("locale") ?? "en";
  const isAr = locale === "ar";

  const [playfairData, notoArabicData, photoDataUrl] = await Promise.all([
    loadFont("playfair-display-bold.woff", "Playfair+Display", 700),
    isAr ? loadFont("noto-sans-arabic.woff", "Noto+Sans+Arabic", 400) : Promise.resolve(null),
    loadPhoto(imagePath),
  ]);

  const fontFamily = isAr ? '"NotoArabic"' : '"Playfair"';

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
              inset: 0,
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
            inset: 0,
            background: isAr
              ? "linear-gradient(to left, rgba(13,11,20,0.90) 45%, rgba(13,11,20,0.55) 100%)"
              : "linear-gradient(to right, rgba(13,11,20,0.90) 45%, rgba(13,11,20,0.55) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
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
              {title}
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
                {description.length > 100 ? description.slice(0, 97) + "…" : description}
              </div>
            )}
          </div>

          {/* Bottom: established */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "28px", height: "1px", background: "rgba(180,154,94,0.5)" }} />
            <div style={{ fontSize: "13px", fontWeight: 400, color: "rgba(245,239,226,0.35)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              {isAr ? "منذ ١٩٨٥" : "EST. 1985"}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        ...(playfairData ? [{ name: "Playfair", data: playfairData, style: "normal" as const, weight: 700 as const }] : []),
        ...(notoArabicData
          ? [
              { name: "NotoArabic", data: notoArabicData, style: "normal" as const, weight: 400 as const },
              { name: "NotoArabic", data: notoArabicData, style: "normal" as const, weight: 700 as const },
            ]
          : []),
      ],
    }
  );

  // Cache for 1 week — OG images are static per route
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "public, max-age=604800, immutable");
  return new NextResponse(response.body, { status: response.status, headers });
}

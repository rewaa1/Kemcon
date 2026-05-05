import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { readFile } from "fs/promises";
import path from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
    // Old IE UA forces Google Fonts to return woff (supported by ImageResponse)
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

export default async function OGImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const isAr = locale === "ar";

  const [playfairData, notoArabicData] = await Promise.all([
    loadFont("playfair-display-bold.woff", "Playfair+Display", 700),
    isAr ? loadFont("noto-sans-arabic.woff", "Noto+Sans+Arabic", 400) : Promise.resolve(null),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0D0B14",
          display: "flex",
          flexDirection: "column",
          alignItems: isAr ? "flex-end" : "flex-start",
          justifyContent: "space-between",
          padding: "72px 96px",
          fontFamily: isAr ? '"NotoArabic"' : '"Playfair"',
          position: "relative",
        }}
      >
        {/* Subtle radial glow */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: isAr ? "auto" : "-120px",
            right: isAr ? "-120px" : "auto",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(180,150,90,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Top: wordmark */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: isAr ? "flex-end" : "flex-start",
            gap: "0px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "2px",
              background: "#B49A5E",
              marginBottom: "20px",
            }}
          />
          <div
            style={{
              fontSize: "22px",
              fontWeight: 400,
              color: "#B49A5E",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            {isAr ? "كيمكون" : "KEMCON"}
          </div>
        </div>

        {/* Middle: main copy */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: isAr ? "flex-end" : "flex-start",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: 700,
              color: "#F5EFE2",
              lineHeight: 1.1,
              maxWidth: "800px",
              textAlign: isAr ? "right" : "left",
            }}
          >
            {isAr ? "أقمشة ومفروشات فاخرة" : "Premium Fabrics\n& Furnishings"}
          </div>
          <div
            style={{
              fontSize: "22px",
              fontWeight: 400,
              color: "rgba(245,239,226,0.5)",
              letterSpacing: "0.02em",
            }}
          >
            {isAr
              ? "موثوقة من أرقى الفنادق في الشرق الأوسط"
              : "Trusted by luxury hotels across the Middle East"}
          </div>
        </div>

        {/* Bottom: established line */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "16px",
            width: "100%",
            justifyContent: isAr ? "flex-end" : "flex-start",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "1px",
              background: "rgba(180,154,94,0.5)",
            }}
          />
          <div
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "rgba(245,239,226,0.35)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            {isAr ? "منذ ١٩٨٥" : "EST. 1985"}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        ...(playfairData ? [{ name: "Playfair", data: playfairData, style: "normal" as const, weight: 700 }] : []),
        ...(notoArabicData
          ? [
              { name: "NotoArabic", data: notoArabicData, style: "normal" as const, weight: 400 },
              { name: "NotoArabic", data: notoArabicData, style: "normal" as const, weight: 700 },
            ]
          : []),
      ],
    }
  );
}

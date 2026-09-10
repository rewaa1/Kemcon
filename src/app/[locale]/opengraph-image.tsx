import { ImageResponse } from "next/og";
import { loadOgFonts, ogFallbackImage, ogFontFamily } from "@/lib/ogFonts";
import { rtlText } from "@/lib/ogText";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function renderLocaleOgImage(locale: string) {
  const isAr = locale === "ar";

  const fonts = await loadOgFonts(isAr);

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
          fontFamily: ogFontFamily(isAr),
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
            {isAr ? rtlText("أقمشة ومفروشات فاخرة", true) : "Premium Fabrics\n& Furnishings"}
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
            {isAr ? rtlText("منذ ١٩٨٥", true) : "EST. 1985"}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    }
  );
}

/**
 * Same guard as `/api/og`: buffer the render so a satori failure is thrown
 * where it can be caught, and answer with the static card rather than a 500.
 * This route is what `og:image` points at for the homepage and for any page
 * without its own card, so it is the one a crawler hits most.
 */
export default async function OGImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  try {
    const response = await renderLocaleOgImage(locale);
    const body = await response.arrayBuffer();
    return new Response(body, {
      status: 200,
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    console.error("Locale OG image render failed", error);
    const fallback = await ogFallbackImage();
    if (fallback) return fallback;
    throw error;
  }
}

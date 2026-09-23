import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { Playfair_Display, Inter, Noto_Sans_Arabic, Noto_Kufi_Arabic } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JsonLd } from "@/components/seo/JsonLd";
import { CurtainRevealClient } from "@/components/ui/CurtainRevealClient";
import { SITE_URL } from "@/lib/metadata";
import { INTRO_COOKIE, KEMCON_EMAIL, KEMCON_PHONE_TEL } from "@/lib/config";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-arabic",
  display: "swap",
});

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  variable: "--font-noto-kufi-arabic",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0D0B14",
};

/**
 * Search Console's ownership token. Read from the environment rather than
 * committed: it is not a secret, but it is per-property, and a fork or a
 * preview deploy claiming the production property is not useful. Absent means
 * no tag is emitted at all — an empty `content` reads as a failed check.
 */
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  title: "Kemcon",
  description: "Premium Fabrics & Furnishings",
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/icons/icon-180.png", sizes: "180x180", type: "image/png" }],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const locale = headersList.get("X-NEXT-INTL-LOCALE") ?? "en";
  const direction = locale === "ar" ? "rtl" : "ltr";
  const introSeen = (await cookies()).has(INTRO_COOKIE);

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${playfair.variable} ${inter.variable} ${notoSansArabic.variable} ${notoKufiArabic.variable}`}
      {...(introSeen ? {} : { "data-curtain": "1" })}
      suppressHydrationWarning
    >
      <head>
        {/* data-curtain is rendered onto <html> above, so this paints before any body content */}
        <style dangerouslySetInnerHTML={{ __html: `html[data-curtain]::before{content:'';position:fixed;inset:0;background:#111318;z-index:9998;pointer-events:none}` }} />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased" suppressHydrationWarning>
        <JsonLd
          schema={[
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${SITE_URL}/#org`,
              name: "Kemcon",
              url: SITE_URL,
              foundingDate: "1985",
              // 512px, not the 32px favicon this used to point at: Google
              // ignores an Organization logo below 112x112, so the logo rich
              // result was silently never eligible. Dimensions are stated so
              // the crawler does not have to fetch the file to learn them.
              logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/icons/icon-512.png`,
                width: 512,
                height: 512,
              },
              sameAs: [
                "https://web.facebook.com/profile.php?id=100076584950929",
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Cairo",
                addressCountry: "EG",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: KEMCON_PHONE_TEL,
                email: KEMCON_EMAIL,
                contactType: "customer service",
                areaServed: ["EG", "SA", "AE", "JO"],
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              url: SITE_URL,
              name: "Kemcon",
              publisher: { "@id": `${SITE_URL}/#org` },
            },
          ]}
        />
        <CurtainRevealClient />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}

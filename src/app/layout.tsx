import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Playfair_Display, Inter, Noto_Sans_Arabic, Noto_Kufi_Arabic } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/metadata";
import { KEMCON_EMAIL, KEMCON_PHONE_TEL } from "@/lib/config";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-sans-arabic",
  display: "swap",
});

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-kufi-arabic",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0D0B14",
};

export const metadata: Metadata = {
  title: "Kemcon",
  description: "Premium Fabrics & Furnishings",
  icons: {
    icon: [
      { url: "/favicon.png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.png",
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

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${playfair.variable} ${inter.variable} ${notoSansArabic.variable} ${notoKufiArabic.variable}`}
    >
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
              logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/favicon.png`,
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
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}

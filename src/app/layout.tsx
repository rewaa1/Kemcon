import type { Metadata } from "next";
import { headers } from "next/headers";
import { Playfair_Display, Inter, Noto_Sans_Arabic, Noto_Kufi_Arabic } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
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

export const metadata: Metadata = {
  title: "Kemcon",
  description: "Premium Fabrics & Furnishings",
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
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}

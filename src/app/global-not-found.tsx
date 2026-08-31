import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Playfair_Display, Inter, Noto_Sans_Arabic, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";

/**
 * The 404 for URLs that match no route at all.
 *
 * This exists because the root layout lives under `[locale]`: an unmatched URL
 * never resolves that segment, so Next cannot compose the localized
 * `[locale]/not-found.tsx` and would otherwise serve its own unstyled page.
 * Enabled by `experimental.globalNotFound` in next.config.ts.
 *
 * Next skips normal rendering for this file, so it has to carry its own
 * `<html>`, fonts, and global styles — nothing from the layouts applies here.
 *
 * `[locale]/not-found.tsx` still handles `notFound()` thrown inside a matched
 * locale route, where the layout and its chrome are available.
 */

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
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

export async function generateMetadata(): Promise<Metadata> {
  const isAr = (await headers()).get("X-NEXT-INTL-LOCALE") === "ar";
  return {
    title: isAr ? "الصفحة غير موجودة | كيمكون" : "Page not found | Kemcon",
    description: isAr
      ? "الصفحة التي تبحث عنها غير موجودة أو نُقلت إلى عنوان آخر."
      : "The page you're looking for doesn't exist or has been moved.",
  };
}

export default async function GlobalNotFound() {
  // Set by the next-intl proxy, the same way the root layout reads it. An
  // unmatched URL may not carry one, so fall back to the default locale.
  const headersList = await headers();
  const locale = headersList.get("X-NEXT-INTL-LOCALE") ?? "en";
  const isAr = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isAr ? "rtl" : "ltr"}
      className={`${playfair.variable} ${inter.variable} ${notoSansArabic.variable} ${notoKufiArabic.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen flex flex-col bg-background text-foreground antialiased"
        suppressHydrationWarning
      >
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-secondary)] px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--color-accent)]">
                404
              </p>
              <div className="w-8 h-px bg-[var(--color-accent)]/40 mx-auto" />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-[var(--color-heading)]">
                {isAr ? "الصفحة غير موجودة" : "Page not found"}
              </h1>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xs mx-auto">
                {isAr
                  ? "الصفحة التي تبحث عنها غير موجودة أو نُقلت إلى عنوان آخر."
                  : "The page you're looking for doesn't exist or has been moved."}
              </p>
            </div>

            {/* Plain anchors: this page renders outside the router, so
                next/link would have no router context to prefetch against. */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`/${locale}`}
                className="px-6 py-2.5 rounded-sm text-sm font-semibold bg-[var(--color-accent)] text-[var(--color-dark)] hover:bg-[var(--color-accent-hover)] transition-colors"
              >
                {isAr ? "العودة للرئيسية" : "Back to home"}
              </a>
              <a
                href={`/${locale}/products`}
                className="px-6 py-2.5 rounded-sm text-sm font-medium border border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-deep-accent)]/50 transition-colors"
              >
                {isAr ? "تصفح المنتجات" : "Browse products"}
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

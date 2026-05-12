import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://kemcon.com");

function buildLanguageAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `/${locale}${path}`;
  }
  // x-default must be a locale-neutral URL; using the root lets next-intl
  // middleware redirect each visitor to their preferred locale automatically.
  languages["x-default"] = path === "" ? "/" : `/${routing.defaultLocale}${path}`;
  return languages;
}

export function pageAlternates(locale: string, path: string) {
  return {
    canonical: `/${locale}${path}`,
    languages: buildLanguageAlternates(path),
  };
}

function ogLocale(locale: string) {
  return locale === "ar" ? "ar_EG" : "en_US";
}

export async function buildPageMetadata({
  locale,
  path,
  titleKey,
  descriptionKey,
  ogImage,
}: {
  locale: string;
  path: string;
  titleKey: string;
  descriptionKey: string;
  ogImage?: string;
}): Promise<Metadata> {
  const t = await getTranslations({ locale });
  const title = t(titleKey);
  const description = t(descriptionKey);

  const ogImageUrl = ogImage
    ? `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&image=${encodeURIComponent(ogImage)}&locale=${locale}`
    : `/${locale}/opengraph-image`;

  return {
    title,
    description,
    alternates: pageAlternates(locale, path),
    openGraph: {
      type: "website",
      siteName: "Kemcon",
      locale: ogLocale(locale),
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_EG"],
      url: `${SITE_URL}/${locale}${path}`,
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

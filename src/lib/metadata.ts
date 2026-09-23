import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

/**
 * The live site. `kemcon.site` 308s here, so this is the only origin that
 * should ever appear in a canonical, an hreflang alternate, an Open Graph URL
 * or the sitemap.
 */
const PRODUCTION_ORIGIN = "https://www.kemcon.site";

/**
 * Where this deployment thinks it lives.
 *
 * `NEXT_PUBLIC_SITE_URL` wins, as it always did — but with two guards that the
 * old one-liner lacked.
 *
 * The first is `VERCEL_URL`. Vercel sets it to the *per-deployment* hostname
 * (`kemcon-a1b2c3.vercel.app`), so using it as a production fallback published
 * canonicals for a throwaway URL and split ranking across two domains. It is
 * now consulted only on preview builds, where a self-referencing preview URL
 * is the correct answer.
 *
 * The second is the vercel.app check. A production build that has somehow been
 * handed a vercel.app origin is misconfigured, and quietly emitting it is far
 * worse than ignoring it: every canonical on the site would disown the real
 * domain. In production we fall back to the domain we know is real.
 */
function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  const isProduction =
    process.env.VERCEL_ENV === "production" ||
    (!process.env.VERCEL_ENV && process.env.NODE_ENV === "production");

  if (configured && !(isProduction && configured.includes(".vercel.app"))) {
    return configured;
  }
  if (!isProduction && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return PRODUCTION_ORIGIN;
}

export const SITE_URL = resolveSiteUrl();

function buildLanguageAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `/${locale}${path}`;
  }
  // x-default is the English URL, matching what `sitemap.ts` emits for the
  // same page. It used to be the bare root for the homepage only, which meant
  // the HTML and the sitemap disagreed about that one page — and pointed
  // x-default at a URL that 307s rather than one that answers 200.
  languages["x-default"] = `/${routing.defaultLocale}${path}`;
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

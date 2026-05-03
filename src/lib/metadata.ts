import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://kemcon.com";

function buildLanguageAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `/${locale}${path}`;
  }
  languages["x-default"] = `/${routing.defaultLocale}${path}`;
  return languages;
}

export function pageAlternates(locale: string, path: string) {
  return {
    canonical: `/${locale}${path}`,
    languages: buildLanguageAlternates(path),
  };
}

export async function buildPageMetadata({
  locale,
  path,
  titleKey,
  descriptionKey,
}: {
  locale: string;
  path: string;
  titleKey: string;
  descriptionKey: string;
}): Promise<Metadata> {
  const t = await getTranslations({ locale });
  return {
    title: t(titleKey),
    description: t(descriptionKey),
    alternates: pageAlternates(locale, path),
  };
}

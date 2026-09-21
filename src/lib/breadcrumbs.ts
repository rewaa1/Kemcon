import { SITE_URL } from "@/lib/metadata";

/**
 * `BreadcrumbList` for the pages that hang directly off the locale root.
 *
 * The service pages build their own inline, because each one already assembles
 * a schema array and its trail is three deep. These four are one deep and
 * identical in shape, so they share this rather than repeating the same six
 * lines four times and drifting apart the way the metadata strings did before
 * `productSeo.ts` collected them.
 *
 * Home is prepended here rather than passed in: every trail on the site starts
 * there, and a caller that forgot it would publish a breadcrumb that begins
 * halfway down the site.
 */

export interface Crumb {
  name: { en: string; ar: string };
  /** Path beneath the locale, e.g. `/services`. */
  path: string;
}

const HOME: Crumb = { name: { en: "Home", ar: "الرئيسية" }, path: "" };

export function breadcrumbSchema(locale: string, trail: Crumb[]) {
  const lang = locale === "ar" ? "ar" : "en";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [HOME, ...trail].map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name[lang],
      item: `${SITE_URL}/${locale}${crumb.path}`,
    })),
  };
}

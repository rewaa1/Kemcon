import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { buildPageMetadata, SITE_URL } from "@/lib/metadata";
import dynamic from "next/dynamic";
import { JsonLd } from "@/components/seo/JsonLd";

const ServicesClient = dynamic(() => import("./services-client"));
import { productCategories } from "@/data/productCategories";

/**
 * Without this the hub inherited the locale layout's metadata wholesale — so
 * `/en/services` served the homepage's title and description and, worse, its
 * canonical, telling Google the section hub was a duplicate of `/`. The
 * translations were written and sitting unused the whole time.
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/services",
    titleKey: "meta.pages.services.title",
    descriptionKey: "meta.pages.services.description",
    ogImage: "cards/fabrics.jpg",
  });
}

export default async function ServicesPage() {
  const locale = await getLocale();
  const base = `${SITE_URL}/${locale}`;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Kemcon Services",
    itemListElement: productCategories.map(({ name, path }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      url: `${base}${path}`,
    })),
  };

  return (
    <>
      <JsonLd schema={itemListSchema} />
      <ServicesClient />
    </>
  );
}

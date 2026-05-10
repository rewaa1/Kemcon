import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { buildPageMetadata, SITE_URL } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import ProductsClient from "./products-client";
import { productCategories } from "@/data/productCategories";

export default async function ProductsPage() {
  const locale = await getLocale();
  const base = `${SITE_URL}/${locale}`;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Kemcon Product Categories",
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
      <ProductsClient />
    </>
  );
}

import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { buildPageMetadata, SITE_URL } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import ProductsClient from "./products-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/products",
    titleKey: "meta.pages.products.title",
    descriptionKey: "meta.pages.products.description",
  });
}

const productCategories = [
  { name: "Bespoke Curtains", path: "/products/curtains" },
  { name: "Custom Chairs", path: "/products/chairs" },
  { name: "Bespoke Sofas", path: "/products/sofas" },
  { name: "Premium Bed Sheets", path: "/products/bed-sheets" },
  { name: "Custom Solutions", path: "/products/custom" },
  { name: "Configure a Product", path: "/products/configure" },
  { name: "Fabric Showroom", path: "/products/showroom" },
  { name: "Design & Plan", path: "/products/design-plan" },
  { name: "Mass Production", path: "/products/mass-production" },
];

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

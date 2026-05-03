import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/metadata";
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

export default function ProductsPage() {
  return <ProductsClient />;
}

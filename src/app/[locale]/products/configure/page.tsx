import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { buildPageMetadata } from "@/lib/metadata";

const ConfigureClient = dynamic(() => import("./configure-client"));

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/products/configure",
    titleKey: "meta.pages.configure.title",
    descriptionKey: "meta.pages.configure.description",
    ogImage: "cards/configure-product-card.jpg",
  });
}

export default function ConfigurePage() {
  return <ConfigureClient />;
}

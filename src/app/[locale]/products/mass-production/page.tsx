import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { buildPageMetadata } from "@/lib/metadata";

const MassProductionClient = dynamic(() => import("./mass-production-client"));

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/products/mass-production",
    titleKey: "meta.pages.massProduction.title",
    descriptionKey: "meta.pages.massProduction.description",
    ogImage: "cards/configure-product-card.jpg",
  });
}

export default function MassProductionPage() {
  return <MassProductionClient />;
}

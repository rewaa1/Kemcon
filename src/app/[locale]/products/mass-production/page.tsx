import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/metadata";
import MassProductionClient from "./mass-production-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/products/mass-production",
    titleKey: "meta.pages.massProduction.title",
    descriptionKey: "meta.pages.massProduction.description",
  });
}

export default function MassProductionPage() {
  return <MassProductionClient />;
}

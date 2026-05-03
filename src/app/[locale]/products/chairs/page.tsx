import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ConfiguratorShell } from "@/components/products/configurator/ConfiguratorShell";
import { buildPageMetadata } from "@/lib/metadata";

interface PageProps {
  searchParams: Promise<{ fabric?: string; fabricFamily?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/products/chairs",
    titleKey: "meta.pages.chairs.title",
    descriptionKey: "meta.pages.chairs.description",
  });
}

export default async function ChairsPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const isAr = locale === "ar";
  const { fabric, fabricFamily } = await searchParams;

  return (
    <ConfiguratorShell
      category="chairs"
      categoryLabel={isAr ? "كراسي" : "Chairs"}
      locale={locale}
      initialFabricId={fabric}
      initialFabricFamilyId={fabricFamily}
    />
  );
}

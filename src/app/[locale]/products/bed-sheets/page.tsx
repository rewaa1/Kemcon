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
    path: "/products/bed-sheets",
    titleKey: "meta.pages.bedSheets.title",
    descriptionKey: "meta.pages.bedSheets.description",
  });
}

export default async function BedSheetsPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const isAr = locale === "ar";
  const { fabric, fabricFamily } = await searchParams;

  return (
    <ConfiguratorShell
      category="bed-sheets"
      categoryLabel={isAr ? "ملاءات سرير" : "Bed Sheets"}
      locale={locale}
      initialFabricId={fabric}
      initialFabricFamilyId={fabricFamily}
    />
  );
}

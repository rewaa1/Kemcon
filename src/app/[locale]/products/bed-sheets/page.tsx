import { getLocale } from "next-intl/server";
import { ConfiguratorShell } from "@/components/products/configurator/ConfiguratorShell";

interface PageProps {
  searchParams: Promise<{ fabric?: string; fabricFamily?: string }>;
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

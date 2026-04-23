"use client";

import { useLocale } from "next-intl";
import { ConfiguratorShell } from "@/components/products/configurator/ConfiguratorShell";

export default function BedSheetsPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <ConfiguratorShell
      category="bed-sheets"
      categoryLabel={isAr ? "ملاءات سرير" : "Bed Sheets"}
      locale={locale}
    />
  );
}

"use client";

import { useLocale } from "next-intl";
import { ConfiguratorShell } from "@/components/products/configurator/ConfiguratorShell";

export default function ChairsPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <ConfiguratorShell
      category="chairs"
      categoryLabel={isAr ? "كراسي" : "Chairs"}
      locale={locale}
    />
  );
}

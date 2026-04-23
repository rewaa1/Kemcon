"use client";

import { useLocale } from "next-intl";
import { ConfiguratorShell } from "@/components/products/configurator/ConfiguratorShell";

export default function SofasPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <ConfiguratorShell
      category="sofas"
      categoryLabel={isAr ? "أرائك" : "Sofas"}
      locale={locale}
    />
  );
}

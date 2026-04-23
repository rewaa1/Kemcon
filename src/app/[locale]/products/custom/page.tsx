"use client";

import { useLocale } from "next-intl";
import { ConfiguratorShell } from "@/components/products/configurator/ConfiguratorShell";

export default function CustomPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <ConfiguratorShell
      category="custom"
      categoryLabel={isAr ? "حل مخصص" : "Custom Solution"}
      locale={locale}
    />
  );
}

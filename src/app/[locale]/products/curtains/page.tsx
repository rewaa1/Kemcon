"use client";

import { useLocale } from "next-intl";
import { ConfiguratorShell } from "@/components/products/configurator/ConfiguratorShell";

export default function CurtainsPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <ConfiguratorShell
      category="curtains"
      categoryLabel={isAr ? "ستائر" : "Curtains"}
      locale={locale}
    />
  );
}

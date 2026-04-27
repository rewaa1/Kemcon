import { getLocale } from "next-intl/server";
import { ConfiguratorShell } from "@/components/products/configurator/ConfiguratorShell";

interface PageProps {
  searchParams: Promise<{ fabric?: string; fabricFamily?: string }>;
}

export default async function CurtainsPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const isAr = locale === "ar";
  const { fabric, fabricFamily } = await searchParams;

  return (
    <ConfiguratorShell
      category="curtains"
      categoryLabel={isAr ? "ستائر" : "Curtains"}
      locale={locale}
      initialFabricId={fabric}
      initialFabricFamilyId={fabricFamily}
    />
  );
}

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
    path: "/products/curtains",
    titleKey: "meta.pages.curtains.title",
    descriptionKey: "meta.pages.curtains.description",
  });
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

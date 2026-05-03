import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ConfiguratorShell } from "@/components/products/configurator/ConfiguratorShell";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/products/custom",
    titleKey: "meta.pages.custom.title",
    descriptionKey: "meta.pages.custom.description",
  });
}

export default async function CustomPage() {
  const locale = await getLocale();
  const isAr = locale === "ar";

  return (
    <ConfiguratorShell
      category="custom"
      categoryLabel={isAr ? "حل مخصص" : "Custom Solution"}
      locale={locale}
    />
  );
}

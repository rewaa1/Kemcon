import { getLocale } from "next-intl/server";
import { ConfiguratorShell } from "@/components/products/configurator/ConfiguratorShell";

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

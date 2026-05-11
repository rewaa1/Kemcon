import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ConfiguratorShell } from "@/components/products/configurator/ConfiguratorShell";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { buildPageMetadata, SITE_URL } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";

interface PageProps {
  searchParams: Promise<{ fabric?: string; fabricFamily?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/products/chairs",
    titleKey: "meta.pages.chairs.title",
    descriptionKey: "meta.pages.chairs.description",
    ogImage: "cards/chairs.jpg",
  });
}

export default async function ChairsPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const isAr = locale === "ar";
  const { fabric, fabricFamily } = await searchParams;

  const pageUrl = `${SITE_URL}/${locale}/products/chairs`;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: isAr ? "الرئيسية" : "Home", item: `${SITE_URL}/${locale}` },
        { "@type": "ListItem", position: 2, name: isAr ? "المنتجات" : "Products", item: `${SITE_URL}/${locale}/products` },
        { "@type": "ListItem", position: 3, name: isAr ? "كراسي" : "Chairs", item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: isAr ? "كراسي مخصصة" : "Custom Chairs",
      description: isAr
        ? "كراسي مخصصة بالكامل من كيمكون — اختر مادة الإطار والتشطيب وصلابة الحشو وقماش التنجيد لمشاريع الضيافة أو السكنية."
        : "Fully custom chairs from Kemcon — choose your frame material, finish, filling firmness, and upholstery fabric for hospitality or residential projects.",
      url: pageUrl,
      brand: { "@type": "Brand", name: "Kemcon" },
      offers: { "@type": "Offer", url: pageUrl, availability: "https://schema.org/InStoreOnly", seller: { "@type": "Organization", name: "Kemcon" } },
    },
  ];

  return (
    <>
      <JsonLd schema={schemas} />
      <ErrorBoundary>
        <ConfiguratorShell
          category="chairs"
          categoryLabel={isAr ? "كراسي" : "Chairs"}
          locale={locale}
          initialFabricId={fabric}
          initialFabricFamilyId={fabricFamily}
        />
      </ErrorBoundary>
    </>
  );
}

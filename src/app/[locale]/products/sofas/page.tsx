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
    path: "/products/sofas",
    titleKey: "meta.pages.sofas.title",
    descriptionKey: "meta.pages.sofas.description",
    ogImage: "cards/sofas.jpg",
  });
}

export default async function SofasPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const isAr = locale === "ar";
  const { fabric, fabricFamily } = await searchParams;

  const pageUrl = `${SITE_URL}/${locale}/products/sofas`;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: isAr ? "الرئيسية" : "Home", item: `${SITE_URL}/${locale}` },
        { "@type": "ListItem", position: 2, name: isAr ? "المنتجات" : "Products", item: `${SITE_URL}/${locale}/products` },
        { "@type": "ListItem", position: 3, name: isAr ? "أرائك" : "Sofas", item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: isAr ? "أرائك مخصصة" : "Bespoke Sofas",
      description: isAr
        ? "أرائك مخصصة تُبنى من الصفر بواسطة كيمكون — اختر كل عنصر من خشب الإطار إلى القماش والنمط النهائي، مصنوعة لأي مساحة."
        : "Bespoke sofas built from scratch by Kemcon — select every element from the frame wood to the final fabric and pattern, made for any space.",
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
          category="sofas"
          categoryLabel={isAr ? "أرائك" : "Sofas"}
          locale={locale}
          initialFabricId={fabric}
          initialFabricFamilyId={fabricFamily}
        />
      </ErrorBoundary>
    </>
  );
}

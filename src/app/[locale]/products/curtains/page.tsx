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
    path: "/products/curtains",
    titleKey: "meta.pages.curtains.title",
    descriptionKey: "meta.pages.curtains.description",
  });
}

export default async function CurtainsPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const isAr = locale === "ar";
  const { fabric, fabricFamily } = await searchParams;

  const pageUrl = `${SITE_URL}/${locale}/products/curtains`;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: isAr ? "الرئيسية" : "Home", item: `${SITE_URL}/${locale}` },
        { "@type": "ListItem", position: 2, name: isAr ? "المنتجات" : "Products", item: `${SITE_URL}/${locale}/products` },
        { "@type": "ListItem", position: 3, name: isAr ? "ستائر" : "Curtains", item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: isAr ? "ستائر مخصصة" : "Bespoke Curtains",
      description: isAr
        ? "ستائر مخصصة بمئات الأقمشة — شفافة، وعازلة للضوء، ومخمل، وكتان، والمزيد. يدوية أو متحكم بها عن بُعد، مصنوعة بمقاساتك."
        : "Bespoke curtains in hundreds of fabrics — sheer, blackout, velvet, linen, and more. Manual or remote-controlled, made to your measurements.",
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
          category="curtains"
          categoryLabel={isAr ? "ستائر" : "Curtains"}
          locale={locale}
          initialFabricId={fabric}
          initialFabricFamilyId={fabricFamily}
        />
      </ErrorBoundary>
    </>
  );
}

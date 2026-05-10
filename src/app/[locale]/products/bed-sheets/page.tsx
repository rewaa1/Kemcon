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
    path: "/products/bed-sheets",
    titleKey: "meta.pages.bedSheets.title",
    descriptionKey: "meta.pages.bedSheets.description",
  });
}

export default async function BedSheetsPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const isAr = locale === "ar";
  const { fabric, fabricFamily } = await searchParams;

  const pageUrl = `${SITE_URL}/${locale}/products/bed-sheets`;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: isAr ? "الرئيسية" : "Home", item: `${SITE_URL}/${locale}` },
        { "@type": "ListItem", position: 2, name: isAr ? "المنتجات" : "Products", item: `${SITE_URL}/${locale}/products` },
        { "@type": "ListItem", position: 3, name: isAr ? "ملاءات سرير" : "Bed Sheets", item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: isAr ? "ملاءات سرير فاخرة" : "Premium Bed Sheets",
      description: isAr
        ? "ملاءات سرير فاخرة من القطن المصري والحرير والساتان والمزيد — بأي لون ونمط من كتالوج كيمكون المختار. راحة بمستوى الفنادق."
        : "Premium bed linen in Egyptian cotton, silk, satin, and more — in any colour and pattern from Kemcon's curated catalog. Hotel-grade comfort.",
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
          category="bed-sheets"
          categoryLabel={isAr ? "ملاءات سرير" : "Bed Sheets"}
          locale={locale}
          initialFabricId={fabric}
          initialFabricFamilyId={fabricFamily}
        />
      </ErrorBoundary>
    </>
  );
}

import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata, SITE_URL } from "@/lib/metadata";
import { productSeo } from "@/data/productSeo";

const ProductEnquiryForm = dynamic(() =>
  import("@/components/products/enquiry/ProductEnquiryForm").then((m) => ({
    default: m.ProductEnquiryForm,
  }))
);

const seo = productSeo["sofas"];

interface PageProps {
  searchParams: Promise<{ fabric?: string; fabricFamily?: string; edit?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: `/products/${seo.slug}`,
    titleKey: `meta.pages.${seo.metaKey}.title`,
    descriptionKey: `meta.pages.${seo.metaKey}.description`,
    ogImage: seo.ogImage,
  });
}

export default async function SofasPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const isAr = locale === "ar";
  const { fabric, fabricFamily, edit } = await searchParams;

  const lang = isAr ? "ar" : "en";
  const pageUrl = `${SITE_URL}/${locale}/products/${seo.slug}`;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: isAr ? "الرئيسية" : "Home", item: `${SITE_URL}/${locale}` },
        { "@type": "ListItem", position: 2, name: isAr ? "المنتجات" : "Products", item: `${SITE_URL}/${locale}/products` },
        { "@type": "ListItem", position: 3, name: seo.name[lang], item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: seo.schemaName[lang],
      description: seo.description[lang],
      url: pageUrl,
      brand: { "@type": "Brand", name: "Kemcon" },
      offers: {
        "@type": "Offer",
        url: pageUrl,
        availability: "https://schema.org/InStoreOnly",
        seller: { "@type": "Organization", name: "Kemcon" },
      },
    },
  ];

  return (
    <>
      <JsonLd schema={schemas} />
      <ErrorBoundary>
        <ProductEnquiryForm
          category="sofas"
          locale={locale}
          initialFabricId={fabric}
          initialFabricFamilyId={fabricFamily}
          editId={edit}
        />
      </ErrorBoundary>
    </>
  );
}

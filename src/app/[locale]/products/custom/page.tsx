import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ConfiguratorShell } from "@/components/products/configurator/ConfiguratorShell";
import { buildPageMetadata, SITE_URL } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";

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

  const pageUrl = `${SITE_URL}/${locale}/products/custom`;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: isAr ? "الرئيسية" : "Home", item: `${SITE_URL}/${locale}` },
        { "@type": "ListItem", position: 2, name: isAr ? "المنتجات" : "Products", item: `${SITE_URL}/${locale}/products` },
        { "@type": "ListItem", position: 3, name: isAr ? "حل مخصص" : "Custom Solution", item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: isAr ? "حلول مخصصة" : "Custom Solutions",
      description: isAr
        ? "هل لديك فكرة فريدة؟ صف رؤيتك وسيقوم فريق كيمكون بصياغة الأقمشة أو التنجيد أو المفروشات وفقًا لمواصفاتك بالضبط."
        : "Have something unique in mind? Describe your vision and Kemcon's team will craft fabrics, upholstery, or furnishings exactly to your specification.",
      url: pageUrl,
      brand: { "@type": "Brand", name: "Kemcon" },
      offers: { "@type": "Offer", url: pageUrl, availability: "https://schema.org/InStoreOnly", seller: { "@type": "Organization", name: "Kemcon" } },
    },
  ];

  return (
    <>
      <JsonLd schema={schemas} />
      <ConfiguratorShell
        category="custom"
        categoryLabel={isAr ? "حل مخصص" : "Custom Solution"}
        locale={locale}
      />
    </>
  );
}

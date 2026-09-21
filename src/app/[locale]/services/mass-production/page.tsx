import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata, SITE_URL } from "@/lib/metadata";

const MassProductionClient = dynamic(() => import("./mass-production-client"));

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/services/mass-production",
    titleKey: "meta.pages.massProduction.title",
    descriptionKey: "meta.pages.massProduction.description",
    ogImage: "cards/configure-product-card.jpg",
  });
}

/**
 * The schema the other service pages have had since the services pass, and
 * this one did not. Kemcon commissions work rather than selling stock, so this
 * is a `Service` with no offer, no price and no rating, and `provider` points
 * at the Organization already declared in the root layout rather than
 * restating it.
 */
export default async function MassProductionPage() {
  const locale = await getLocale();
  const isAr = locale === "ar";
  const pageUrl = `${SITE_URL}/${locale}/services/mass-production`;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: isAr ? "الرئيسية" : "Home", item: `${SITE_URL}/${locale}` },
        { "@type": "ListItem", position: 2, name: isAr ? "الخدمات" : "Services", item: `${SITE_URL}/${locale}/services` },
        { "@type": "ListItem", position: 3, name: isAr ? "الإنتاج بكميات كبيرة" : "Mass Production", item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: isAr ? "الإنتاج بكميات كبيرة" : "Mass Production",
      serviceType: isAr
        ? "التصنيع بكميات كبيرة للستائر والتنجيد ومفروشات السرير"
        : "Volume manufacturing of curtains, upholstery and bed linen",
      description: isAr
        ? "تصنيع الستائر والتنجيد ومفروشات السرير بكميات كبيرة لعقود الضيافة والمطورين في مصر، بمواصفة واحدة تُنفَّذ على العقار بأكمله."
        : "Manufacturing of curtains, upholstery and bed linen at volume for hospitality contracts and developers in Egypt, produced to one specification across a property.",
      url: pageUrl,
      inLanguage: locale,
      provider: { "@id": `${SITE_URL}/#org` },
      areaServed: { "@type": "Country", name: isAr ? "مصر" : "Egypt" },
      audience: {
        "@type": "Audience",
        audienceType: isAr
          ? [
            "الفنادق والضيافة",
            "مطورو العقارات",
            "الشركات والمكاتب",
          ]
          : [
            "Hotels and hospitality",
            "Property developers",
            "Businesses and offices",
          ],
      },
    },
  ];

  return (
    <>
      <JsonLd schema={schemas} />
      <MassProductionClient />
    </>
  );
}

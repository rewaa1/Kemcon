import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata, SITE_URL } from "@/lib/metadata";

const DesignPlanClient = dynamic(() => import("./design-plan-client"));

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/services/design-plan",
    titleKey: "meta.pages.designPlan.title",
    descriptionKey: "meta.pages.designPlan.description",
    ogImage: "images/about-preview.jpg",
  });
}

/**
 * The schema the other service pages have had since the services pass, and
 * this one did not. Kemcon commissions work rather than selling stock, so this
 * is a `Service` with no offer, no price and no rating, and `provider` points
 * at the Organization already declared in the root layout rather than
 * restating it.
 */
export default async function DesignPlanPage() {
  const locale = await getLocale();
  const isAr = locale === "ar";
  const pageUrl = `${SITE_URL}/${locale}/services/design-plan`;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: isAr ? "الرئيسية" : "Home", item: `${SITE_URL}/${locale}` },
        { "@type": "ListItem", position: 2, name: isAr ? "الخدمات" : "Services", item: `${SITE_URL}/${locale}/services` },
        { "@type": "ListItem", position: 3, name: isAr ? "التصميم والتخطيط" : "Design & Plan", item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: isAr ? "التصميم والتخطيط" : "Design & Planning",
      serviceType: isAr
        ? "تخطيط مواصفات الأقمشة والمفروشات الداخلية"
        : "Interior fabric and furnishing specification planning",
      description: isAr
        ? "تخطيط الأقمشة والتشطيبات والمفروشات للفنادق والمنتجعات والمنازل الخاصة في مصر، بقيادة المهندس المعماري لدى كيمكون — لغرفة واحدة أو لعقار بأكمله."
        : "Planning of fabrics, finishes and furnishings for hotels, resorts and private residences in Egypt, led by Kemcon's in-house architect — for a single room or an entire property.",
      url: pageUrl,
      inLanguage: locale,
      provider: { "@id": `${SITE_URL}/#org` },
      areaServed: { "@type": "Country", name: isAr ? "مصر" : "Egypt" },
      audience: {
        "@type": "Audience",
        audienceType: isAr
          ? [
            "الفنادق والمنتجعات",
            "المنازل الخاصة",
            "مصممو الديكور والمعماريون",
          ]
          : [
            "Hotels and resorts",
            "Private residences",
            "Interior designers and architects",
          ],
      },
    },
  ];

  return (
    <>
      <JsonLd schema={schemas} />
      <DesignPlanClient />
    </>
  );
}

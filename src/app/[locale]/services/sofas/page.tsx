import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceIntroHeader } from "@/components/products/enquiry/ServiceIntroHeader";
import {
  ServiceContent,
  ServiceEnquiryHeading,
} from "@/components/products/enquiry/ServiceContent";
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
    path: `/services/${seo.slug}`,
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
  const pageUrl = `${SITE_URL}/${locale}/services/${seo.slug}`;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: isAr ? "الرئيسية" : "Home", item: `${SITE_URL}/${locale}` },
        { "@type": "ListItem", position: 2, name: isAr ? "الخدمات" : "Services", item: `${SITE_URL}/${locale}/services` },
        { "@type": "ListItem", position: 3, name: seo.name[lang], item: pageUrl },
      ],
    },
    /**
     * A `Service`, not a `Product`.
     *
     * This page used to declare a Product with an `Offer` and `InStoreOnly`
     * availability, describing a business Kemcon is not in: nothing here is
     * sold off a shelf at a listed price. `Service` states the true shape of
     * it — work commissioned, specified and made — and drops the offer block
     * rather than fabricating availability. No price, no rating, no reviews:
     * none of that exists to report.
     *
     * `provider` points at the Organization already declared in the root
     * layout instead of restating it, so there is one Kemcon entity on the
     * site rather than a second one that could drift out of sync.
     */
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: seo.schemaName[lang],
      serviceType: isAr
        ? "تصميم الأرائك وتصنيعها وتنجيدها"
        : "Sofa design, manufacture and upholstery",
      description: isAr
        ? "تصميم الأرائك وتصنيعها وتنجيدها حسب الطلب للفنادق والمساحات التجارية والمنازل في مصر — يُحدَّد الهيكل والحشو والقماش كلٌّ على حدة، ويتولى فريق كيمكون التركيب."
        : "Made-to-order sofa design, manufacture and upholstery for hotels, commercial spaces and homes in Egypt — frame, filling and fabric specified separately, with installation by Kemcon's own team.",
      url: pageUrl,
      inLanguage: locale,
      provider: { "@id": `${SITE_URL}/#org` },
      areaServed: { "@type": "Country", name: isAr ? "مصر" : "Egypt" },
      audience: {
        "@type": "Audience",
        audienceType: isAr
          ? [
              "الفنادق والضيافة",
              "الشركات والمكاتب",
              "المنازل",
              "مصممو الديكور والمعماريون",
            ]
          : [
              "Hotels and hospitality",
              "Businesses and offices",
              "Residential",
              "Interior designers and architects",
            ],
      },
    },
  ];

  return (
    <>
      <JsonLd schema={schemas} />
      <div className="min-h-screen bg-[#1A1D24]">
        <ServiceIntroHeader category="sofas" locale={locale} editId={edit} />
        {/*
          Service copy only on the way in. With `?edit=` the visitor is amending
          something they already configured and just wants the form back.
        */}
        {!edit && (
          <>
            <ServiceContent category="sofas" locale={locale} />
            <ServiceEnquiryHeading category="sofas" locale={locale} />
          </>
        )}
        <ErrorBoundary>
          <ProductEnquiryForm
            category="sofas"
            locale={locale}
            initialFabricId={fabric}
            initialFabricFamilyId={fabricFamily}
            editId={edit}
          />
        </ErrorBoundary>
      </div>
    </>
  );
}

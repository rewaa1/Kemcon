import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceIntroHeader } from "@/components/products/enquiry/ServiceIntroHeader";
import { buildPageMetadata, SITE_URL } from "@/lib/metadata";
import { productSeo } from "@/data/productSeo";
import { CurtainsContent } from "./curtains-content";

const ProductEnquiryForm = dynamic(() =>
  import("@/components/products/enquiry/ProductEnquiryForm").then((m) => ({
    default: m.ProductEnquiryForm,
  }))
);

const seo = productSeo["curtains"];

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

export default async function CurtainsPage({ searchParams }: PageProps) {
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
     * This page used to declare a Product with an `Offer` and
     * `InStoreOnly` availability, which described a business Kemcon is not in:
     * nothing here is sold off a shelf at a listed price. `Service` states the
     * true shape of it — work commissioned, specified and installed — and drops
     * the offer block rather than fabricating availability. No price, no
     * rating, no reviews: none of that exists to report.
     *
     * `provider` points at the Organization already declared in the root
     * layout instead of restating it, so there is one Kemcon entity on the site
     * rather than a second one that could drift out of sync.
     */
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: seo.schemaName[lang],
      serviceType: isAr
        ? "تصميم الستائر وتصنيعها وتركيبها"
        : "Curtain design, manufacture and installation",
      // Deliberately not the meta description verbatim — same facts, stated for
      // a machine reader rather than for a search result snippet.
      description: isAr
        ? "تصميم الستائر وتصنيعها وتركيبها بالمقاس للفنادق والمساحات التجارية والمنازل في مصر، بطبقات شفافة وديكورية ومعتمة، وفتح يدوي أو بمحرك، ومعالجات اختيارية للقماش."
        : "Made-to-measure curtain design, manufacture and installation for hotels, commercial spaces and homes in Egypt — sheer, decorative and blackout layers, manual or motorised opening, with optional fabric treatments.",
      url: pageUrl,
      inLanguage: locale,
      provider: { "@id": `${SITE_URL}/#org` },
      areaServed: { "@type": "Country", name: isAr ? "مصر" : "Egypt" },
      audience: {
        "@type": "Audience",
        audienceType: isAr
          ? ["الفنادق والضيافة", "الشركات والمكاتب", "المنازل", "مصممو الديكور والمعماريون"]
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
        <ServiceIntroHeader category="curtains" locale={locale} editId={edit} />
        {/*
          Service copy only on the way in. With `?edit=` the visitor is amending
          something they already configured and just wants the form back.
        */}
        {!edit && (
          <>
            <CurtainsContent locale={locale} />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
              <h2
                className={`text-2xl md:text-3xl font-bold text-[var(--color-heading)] leading-snug ${isAr ? "text-right" : ""}`}
              >
                {isAr ? "اطلب عرض سعر للستائر" : "Request a curtain quote"}
              </h2>
              <p
                className={`text-[var(--color-text-muted)] text-base leading-relaxed max-w-3xl mt-3 ${isAr ? "text-right" : ""}`}
              >
                {isAr
                  ? "ثلاثة أسئلة عن مشروعك وبيانات التواصل — هذا كل المطلوب. أضف المقاسات والقماش والمعالجات إن كنت تعرفها، أو اتركها لنا."
                  : "Three questions about your project and how to reach you — that's all we need. Add measurements, fabric and treatments if you know them, or leave them to us."}
              </p>
            </div>
          </>
        )}
        <ErrorBoundary>
          <ProductEnquiryForm
            category="curtains"
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

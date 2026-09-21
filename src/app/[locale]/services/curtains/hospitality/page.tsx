import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata, SITE_URL } from "@/lib/metadata";
import { HospitalityContent } from "./hospitality-content";

/**
 * `/services/curtains/hospitality` — curtains for hotels and resorts.
 *
 * A sibling of the general curtains page rather than a replacement for it.
 * `/services/curtains` has to serve four audiences at once and cannot lead with
 * hotels without losing the other three; a hotel buyer searching for a curtain
 * supplier is a different visitor with a different question. Phase 2C found
 * this intent has its own search results — service pages and manufacturers,
 * no marketplaces — and that the Arabic side of it is barely contested.
 *
 * Everything indexable is server-rendered. The enquiry form itself stays on
 * `/services/curtains`, so this page carries a CTA rather than a second copy
 * of the form.
 */

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/services/curtains/hospitality",
    titleKey: "meta.pages.hospitalityCurtains.title",
    descriptionKey: "meta.pages.hospitalityCurtains.description",
    ogImage: "cards/curtains.jpg",
  });
}

export default async function HospitalityCurtainsPage() {
  const locale = await getLocale();
  const isAr = locale === "ar";
  const pageUrl = `${SITE_URL}/${locale}/services/curtains/hospitality`;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: isAr ? "الرئيسية" : "Home",
          item: `${SITE_URL}/${locale}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: isAr ? "الخدمات" : "Services",
          item: `${SITE_URL}/${locale}/services`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: isAr ? "ستائر" : "Curtains",
          item: `${SITE_URL}/${locale}/services/curtains`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: isAr ? "ستائر الفنادق والضيافة" : "Hotel & Hospitality Curtains",
          item: pageUrl,
        },
      ],
    },
    /**
     * A `Service` narrowed to hospitality, matching the pattern the other
     * service pages use: no offer, no price, no rating, and `provider` pointing
     * at the Organization already declared in the root layout rather than a
     * second copy of it.
     */
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: isAr ? "ستائر الفنادق والضيافة" : "Hotel & Hospitality Curtains",
      serviceType: isAr
        ? "توريد ستائر الفنادق: التصميم والتصنيع والتركيب"
        : "Hotel curtain supply: design, manufacture and installation",
      description: isAr
        ? "تصميم ستائر الفنادق والمنتجعات وتصنيعها وتركيبها بالمقاس في مصر — طبقات شفافة وديكورية وبلاك اوت لغرف النزلاء والأجنحة والبهو والمطاعم، مع معالجات مقاومة للحريق ومضادة للفطريات وحماية من البقع."
        : "Made-to-measure curtain design, manufacture and installation for hotels and resorts in Egypt — sheer, drapery and blackout layers for guest rooms, suites, lobbies and restaurants, with fire-retardant, anti-fungal and stain-protection finishing.",
      url: pageUrl,
      inLanguage: locale,
      provider: { "@id": `${SITE_URL}/#org` },
      areaServed: { "@type": "Country", name: isAr ? "مصر" : "Egypt" },
      audience: {
        "@type": "Audience",
        audienceType: isAr
          ? [
              "الفنادق والمنتجعات",
              "المطاعم والقاعات",
              "مصممو الديكور والمعماريون",
            ]
          : [
              "Hotels and resorts",
              "Restaurants and venues",
              "Interior designers and architects",
            ],
      },
      isPartOf: { "@id": `${SITE_URL}/${locale}/services/curtains#service` },
    },
  ];

  return (
    <>
      <JsonLd schema={schemas} />
      <div className="min-h-screen bg-[#1A1D24]">
        {/* Header — the same shape as every other service page's opening. */}
        <section className="relative py-20 md:py-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[260px] rounded-full blur-[100px] opacity-[0.08] bg-[#c8a45a]" />
          </div>
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn direction="up">
              <Link
                href={`/${locale}/services/curtains`}
                className={`inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-8 ${isAr ? "flex-row-reverse" : ""}`}
              >
                {isAr ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
                {isAr ? "كل حلول الستائر" : "All curtain solutions"}
              </Link>
            </FadeIn>
            <FadeIn direction="up" delay={0.05}>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c8a45a] mb-4">
                {isAr ? "الضيافة" : "Hospitality"}
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.1}>
              <h1
                className={`text-4xl md:text-5xl font-bold text-[var(--color-heading)] leading-tight mb-4 max-w-3xl ${isAr ? "text-right" : ""}`}
              >
                {isAr
                  ? "حلول ستائر الفنادق والضيافة في مصر"
                  : "Hotel & Hospitality Curtain Solutions in Egypt"}
              </h1>
            </FadeIn>
            <FadeIn direction="up" delay={0.15}>
              <p
                className={`text-[var(--color-text-muted)] text-base leading-relaxed max-w-2xl ${isAr ? "text-right" : ""}`}
              >
                {isAr
                  ? "تفصّل كيمكون ستائر الفنادق والمنتجعات بالمقاس وتركّبها في مصر — من غرف النزلاء والأجنحة إلى البهو والمطاعم. القماش يُنتج في مصنعنا، ويُشطَّب بالمعالجات التي يتطلبها العقار، ويتولى فريقنا تركيبه."
                  : "Kemcon makes and installs curtains for hotels and resorts across Egypt — from guest rooms and suites to lobbies and restaurants. The fabric is produced in our own factory, finished to the treatments the property requires, and hung by our own team."}
              </p>
            </FadeIn>
          </div>
        </section>

        <HospitalityContent locale={locale} />
        <div className="pb-24" />
      </div>
    </>
  );
}

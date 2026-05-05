import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { buildPageMetadata, SITE_URL } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import AboutClient from "./about-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/about",
    titleKey: "meta.pages.about.title",
    descriptionKey: "meta.pages.about.description",
  });
}

export default async function AboutPage() {
  const locale = await getLocale();
  const isAr = locale === "ar";

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/${locale}/about`,
    url: `${SITE_URL}/${locale}/about`,
    name: isAr ? "عن كيمكون" : "About Us",
    description: isAr
      ? "تأسست كيمكون عام 1985 لتقديم الأقمشة والمفروشات الفاخرة لأرقى الفنادق والمنازل في الشرق الأوسط — بخبرة حرفية تمتد لأربعين عامًا."
      : "Established in 1985, Kemcon crafts premium fabrics and furnishings for elite hotels and homes across the Middle East — backed by 40 years of artisanal expertise.",
    about: { "@id": `${SITE_URL}/#org` },
  };

  return (
    <>
      <JsonLd schema={aboutSchema} />
      <AboutClient />
    </>
  );
}

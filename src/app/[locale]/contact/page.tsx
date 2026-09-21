import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { buildPageMetadata, SITE_URL } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/breadcrumbs";
import { KEMCON_EMAIL, KEMCON_PHONE_TEL } from "@/lib/config";
import { JsonLd } from "@/components/seo/JsonLd";
import ContactClient from "./contact-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/contact",
    titleKey: "meta.pages.contact.title",
    descriptionKey: "meta.pages.contact.description",
    ogImage: "images/contact-hero.jpg",
  });
}

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: "Kemcon",
  url: SITE_URL,
  telephone: KEMCON_PHONE_TEL,
  email: KEMCON_EMAIL,
  foundingDate: "1985",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cairo",
    addressCountry: "EG",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
};

export default async function ContactPage() {
  // The business record above is locale-independent and stays at module scope.
  // The breadcrumb is not — its labels are translated — so it is built here.
  const locale = await getLocale();
  const crumbs = breadcrumbSchema(locale, [
    { name: { en: "Contact Us", ar: "تواصل معنا" }, path: "/contact" },
  ]);

  return (
    <>
      <JsonLd schema={[crumbs, localBusinessSchema]} />
      <ContactClient />
    </>
  );
}

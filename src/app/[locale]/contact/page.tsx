import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { buildPageMetadata, SITE_URL } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import ContactClient from "./contact-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/contact",
    titleKey: "meta.pages.contact.title",
    descriptionKey: "meta.pages.contact.description",
  });
}

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: "Kemcon",
  url: SITE_URL,
  telephone: "+20-12-23122276",
  email: "kemcon@yahoo.com",
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

export default function ContactPage() {
  return (
    <>
      <JsonLd schema={localBusinessSchema} />
      <ContactClient />
    </>
  );
}

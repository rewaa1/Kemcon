import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { buildPageMetadata, SITE_URL } from "@/lib/metadata";
import { getFeaturedClients } from "@/lib/showcaseClients";
import { breadcrumbSchema } from "@/lib/breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";

const ClientsClient = dynamic(() => import("./clients-client"));

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/clients",
    titleKey: "meta.pages.clients.title",
    descriptionKey: "meta.pages.clients.description",
    ogImage: "images/clients-hero.jpg",
  });
}

export default async function ClientsPage() {
  const featuredClients = await getFeaturedClients();
  const locale = await getLocale();
  const isAr = locale === "ar";

  /**
   * The client roster as structured data.
   *
   * This page's substance is a list of named properties in named cities, which
   * is exactly the kind of thing an answer engine quotes and a crawler cannot
   * infer from prose. The cards render the names in server HTML already; this
   * states plainly what the list *is*, so "which hotels does Kemcon supply" has
   * a machine-readable answer rather than one inferred from card markup.
   *
   * Modelled as a CollectionPage whose main entity is a list of `Hotel`s, not
   * as Kemcon's offerings — Kemcon is a manufacturer, and the Organization
   * schema in the root layout says so. These are its customers.
   */
  const rosterSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: isAr ? "عملاء كمكون" : "Kemcon Clients",
    url: `${SITE_URL}/${locale}/clients`,
    description: isAr
      ? "الفنادق والمنتجعات التي زودتها كمكون بالمفروشات."
      : "Hotels and resorts Kemcon has supplied with furnishings.",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: featuredClients.length,
      itemListElement: featuredClients.map((client, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Hotel",
          name: client.name,
          address: {
            "@type": "PostalAddress",
            addressLocality: client.region.split(",")[0]?.trim(),
            addressCountry: client.region.split(",").pop()?.trim(),
          },
        },
      })),
    },
  };

  const crumbs = breadcrumbSchema(locale, [
    { name: { en: "Clients", ar: "عملاؤنا" }, path: "/clients" },
  ]);

  return (
    <>
      <JsonLd schema={[crumbs, rosterSchema]} />
      <ClientsClient featuredClients={featuredClients} />
    </>
  );
}

import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { buildPageMetadata } from "@/lib/metadata";

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

export default function ClientsPage() {
  return <ClientsClient />;
}

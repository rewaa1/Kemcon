import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/metadata";
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

export default function ContactPage() {
  return <ContactClient />;
}

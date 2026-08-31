import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/metadata";
import { LegalDocument } from "@/components/legal/LegalDocument";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/terms",
    titleKey: "meta.pages.terms.title",
    descriptionKey: "meta.pages.terms.description",
  });
}

export default function TermsConditionsPage() {
  return <LegalDocument namespace="terms" />;
}

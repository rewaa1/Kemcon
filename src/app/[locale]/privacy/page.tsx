import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/metadata";
import { LegalDocument } from "@/components/legal/LegalDocument";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/privacy",
    titleKey: "meta.pages.privacy.title",
    descriptionKey: "meta.pages.privacy.description",
  });
}

export default function PrivacyPolicyPage() {
  return <LegalDocument namespace="privacy" />;
}

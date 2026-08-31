import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { buildPageMetadata } from "@/lib/metadata";

const BriefClient = dynamic(() => import("./brief-client"));

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const base = await buildPageMetadata({
    locale,
    path: "/products/brief",
    titleKey: "meta.pages.brief.title",
    descriptionKey: "meta.pages.brief.description",
  });

  // The brief is per-visitor working state with no content to index, and it is
  // deliberately absent from the sitemap for the same reason.
  return { ...base, robots: { index: false, follow: true } };
}

export default function BriefPage() {
  return (
    <ErrorBoundary>
      <BriefClient />
    </ErrorBoundary>
  );
}

import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/metadata";
import { Hero } from "@/components/sections/Hero";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { ProductHighlights } from "@/components/sections/ProductHighlights";
import { WhyKemcon } from "@/components/sections/WhyKemcon";
import { CTABanner } from "@/components/sections/CTABanner";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/",
    titleKey: "meta.title",
    descriptionKey: "meta.description",
  });
}

export default function HomePage() {
  return (
    <div className="flex flex-col ">
      <Hero />
      <AboutPreview />
      <ProductHighlights />
      <WhyKemcon />
      <CTABanner />
    </div>
  );
}

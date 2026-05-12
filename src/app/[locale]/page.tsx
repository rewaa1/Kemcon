import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { buildPageMetadata } from "@/lib/metadata";
import { Hero } from "@/components/sections/Hero";
import { LazySection } from "@/components/shared/LazySection";

const AboutPreview = dynamic(
  () => import("@/components/sections/AboutPreview").then((m) => ({ default: m.AboutPreview })),
  { ssr: false }
);
const ProductHighlights = dynamic(
  () => import("@/components/sections/ProductHighlights").then((m) => ({ default: m.ProductHighlights })),
  { ssr: false }
);
const WhyKemcon = dynamic(
  () => import("@/components/sections/WhyKemcon").then((m) => ({ default: m.WhyKemcon })),
  { ssr: false }
);
const CTABanner = dynamic(
  () => import("@/components/sections/CTABanner").then((m) => ({ default: m.CTABanner })),
  { ssr: false }
);

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
    <div className="flex flex-col">
      <Hero />
      <LazySection>
        <AboutPreview />
      </LazySection>
      <LazySection>
        <ProductHighlights />
      </LazySection>
      <LazySection>
        <WhyKemcon />
      </LazySection>
      <LazySection rootMargin="200px">
        <CTABanner />
      </LazySection>
    </div>
  );
}

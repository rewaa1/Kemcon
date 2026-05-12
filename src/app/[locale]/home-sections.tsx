"use client";

import dynamic from "next/dynamic";
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

export function HomeSections({ afterWhyKemcon }: { afterWhyKemcon?: React.ReactNode }) {
  return (
    <>
      <LazySection>
        <AboutPreview />
      </LazySection>
      <LazySection>
        <ProductHighlights />
      </LazySection>
      <LazySection>
        <WhyKemcon />
      </LazySection>
      {afterWhyKemcon}
      <LazySection rootMargin="200px">
        <CTABanner />
      </LazySection>
    </>
  );
}

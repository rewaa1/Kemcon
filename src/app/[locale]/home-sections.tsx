import { AboutPreview } from "@/components/sections/AboutPreview";
import { ProductHighlights } from "@/components/sections/ProductHighlights";
import { WhyKemcon } from "@/components/sections/WhyKemcon";
import { CTABanner } from "@/components/sections/CTABanner";

export function HomeSections({ afterWhyKemcon }: { afterWhyKemcon?: React.ReactNode }) {
  return (
    <>
      <AboutPreview />
      <ProductHighlights />
      <WhyKemcon />
      {afterWhyKemcon}
      <CTABanner />
    </>
  );
}

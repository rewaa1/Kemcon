import { Hero } from "@/components/sections/Hero";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { ProductHighlights } from "@/components/sections/ProductHighlights";
import { WhyKemcon } from "@/components/sections/WhyKemcon";
import { ClientsShowcase } from "@/components/sections/ClientsShowcase";
import { CTABanner } from "@/components/sections/CTABanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <ProductHighlights />
      <WhyKemcon />
      <ClientsShowcase />
      <CTABanner />
    </>
  );
}

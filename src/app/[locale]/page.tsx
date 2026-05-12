import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { buildPageMetadata } from "@/lib/metadata";
import { Hero } from "@/components/sections/Hero";

const AboutPreview = dynamic(() =>
  import("@/components/sections/AboutPreview").then((m) => ({ default: m.AboutPreview }))
);
const ProductHighlights = dynamic(() =>
  import("@/components/sections/ProductHighlights").then((m) => ({ default: m.ProductHighlights }))
);
const WhyKemcon = dynamic(() =>
  import("@/components/sections/WhyKemcon").then((m) => ({ default: m.WhyKemcon }))
);
const CTABanner = dynamic(() =>
  import("@/components/sections/CTABanner").then((m) => ({ default: m.CTABanner }))
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
    <div className="flex flex-col ">
      <Hero />
      <AboutPreview />
      <ProductHighlights />
      <WhyKemcon />
      <CTABanner />
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerContainer, staggerItem } from "@/components/motion/StaggerContainer";
import { motion } from "framer-motion";
import { CTABanner } from "@/components/sections/CTABanner";

const products = [
  {
    key: "fabrics",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=1200&auto=format&fit=crop",
    features: ["Egyptian Cotton", "Silk Blends", "Velvet", "Linen", "Custom Prints"],
  },
  {
    key: "cushions",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop",
    features: ["Decorative", "Outdoor", "Floor Cushions", "Custom Sizes", "Hotel-Grade"],
  },
  {
    key: "pillows",
    image: "https://images.unsplash.com/photo-1584100936595-c0c9cf1d0843?q=80&w=1200&auto=format&fit=crop",
    features: ["Memory Foam", "Down Alternative", "Hypoallergenic", "Ergonomic", "Luxury Fill"],
  },
  {
    key: "sofas",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop",
    features: ["L-Shaped", "Chesterfield", "Modular", "Sectional", "Custom Design"],
  },
  {
    key: "custom",
    image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1200&auto=format&fit=crop",
    features: ["Hotel Packages", "Interior Design", "Bulk Orders", "Consultation", "Installation"],
  },
];

export default function ProductsPage() {
  const t = useTranslations("products");

  return (
    <>
      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=2000&auto=format&fit=crop"
            alt="Products"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-dark/70" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase">
              {t("label")}
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warm-white mt-4 leading-tight">
              {t("title")}
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="gold-divider mt-6" />
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-warm-white/70 mt-6 max-w-2xl text-lg">
              {t("description")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {products.map((product, index) => (
              <div
                key={product.key}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:direction-reverse" : ""
                }`}
              >
                {/* Image */}
                <FadeIn direction={index % 2 === 0 ? "left" : "right"} className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="relative group">
                    <div className="aspect-[4/3] rounded-sm overflow-hidden">
                      <img
                        src={product.image}
                        alt={t(`categories.${product.key}.name`)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-accent/20 rounded-sm -z-10" />
                  </div>
                </FadeIn>

                {/* Content */}
                <FadeIn direction={index % 2 === 0 ? "right" : "left"} className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      {t(`categories.${product.key}.name`)}
                    </h2>
                    <div className="gold-divider mb-6" />
                    <p className="text-foreground/60 leading-relaxed mb-8">
                      {t(`categories.${product.key}.description`)}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-3">
                      {product.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-4 py-2 rounded-sm bg-background-secondary text-sm text-foreground/70 border border-accent/10"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

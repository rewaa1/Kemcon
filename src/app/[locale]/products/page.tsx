"use client";

import { useTranslations } from "next-intl";
import { PageHero } from "@/components/ui/PageHero";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerContainer, staggerItem } from "@/components/motion/StaggerContainer";
import { motion } from "framer-motion";
import { CTABanner } from "@/components/sections/CTABanner";

const products = [
  {
    key: "fabrics",
    image: "https://images.unsplash.com/photo-1622372738946-62e02505feb3?q=80&w=1200&auto=format&fit=crop",
    features: ["Egyptian Cotton", "Silk Blends", "Velvet", "Linen", "Custom Prints"],
  },
  {
    key: "cushions",
    image: "https://images.unsplash.com/photo-1621293954908-907159247fc8?q=80&w=1200&auto=format&fit=crop",
    features: ["Decorative", "Outdoor", "Floor Cushions", "Custom Sizes", "Hotel-Grade"],
  },
  {
    key: "pillows",
    image: "https://images.unsplash.com/photo-1630587148265-761cbd139043?q=80&w=1200&auto=format&fit=crop",
    features: ["Memory Foam", "Down Alternative", "Hypoallergenic", "Ergonomic", "Luxury Fill"],
  },
  {
    key: "sofas",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1200&auto=format&fit=crop",
    features: ["L-Shaped", "Chesterfield", "Modular", "Sectional", "Custom Design"],
  },
  {
    key: "custom",
    image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1200&auto=format&fit=crop",
    features: ["Hotel Packages", "Interior Design", "Bulk Orders", "Consultation", "Installation"],
  },
];

export default function ProductsPage() {
  const t = useTranslations("products");

  return (
    <>
      {/* Hero Banner */}
      <PageHero
        label={t("label")}
        title={t("title")}
        description={t("description")}
        image="https://images.unsplash.com/photo-1692153142524-60285a93c249?q=80&w=2000&auto=format&fit=crop"
        alt="Products"
      />

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

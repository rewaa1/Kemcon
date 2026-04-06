"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerContainer, staggerItem } from "@/components/motion/StaggerContainer";

const productImages = [
  {
    key: "fabrics",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=800&auto=format&fit=crop",
  },
  {
    key: "cushions",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop",
  },
  {
    key: "pillows",
    image: "https://images.unsplash.com/photo-1584100936595-c0c9cf1d0843?q=80&w=800&auto=format&fit=crop",
  },
  {
    key: "sofas",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
  },
  {
    key: "custom",
    image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=800&auto=format&fit=crop",
  },
];

export function ProductHighlights() {
  const t = useTranslations("products");

  return (
    <section className="py-20 md:py-32 bg-background-secondary relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label={t("label")}
          title={t("title")}
          description={t("description")}
        />

        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          staggerDelay={0.12}
        >
          {productImages.map((product, index) => (
            <motion.div
              key={product.key}
              variants={staggerItem}
              className={`group relative rounded-sm overflow-hidden cursor-pointer ${
                index === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""
              }`}
            >
              <div className={`relative ${index === 0 ? "aspect-[4/3] lg:aspect-auto lg:h-full" : "aspect-[3/4]"}`}>
                <img
                  src={product.image}
                  alt={t(`categories.${product.key}.name`)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <motion.div
                    className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                  >
                    <h3 className="text-xl md:text-2xl font-bold text-warm-white mb-2">
                      {t(`categories.${product.key}.name`)}
                    </h3>
                    <p className="text-warm-white/70 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-w-sm">
                      {t(`categories.${product.key}.description`)}
                    </p>
                  </motion.div>

                  {/* Gold line */}
                  <div className="w-0 group-hover:w-12 h-0.5 bg-accent mt-4 transition-all duration-500" />
                </div>

                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-accent/0 group-hover:border-accent/50 transition-all duration-500" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-accent/0 group-hover:border-accent/50 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

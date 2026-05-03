"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerContainer, staggerItem } from "@/components/motion/StaggerContainer";

const productImages = [
  {
    key: "fabrics",
    image: "/cards/fabrics.jpg",
  },
  {
    key: "cushions",
    image: "/cards/cushions.jpg",
  },
  {
    key: "pillows",
    image: "/cards/bed.jpg",
  },
  {
    key: "sofas",
    image: "/cards/sofa.jpg",
  },
  {
    key: "chairs",
    image: "/cards/chair.jpg",
  },
  {
    key: "custom",
    image: "/cards/custom.jpg",
  },
];

export function ProductHighlights() {
  const t = useTranslations("products");

  return (
    <section className="py-28 md:py-40 bg-background-secondary relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeading
          label={t("label")}
          title={t("title")}
          description={t("description")}
        />

        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7"
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
              <div className={`relative ${index === 0 ? "aspect-[4/3] lg:aspect-auto lg:h-full min-h-[400px]" : "aspect-[3/4]"}`}>
                <img
                  src={product.image}
                  alt={t(`categories.${product.key}.name`)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-9">
                  <motion.div
                    className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500"
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
                <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-accent/0 group-hover:border-accent/50 transition-all duration-500" />
                <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-accent/0 group-hover:border-accent/50 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

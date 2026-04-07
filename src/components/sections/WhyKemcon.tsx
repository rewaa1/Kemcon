"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerContainer, staggerItem } from "@/components/motion/StaggerContainer";

const valueIcons = {
  quality: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  craftsmanship: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  materials: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
};

export function WhyKemcon() {
  const t = useTranslations("whyKemcon");

  const values = ["quality", "craftsmanship", "materials"] as const;

  return (
    <section className="py-28 md:py-40 bg-background relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-deep-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        <SectionHeading
          label={t("label")}
          title={t("title")}
        />

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10"
          staggerDelay={0.15}
        >
          {values.map((value) => (
            <motion.div
              key={value}
              variants={staggerItem}
              className="group relative p-8 md:p-10 lg:p-12 rounded-sm bg-warm-white border border-accent/10 hover:border-accent/25 transition-all duration-500 hover:shadow-md"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-sm bg-accent/10 flex items-center justify-center text-accent mb-7 group-hover:bg-accent group-hover:text-warm-white transition-all duration-500">
                {valueIcons[value]}
              </div>

              <h3 className="text-xl font-bold text-foreground mb-4">
                {t(`values.${value}.title`)}
              </h3>

              <p className="text-foreground/55 leading-relaxed text-sm">
                {t(`values.${value}.description`)}
              </p>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent to-deep-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

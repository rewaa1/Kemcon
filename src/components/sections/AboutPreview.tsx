"use client";

import { useTranslations, useLocale } from "next-intl";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerContainer, staggerItem } from "@/components/motion/StaggerContainer";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import Link from "next/link";

export function AboutPreview() {
  const t = useTranslations("about");
  const locale = useLocale();

  const stats = [
    { value: t("stats.hotels"), label: t("stats.hotelsLabel") },
    { value: t("stats.countries"), label: t("stats.countriesLabel") },
    { value: t("stats.years"), label: t("stats.yearsLabel") },
    { value: t("stats.products"), label: t("stats.productsLabel") },
  ];

  return (
    <section className="py-28 md:py-40 bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--color-accent) 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image Side */}
          <FadeIn direction="left" className="relative">
            <div className="relative">
              <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?q=80&w=1200&auto=format&fit=crop"
                  alt="Kemcon luxury fabrics"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative Frame */}
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-accent/20 rounded-sm -z-10 hidden md:block" />
              {/* Floating Accent */}
              <motion.div
                className="absolute -top-4 -left-4 w-20 h-20 bg-accent/10 rounded-sm hidden md:block"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </FadeIn>

          {/* Content Side */}
          <div>
            <FadeIn>
              <span className="text-accent text-xs sm:text-sm font-medium tracking-[0.25em] uppercase">
                {t("label")}
              </span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-5 mb-7 leading-tight">
                {t("title")}
              </h2>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="gold-divider mb-8" />
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-foreground/60 leading-relaxed mb-5 text-base">
                {t("description")}
              </p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <p className="text-foreground/60 leading-relaxed mb-10 text-base">
                {t("descriptionSecondary")}
              </p>
            </FadeIn>

            {/* Stats */}
            <StaggerContainer className="grid grid-cols-2 gap-4 sm:gap-5 mb-10" staggerDelay={0.1}>
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={staggerItem}
                  className="text-center p-5 rounded-sm bg-background-secondary/50 border border-accent/8 hover:border-accent/20 transition-all duration-300"
                >
                  <div className="text-2xl md:text-3xl font-bold text-accent mb-2">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-xs sm:text-sm text-foreground/50 tracking-wide">{stat.label}</div>
                </motion.div>
              ))}
            </StaggerContainer>

            <FadeIn delay={0.4} className="flex justify-center">
              <Link
                href={`/${locale}/about`}
                className="group relative inline-flex items-center justify-center h-13 px-10 text-sm font-medium tracking-[0.15em] uppercase bg-accent text-warm-white hover:bg-accent-hover shadow-gold hover:shadow-lg transition-all duration-500 overflow-hidden rounded-sm"
              >
                <span className="relative z-10">{t("cta")}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent-hover to-deep-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

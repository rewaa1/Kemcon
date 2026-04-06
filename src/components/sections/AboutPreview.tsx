"use client";

import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerContainer, staggerItem } from "@/components/motion/StaggerContainer";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export function AboutPreview() {
  const t = useTranslations("about");

  const stats = [
    { value: t("stats.hotels"), label: t("stats.hotelsLabel") },
    { value: t("stats.countries"), label: t("stats.countriesLabel") },
    { value: t("stats.years"), label: t("stats.yearsLabel") },
    { value: t("stats.products"), label: t("stats.productsLabel") },
  ];

  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--color-accent) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <FadeIn direction="left" className="relative">
            <div className="relative">
              <div className="aspect-[4/5] rounded-sm overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop"
                  alt="Kemcon luxury fabrics"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative Frame */}
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-accent/30 rounded-sm -z-10" />
              {/* Floating Accent */}
              <motion.div
                className="absolute -top-4 -left-4 w-20 h-20 bg-accent/10 rounded-sm"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </FadeIn>

          {/* Content Side */}
          <div>
            <FadeIn>
              <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase">
                {t("label")}
              </span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 leading-tight">
                {t("title")}
              </h2>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="gold-divider mb-6" />
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-foreground/60 leading-relaxed mb-4">
                {t("description")}
              </p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <p className="text-foreground/60 leading-relaxed mb-8">
                {t("descriptionSecondary")}
              </p>
            </FadeIn>

            {/* Stats */}
            <StaggerContainer className="grid grid-cols-2 gap-6 mb-8" staggerDelay={0.1}>
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={staggerItem}
                  className="text-center p-4 rounded-sm bg-background-secondary/50"
                >
                  <div className="text-2xl md:text-3xl font-bold text-accent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-foreground/50">{stat.label}</div>
                </motion.div>
              ))}
            </StaggerContainer>

            <FadeIn delay={0.4}>
              <Button variant="primary">{t("cta")}</Button>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

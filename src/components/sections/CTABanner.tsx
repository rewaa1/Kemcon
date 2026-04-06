"use client";

import { useTranslations, useLocale } from "next-intl";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";

export function CTABanner() {
  const t = useTranslations("cta");
  const locale = useLocale();

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-gold" />
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-warm-white mb-6 leading-tight">
            {t("title")}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-warm-white/80 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("description")}
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <Button
            variant="secondary"
            size="lg"
            className="bg-warm-white text-deep-accent hover:bg-background border-0 shadow-lg"
            href={`/${locale}/contact`}
          >
            {t("button")}
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}

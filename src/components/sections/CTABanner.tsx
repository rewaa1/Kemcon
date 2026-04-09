"use client";

import { useTranslations, useLocale } from "next-intl";
import { FadeIn } from "@/components/motion/FadeIn";
import Link from "next/link";

export function CTABanner() {
  const t = useTranslations("cta");
  const locale = useLocale();

  return (
    <section className="py-28 md:py-36 relative overflow-hidden border-y border-accent/15">
      {/* Background */}
      <div className="absolute inset-0 bg-background-secondary" />
      <div className="absolute inset-0 opacity-[0.07]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-warm-white mb-7 leading-tight">
            {t("title")}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-warm-white/80 text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            {t("description")}
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <Link
            href={`/${locale}/contact`}
            className="group relative inline-flex items-center justify-center h-14 px-12 text-sm md:text-base font-medium tracking-[0.15em] uppercase bg-accent text-dark hover:bg-accent-hover shadow-gold transition-all duration-500 rounded-sm overflow-hidden"
          >
            <span className="relative z-10">{t("button")}</span>
            <div className="absolute inset-0 bg-accent-hover opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

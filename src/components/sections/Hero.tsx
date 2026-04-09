"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2000&auto=format&fit=crop')",
          }}
        />
        {/* Gradient Overlay - richer for luxury feel */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/65 to-dark/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-dark/20" />
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-32 right-16 w-48 h-48 border border-accent/15 rounded-full opacity-40 hidden lg:block" />
      <div className="absolute top-36 right-20 w-36 h-36 border border-accent/10 rounded-full opacity-30 hidden lg:block" />
      <div className="absolute bottom-32 left-12 w-64 h-64 border border-accent/8 rounded-full opacity-20 hidden lg:block" />
      <motion.div
        className="absolute top-1/4 right-1/4 w-2 h-2 bg-accent/30 rounded-full hidden lg:block"
        animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.5, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <motion.div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full" style={{ opacity }}>
        <div className="max-w-3xl">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-10 h-px bg-accent" />
            <span className="text-accent text-xs sm:text-sm font-medium tracking-[0.25em] uppercase">
              {t("tagline")}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-warm-white leading-[1.08] mb-8"
          >
            {t("title")}
            <br />
            <span className="text-gradient-gold">{t("titleHighlight")}</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-warm-white/70 text-base md:text-lg max-w-xl leading-relaxed mb-12"
          >
            {t("description")}
          </motion.p>

          {/* CTAs - refined button sizing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5"
          >
            <Link
              href={`/${locale}/products`}
              className="group relative inline-flex items-center justify-center h-13 px-10 text-sm font-medium tracking-[0.15em] uppercase bg-accent text-dark hover:bg-accent-hover shadow-gold hover:shadow-lg transition-all duration-500 overflow-hidden rounded-sm w-full sm:w-auto"
            >
              <span className="relative z-10">{t("cta")}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-hover to-deep-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="group inline-flex items-center justify-center h-13 px-10 text-sm font-medium tracking-[0.15em] uppercase border border-warm-white/40 bg-transparent text-warm-white hover:bg-warm-white/10 hover:border-warm-white/70 transition-all duration-500 rounded-sm w-full sm:w-auto"
            >
              {t("ctaSecondary")}
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-5 h-9 border border-warm-white/25 rounded-full flex items-start justify-center p-1.5">
          <motion.div
            className="w-1 h-2 bg-accent rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}

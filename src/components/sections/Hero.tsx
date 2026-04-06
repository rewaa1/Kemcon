"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const t = useTranslations("hero");
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
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop')",
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/60 to-dark/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-40 h-40 border border-accent/20 rounded-full opacity-30 hidden lg:block" />
      <div className="absolute bottom-20 left-10 w-60 h-60 border border-accent/10 rounded-full opacity-20 hidden lg:block" />

      {/* Content */}
      <motion.div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full" style={{ opacity }}>
        <div className="max-w-3xl">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-8 h-px bg-accent" />
            <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase">
              {t("tagline")}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-warm-white leading-[1.1] mb-6"
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
            className="text-warm-white/70 text-base md:text-lg max-w-xl leading-relaxed mb-10"
          >
            {t("description")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button variant="primary" size="lg">
              {t("cta")}
            </Button>
            <Button variant="outline" size="lg" className="border-warm-white/30 text-warm-white hover:bg-warm-white/10 hover:text-warm-white">
              {t("ctaSecondary")}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-5 h-8 border-2 border-warm-white/30 rounded-full flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-2 bg-accent rounded-full"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}

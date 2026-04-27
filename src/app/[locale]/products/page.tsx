"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Settings2, PenTool, Layers, Building2 } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { CTABanner } from "@/components/sections/CTABanner";

const HUB_CARDS = [
  {
    num: "01",
    slug: "configure",
    glow: "#6a4a8a",
    bg: "linear-gradient(145deg, #130f1d 0%, #1c1428 100%)",
    icon: Settings2,
    featured: true,
    en: {
      title: "Configure a Product",
      subtitle: "Design every detail — fabric, colour, pattern, dimensions, and more — then send us your brief.",
      cta: "Start Designing",
      tag: "Most Popular",
    },
    ar: {
      title: "صمّم منتجك",
      subtitle: "اختر كل التفاصيل — القماش، اللون، النمط، الأبعاد وأكثر — ثم أرسل لنا موجزك.",
      cta: "ابدأ التصميم",
      tag: "الأكثر شيوعاً",
    },
  },
  {
    num: "02",
    slug: "design-plan",
    glow: "#c8a45a",
    bg: "linear-gradient(145deg, #181208 0%, #221808 100%)",
    icon: PenTool,
    featured: false,
    en: {
      title: "Request a Design Plan",
      subtitle: "Share your vision with our in-house architect. We'll reply within 3–5 days.",
      cta: "Start Your Brief",
    },
    ar: {
      title: "اطلب خطة تصميم",
      subtitle: "شارك رؤيتك مع المعماري لدينا. سنرد خلال 3–5 أيام.",
      cta: "ابدأ موجزك",
    },
  },
  {
    num: "03",
    slug: "showroom",
    glow: "#4a8a6a",
    bg: "linear-gradient(145deg, #0c1410 0%, #121e18 100%)",
    icon: Layers,
    featured: false,
    en: {
      title: "Browse Our Showroom",
      subtitle: "Explore our full material catalog by fabric family. Find a fabric and configure it directly.",
      cta: "Enter Showroom",
    },
    ar: {
      title: "تصفّح معرضنا",
      subtitle: "استكشف كتالوج المواد مرتبًا حسب عائلة القماش. اعثر على قماش وصمّمه مباشرة.",
      cta: "دخول المعرض",
    },
  },
  {
    num: "04",
    slug: "mass-production",
    glow: "#3a6a9a",
    bg: "linear-gradient(145deg, #0c1018 0%, #131a28 100%)",
    icon: Building2,
    featured: false,
    en: {
      title: "Mass Production",
      subtitle: "Hotels, hospitality, and bulk contracts — share your project details and we'll handle the scale.",
      cta: "Discuss Your Project",
    },
    ar: {
      title: "الإنتاج بالجملة",
      subtitle: "الفنادق والضيافة وعقود الجملة — شارك تفاصيل مشروعك ونحن نتولى الحجم.",
      cta: "ناقش مشروعك",
    },
  },
];

export default function ProductsPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <>
      {/* Compact header */}
      <section className="pt-20 pb-10 text-center bg-[var(--color-bg)] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[220px] rounded-full blur-[100px] opacity-[0.05] bg-[var(--color-accent)]" />
        </div>
        <div className="relative max-w-xl mx-auto px-4 sm:px-6">
          <FadeIn direction="up">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text-muted)] mb-4">
              {isAr ? "مجموعتنا" : "Our Services"}
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-heading)] leading-tight">
              {isAr ? "كيف يمكننا مساعدتك؟" : "How Can We Help You?"}
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* 2×2 grid */}
      <section className="bg-[var(--color-bg)] px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {HUB_CARDS.map((card, index) => {
            const Icon = card.icon;
            const content = isAr ? card.ar : card.en;
            const tag = "tag" in content ? content.tag : undefined;

            return (
              <motion.div
                key={card.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className="h-full"
              >
                <Link
                  href={`/${locale}/products/${card.slug}`}
                  className="group block h-full"
                  aria-label={content.title}
                >
                  <div
                    className="relative overflow-hidden h-full min-h-[280px] flex flex-col justify-between p-8 sm:p-10 transition-all duration-500"
                    style={{
                      background: card.bg,
                      border: `1px solid ${card.glow}1a`,
                    }}
                  >
                    {/* Glow blob */}
                    <div
                      className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-[0.07] blur-[90px] transition-opacity duration-500 group-hover:opacity-[0.14] pointer-events-none"
                      style={{ background: card.glow }}
                    />

                    {/* Top row: icon + optional badge */}
                    <div className={`relative flex items-start justify-between ${isAr ? "flex-row-reverse" : ""}`}>
                      <div
                        className="w-11 h-11 flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                        style={{
                          background: `${card.glow}15`,
                          border: `1px solid ${card.glow}30`,
                        }}
                      >
                        <Icon size={20} strokeWidth={1.3} style={{ color: card.glow }} />
                      </div>

                      {card.featured && tag && (
                        <span
                          className="text-[10px] font-semibold uppercase tracking-[0.18em] px-2.5 py-1"
                          style={{
                            color: card.glow,
                            background: `${card.glow}12`,
                            border: `1px solid ${card.glow}28`,
                          }}
                        >
                          {tag}
                        </span>
                      )}
                    </div>

                    {/* Bottom: number + text + CTA */}
                    <div className={`relative mt-8 ${isAr ? "text-right" : "text-left"}`}>
                      <span
                        className="block text-5xl font-bold font-mono leading-none mb-4 select-none"
                        style={{ color: card.glow, opacity: 0.1 }}
                      >
                        {card.num}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-heading)] mb-2 leading-snug">
                        {content.title}
                      </h2>
                      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                        {content.subtitle}
                      </p>

                      <div className={`mt-6 flex items-center gap-2 ${isAr ? "flex-row-reverse justify-end" : ""}`}>
                        <span
                          className="text-xs font-semibold uppercase tracking-[0.18em]"
                          style={{ color: card.glow }}
                        >
                          {content.cta}
                        </span>
                        <Arrow
                          size={13}
                          className={`transition-transform duration-300 ${isAr ? "group-hover:-translate-x-1.5" : "group-hover:translate-x-1.5"}`}
                          style={{ color: card.glow }}
                        />
                      </div>
                    </div>

                    {/* Bottom border grows on hover */}
                    <div
                      className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out"
                      style={{ background: `linear-gradient(90deg, transparent, ${card.glow}, transparent)` }}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <CTABanner />
    </>
  );
}

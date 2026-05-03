"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Settings2, PenTool, Layers, Building2 } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { CTABanner } from "@/components/sections/CTABanner";

const FEATURED = {
  slug: "configure",
  glow: "#7a5a9a",
  bg: "#13101c",
  icon: Settings2,
  en: {
    label: "Where Most Begin",
    title: "Configure a Product",
    subtitle:
      "Design every detail — fabric, colour, pattern, and dimensions — then send us your brief.",
    cta: "Start Designing",
  },
  ar: {
    label: "حيث يبدأ معظم العملاء",
    title: "صمّم منتجك",
    subtitle:
      "اختر كل التفاصيل — القماش، اللون، النمط، والأبعاد — ثم أرسل لنا موجزك.",
    cta: "ابدأ التصميم",
  },
};

const SECONDARY = [
  {
    slug: "design-plan",
    glow: "#c8a45a",
    bg: "#19160f",
    icon: PenTool,
    en: {
      title: "Request a Design Plan",
      subtitle: "Work with our in-house architect. We reply within 3–5 days.",
      cta: "Start Your Brief",
    },
    ar: {
      title: "اطلب خطة تصميم",
      subtitle: "تعاون مع معمارينا الداخلي. نرد خلال 3–5 أيام.",
      cta: "ابدأ موجزك",
    },
  },
  {
    slug: "showroom",
    glow: "#4a8a6a",
    bg: "#0f1612",
    icon: Layers,
    en: {
      title: "Browse Our Showroom",
      subtitle: "Explore fabrics by family, then configure your favourite directly.",
      cta: "Enter Showroom",
    },
    ar: {
      title: "تصفّح معرضنا",
      subtitle: "استكشف الأقمشة حسب العائلة، ثم صمّم المفضل لديك مباشرة.",
      cta: "دخول المعرض",
    },
  },
  {
    slug: "mass-production",
    glow: "#4a7aaa",
    bg: "#0f1319",
    icon: Building2,
    en: {
      title: "Mass Production",
      subtitle: "Hotels, hospitality, and bulk contracts at scale.",
      cta: "Discuss Your Project",
    },
    ar: {
      title: "الإنتاج بالجملة",
      subtitle: "الفنادق والضيافة وعقود الجملة بكميات كبيرة.",
      cta: "ناقش مشروعك",
    },
  },
];

export default function ProductsClient() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const featuredContent = isAr ? FEATURED.ar : FEATURED.en;

  return (
    <>
      {/* Compact header */}
      <section className="pt-20 pb-10 text-center bg-[var(--color-bg)]">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
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

      {/* Bento grid — dir="rtl" on <html> auto-mirrors columns for Arabic */}
      <section className="bg-[var(--color-bg)] px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-4">

          {/* Featured card — spans all 3 rows in left column (right in RTL) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="md:row-span-3"
          >
            <Link
              href={`/${locale}/products/${FEATURED.slug}`}
              className="group block h-full"
              aria-label={featuredContent.title}
            >
              <div
                className="relative overflow-hidden h-full min-h-[380px] md:min-h-0 flex flex-col justify-between p-8 sm:p-12 transition-all duration-500"
                style={{
                  background: `radial-gradient(ellipse at 80% 20%, ${FEATURED.glow}28 0%, ${FEATURED.bg} 65%)`,
                  border: `1px solid ${FEATURED.glow}22`,
                }}
              >
                {/* Background fabric image */}
                <Image
                  src="/cards/configure-product-card.jpg"
                  alt=""
                  fill
                  className="object-cover opacity-[0.45] group-hover:opacity-[0.55] transition-opacity duration-700 pointer-events-none select-none"
                  aria-hidden="true"
                />
                {/* Dark vignette — keeps icon and text readable */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#13101c]/70 via-transparent to-[#13101c]/85 pointer-events-none" />

                {/* Ambient glow */}
                <div
                  className="absolute top-0 end-0 w-[380px] h-[380px] rounded-full opacity-10 blur-[110px] transition-opacity duration-700 group-hover:opacity-20 pointer-events-none"
                  style={{ background: FEATURED.glow }}
                />

                {/* Icon */}
                <div className="relative">
                  <div
                    className="inline-flex w-14 h-14 items-center justify-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      background: `${FEATURED.glow}18`,
                      border: `1px solid ${FEATURED.glow}38`,
                    }}
                  >
                    <Settings2 size={24} strokeWidth={1.2} style={{ color: FEATURED.glow }} />
                  </div>
                </div>

                {/* Text */}
                <div className="relative">
                  <p
                    className="text-[11px] font-semibold uppercase tracking-[0.25em] mb-4 opacity-80"
                    style={{ color: FEATURED.glow }}
                  >
                    {featuredContent.label}
                  </p>
                  <h2
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-heading)] leading-snug mb-5"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {featuredContent.title}
                  </h2>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xs">
                    {featuredContent.subtitle}
                  </p>
                  <div className={`mt-8 flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
                    <span
                      className="text-xs font-semibold uppercase tracking-[0.2em]"
                      style={{ color: FEATURED.glow }}
                    >
                      {featuredContent.cta}
                    </span>
                    <Arrow
                      size={13}
                      className={`transition-transform duration-300 ${isAr ? "group-hover:-translate-x-2" : "group-hover:translate-x-2"}`}
                      style={{ color: FEATURED.glow }}
                    />
                  </div>
                </div>

                {/* Bottom sweep */}
                <div
                  className="absolute bottom-0 start-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out"
                  style={{ background: `linear-gradient(90deg, transparent, ${FEATURED.glow}, transparent)` }}
                />
              </div>
            </Link>
          </motion.div>

          {/* Secondary cards */}
          {SECONDARY.map((card, i) => {
            const Icon = card.icon;
            const content = isAr ? card.ar : card.en;
            return (
              <motion.div
                key={card.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.12 + i * 0.08 }}
              >
                <Link
                  href={`/${locale}/products/${card.slug}`}
                  className="group block h-full"
                  aria-label={content.title}
                >
                  <div
                    className="relative overflow-hidden h-full min-h-[150px] flex flex-col justify-between p-6 sm:p-8 transition-all duration-500"
                    style={{
                      background: `radial-gradient(ellipse at 90% 10%, ${card.glow}1e 0%, ${card.bg} 60%)`,
                      border: `1px solid ${card.glow}1a`,
                    }}
                  >
                    {/* Glow blob */}
                    <div
                      className="absolute top-0 end-0 w-[200px] h-[200px] rounded-full opacity-[0.06] blur-[70px] transition-opacity duration-500 group-hover:opacity-[0.14] pointer-events-none"
                      style={{ background: card.glow }}
                    />

                    {/* Icon */}
                    <div className="relative">
                      <Icon
                        size={18}
                        strokeWidth={1.3}
                        style={{ color: card.glow }}
                        className="opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>

                    {/* Text */}
                    <div className="relative">
                      <h2 className="text-base sm:text-lg font-bold text-[var(--color-heading)] mb-1.5 leading-snug">
                        {content.title}
                      </h2>
                      <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-4">
                        {content.subtitle}
                      </p>
                      <div className={`flex items-center gap-1.5 ${isAr ? "flex-row-reverse" : ""}`}>
                        <span
                          className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                          style={{ color: card.glow }}
                        >
                          {content.cta}
                        </span>
                        <Arrow
                          size={11}
                          className={`transition-transform duration-300 ${isAr ? "group-hover:-translate-x-1.5" : "group-hover:translate-x-1.5"}`}
                          style={{ color: card.glow }}
                        />
                      </div>
                    </div>

                    {/* Bottom sweep */}
                    <div
                      className="absolute bottom-0 start-0 h-[1px] w-0 group-hover:w-full transition-all duration-500 ease-out"
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

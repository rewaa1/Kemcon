"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, PenTool, Building2 } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { CTABanner } from "@/components/sections/CTABanner";
import { CategoryGrid } from "@/components/products/CategoryGrid";
import { FabricCatalog } from "@/components/products/FabricCatalog";
import type { CategoryType } from "@/types/configurator";

/**
 * `/products` — the section the nav labels "Services".
 *
 * Two entrances to the same configurator, presented as complements rather than
 * as rival service cards: start from a product, or start from a fabric. Both
 * end at the same brief.
 *
 * The page opens editorially — it states what Kemcon is before it shows a
 * filter — because this is the section's front page, not a category listing.
 */

const SERVICES = [
  {
    slug: "design-plan",
    glow: "#c8a45a",
    bg: "#19160f",
    icon: PenTool,
    en: {
      title: "Request a Design Plan",
      subtitle:
        "Work with our in-house architect on a room or a whole property. We reply within 3–5 days.",
      cta: "Start Your Brief",
    },
    ar: {
      title: "اطلب خطة تصميم",
      subtitle:
        "تعاون مع معمارينا الداخلي على غرفة أو عقار كامل. نرد خلال 3–5 أيام.",
      cta: "ابدأ موجزك",
    },
  },
  {
    slug: "mass-production",
    glow: "#4a7aaa",
    bg: "#0f1319",
    icon: Building2,
    en: {
      title: "Mass Production",
      subtitle: "Hotels, resorts, and hospitality contracts at volume.",
      cta: "Discuss Your Project",
    },
    ar: {
      title: "الإنتاج بالجملة",
      subtitle: "الفنادق والمنتجعات وعقود الضيافة بكميات كبيرة.",
      cta: "ناقش مشروعك",
    },
  },
];

function Divider({ label, isAr }: { label: string; isAr: boolean }) {
  return (
    <div className={`flex items-center gap-4 ${isAr ? "flex-row-reverse" : ""}`}>
      <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-muted)] flex-shrink-0">
        {label}
      </span>
      <div className="h-px flex-1 bg-[var(--color-deep-accent)]/15" />
    </div>
  );
}

export default function ProductsClient() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("products");
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const categories: { id: CategoryType; name: string; description: string }[] = [
    { id: "curtains", name: t("categories.curtains.name"), description: t("categories.curtains.description") },
    { id: "chairs", name: t("categories.chairs.name"), description: t("categories.chairs.description") },
    { id: "sofas", name: t("categories.sofas.name"), description: t("categories.sofas.description") },
    { id: "bed-sheets", name: t("categories.bedSheets.name"), description: t("categories.bedSheets.description") },
    { id: "custom", name: t("categories.custom.name"), description: t("categories.custom.description") },
  ];

  return (
    <div className="bg-[var(--color-bg-secondary)]">
      {/* ── Editorial opening ── */}
      <section className="relative pt-28 pb-14 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[620px] h-[300px] rounded-full blur-[120px] opacity-[0.07] bg-[#c8a45a]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text-muted)] mb-5">
              {isAr ? "خدماتنا" : "Our Services"}
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.05}>
            <h1
              className={`text-4xl md:text-6xl font-bold text-[var(--color-heading)] leading-[1.1] mb-6 max-w-2xl ${isAr ? "text-right ms-auto" : ""}`}
            >
              {isAr ? "كيف يمكننا مساعدتك؟" : "How Can We Help You?"}
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.1}>
            <p
              className={`text-[var(--color-text-muted)] text-base md:text-lg leading-relaxed max-w-xl ${isAr ? "text-right ms-auto" : ""}`}
            >
              {isAr
                ? "مصنعنا، ومهندسنا المعماري، وأقمشة من مئات الموردين حول العالم — فريق واحد من أول رسم حتى التركيب النهائي."
                : "Our own factory, our own architect, and fabrics from hundreds of suppliers worldwide — one team from the first sketch to the final installation."}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Start from a product ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-5">
        <Divider label={isAr ? "ابدأ من المنتج" : "Start with a product"} isAr={isAr} />
        <CategoryGrid
          categories={categories}
          locale={locale}
          basePath={`/${locale}/products`}
        />
      </section>

      {/* ── Or start from a fabric ── */}
      <section className="pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <Divider label={isAr ? "أو ابدأ من القماش" : "Or start with a fabric"} isAr={isAr} />
          <p
            className={`text-sm text-[var(--color-text-muted)] leading-relaxed mt-4 max-w-xl ${isAr ? "text-right ms-auto" : ""}`}
          >
            {isAr
              ? "اختر المنتج لتصفية الأقمشة المتوافقة، ثم صمّم مباشرة من القماش الذي أعجبك."
              : "Filter by what you're making, then configure straight from the fabric you like."}
          </p>
        </div>
        <FabricCatalog />
      </section>

      {/* ── Or let us take it on ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-5">
        <Divider label={isAr ? "أو دعنا نتولى الأمر" : "Or let us take it on"} isAr={isAr} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SERVICES.map((card, i) => {
            const Icon = card.icon;
            const content = isAr ? card.ar : card.en;
            return (
              <motion.div
                key={card.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <Link
                  href={`/${locale}/products/${card.slug}`}
                  className="group block h-full"
                  aria-label={content.title}
                >
                  <div
                    className="relative overflow-hidden h-full min-h-[190px] flex flex-col justify-between p-7 transition-all duration-500"
                    style={{
                      background: `radial-gradient(ellipse at 90% 10%, ${card.glow}1e 0%, ${card.bg} 60%)`,
                      border: `1px solid ${card.glow}1a`,
                    }}
                  >
                    {/* Ambient glow */}
                    <div
                      className="absolute top-0 end-0 w-[240px] h-[240px] rounded-full opacity-[0.07] blur-[80px] transition-opacity duration-500 group-hover:opacity-[0.16] pointer-events-none"
                      style={{ background: card.glow }}
                    />

                    <div className="relative">
                      <div
                        className="inline-flex w-11 h-11 items-center justify-center transition-transform duration-500 group-hover:scale-110"
                        style={{
                          background: `${card.glow}14`,
                          border: `1px solid ${card.glow}30`,
                        }}
                      >
                        <Icon size={18} strokeWidth={1.3} style={{ color: card.glow }} />
                      </div>
                    </div>

                    <div className={`relative ${isAr ? "text-right" : ""}`}>
                      <h2 className="text-xl font-bold text-[var(--color-heading)] mb-2 leading-snug">
                        {content.title}
                      </h2>
                      <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-5 max-w-xs">
                        {content.subtitle}
                      </p>
                      <div className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
                        <span
                          className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                          style={{ color: card.glow }}
                        >
                          {content.cta}
                        </span>
                        <Arrow
                          size={12}
                          className={`transition-transform duration-300 ${isAr ? "group-hover:-translate-x-1.5" : "group-hover:translate-x-1.5"}`}
                          style={{ color: card.glow }}
                        />
                      </div>
                    </div>

                    {/* Bottom sweep */}
                    <div
                      className="absolute bottom-0 start-0 h-[1px] w-0 group-hover:w-full transition-all duration-700 ease-out"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${card.glow}, transparent)`,
                      }}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <CTABanner />
    </div>
  );
}

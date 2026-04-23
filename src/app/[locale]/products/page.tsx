"use client";

import { useTranslations, useLocale } from "next-intl";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryGrid } from "@/components/products/CategoryGrid";
import { CTABanner } from "@/components/sections/CTABanner";
import { motion } from "framer-motion";
import type { CategoryType } from "@/types/configurator";

export default function ProductsPage() {
  const t = useTranslations("products");
  const locale = useLocale();
  const isAr = locale === "ar";

  const categories: { id: CategoryType; name: string; description: string }[] = [
    {
      id: "curtains",
      name: t("categories.curtains.name"),
      description: t("categories.curtains.description"),
    },
    {
      id: "chairs",
      name: t("categories.chairs.name"),
      description: t("categories.chairs.description"),
    },
    {
      id: "sofas",
      name: t("categories.sofas.name"),
      description: t("categories.sofas.description"),
    },
    {
      id: "bed-sheets",
      name: t("categories.bedSheets.name"),
      description: t("categories.bedSheets.description"),
    },
    {
      id: "custom",
      name: t("categories.custom.name"),
      description: t("categories.custom.description"),
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-[var(--color-bg)]">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-10 bg-[var(--color-accent)]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn direction="up">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)] mb-5">
              {t("label")}
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-heading)] leading-tight mb-6">
              {t("heroTitle")}
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <p className="text-[var(--color-text-muted)] text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              {t("heroDescription")}
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <div className="gold-divider gold-divider-center" />
          </FadeIn>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 bg-[var(--color-bg-secondary)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-text-muted)] mb-8">
              {isAr ? "كيف يعمل" : "How It Works"}
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: isAr ? "اختر فئة المنتج" : "Choose a Category",
                desc: isAr
                  ? "ابدأ باختيار نوع المنتج الذي تريده"
                  : "Start by selecting the type of piece you want",
              },
              {
                step: "02",
                title: isAr ? "صمّم بالتفصيل" : "Design in Detail",
                desc: isAr
                  ? "اختر القماش واللون والنمط والخيارات الخاصة بكل منتج"
                  : "Pick fabric, colour, pattern, and product-specific options",
              },
              {
                step: "03",
                title: isAr ? "أرسل استفساراتك" : "Send Your Inquiry",
                desc: isAr
                  ? "أرسل اختياراتك بالبريد أو واتساب أو زر معرضنا"
                  : "Submit your selections via email, WhatsApp, or visit our showroom",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex flex-col gap-3 p-6 glass-card rounded-sm"
              >
                <span className="text-3xl font-bold text-[var(--color-accent)]/30 font-mono">
                  {item.step}
                </span>
                <h3 className="text-base font-semibold text-[var(--color-heading)]">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="py-20 md:py-28 bg-[var(--color-bg)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label={t("categoriesLabel")}
            title={t("categoriesTitle")}
            description={t("categoriesDescription")}
            align="center"
          />
          <div className="mt-12">
            <CategoryGrid
              categories={categories}
              locale={locale}
              basePath={`/${locale}/products`}
            />
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

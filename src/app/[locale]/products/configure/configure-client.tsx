"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CategoryGrid } from "@/components/products/CategoryGrid";
import type { CategoryType } from "@/types/configurator";

export default function ConfigureClient() {
  const t = useTranslations("products");
  const locale = useLocale();
  const isAr = locale === "ar";

  const categories: { id: CategoryType; name: string; description: string }[] = [
    { id: "curtains", name: t("categories.curtains.name"), description: t("categories.curtains.description") },
    { id: "chairs", name: t("categories.chairs.name"), description: t("categories.chairs.description") },
    { id: "sofas", name: t("categories.sofas.name"), description: t("categories.sofas.description") },
    { id: "bed-sheets", name: t("categories.bedSheets.name"), description: t("categories.bedSheets.description") },
    { id: "custom", name: t("categories.custom.name"), description: t("categories.custom.description") },
  ];

  const steps = isAr
    ? [
        { n: "01", label: "اختر الفئة" },
        { n: "02", label: "صمّم بالتفصيل" },
        { n: "03", label: "أرسل استفسارك" },
      ]
    : [
        { n: "01", label: "Pick a category" },
        { n: "02", label: "Design in detail" },
        { n: "03", label: "Send your inquiry" },
      ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      {/* Compact header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
        <Link
          href={`/${locale}/products`}
          className={`inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-6 ${isAr ? "flex-row-reverse" : ""}`}
        >
          {isAr ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
          {isAr ? "العودة" : "Back"}
        </Link>

        <div className={`flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-8 mb-7 ${isAr ? "sm:flex-row-reverse sm:text-right" : ""}`}>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-heading)] leading-tight">
              {isAr ? "صمّم منتجك" : "Configure a Product"}
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-2 max-w-sm leading-relaxed">
              {isAr
                ? "اختر كل التفاصيل — القماش واللون والنمط — ثم أرسل لنا موجزك."
                : "Design every detail — fabric, colour, pattern — then send us your brief."}
            </p>
          </div>
        </div>

        {/* Inline steps */}
        <div className={`flex items-center gap-1 flex-wrap ${isAr ? "flex-row-reverse" : ""}`}>
          {steps.map((s, i) => (
            <div key={s.n} className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
              <span className="text-[10px] font-mono text-[var(--color-accent)]/40 tabular-nums">
                {s.n}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">{s.label}</span>
              {i < steps.length - 1 && (
                <span className="text-[var(--color-deep-accent)]/25 mx-2 text-xs select-none">—</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Category selector */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <CategoryGrid
          categories={categories}
          locale={locale}
          basePath={`/${locale}/products`}
        />
      </div>
    </div>
  );
}

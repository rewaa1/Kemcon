"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { ArrowLeft, ArrowRight, X, ChevronRight } from "lucide-react";
import { fabricFamilies, fabrics, type Fabric } from "@/data/fabrics";
import { FadeIn } from "@/components/motion/FadeIn";

const PRODUCT_CATEGORIES = [
  { id: "curtains", en: "Curtains", ar: "ستائر" },
  { id: "chairs", en: "Chairs", ar: "كراسي" },
  { id: "sofas", en: "Sofas", ar: "أرائك" },
  { id: "bed-sheets", en: "Bed Sheets", ar: "ملاءات سرير" },
] as const;

export default function ShowroomClient() {
  const locale = useLocale();
  const isAr = locale === "ar";

  const [activeFamilyId, setActiveFamilyId] = useState(fabricFamilies[0].id);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [drawerFabric, setDrawerFabric] = useState<Fabric | null>(null);

  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    if (drawerFabric) lenis.stop();
    else lenis.start();
    return () => lenis.start();
  }, [drawerFabric, lenis]);

  // Count per family, respecting the active product filter
  const familyCounts = useMemo(() =>
    fabricFamilies.reduce<Record<string, number>>((acc, family) => {
      acc[family.id] = fabrics.filter(
        (f) =>
          f.familyId === family.id &&
          (!selectedProduct || f.compatibleWith.includes(selectedProduct))
      ).length;
      return acc;
    }, {}),
    [selectedProduct]
  );

  // First 2 fabric gradients per family for the tab swatch previews
  const familySwatches = useMemo(() =>
    fabricFamilies.reduce<Record<string, string[]>>((acc, family) => {
      acc[family.id] = fabrics
        .filter((f) => f.familyId === family.id)
        .slice(0, 2)
        .map((f) => f.gradient);
      return acc;
    }, {}),
    []
  );

  const visibleFabrics = fabrics.filter(
    (f) =>
      f.familyId === activeFamilyId &&
      (!selectedProduct || f.compatibleWith.includes(selectedProduct))
  );

  const handleProductSelect = (id: string | null) => {
    setSelectedProduct(id);
    // If the active family has no fabrics for the new filter, jump to first valid family
    if (id) {
      const currentCount = fabrics.filter(
        (f) => f.familyId === activeFamilyId && f.compatibleWith.includes(id)
      ).length;
      if (currentCount === 0) {
        const firstValid = fabricFamilies.find((fam) =>
          fabrics.some((f) => f.familyId === fam.id && f.compatibleWith.includes(id))
        );
        if (firstValid) setActiveFamilyId(firstValid.id);
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[var(--color-bg-secondary)] pb-24">

        {/* ── Header ── */}
        <section className="relative py-20 md:py-24 overflow-hidden bg-[var(--color-bg-secondary)]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[260px] rounded-full blur-[100px] opacity-[0.08] bg-[#4a8a6a]" />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn direction="up">
              <Link
                href={`/${locale}/products`}
                className={`inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-8 ${isAr ? "flex-row-reverse" : ""}`}
              >
                {isAr ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
                {isAr ? "العودة" : "Back"}
              </Link>
            </FadeIn>

            <FadeIn direction="up" delay={0.05}>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4a8a6a] mb-4">
                {isAr ? "كتالوج المواد" : "Material Catalog"}
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <h1 className={`text-4xl md:text-5xl font-bold text-[var(--color-heading)] leading-tight mb-3 ${isAr ? "text-right" : ""}`}>
                {isAr ? "تصفّح معرضنا" : "Browse Our Showroom"}
              </h1>
            </FadeIn>

            <FadeIn direction="up" delay={0.15}>
              <p className={`text-[var(--color-text-muted)] text-base leading-relaxed max-w-xl mb-8 ${isAr ? "text-right" : ""}`}>
                {isAr
                  ? "اختر المنتج الذي تودّ تصميمه، ثم استعرض مجموعاتنا من الأقمشة المناسبة."
                  : "Choose what you want to make, then explore fabrics matched to that product."}
              </p>
            </FadeIn>

            {/* ── Product filter pills ── */}
            <FadeIn direction="up" delay={0.2}>
              <div className={`flex flex-wrap gap-2 ${isAr ? "justify-end" : ""}`}>
                <button
                  onClick={() => handleProductSelect(null)}
                  className={`px-4 py-2 rounded-sm text-sm font-medium border transition-all duration-200 ${
                    !selectedProduct
                      ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/10"
                      : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text)]"
                  }`}
                >
                  {isAr ? "الكل" : "All"}
                </button>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleProductSelect(selectedProduct === cat.id ? null : cat.id)}
                    className={`px-4 py-2 rounded-sm text-sm font-medium border transition-all duration-200 ${
                      selectedProduct === cat.id
                        ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/10"
                        : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text)]"
                    }`}
                  >
                    {isAr ? cat.ar : cat.en}
                  </button>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Fabric family tabs ── */}
        <div className="sticky top-[72px] z-20 bg-[var(--color-bg-secondary)]/95 backdrop-blur-md border-b border-[var(--color-deep-accent)]/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {fabricFamilies.map((family) => {
                const count = familyCounts[family.id];
                const swatches = familySwatches[family.id] ?? [];
                const isEmpty = count === 0;
                const isActive = activeFamilyId === family.id;

                return (
                  <button
                    key={family.id}
                    onClick={() => !isEmpty && setActiveFamilyId(family.id)}
                    disabled={isEmpty}
                    className={`
                      flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-sm text-sm font-medium
                      border transition-all duration-200 whitespace-nowrap
                      ${isEmpty
                        ? "opacity-30 cursor-not-allowed border-[var(--color-deep-accent)]/15 text-[var(--color-text-muted)]"
                        : isActive
                          ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/8"
                          : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text)]"
                      }
                    `}
                  >
                    {/* Mini swatch previews */}
                    <span className="flex gap-0.5 flex-shrink-0">
                      {swatches.map((gradient, i) => (
                        <span
                          key={i}
                          className="w-3.5 h-3.5 rounded-[2px] block"
                          style={{ background: gradient }}
                        />
                      ))}
                    </span>
                    <span>{isAr ? family.nameAr : family.name}</span>
                    <span className={`text-[10px] font-normal tabular-nums ${isActive ? "opacity-70" : "opacity-50"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Fabric grid ── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFamilyId + (selectedProduct ?? "all")}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {visibleFabrics.length === 0 ? (
                <div className="py-24 text-center">
                  <p className="text-[var(--color-text-muted)] text-sm">
                    {isAr
                      ? "لا توجد أقمشة متوافقة في هذه الفئة."
                      : "No fabrics in this family match the selected product."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 md:gap-6">
                  {visibleFabrics.map((fabric, index) => (
                    <motion.button
                      key={fabric.id}
                      onClick={() => setDrawerFabric(fabric)}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.04 }}
                      className="group relative flex flex-col rounded-sm overflow-hidden text-left border border-[var(--color-deep-accent)]/15 hover:border-[var(--color-accent)]/40 transition-all duration-300 hover:shadow-[var(--shadow-md)] bg-[var(--color-surface)]"
                    >
                      {/* Fabric image */}
                      <div
                        className="w-full aspect-[4/5] relative overflow-hidden flex-shrink-0"
                        style={fabric.image ? {} : { background: fabric.gradient }}
                      >
                        {fabric.image && (
                          <img
                            src={fabric.image}
                            alt={isAr ? fabric.nameAr : fabric.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-end justify-center pb-4">
                          <span className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-white text-[10px] font-semibold tracking-[0.2em] uppercase">
                            {isAr ? "عرض التفاصيل" : "View Details"}
                          </span>
                        </div>
                      </div>

                      {/* Card info */}
                      <div className="p-3 flex-1 flex flex-col gap-1.5">
                        <p className="text-sm font-semibold text-[var(--color-text)] leading-tight">
                          {isAr ? fabric.nameAr : fabric.name}
                        </p>
                        <p className="text-[11px] text-[var(--color-text-muted)] leading-snug line-clamp-2">
                          {isAr ? fabric.descriptionAr : fabric.description}
                        </p>
                        {/* Compatibility badges */}
                        <div className="flex flex-wrap gap-1 mt-auto pt-1">
                          {fabric.compatibleWith.map((cat) => {
                            const label = PRODUCT_CATEGORIES.find((c) => c.id === cat);
                            if (!label) return null;
                            return (
                              <span
                                key={cat}
                                className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-[2px] transition-colors ${
                                  selectedProduct === cat
                                    ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                                    : "bg-[var(--color-deep-accent)]/15 text-[var(--color-text-muted)]"
                                }`}
                              >
                                {isAr ? label.ar : label.en}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Fabric detail drawer ── */}
      <AnimatePresence>
        {drawerFabric && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setDrawerFabric(null)}
            />

            {/* Drawer panel — single scrollable container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-[var(--color-bg)] border-l border-[var(--color-deep-accent)]/20 overflow-y-auto overscroll-contain shadow-[var(--shadow-lg)]"
              data-lenis-prevent
            >
              {/* Large fabric image */}
              <div
                className="w-full aspect-[4/3] relative"
                style={drawerFabric.image ? {} : { background: drawerFabric.gradient }}
              >
                {drawerFabric.image && (
                  <img
                    src={drawerFabric.image}
                    alt={isAr ? drawerFabric.nameAr : drawerFabric.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <button
                  onClick={() => setDrawerFabric(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/65 transition-colors"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Drawer content */}
              <div className="p-6 flex flex-col gap-6">

                {/* Name & family */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] mb-1">
                    {fabricFamilies.find((f) => f.id === drawerFabric.familyId)?.[isAr ? "nameAr" : "name"]}
                  </p>
                  <h2 className="text-2xl font-bold text-[var(--color-heading)] mb-2">
                    {isAr ? drawerFabric.nameAr : drawerFabric.name}
                  </h2>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                    {isAr ? drawerFabric.descriptionAr : drawerFabric.description}
                  </p>
                </div>

                {/* Compatibility tags */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] mb-2.5 font-semibold">
                    {isAr ? "مناسب لـ" : "Compatible with"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {drawerFabric.compatibleWith.map((cat) => {
                      const label = PRODUCT_CATEGORIES.find((c) => c.id === cat);
                      if (!label) return null;
                      return (
                        <span
                          key={cat}
                          className="text-xs font-medium px-3 py-1.5 rounded-sm bg-[var(--color-surface)] border border-[var(--color-deep-accent)]/20 text-[var(--color-text)]"
                        >
                          {isAr ? label.ar : label.en}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Configure CTAs */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] mb-2.5 font-semibold">
                    {isAr ? "صمّم بهذا القماش" : "Configure with this fabric"}
                  </p>
                  <div className="flex flex-col gap-2">
                    {(selectedProduct
                      ? PRODUCT_CATEGORIES.filter((c) => c.id === selectedProduct)
                      : PRODUCT_CATEGORIES.filter((c) =>
                          drawerFabric.compatibleWith.includes(c.id)
                        )
                    ).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/${locale}/products/${cat.id}?fabric=${drawerFabric.id}&fabricFamily=${drawerFabric.familyId}`}
                        className={`flex items-center justify-between px-4 py-3 rounded-sm border border-[var(--color-accent)]/30 text-[var(--color-accent)] bg-[var(--color-accent)]/6 hover:bg-[var(--color-accent)]/14 hover:border-[var(--color-accent)] transition-all duration-200 group ${isAr ? "flex-row-reverse" : ""}`}
                      >
                        <span className="text-sm font-semibold">{isAr ? cat.ar : cat.en}</span>
                        <ChevronRight
                          size={15}
                          className={`transition-transform duration-200 group-hover:translate-x-0.5 ${isAr ? "rotate-180 group-hover:-translate-x-0.5 group-hover:translate-x-0" : ""}`}
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

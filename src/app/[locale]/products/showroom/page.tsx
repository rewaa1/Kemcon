"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { fabricFamilies, fabrics, type Fabric } from "@/data/fabrics";
import { FadeIn } from "@/components/motion/FadeIn";

const CONFIGURABLE_CATEGORIES = [
  { id: "curtains", en: "Curtains", ar: "ستائر" },
  { id: "chairs", en: "Chairs", ar: "كراسي" },
  { id: "sofas", en: "Sofas", ar: "أرائك" },
  { id: "bed-sheets", en: "Bed Sheets", ar: "ملاءات سرير" },
] as const;

export default function ShowroomPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  const [activeFamilyId, setActiveFamilyId] = useState(fabricFamilies[0].id);
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);

  const visibleFabrics = fabrics.filter((f) => f.familyId === activeFamilyId);

  const handleFamilyClick = (id: string) => {
    setActiveFamilyId(id);
    setSelectedFabric(null);
  };

  return (
    <>
      <div className="min-h-screen bg-[var(--color-bg)] pb-48">
        {/* Header */}
        <section className="relative py-20 md:py-24 overflow-hidden bg-[var(--color-bg)]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[260px] rounded-full blur-[100px] opacity-8 bg-[#4a8a6a]" />
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
              <h1 className={`text-4xl md:text-5xl font-bold text-[var(--color-heading)] leading-tight mb-4 ${isAr ? "text-right" : ""}`}>
                {isAr ? "تصفّح معرضنا" : "Browse Our Showroom"}
              </h1>
            </FadeIn>
            <FadeIn direction="up" delay={0.15}>
              <p className={`text-[var(--color-text-muted)] text-base leading-relaxed max-w-xl ${isAr ? "text-right" : ""}`}>
                {isAr
                  ? "استكشف مجموعاتنا من الأقمشة مرتبةً حسب العائلة. اضغط على أي قماش لتصميم منتجك به مباشرة."
                  : "Explore our fabric collections by family. Tap any material to configure a product with it directly."}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Fabric family tabs */}
        <div className="sticky top-[72px] z-20 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-deep-accent)]/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {fabricFamilies.map((family) => (
                <button
                  key={family.id}
                  onClick={() => handleFamilyClick(family.id)}
                  className={`
                    flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium
                    border transition-all duration-200 whitespace-nowrap
                    ${activeFamilyId === family.id
                      ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/8"
                      : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text)]"
                    }
                  `}
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: family.gradient }}
                  />
                  {isAr ? family.nameAr : family.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fabric grid */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFamilyId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {visibleFabrics.map((fabric, index) => {
                const isSelected = selectedFabric?.id === fabric.id;
                return (
                  <motion.button
                    key={fabric.id}
                    onClick={() => setSelectedFabric(isSelected ? null : fabric)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.04 }}
                    className={`
                      group relative flex flex-col rounded-sm overflow-hidden text-left
                      border-2 transition-all duration-200
                      ${isSelected
                        ? "border-[var(--color-accent)] shadow-[var(--shadow-gold)]"
                        : "border-transparent hover:border-[var(--color-accent)]/40"
                      }
                    `}
                  >
                    <div
                      className="w-full aspect-square relative overflow-hidden"
                      style={fabric.image ? {} : { background: fabric.gradient }}
                    >
                      {fabric.image && (
                        <img
                          src={fabric.image}
                          alt={isAr ? fabric.nameAr : fabric.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-2 bg-[var(--color-surface)] flex-1">
                      <p className="text-xs font-semibold text-[var(--color-text)] leading-tight">
                        {isAr ? fabric.nameAr : fabric.name}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 leading-tight line-clamp-2">
                        {isAr ? fabric.descriptionAr : fabric.description}
                      </p>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--color-accent)] flex items-center justify-center"
                      >
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="#111318" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Fixed bottom panel — configure with selected fabric */}
      <AnimatePresence>
        {selectedFabric && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 inset-x-0 z-50 border-t border-[var(--color-deep-accent)]/20 bg-[var(--color-bg)]/98 backdrop-blur-xl"
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className={`flex flex-col sm:flex-row sm:items-center gap-4 ${isAr ? "sm:flex-row-reverse" : ""}`}>
                {/* Selected fabric info */}
                <div className={`flex items-center gap-3 flex-shrink-0 ${isAr ? "flex-row-reverse" : ""}`}>
                  <div
                    className="w-12 h-12 rounded-sm flex-shrink-0 overflow-hidden border border-[var(--color-deep-accent)]/20"
                    style={selectedFabric.image ? {} : { background: selectedFabric.gradient }}
                  >
                    {selectedFabric.image && (
                      <img
                        src={selectedFabric.image}
                        alt={isAr ? selectedFabric.nameAr : selectedFabric.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className={isAr ? "text-right" : ""}>
                    <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest">
                      {isAr ? "القماش المختار" : "Selected Fabric"}
                    </p>
                    <p className="text-sm font-semibold text-[var(--color-heading)]">
                      {isAr ? selectedFabric.nameAr : selectedFabric.name}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px h-10 bg-[var(--color-deep-accent)]/20 mx-2" />

                {/* Category buttons */}
                <div className={`flex-1 ${isAr ? "text-right" : ""}`}>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                    {isAr ? "صمّم هذا القماش في:" : "Configure this fabric in:"}
                  </p>
                  <div className={`flex flex-wrap gap-2 ${isAr ? "justify-end" : ""}`}>
                    {CONFIGURABLE_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/${locale}/products/${cat.id}?fabric=${selectedFabric.id}&fabricFamily=${selectedFabric.familyId}`}
                        className="px-4 py-1.5 rounded-sm text-xs font-semibold border border-[var(--color-accent)]/50 text-[var(--color-accent)] bg-[var(--color-accent)]/6 hover:bg-[var(--color-accent)]/14 hover:border-[var(--color-accent)] transition-all duration-200 whitespace-nowrap"
                      >
                        {isAr ? cat.ar : cat.en}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Dismiss */}
                <button
                  onClick={() => setSelectedFabric(null)}
                  className="absolute top-3 right-3 sm:static sm:flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-all duration-200"
                  aria-label="Dismiss"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

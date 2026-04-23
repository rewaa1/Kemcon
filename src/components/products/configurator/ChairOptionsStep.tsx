"use client";

import { motion } from "framer-motion";
import { frameMaterials, frameFinishes, fillingOptions } from "@/data/frames";
import type { ConfiguratorState } from "@/types/configurator";

interface ChairOptionsStepProps {
  state: ConfiguratorState;
  onChange: (updates: Partial<ConfiguratorState>) => void;
  locale: string;
  productType?: "chairs" | "sofas";
}

export function ChairOptionsStep({
  state,
  onChange,
  locale,
  productType = "chairs",
}: ChairOptionsStepProps) {
  const isAr = locale === "ar";
  const productLabel = productType === "sofas"
    ? isAr ? "الأريكة" : "Sofa"
    : isAr ? "الكرسي" : "Chair";

  return (
    <div className="space-y-10">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-heading)]">
          {isAr ? `خيارات ${productLabel}` : `${productLabel} Options`}
        </h2>
        <p className="text-[var(--color-text-muted)] text-sm">
          {isAr
            ? "اختر مادة الإطار والتشطيب والحشو"
            : "Choose frame material, finish, and filling"}
        </p>
      </div>

      {/* Frame material */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          {isAr ? "مادة الإطار" : "Frame Material"}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {frameMaterials.map((material, index) => {
            const isSelected = state.frameMaterialId === material.id;
            return (
              <motion.button
                key={material.id}
                onClick={() => onChange({ frameMaterialId: material.id })}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
                className={`
                  relative flex flex-col items-center gap-2 p-4 rounded-sm border-2
                  transition-all duration-200
                  ${isSelected
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8"
                    : "border-[var(--color-deep-accent)]/25 hover:border-[var(--color-accent)]/40"
                  }
                `}
              >
                <div
                  className="w-10 h-10 rounded-sm border border-white/10"
                  style={{ backgroundColor: material.hex }}
                />
                <div className="text-center">
                  <p className={`text-xs font-semibold ${isSelected ? "text-[var(--color-accent)]" : "text-[var(--color-text)]"}`}>
                    {isAr ? material.nameAr : material.name}
                  </p>
                  <p className="text-[9px] text-[var(--color-text-muted)] leading-tight mt-0.5">
                    {isAr ? material.descriptionAr : material.description}
                  </p>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[var(--color-accent)] flex items-center justify-center"
                  >
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L2.8 5L7 1" stroke="#111318" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Frame finish */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          {isAr ? "تشطيب الإطار" : "Frame Finish"}
        </h3>
        <div className="flex flex-wrap gap-3">
          {frameFinishes.map((finish) => {
            const isSelected = state.frameFinishId === finish.id;
            return (
              <button
                key={finish.id}
                onClick={() => onChange({ frameFinishId: finish.id })}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-sm border
                  transition-all duration-200 text-sm
                  ${isSelected
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8 text-[var(--color-accent)]"
                    : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text)]"
                  }
                `}
              >
                <div
                  className="w-4 h-4 rounded-full border border-white/15 flex-shrink-0"
                  style={{ backgroundColor: finish.hex }}
                />
                {isAr ? finish.nameAr : finish.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filling */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          {isAr ? "الحشو" : "Filling"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {fillingOptions.map((filling, index) => {
            const isSelected = state.fillingId === filling.id;
            const firmnessLabel = {
              soft: isAr ? "ناعم" : "Soft",
              medium: isAr ? "متوسط" : "Medium",
              firm: isAr ? "صلب" : "Firm",
            }[filling.firmness];

            return (
              <motion.button
                key={filling.id}
                onClick={() => onChange({ fillingId: filling.id })}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`
                  relative flex flex-col gap-1.5 p-4 rounded-sm border-2 text-left
                  transition-all duration-200
                  ${isSelected
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8"
                    : "border-[var(--color-deep-accent)]/25 hover:border-[var(--color-accent)]/40"
                  }
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold leading-tight ${isSelected ? "text-[var(--color-accent)]" : "text-[var(--color-text)]"}`}>
                    {isAr ? filling.nameAr : filling.name}
                  </p>
                  <span className={`
                    text-[9px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0
                    ${filling.firmness === "soft" ? "bg-blue-500/15 text-blue-400" : filling.firmness === "medium" ? "bg-amber-500/15 text-amber-400" : "bg-red-500/15 text-red-400"}
                  `}>
                    {firmnessLabel}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed">
                  {isAr ? filling.descriptionAr : filling.description}
                </p>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[var(--color-accent)] flex items-center justify-center"
                  >
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L2.8 5L7 1" stroke="#111318" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Validation hint */}
      {!(state.frameMaterialId && state.frameFinishId && state.fillingId) && (
        <p className="text-xs text-[var(--color-text-muted)] italic">
          {isAr
            ? `* اختر ${[!state.frameMaterialId && "مادة الإطار", !state.frameFinishId && "التشطيب", !state.fillingId && "الحشو"].filter(Boolean).join(" و")} للمتابعة`
            : `* Select ${[!state.frameMaterialId && "frame material", !state.frameFinishId && "finish", !state.fillingId && "filling"].filter(Boolean).join(" and ")} to continue`}
        </p>
      )}
    </div>
  );
}

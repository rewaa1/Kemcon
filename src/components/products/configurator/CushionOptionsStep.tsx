"use client";

import { motion } from "framer-motion";
import type { ConfiguratorState } from "@/types/configurator";

interface CushionOptionsStepProps {
  state: ConfiguratorState;
  onChange: (updates: Partial<ConfiguratorState>) => void;
  locale: string;
  productType: "chairs" | "sofas";
}

const quantities = [2, 4, 6];

const checkIcon = (
  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
    <path d="M1 3L2.8 5L7 1" stroke="#111318" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function CushionOptionsStep({ state, onChange, locale, productType }: CushionOptionsStepProps) {
  const isAr = locale === "ar";
  const productLabel = productType === "sofas"
    ? isAr ? "الأريكة" : "sofa"
    : isAr ? "الكرسي" : "chair";

  return (
    <div className="space-y-10">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-heading)]">
          {isAr ? "إضافة وسائد" : "Add Cushions"}
        </h2>
        <p className="text-[var(--color-text-muted)] text-sm">
          {isAr
            ? `هل تريد إضافة وسائد مطابقة لـ${productLabel}؟`
            : `Would you like matching cushions for your ${productLabel}?`}
        </p>
      </div>

      {/* Yes / No */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          {isAr ? "إضافة وسائد؟" : "Include Cushions?"}
        </h3>
        <div className="grid grid-cols-2 gap-4 max-w-sm">
          {([true, false] as const).map((val) => {
            const isSelected = state.cushionAdd === val;
            const label = val
              ? isAr ? "نعم، أضف وسائد" : "Yes, add cushions"
              : isAr ? "لا، شكراً" : "No, thank you";
            return (
              <motion.button
                key={String(val)}
                onClick={() =>
                  onChange({
                    cushionAdd: val,
                    ...(val === false && { cushionSameFabric: null, cushionQty: null }),
                  })
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex flex-col items-center gap-3 p-5 rounded-sm border-2
                  transition-all duration-200 text-sm font-medium
                  ${isSelected
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8 text-[var(--color-accent)]"
                    : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text)]"
                  }
                `}
              >
                <span className="text-xl">{val ? "＋" : "—"}</span>
                <span>{label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Fabric + Quantity — shown only when yes */}
      {state.cushionAdd === true && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          {/* Fabric choice */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              {isAr ? "قماش الوسائد" : "Cushion Fabric"}
            </h3>
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              {([true, false] as const).map((val) => {
                const isSelected = state.cushionSameFabric === val;
                const label = val
                  ? isAr ? "نفس قماش المنتج" : "Same as product fabric"
                  : isAr ? "سأحدد لاحقاً" : "I'll specify separately";
                return (
                  <motion.button
                    key={String(val)}
                    onClick={() => onChange({ cushionSameFabric: val })}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative flex flex-col items-center gap-2 p-4 rounded-sm border-2 text-center
                      transition-all duration-200 text-sm
                      ${isSelected
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8 text-[var(--color-accent)]"
                        : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text)]"
                      }
                    `}
                  >
                    {label}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[var(--color-accent)] flex items-center justify-center"
                      >
                        {checkIcon}
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              {isAr ? "العدد لكل قطعة" : "Quantity Per Piece"}
            </h3>
            <div className="flex gap-3">
              {quantities.map((qty) => {
                const isSelected = state.cushionQty === qty;
                return (
                  <button
                    key={qty}
                    onClick={() => onChange({ cushionQty: qty })}
                    className={`
                      w-16 h-16 rounded-sm border-2 text-lg font-bold
                      transition-all duration-200
                      ${isSelected
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8 text-[var(--color-accent)]"
                        : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text)]"
                      }
                    `}
                  >
                    {qty}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {state.cushionAdd === null && (
        <p className="text-xs text-[var(--color-text-muted)] italic">
          {isAr ? "* اختر خياراً للمتابعة" : "* Make a selection to continue"}
        </p>
      )}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import type { ConfiguratorState } from "@/types/configurator";

interface PillowOptionsStepProps {
  state: ConfiguratorState;
  onChange: (updates: Partial<ConfiguratorState>) => void;
  locale: string;
}

const fillOptions = [
  {
    id: "cotton",
    label: "Cotton Fill",       labelAr: "حشو قطني",
    desc: "Breathable and soft, ideal for warm climates",
    descAr: "قابل للتهوية وناعم، مثالي للمناخ الحار",
  },
  {
    id: "polyester",
    label: "Polyester Fill",    labelAr: "حشو بوليستر",
    desc: "Hypoallergenic and easy to maintain",
    descAr: "مضاد للحساسية وسهل العناية",
  },
  {
    id: "memory-foam",
    label: "Memory Foam",       labelAr: "إسفنج الذاكرة",
    desc: "Contouring support for premium comfort",
    descAr: "دعم مُريح لراحة فائقة",
  },
  {
    id: "down",
    label: "Down Fill",         labelAr: "حشو ريش",
    desc: "Ultra-soft luxury hotel standard",
    descAr: "ناعم للغاية بمعيار الفنادق الفاخرة",
  },
];

const sizeOptions = [
  { id: "standard", label: "Standard", labelAr: "قياسي", dim: "50 × 75 cm" },
  { id: "queen",    label: "Queen",    labelAr: "كوين",   dim: "50 × 90 cm" },
  { id: "king",     label: "King",     labelAr: "كينج",   dim: "50 × 100 cm" },
];

const checkIcon = (
  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
    <path d="M1 3L2.8 5L7 1" stroke="#111318" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function PillowOptionsStep({ state, onChange, locale }: PillowOptionsStepProps) {
  const isAr = locale === "ar";

  return (
    <div className="space-y-10">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-heading)]">
          {isAr ? "إضافة مخدات" : "Add Pillows"}
        </h2>
        <p className="text-[var(--color-text-muted)] text-sm">
          {isAr
            ? "هل تريد إضافة مخدات مع ملاءاتك؟"
            : "Would you like to add pillows with your bed sheets?"}
        </p>
      </div>

      {/* Yes / No */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          {isAr ? "إضافة مخدات؟" : "Include Pillows?"}
        </h3>
        <div className="grid grid-cols-2 gap-4 max-w-sm">
          {([true, false] as const).map((val) => {
            const isSelected = state.pillowAdd === val;
            const label = val
              ? isAr ? "نعم، أضف مخدات" : "Yes, add pillows"
              : isAr ? "لا، شكراً" : "No, thank you";
            return (
              <motion.button
                key={String(val)}
                onClick={() =>
                  onChange({
                    pillowAdd: val,
                    ...(val === false && { pillowFill: null, pillowSize: null }),
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

      {/* Fill + Size — shown only when yes */}
      {state.pillowAdd === true && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          {/* Fill type */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              {isAr ? "نوع الحشو" : "Fill Type"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fillOptions.map((fill, index) => {
                const isSelected = state.pillowFill === fill.id;
                return (
                  <motion.button
                    key={fill.id}
                    onClick={() => onChange({ pillowFill: fill.id })}
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
                    <p className={`text-sm font-semibold ${isSelected ? "text-[var(--color-accent)]" : "text-[var(--color-text)]"}`}>
                      {isAr ? fill.labelAr : fill.label}
                    </p>
                    <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed">
                      {isAr ? fill.descAr : fill.desc}
                    </p>
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

          {/* Size */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              {isAr ? "مقاس المخدة" : "Pillow Size"}
            </h3>
            <div className="flex flex-wrap gap-3">
              {sizeOptions.map((size) => {
                const isSelected = state.pillowSize === size.id;
                return (
                  <button
                    key={size.id}
                    onClick={() => onChange({ pillowSize: size.id })}
                    className={`
                      flex flex-col items-center gap-1 px-6 py-4 rounded-sm border-2
                      transition-all duration-200
                      ${isSelected
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8 text-[var(--color-accent)]"
                        : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text)]"
                      }
                    `}
                  >
                    <span className="text-sm font-bold">{isAr ? size.labelAr : size.label}</span>
                    <span className="text-[10px]">{size.dim}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {state.pillowAdd === null && (
        <p className="text-xs text-[var(--color-text-muted)] italic">
          {isAr ? "* اختر خياراً للمتابعة" : "* Make a selection to continue"}
        </p>
      )}
    </div>
  );
}

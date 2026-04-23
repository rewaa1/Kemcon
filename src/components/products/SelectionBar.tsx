"use client";

import { motion, AnimatePresence } from "framer-motion";
import { fabrics } from "@/data/fabrics";
import { colors } from "@/data/colors";
import { patterns } from "@/data/patterns";
import type { ConfiguratorState, CategoryType } from "@/types/configurator";

interface SelectionBarProps {
  state: ConfiguratorState;
  category: CategoryType;
  locale: string;
}

export function SelectionBar({ state, category, locale }: SelectionBarProps) {
  const isAr = locale === "ar";

  const fabric = fabrics.find((f) => f.id === state.fabricId);
  const color = colors.find((c) => c.id === state.colorId);
  const pattern = patterns.find((p) => p.id === state.patternId);

  const chips = [
    fabric && {
      label: isAr ? fabric.nameAr : fabric.name,
      bg: fabric.gradient,
      isGradient: true,
    },
    color && {
      label: isAr ? color.nameAr : color.name,
      bg: color.hex,
      isGradient: false,
    },
    pattern && pattern.id !== "solid" && {
      label: isAr ? pattern.nameAr : pattern.name,
      bg: null,
      isGradient: false,
    },
    category === "curtains" &&
      state.curtainControl && {
        label: state.curtainControl === "manual" ? (isAr ? "يدوي" : "Manual") : isAr ? "ريموت" : "Remote",
        bg: null,
        isGradient: false,
      },
  ].filter(Boolean) as { label: string; bg: string | null; isGradient: boolean }[];

  if (chips.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 inset-x-0 z-50 pointer-events-none"
      >
        <div className="max-w-5xl mx-auto px-4 pb-4">
          <div className="glass-card rounded-sm px-4 py-3 flex items-center gap-3 overflow-x-auto pointer-events-auto">
            <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest flex-shrink-0">
              {isAr ? "اختياراتك:" : "Your picks:"}
            </span>
            <div className="flex items-center gap-2 flex-nowrap">
              {chips.map((chip, index) => (
                <motion.div
                  key={`${chip.label}-${index}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.06 }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-deep-accent)]/20 flex-shrink-0"
                >
                  {chip.bg && (
                    <div
                      className="w-3 h-3 rounded-full border border-white/15 flex-shrink-0"
                      style={
                        chip.isGradient
                          ? { background: chip.bg }
                          : { backgroundColor: chip.bg }
                      }
                    />
                  )}
                  <span className="text-xs text-[var(--color-text)]">{chip.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

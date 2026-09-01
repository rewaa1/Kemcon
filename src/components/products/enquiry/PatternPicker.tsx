"use client";

import { motion } from "framer-motion";
import { patterns } from "@/data/patterns";
import { colors } from "@/data/colors";
import type { ConfiguratorState } from "@/types/configurator";

interface PatternPickerProps {
  state: ConfiguratorState;
  onChange: (updates: Partial<ConfiguratorState>) => void;
  locale: string;
}

export function PatternPicker({ state, onChange, locale }: PatternPickerProps) {
  const isAr = locale === "ar";

  const baseColor =
    colors.find((c) => c.id === state.colorId)?.hex ?? "#2a2a2a";

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {patterns.map((pattern, index) => {
          const isSelected = state.patternId === pattern.id;

          return (
            <motion.button
              key={pattern.id}
              onClick={() => onChange({ patternId: isSelected ? null : pattern.id })}
              data-testid="picker-option"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.04 }}
              className={`
                group relative flex flex-col rounded-sm overflow-hidden
                border-2 transition-all duration-200 text-left
                ${isSelected
                  ? "border-[var(--color-accent)] shadow-[var(--shadow-gold)]"
                  : "border-[var(--color-deep-accent)]/20 hover:border-[var(--color-accent)]/40"
                }
              `}
            >
              {/* Pattern preview */}
              <div
                className="w-full aspect-square"
                style={{
                  backgroundColor: baseColor,
                  backgroundImage: pattern.cssPattern,
                }}
              />

              {/* Label */}
              <div className="p-2.5 bg-[var(--color-surface)]">
                <p className="text-xs font-semibold text-[var(--color-text)]">
                  {isAr ? pattern.nameAr : pattern.name}
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 leading-tight line-clamp-2">
                  {isAr ? pattern.descriptionAr : pattern.description}
                </p>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--color-accent)] flex items-center justify-center"
                >
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="#111318"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, colorGroups } from "@/data/colors";
import type { ConfiguratorState } from "@/types/configurator";

interface ColorStepProps {
  state: ConfiguratorState;
  onChange: (updates: Partial<ConfiguratorState>) => void;
  locale: string;
}

export function ColorStep({ state, onChange, locale }: ColorStepProps) {
  const isAr = locale === "ar";
  const [activeGroupId, setActiveGroupId] = useState<string>(
    state.colorGroupId ?? "neutrals"
  );

  const visibleColors = colors.filter((c) => c.groupId === activeGroupId);

  const handleGroupClick = (id: string) => {
    setActiveGroupId(id);
    if (id !== state.colorGroupId) {
      onChange({ colorGroupId: id, colorId: null });
    }
  };

  const handleColorClick = (id: string) => {
    const color = colors.find((c) => c.id === id);
    onChange({ colorGroupId: color?.groupId ?? activeGroupId, colorId: id });
  };

  const selectedColor = colors.find((c) => c.id === state.colorId);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-heading)]">
          {isAr ? "اختر اللون" : "Select Color"}
        </h2>
        <p className="text-[var(--color-text-muted)] text-sm">
          {isAr
            ? "اختر من مجموعتنا الواسعة من الألوان الفاخرة"
            : "Choose from our extensive palette of luxury colours"}
        </p>
      </div>

      {/* Group filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {colorGroups.map((group) => (
          <button
            key={group.id}
            onClick={() => handleGroupClick(group.id)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-sm text-sm font-medium
              border transition-all duration-200 whitespace-nowrap
              ${activeGroupId === group.id
                ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/8"
                : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text)]"
              }
            `}
          >
            {isAr ? group.nameAr : group.name}
          </button>
        ))}
      </div>

      {/* Selected color preview */}
      {selectedColor && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex items-center gap-4 p-4 glass-card rounded-sm"
        >
          <div
            className="w-12 h-12 rounded-sm border border-white/10 flex-shrink-0"
            style={{ backgroundColor: selectedColor.hex }}
          />
          <div>
            <p className="text-sm font-semibold text-[var(--color-heading)]">
              {isAr ? selectedColor.nameAr : selectedColor.name}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] font-mono">
              {selectedColor.hex}
            </p>
          </div>
        </motion.div>
      )}

      {/* Color swatches */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeGroupId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3"
        >
          {visibleColors.map((color, index) => {
            const isSelected = state.colorId === color.id;
            return (
              <motion.button
                key={color.id}
                onClick={() => handleColorClick(color.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                title={isAr ? color.nameAr : color.name}
                className="group relative flex flex-col items-center gap-1.5"
              >
                <div
                  className={`
                    w-10 h-10 rounded-full transition-all duration-200 border-2
                    ${isSelected
                      ? "scale-110 border-[var(--color-accent)] shadow-[0_0_12px_rgba(216,210,200,0.4)]"
                      : "border-transparent hover:scale-105 hover:border-[var(--color-accent)]/50"
                    }
                  `}
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-full h-full rounded-full flex items-center justify-center"
                    >
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke={isLightColor(color.hex) ? "#111318" : "#EEEEF0"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  )}
                </div>
                <span className="text-[9px] text-[var(--color-text-muted)] text-center leading-tight max-w-[44px] truncate">
                  {isAr ? color.nameAr : color.name}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

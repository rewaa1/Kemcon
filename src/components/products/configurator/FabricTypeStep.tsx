"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fabricFamilies, fabrics } from "@/data/fabrics";
import type { ConfiguratorState } from "@/types/configurator";

interface FabricTypeStepProps {
  state: ConfiguratorState;
  onChange: (updates: Partial<ConfiguratorState>) => void;
  locale: string;
}

export function FabricTypeStep({ state, onChange, locale }: FabricTypeStepProps) {
  const isAr = locale === "ar";
  const [activeFamilyId, setActiveFamilyId] = useState<string>(
    state.fabricFamilyId ?? fabricFamilies[0].id
  );

  const visibleFabrics = fabrics.filter((f) => f.familyId === activeFamilyId);

  const handleFamilyClick = (id: string) => {
    setActiveFamilyId(id);
    if (id !== state.fabricFamilyId) {
      onChange({ fabricFamilyId: id, fabricId: null });
    }
  };

  const handleFabricClick = (id: string) => {
    onChange({ fabricFamilyId: activeFamilyId, fabricId: id });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-heading)]">
          {isAr ? "اختر نوع القماش" : "Select Fabric Type"}
        </h2>
        <p className="text-[var(--color-text-muted)] text-sm">
          {isAr
            ? "اختر عائلة القماش ثم النوع المحدد"
            : "Choose a fabric family, then pick your specific fabric"}
        </p>
      </div>

      {/* Family filter strip */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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

      {/* Fabric grid */}
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
            const isSelected = state.fabricId === fabric.id;
            return (
              <motion.button
                key={fabric.id}
                onClick={() => handleFabricClick(fabric.id)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
                className={`
                  group relative flex flex-col rounded-sm overflow-hidden
                  border-2 transition-all duration-200 text-left
                  ${isSelected
                    ? "border-[var(--color-accent)] shadow-[var(--shadow-gold)]"
                    : "border-transparent hover:border-[var(--color-accent)]/40"
                  }
                `}
              >
                {/* Swatch */}
                <div
                  className="w-full aspect-square relative overflow-hidden"
                  style={fabric.image ? {} : { background: fabric.gradient }}
                >
                  {fabric.image && (
                    <img
                      src={fabric.image}
                      alt={fabric.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Label */}
                <div className="p-2 bg-[var(--color-surface)] flex-1">
                  <p className="text-xs font-semibold text-[var(--color-text)] leading-tight">
                    {isAr ? fabric.nameAr : fabric.name}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 leading-tight line-clamp-2">
                    {isAr ? fabric.descriptionAr : fabric.description}
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
                      <path d="M1 4L3.5 6.5L9 1" stroke="#111318" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Selection count hint */}
      {state.fabricId && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-[var(--color-accent)]"
        >
          {isAr
            ? `تم اختيار: ${fabrics.find((f) => f.id === state.fabricId)?.[isAr ? "nameAr" : "name"]}`
            : `Selected: ${fabrics.find((f) => f.id === state.fabricId)?.name}`}
        </motion.p>
      )}
    </div>
  );
}

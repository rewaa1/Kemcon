"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { StepType } from "@/types/configurator";

const STEP_LABELS: Record<StepType, { en: string; ar: string }> = {
  fabric: { en: "Fabric", ar: "القماش" },
  color: { en: "Color", ar: "اللون" },
  pattern: { en: "Pattern", ar: "النمط" },
  curtainOptions: { en: "Options", ar: "الخيارات" },
  chairOptions: { en: "Frame & Fill", ar: "الإطار والحشو" },
  aiVisualization: { en: "Preview", ar: "معاينة" },
  inquiry: { en: "Inquiry", ar: "الاستفسار" },
  customDescription: { en: "Describe", ar: "الوصف" },
};

interface StepIndicatorProps {
  steps: StepType[];
  currentStep: number;
  locale: string;
  onStepClick?: (index: number) => void;
}

export function StepIndicator({ steps, currentStep, locale, onStepClick }: StepIndicatorProps) {
  const isAr = locale === "ar";

  return (
    <div className="w-full flex items-center justify-center px-4 py-6 overflow-x-auto">
      <div className="flex items-center gap-0 min-w-max">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isClickable = isCompleted && onStepClick;
          const label = STEP_LABELS[step][isAr ? "ar" : "en"];

          return (
            <div key={step} className="flex items-center">
              {/* Step circle + label */}
              <div
                className={`flex flex-col items-center gap-2 ${isClickable ? "cursor-pointer group" : ""}`}
                onClick={() => isClickable && onStepClick(index)}
              >
                <motion.div
                  className={`
                    relative w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold
                    transition-colors duration-300 border
                    ${isCompleted
                      ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-dark)] group-hover:opacity-80"
                      : isActive
                      ? "bg-transparent border-[var(--color-accent)] text-[var(--color-accent)]"
                      : "bg-transparent border-[var(--color-deep-accent)]/40 text-[var(--color-text-muted)]"
                    }
                  `}
                  initial={false}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {isCompleted ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.div>
                <span
                  className={`text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
                    isActive
                      ? "text-[var(--color-accent)]"
                      : isCompleted
                      ? "text-[var(--color-text)] group-hover:text-[var(--color-accent)]"
                      : "text-[var(--color-text-muted)]"
                  }`}
                >
                  {label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="w-12 sm:w-20 h-px mx-2 mb-5 relative overflow-hidden bg-[var(--color-deep-accent)]/20">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-[var(--color-accent)]"
                    initial={{ width: "0%" }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  CATEGORY_STEPS,
  initialConfiguratorState,
  type CategoryType,
  type ConfiguratorState,
  type StepType,
} from "@/types/configurator";
import { StepIndicator } from "./StepIndicator";
import { FabricTypeStep } from "./FabricTypeStep";
import { ColorStep } from "./ColorStep";
import { PatternStep } from "./PatternStep";
import { CurtainOptionsStep } from "./CurtainOptionsStep";
import { ChairOptionsStep } from "./ChairOptionsStep";
import { CustomDescriptionStep } from "./CustomDescriptionStep";
import { InquiryStep } from "./InquiryStep";
import { AIVisualizationStep } from "./AIVisualizationStep";
import { SelectionBar } from "../SelectionBar";

interface ConfiguratorShellProps {
  category: CategoryType;
  categoryLabel: string;
  locale: string;
}

function canProceed(
  step: StepType,
  state: ConfiguratorState,
  category: CategoryType
): boolean {
  switch (step) {
    case "fabric":
      return !!state.fabricId;
    case "color":
      return !!state.colorId;
    case "pattern":
      return !!state.patternId;
    case "curtainOptions":
      return !!state.curtainControl;
    case "chairOptions":
      return !!(state.frameMaterialId && state.frameFinishId && state.fillingId);
    case "customDescription":
      return state.customDescription.trim().length > 10;
    case "aiVisualization":
      return true;
    case "inquiry":
      return true;
    default:
      return true;
  }
}

export function ConfiguratorShell({
  category,
  categoryLabel,
  locale,
}: ConfiguratorShellProps) {
  const isAr = locale === "ar";
  const steps = CATEGORY_STEPS[category];
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<ConfiguratorState>(initialConfiguratorState);
  const [direction, setDirection] = useState<1 | -1>(1);

  const currentStepId = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const canGoNext = canProceed(currentStepId, state, category);

  const handleChange = (updates: Partial<ConfiguratorState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const goNext = () => {
    if (!canGoNext) return;
    setDirection(1);
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const goToStep = (index: number) => {
    if (index >= currentStep) return;
    // Clear the AI image if jumping back before the preview step
    const previewIndex = steps.indexOf("aiVisualization");
    if (previewIndex !== -1 && index < previewIndex) {
      setState((prev) => ({ ...prev, aiImageUrl: null, aiDisplayUrl: null }));
    }
    setDirection(-1);
    setCurrentStep(index);
  };

  const renderStep = () => {
    switch (currentStepId) {
      case "fabric":
        return <FabricTypeStep state={state} onChange={handleChange} locale={locale} />;
      case "color":
        return <ColorStep state={state} onChange={handleChange} locale={locale} />;
      case "pattern":
        return <PatternStep state={state} onChange={handleChange} locale={locale} />;
      case "curtainOptions":
        return <CurtainOptionsStep state={state} onChange={handleChange} locale={locale} />;
      case "chairOptions":
        return (
          <ChairOptionsStep
            state={state}
            onChange={handleChange}
            locale={locale}
            productType={category as "chairs" | "sofas"}
          />
        );
      case "customDescription":
        return <CustomDescriptionStep state={state} onChange={handleChange} locale={locale} />;
      case "aiVisualization":
        return (
          <AIVisualizationStep
            state={state}
            onChange={handleChange}
            locale={locale}
            onNext={goNext}
          />
        );
      case "inquiry":
        return (
          <InquiryStep
            state={state}
            onChange={handleChange}
            locale={locale}
            category={category}
            categoryLabel={categoryLabel}
          />
        );
      default:
        return null;
    }
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? (isAr ? -40 : 40) : (isAr ? 40 : -40),
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? (isAr ? 40 : -40) : (isAr ? -40 : 40),
      opacity: 0,
    }),
  };

  return (
    <div className="relative min-h-screen pt-20 pb-48">
      {/* Category header + back link */}
      <div className="sticky top-20 z-30 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-deep-accent)]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">
          <Link
            href={`/${locale}/products`}
            className={`flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors ${isAr ? "flex-row-reverse" : ""}`}
          >
            {isAr ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
            {isAr ? "جميع المنتجات" : "All Products"}
          </Link>
          <span className="text-sm font-semibold text-[var(--color-heading)]">{categoryLabel}</span>
          <div className="w-24" />
        </div>
        <StepIndicator steps={steps} currentStep={currentStep} locale={locale} onStepClick={goToStep} />
      </div>

      {/* Step content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {currentStepId !== "inquiry" && currentStepId !== "aiVisualization" && (
        <div className="fixed bottom-24 inset-x-0 z-30 pointer-events-none">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex ${isAr ? "flex-row-reverse" : "flex-row"} items-center justify-between pointer-events-auto`}>
              {/* Back */}
              <button
                onClick={goPrev}
                disabled={isFirstStep}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium
                  border transition-all duration-200
                  ${isFirstStep
                    ? "opacity-0 pointer-events-none"
                    : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text)]"
                  }
                `}
              >
                {isAr ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                {isAr ? "السابق" : "Back"}
              </button>

              {/* Next */}
              <motion.button
                onClick={goNext}
                disabled={!canGoNext}
                whileHover={canGoNext ? { scale: 1.02 } : {}}
                whileTap={canGoNext ? { scale: 0.98 } : {}}
                className={`
                  flex items-center gap-2 px-6 py-2.5 rounded-sm text-sm font-semibold
                  transition-all duration-200
                  ${canGoNext
                    ? "bg-[var(--color-accent)] text-[var(--color-dark)] hover:bg-[var(--color-accent-hover)]"
                    : "bg-[var(--color-deep-accent)]/20 text-[var(--color-text-muted)] cursor-not-allowed"
                  }
                `}
              >
                {isAr ? "التالي" : isLastStep ? "Review" : "Next"}
                {isAr ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Selection bar */}
      <SelectionBar state={state} category={category} locale={locale} />
    </div>
  );
}

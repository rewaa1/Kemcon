"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
import { fabrics } from "@/data/fabrics";
import { colors } from "@/data/colors";
import { patterns } from "@/data/patterns";

interface ConfiguratorShellProps {
  category: CategoryType;
  categoryLabel: string;
  locale: string;
  initialFabricId?: string;
  initialFabricFamilyId?: string;
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
  initialFabricId,
  initialFabricFamilyId,
}: ConfiguratorShellProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const tc = useTranslations("configurator");
  const steps = CATEGORY_STEPS[category];
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<ConfiguratorState>({
    ...initialConfiguratorState,
    ...(initialFabricId && {
      fabricId: initialFabricId,
      fabricFamilyId: initialFabricFamilyId ?? null,
    }),
  });
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
      setState((prev) => ({ ...prev, aiImageUrl: null, aiDetailImageUrl: null, aiDisplayUrl: null }));
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
            category={category}
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

  const fabric = fabrics.find((f) => f.id === state.fabricId);
  const color = colors.find((c) => c.id === state.colorId);
  const pattern = patterns.find((p) => p.id === state.patternId);
  const chips = [
    fabric && { label: isAr ? fabric.nameAr : fabric.name, bg: fabric.gradient, isGradient: true },
    color && { label: isAr ? color.nameAr : color.name, bg: color.hex, isGradient: false },
    pattern && pattern.id !== "solid" && { label: isAr ? pattern.nameAr : pattern.name, bg: null, isGradient: false },
    category === "curtains" && state.curtainControl && {
      label: state.curtainControl === "manual" ? (isAr ? "يدوي" : "Manual") : isAr ? "ريموت" : "Remote",
      bg: null,
      isGradient: false,
    },
  ].filter(Boolean) as { label: string; bg: string | null; isGradient: boolean }[];

  const showNav = currentStepId !== "inquiry" && currentStepId !== "aiVisualization";

  const isDirty = currentStep > 0;

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const confirmLeave = useCallback(() => {
    if (!isDirty) return true;
    return window.confirm(tc("unsavedPrompt"));
  }, [isDirty, isAr]);

  return (
    <div className="relative min-h-screen pt-20 pb-48 bg-[var(--color-bg-secondary)]">
      {/* Category header + back link */}
      <div className="sticky top-20 z-30 bg-[var(--color-bg-secondary)]/95 backdrop-blur-md border-b border-[var(--color-deep-accent)]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">
          <button
            onClick={() => confirmLeave() && router.push(`/${locale}/products`)}
            className={`flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors ${isAr ? "flex-row-reverse" : ""}`}
          >
            {isAr ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
            {tc("allProducts")}
          </button>
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

      {/* Unified bottom panel — nav + selection chips in one bar */}
      {showNav ? (
        <div className="fixed bottom-0 inset-x-0 z-50 pointer-events-none">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <div className={`glass-card rounded-sm px-4 py-3 flex items-center gap-3 pointer-events-auto ${isAr ? "flex-row-reverse" : ""}`}>
              {/* Back */}
              <button
                onClick={goPrev}
                disabled={isFirstStep}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium flex-shrink-0
                  border transition-all duration-200
                  ${isFirstStep
                    ? "opacity-0 pointer-events-none"
                    : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text)]"
                  }
                `}
              >
                {isAr ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                {tc("back")}
              </button>

              {/* Selection chips */}
              {chips.length > 0 && (
                <div className={`flex-1 flex items-center gap-2 overflow-x-auto min-w-0 ${isAr ? "flex-row-reverse" : ""}`}>
                  <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest flex-shrink-0">
                    {tc("yourPicks")}
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
                            style={chip.isGradient ? { background: chip.bg } : { backgroundColor: chip.bg }}
                          />
                        )}
                        <span className="text-xs text-[var(--color-text)]">{chip.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next */}
              <motion.button
                onClick={goNext}
                disabled={!canGoNext}
                aria-disabled={!canGoNext}
                whileHover={canGoNext ? { scale: 1.02 } : {}}
                whileTap={canGoNext ? { scale: 0.98 } : {}}
                className={`
                  flex items-center gap-2 px-6 py-2 rounded-sm text-sm font-semibold flex-shrink-0
                  transition-all duration-200 ms-auto
                  ${canGoNext
                    ? "bg-[var(--color-accent)] text-[var(--color-dark)] hover:bg-[var(--color-accent-hover)]"
                    : "bg-[var(--color-deep-accent)]/20 text-[var(--color-text-muted)] cursor-not-allowed"
                  }
                `}
              >
                {isLastStep ? tc("review") : tc("next")}
                {isAr ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </motion.button>
            </div>
          </div>
        </div>
      ) : (
        <SelectionBar state={state} category={category} locale={locale} />
      )}
    </div>
  );
}

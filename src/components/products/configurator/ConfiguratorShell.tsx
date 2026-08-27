"use client";

import { useState, useEffect } from "react";
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
import { CushionOptionsStep } from "./CushionOptionsStep";
import { PillowOptionsStep } from "./PillowOptionsStep";
import { CustomDescriptionStep } from "./CustomDescriptionStep";
import { ReviewStep } from "./ReviewStep";
import { AIVisualizationStep } from "./AIVisualizationStep";
import { ConfiguratorBar, type PickChip } from "./ConfiguratorBar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fabrics } from "@/data/fabrics";
import { colors } from "@/data/colors";
import { patterns } from "@/data/patterns";
import { useBriefStore } from "@/lib/brief/store";
import { configuratorStateFromLineItem, lineItemFromConfigurator } from "@/lib/brief/types";
import { MAX_INSPIRATION } from "@/lib/brief/format";

interface ConfiguratorShellProps {
  category: CategoryType;
  categoryLabel: string;
  locale: string;
  initialFabricId?: string;
  initialFabricFamilyId?: string;
  /** Brief line item being edited, from `?edit=<id>`. */
  editId?: string;
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
    case "cushionOptions":
      if (state.cushionAdd === null) return false;
      if (state.cushionAdd === false) return true;
      return !!(state.cushionSameFabric !== null && state.cushionQty !== null);
    case "pillowOptions":
      if (state.pillowAdd === null) return false;
      if (state.pillowAdd === false) return true;
      return !!(state.pillowFill && state.pillowSize);
    case "customDescription":
      return state.customDescription.trim().length > 10;
    case "aiVisualization":
      return true;
    case "review":
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
  editId,
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

  // Edit mode: seed from the brief once the persisted store has rehydrated.
  // The store is empty during SSR and on the first client render, so this
  // cannot run during initialisation without a hydration mismatch.
  const briefHydrated = useBriefStore((s) => s.hydrated);
  const briefItems = useBriefStore((s) => s.items);
  const [seededFor, setSeededFor] = useState<string | null>(null);
  /**
   * Whether the visitor has actually changed anything. Previously this was
   * `currentStep > 0`, which meant edit mode — which lands on the last step —
   * warned about unsaved changes before the visitor had touched a thing.
   */
  const [touched, setTouched] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);

  /**
   * The review step's working state lives here rather than in the step, so the
   * fixed bottom bar can own the commit action. The step renders the summary;
   * the bar commits it.
   */
  const [reviewQuantity, setReviewQuantity] = useState(1);
  const [committedId, setCommittedId] = useState<string | null>(editId ?? null);

  const addBriefItem = useBriefStore((s) => s.addItem);
  const replaceBriefItem = useBriefStore((s) => s.replaceItem);
  const openBriefDrawer = useBriefStore((s) => s.openDrawer);
  const toggleBriefInspiration = useBriefStore((s) => s.toggleInspiration);
  const briefInspiration = useBriefStore((s) => s.inspirationImages);

  // Adjusting state during render — React's documented pattern for reacting to
  // a changed input — rather than in an effect, which would render once with
  // the wrong state and then cascade.
  if (editId && briefHydrated && seededFor !== editId) {
    const item = briefItems.find((i) => i.id === editId);
    if (item) {
      setSeededFor(editId);
      setState((prev) => configuratorStateFromLineItem(item, prev));
      // Land on the review step — the visitor came to change one detail, not
      // to walk the whole flow again. Every earlier step stays reachable.
      setCurrentStep(steps.length - 1);
      setReviewQuantity(item.quantity);
    }
  }

  const currentStepId = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const canGoNext = canProceed(currentStepId, state, category);

  const handleChange = (updates: Partial<ConfiguratorState>) => {
    setTouched(true);
    setState((prev) => ({ ...prev, ...updates }));
  };

  const goNext = () => {
    if (!canGoNext) return;
    setTouched(true);
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
      case "cushionOptions":
        return (
          <CushionOptionsStep
            state={state}
            onChange={handleChange}
            locale={locale}
            productType={category as "chairs" | "sofas"}
          />
        );
      case "pillowOptions":
        return <PillowOptionsStep state={state} onChange={handleChange} locale={locale} />;
      case "customDescription":
        return <CustomDescriptionStep state={state} onChange={handleChange} locale={locale} />;
      case "aiVisualization":
        return (
          <AIVisualizationStep
            state={state}
            onChange={handleChange}
            locale={locale}
            category={category}
          />
        );
      case "review":
        return (
          <ReviewStep
            state={state}
            onChange={handleChange}
            locale={locale}
            category={category}
            categoryLabel={categoryLabel}
            editingId={editId ?? null}
            quantity={reviewQuantity}
            onQuantityChange={setReviewQuantity}
            committed={committedId !== null}
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

  // Each chip records the step that set it, so the bar can send the visitor
  // back to change it.
  const chips = [
    fabric && {
      step: "fabric" as const,
      field: isAr ? "القماش" : "Fabric",
      label: isAr ? fabric.nameAr : fabric.name,
      bg: fabric.gradient,
      isGradient: true,
    },
    color && {
      step: "color" as const,
      field: isAr ? "اللون" : "Colour",
      label: isAr ? color.nameAr : color.name,
      bg: color.hex,
      isGradient: false,
    },
    pattern && pattern.id !== "solid" && {
      step: "pattern" as const,
      field: isAr ? "النمط" : "Pattern",
      label: isAr ? pattern.nameAr : pattern.name,
      bg: null,
      isGradient: false,
    },
    category === "curtains" && state.curtainControl && {
      step: "curtainOptions" as const,
      field: isAr ? "التحكم" : "Control",
      label:
        state.curtainControl === "manual"
          ? isAr ? "يدوي" : "Manual"
          : isAr ? "ريموت" : "Remote",
      bg: null,
      isGradient: false,
    },
  ].filter(Boolean) as PickChip[];


  const isDirty = touched;

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const leave = () => router.push(`/${locale}/products`);

  /**
   * `window.confirm` blocks the whole page on an OS-chrome box that ignores the
   * site's language direction and styling. The dialog says the same thing in
   * the site's own voice — and can be honest that the brief itself is safe,
   * which the old one-line prompt could not convey.
   */
  const requestLeave = () => {
    if (!isDirty) {
      leave();
      return;
    }
    setLeaveOpen(true);
  };

  /**
   * Commit the configured piece to the brief. Owns exactly one line item: once
   * created its id is kept, so pressing the button again updates that item
   * rather than appending a copy.
   */
  const commitLineItem = () => {
    const draft = lineItemFromConfigurator(
      state,
      category,
      reviewQuantity,
      committedId ?? undefined
    );
    if (committedId) replaceBriefItem({ ...draft, id: committedId });
    else {
      addBriefItem(draft);
      setCommittedId(draft.id);
    }
    // Inspiration is picked per-piece but belongs to the brief as a whole.
    for (const src of state.inspirationImages) {
      if (!briefInspiration.includes(src)) toggleBriefInspiration(src, MAX_INSPIRATION);
    }
    // The piece is in the brief now, so there is no unsaved work to warn about
    // until something changes again.
    setTouched(false);
  };

  const handleChipClick = (step: StepType) => {
    const index = steps.indexOf(step);
    if (index === -1 || index === currentStep) return;
    goToStep(index);
  };

  // Every step hands its actions to the fixed bar instead of rendering its own.
  const { primary, secondary } = (() => {
    if (currentStepId === "review") {
      return {
        primary: {
          label: editId
            ? isAr ? "حفظ التغييرات" : "Save changes"
            : committedId
              ? isAr ? "تحديث الموجز" : "Update brief"
              : isAr ? "أضف إلى الموجز" : "Add to Brief",
          onClick: () => {
            commitLineItem();
            openBriefDrawer();
          },
          icon: (committedId && !editId ? "check" : "clipboard") as "check" | "clipboard",
        },
        secondary: editId
          ? null
          : {
              label: isAr ? "صمّم قطعة أخرى" : "Configure another",
              onClick: () => {
                commitLineItem();
                router.push(`/${locale}/products`);
              },
            },
      };
    }

    if (currentStepId === "aiVisualization") {
      return {
        primary: {
          label: tc("next"),
          onClick: goNext,
          icon: "arrow" as const,
        },
        secondary: { label: isAr ? "تخطي" : "Skip", onClick: goNext },
      };
    }

    return {
      primary: {
        label: isLastStep ? tc("review") : tc("next"),
        onClick: goNext,
        disabled: !canGoNext,
        icon: "arrow" as const,
      },
      secondary: null,
    };
  })();

  return (
    <div className="relative min-h-screen pt-20 pb-48 bg-[var(--color-bg-secondary)]">
      {/* Category header + back link */}
      <div className="sticky top-20 z-30 bg-[var(--color-bg-secondary)]/95 backdrop-blur-md border-b border-[var(--color-deep-accent)]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">
          <button
            onClick={requestLeave}
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

      <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <DialogContent
          showCloseButton={false}
          className="rounded-sm max-w-md bg-[var(--color-bg)] ring-1 ring-[var(--color-deep-accent)]/25 p-6"
        >
          <DialogHeader className={isAr ? "text-right" : ""}>
            <DialogTitle className="text-lg font-bold text-[var(--color-heading)]">
              {tc("leaveTitle")}
            </DialogTitle>
            <DialogDescription className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              {tc("leaveBody")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className={`gap-2 ${isAr ? "sm:flex-row-reverse" : ""}`}>
            <button
              onClick={() => setLeaveOpen(false)}
              className="px-5 py-2.5 rounded-sm border border-[var(--color-deep-accent)]/30 text-sm font-medium text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text)] transition-colors cursor-pointer"
            >
              {tc("leaveStay")}
            </button>
            <button
              onClick={leave}
              className="px-5 py-2.5 rounded-sm bg-[var(--color-accent)] text-[var(--color-dark)] text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors cursor-pointer"
            >
              {tc("leaveConfirm")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* One fixed surface for picks and navigation, on every step */}
      <ConfiguratorBar
        locale={locale}
        chips={chips}
        onChipClick={handleChipClick}
        onBack={goPrev}
        showBack={!isFirstStep}
        backLabel={tc("back")}
        picksLabel={tc("yourPicks")}
        secondary={secondary}
        primary={primary}
      />
    </div>
  );
}

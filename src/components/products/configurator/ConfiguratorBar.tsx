"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ClipboardList, Pencil } from "lucide-react";
import type { StepType } from "@/types/configurator";

export interface PickChip {
  /** The step that owns this selection — clicking the chip returns there. */
  step: StepType;
  /** What the chip is, for the accessible name: "Fabric", "Colour"… */
  field: string;
  label: string;
  bg: string | null;
  isGradient: boolean;
}

export interface BarAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: "arrow" | "check" | "clipboard";
}

interface ConfiguratorBarProps {
  locale: string;
  chips: PickChip[];
  onChipClick: (step: StepType) => void;
  onBack: () => void;
  showBack: boolean;
  backLabel: string;
  picksLabel: string;
  secondary?: BarAction | null;
  primary: BarAction;
}

/**
 * The configurator's one fixed surface: current picks on the left, navigation
 * on the right, pinned to the viewport on every step.
 *
 * Previously the bar only appeared on the plain option steps. The AI preview
 * and review steps rendered their own Continue / Skip / Add buttons at the
 * bottom of the scrolling content, so on exactly the two tallest steps the
 * visitor had to scroll to find the way forward while the picks bar stayed
 * pinned. Every step now supplies its actions to this bar instead.
 *
 * Chips are buttons. A selection you can see is a selection you should be able
 * to change, so clicking one returns to the step that owns it.
 */
export function ConfiguratorBar({
  locale,
  chips,
  onChipClick,
  onBack,
  showBack,
  backLabel,
  picksLabel,
  secondary,
  primary,
}: ConfiguratorBarProps) {
  const isAr = locale === "ar";
  const BackArrow = isAr ? ArrowRight : ArrowLeft;
  const FwdArrow = isAr ? ArrowLeft : ArrowRight;

  const PrimaryIcon =
    primary.icon === "check" ? Check : primary.icon === "clipboard" ? ClipboardList : null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 pointer-events-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="glass-card rounded-sm p-3 pointer-events-auto flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4">
          {/* Picks — each one returns to the step that set it */}
          {chips.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide min-w-0 sm:flex-1">
              <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest flex-shrink-0">
                {picksLabel}
              </span>
              {chips.map((chip) => (
                <motion.button
                  key={`${chip.step}-${chip.label}`}
                  onClick={() => onChipClick(chip.step)}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  aria-label={
                    isAr
                      ? `تغيير ${chip.field}: ${chip.label}`
                      : `Change ${chip.field.toLowerCase()}: ${chip.label}`
                  }
                  title={isAr ? `تغيير ${chip.field}` : `Change ${chip.field.toLowerCase()}`}
                  className="group flex items-center gap-1.5 ps-2.5 pe-2 py-1 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-deep-accent)]/20 hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-accent)]/[0.06] transition-colors duration-200 flex-shrink-0 cursor-pointer"
                >
                  {chip.bg && (
                    <span
                      className="w-3 h-3 rounded-full border border-white/15 flex-shrink-0"
                      style={
                        chip.isGradient ? { background: chip.bg } : { backgroundColor: chip.bg }
                      }
                    />
                  )}
                  <span className="text-xs text-[var(--color-text)] whitespace-nowrap">
                    {chip.label}
                  </span>
                  <Pencil
                    size={10}
                    strokeWidth={1.75}
                    aria-hidden="true"
                    className="text-[var(--color-text-muted)] opacity-40 group-hover:opacity-100 group-hover:text-[var(--color-accent)] transition-opacity duration-200 flex-shrink-0"
                  />
                </motion.button>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-2 flex-shrink-0 justify-between sm:justify-end">
            <button
              onClick={onBack}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium flex-shrink-0 border transition-all duration-200 ${
                showBack
                  ? "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text)] cursor-pointer"
                  : "opacity-0 pointer-events-none"
              }`}
              tabIndex={showBack ? 0 : -1}
              aria-hidden={!showBack}
            >
              <BackArrow size={16} />
              {backLabel}
            </button>

            {secondary && (
              <button
                onClick={secondary.onClick}
                className="px-3 py-2 rounded-sm text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] underline underline-offset-2 transition-colors flex-shrink-0 cursor-pointer whitespace-nowrap"
              >
                {secondary.label}
              </button>
            )}

            <motion.button
              onClick={primary.onClick}
              disabled={primary.disabled}
              aria-disabled={primary.disabled}
              whileHover={primary.disabled ? {} : { scale: 1.02 }}
              whileTap={primary.disabled ? {} : { scale: 0.98 }}
              className={`flex items-center gap-2 px-6 py-2 rounded-sm text-sm font-semibold flex-shrink-0 transition-all duration-200 whitespace-nowrap ${
                primary.disabled
                  ? "bg-[var(--color-deep-accent)]/20 text-[var(--color-text-muted)] cursor-not-allowed"
                  : "bg-[var(--color-accent)] text-[var(--color-dark)] hover:bg-[var(--color-accent-hover)] cursor-pointer"
              }`}
            >
              {PrimaryIcon && <PrimaryIcon size={16} strokeWidth={1.75} />}
              {primary.label}
              {!PrimaryIcon && <FwdArrow size={16} />}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, type ReactNode } from "react";
import { Check, Minus, Plus } from "lucide-react";

/**
 * The form vocabulary, in one place.
 *
 * Five enquiry forms ask the same *kinds* of question — pick one of these,
 * tick any of these, how many — and the styling for each was long enough that
 * repeating it five times would guarantee they drifted apart. Every control
 * here is RTL-aware through `isAr`; none of them own any state that outlives a
 * keystroke, except `Stepper`, which keeps a string draft so the field can be
 * cleared while typing.
 */

const CHIP_BASE =
  "px-4 py-2 rounded-sm text-xs font-medium border transition-all duration-200";
const CHIP_ON =
  "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/8";
const CHIP_OFF =
  "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50";

export const inputClass = (isAr: boolean) =>
  `w-full px-3 py-2.5 rounded-sm bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors ${isAr ? "text-right" : ""}`;

export function FieldLabel({
  htmlFor,
  children,
  hint,
  isAr,
  action,
}: {
  htmlFor?: string;
  children: ReactNode;
  hint?: string;
  isAr: boolean;
  action?: ReactNode;
}) {
  return (
    <div className={`flex items-end justify-between gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
      <div className={isAr ? "text-right" : ""}>
        <label
          htmlFor={htmlFor}
          className="block text-xs text-[var(--color-text-muted)] font-medium"
        >
          {children}
        </label>
        {hint && (
          <p className="text-[11px] text-[var(--color-text-muted)]/80 mt-1 leading-snug">{hint}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export interface ChipOption {
  value: string;
  label: string;
  /** Small trailing detail, e.g. a bed size's dimensions. */
  sub?: string;
  /** Renders a colour dot before the label — frame finishes, fabric families. */
  hex?: string;
}

/**
 * A row of single-choice chips. Clicking the active chip clears it, so a
 * visitor can undo an answer they only meant to look at.
 */
export function ChipGroup({
  options,
  value,
  onChange,
  isAr,
  testId,
}: {
  options: readonly ChipOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  isAr: boolean;
  testId?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${isAr ? "justify-end" : ""}`}>
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            data-testid={testId}
            onClick={() => onChange(selected ? null : option.value)}
            aria-pressed={selected}
            className={`${CHIP_BASE} ${selected ? CHIP_ON : CHIP_OFF} ${option.hex ? "inline-flex items-center gap-2" : ""} ${isAr ? "flex-row-reverse" : ""}`}
          >
            {option.hex && (
              <span
                className="w-3 h-3 rounded-full flex-shrink-0 border border-white/10"
                style={{ backgroundColor: option.hex }}
              />
            )}
            {option.label}
            {option.sub && (
              <span className="text-[10px] text-[var(--color-text-muted)]/70 ms-1.5">
                {option.sub}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** The tick box used by every multi-select and toggle in the forms. */
function Tick({ on }: { on: boolean }) {
  return (
    <span
      className={`mt-0.5 w-5 h-5 rounded-sm flex-shrink-0 flex items-center justify-center border transition-all duration-200 ${
        on
          ? "bg-[var(--color-accent)] border-[var(--color-accent)]"
          : "border-[var(--color-deep-accent)]/50"
      }`}
    >
      {on && <Check size={12} strokeWidth={3} className="text-[var(--color-dark)]" />}
    </span>
  );
}

/**
 * A full-width tickable row with room to explain itself — curtain layers,
 * fabric treatments, the measuring-visit offer. Used where the *description*
 * is the point, not just the label.
 */
export function SelectableRow({
  selected,
  title,
  sub,
  description,
  onToggle,
  isAr,
  testId,
}: {
  selected: boolean;
  title: string;
  /** Accent-coloured line between title and description. */
  sub?: string;
  description?: string;
  onToggle: () => void;
  isAr: boolean;
  testId?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      data-testid={testId}
      className={`w-full flex items-start gap-3.5 p-4 rounded-sm border transition-all duration-200 ${
        selected
          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/[0.06]"
          : "border-[var(--color-deep-accent)]/30 hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-accent)]/[0.02]"
      } ${isAr ? "flex-row-reverse text-right" : "text-left"}`}
    >
      <Tick on={selected} />
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-[var(--color-heading)] leading-snug">
          {title}
        </span>
        {sub && (
          <span className="block text-[11px] text-[var(--color-accent)]/80 mt-1 leading-snug">
            {sub}
          </span>
        )}
        {description && (
          <span className="block text-xs text-[var(--color-text-muted)] mt-1.5 leading-relaxed">
            {description}
          </span>
        )}
      </span>
    </button>
  );
}

/** Card-shaped single choice, laid out in a grid — control, filling, cushions. */
export function OptionCard({
  selected,
  title,
  description,
  onClick,
  isAr,
  testId,
}: {
  selected: boolean;
  title: string;
  description?: string;
  onClick: () => void;
  isAr: boolean;
  testId?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      data-testid={testId}
      className={`p-4 rounded-sm border transition-all duration-200 ${
        selected
          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/[0.06]"
          : "border-[var(--color-deep-accent)]/30 hover:border-[var(--color-accent)]/50"
      } ${isAr ? "text-right" : "text-left"}`}
    >
      <span className="block text-sm font-semibold text-[var(--color-heading)]">{title}</span>
      {description && (
        <span className="block text-[11px] text-[var(--color-text-muted)] mt-1.5 leading-relaxed">
          {description}
        </span>
      )}
    </button>
  );
}

export function OptionCardGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">{children}</div>;
}

/**
 * A number with buttons either side.
 *
 * Holds the field as a string so it can be emptied mid-edit — a controlled
 * number input that coerces on every keystroke makes backspacing to change
 * "12" into "3" impossible. The committed value is normalised on blur.
 */
export function Stepper({
  id,
  value,
  onChange,
  unitLabel,
  isAr,
  min = 1,
  decreaseLabel,
  increaseLabel,
}: {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  unitLabel?: string;
  isAr: boolean;
  min?: number;
  decreaseLabel: string;
  increaseLabel: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? String(value);

  const commit = (raw: string) => {
    const next = Math.max(min, Math.floor(Number(raw)) || min);
    setDraft(null);
    onChange(next);
  };

  const button =
    "w-10 h-10 flex items-center justify-center rounded-sm border border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text)] transition-colors";

  return (
    <div className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label={decreaseLabel}
        className={button}
      >
        <Minus size={14} strokeWidth={1.75} />
      </button>
      <input
        id={id}
        type="number"
        min={min}
        inputMode="numeric"
        value={shown}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        className="w-24 px-3 py-2.5 rounded-sm bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm text-center focus:outline-none focus:border-[var(--color-accent)] transition-colors"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label={increaseLabel}
        className={button}
      >
        <Plus size={14} strokeWidth={1.75} />
      </button>
      {unitLabel && <span className="text-xs text-[var(--color-text-muted)]">{unitLabel}</span>}
    </div>
  );
}

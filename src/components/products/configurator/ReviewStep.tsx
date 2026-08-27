"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Minus, Plus, Check, Layers, ArrowRight, ArrowLeft } from "lucide-react";
import type { ConfiguratorState, CategoryType } from "@/types/configurator";
import { useBriefStore } from "@/lib/brief/store";
import { lineItemFromConfigurator } from "@/lib/brief/types";
import { lineItemChips, MAX_INSPIRATION, UNIT_LABELS } from "@/lib/brief/format";

interface ReviewStepProps {
  state: ConfiguratorState;
  onChange: (updates: Partial<ConfiguratorState>) => void;
  locale: string;
  category: CategoryType;
  categoryLabel: string;
  /** Set when the visitor arrived via "edit" on an existing brief item. */
  editingId: string | null;
}

/**
 * The configurator's final step.
 *
 * This replaces `InquiryStep`, which ended the flow with a `mailto:` link and
 * therefore never told the server a lead existed. The configurator now
 * produces a line item; sending happens once, on `/products/brief`.
 *
 * The step owns exactly one line item. Once committed, its id is held in
 * `committedId` and every later commit *replaces* that item rather than
 * appending — so pressing the button twice cannot put two copies of the same
 * piece into the brief, and changing a selection afterwards updates it.
 */
export function ReviewStep({
  state,
  onChange,
  locale,
  category,
  categoryLabel,
  editingId,
}: ReviewStepProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const addItem = useBriefStore((s) => s.addItem);
  const replaceItem = useBriefStore((s) => s.replaceItem);
  const openDrawer = useBriefStore((s) => s.openDrawer);
  const items = useBriefStore((s) => s.items);
  const toggleInspiration = useBriefStore((s) => s.toggleInspiration);
  const briefInspiration = useBriefStore((s) => s.inspirationImages);

  const existing = editingId ? items.find((i) => i.id === editingId) : undefined;
  const [quantity, setQuantity] = useState(existing?.quantity ?? 1);
  const [committedId, setCommittedId] = useState<string | null>(editingId);

  const hasCommitted = committedId !== null;
  const isEditing = editingId !== null;

  const draft = lineItemFromConfigurator(state, category, quantity, committedId ?? undefined);
  const chips = lineItemChips(draft, isAr);
  const unit = UNIT_LABELS[category][isAr ? "ar" : "en"];

  /**
   * Inspiration is chosen per-item inside the AI visualization step but belongs
   * to the brief as a whole, so it is merged up on commit. The cap is the same
   * one the brief page enforces, so the two can never disagree.
   */
  const mergeInspiration = () => {
    for (const src of state.inspirationImages) {
      if (!briefInspiration.includes(src)) toggleInspiration(src, MAX_INSPIRATION);
    }
  };

  const commit = () => {
    if (committedId) {
      replaceItem({ ...draft, id: committedId });
    } else {
      addItem(draft);
      setCommittedId(draft.id);
    }
    mergeInspiration();
  };

  const handleCommit = () => {
    commit();
    openDrawer();
  };

  const handleAddAnother = () => {
    commit();
    router.push(`/${locale}/products`);
  };

  const primaryLabel = isEditing
    ? isAr ? "حفظ التغييرات" : "Save changes"
    : hasCommitted
      ? isAr ? "تحديث الموجز" : "Update your brief"
      : isAr ? "أضف إلى الموجز" : "Add to Brief";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className={isAr ? "text-right" : ""}>
        <h2 className="text-2xl font-bold text-[var(--color-heading)] mb-1.5">
          {isEditing
            ? isAr ? "تعديل هذه القطعة" : "Edit this piece"
            : isAr ? "راجع اختياراتك" : "Review your piece"}
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
          {isAr
            ? "أضفها إلى موجزك، ثم أضف قطعًا أخرى أو أرسل الموجز كاملًا."
            : "Add it to your brief, then add more pieces or send the whole brief at once."}
        </p>
      </div>

      {/* Summary card */}
      <div className="rounded-sm border border-[var(--color-deep-accent)]/20 bg-[var(--color-surface)] p-5 space-y-4">
        <div className={`flex items-center justify-between gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
          <p className="text-sm font-bold text-[var(--color-heading)]">{categoryLabel}</p>
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
            {isAr ? "ملخص" : "Summary"}
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          {chips.map((chip) => (
            <div key={chip.label} className={isAr ? "text-right" : ""}>
              <dt className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                {chip.label}
              </dt>
              <dd className={`text-sm text-[var(--color-text)] mt-0.5 flex items-center gap-1.5 ${isAr ? "flex-row-reverse" : ""}`}>
                {chip.hex && (
                  <span
                    className="w-3 h-3 rounded-full border border-white/20 flex-shrink-0"
                    style={{ background: chip.hex }}
                  />
                )}
                <span className="truncate">{chip.value}</span>
              </dd>
            </div>
          ))}
        </dl>

        {state.aiDisplayUrl && (
          <div className={`flex items-center gap-3 pt-3 border-t border-[var(--color-deep-accent)]/15 ${isAr ? "flex-row-reverse" : ""}`}>
            <div className="relative w-14 h-20 rounded-sm overflow-hidden border border-[var(--color-deep-accent)]/20 flex-shrink-0">
              <Image
                src={state.aiDisplayUrl}
                alt=""
                fill
                className="object-cover"
                sizes="56px"
                unoptimized
              />
            </div>
            <div className={isAr ? "text-right" : ""}>
              <p className="text-xs font-medium text-[var(--color-text)]">
                {isAr ? "المعاينة التوليدية" : "AI preview"}
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                {isAr ? "سيُرفق مع الموجز" : "Included with your brief"}
              </p>
            </div>
          </div>
        )}

        {/* Quantity — counted in the unit this category is actually quoted in */}
        <div className={`flex items-center justify-between gap-4 pt-3 border-t border-[var(--color-deep-accent)]/15 ${isAr ? "flex-row-reverse" : ""}`}>
          <div className={isAr ? "text-right" : ""}>
            <p className="text-xs font-medium text-[var(--color-text)]">
              {isAr ? "الكمية" : "How many"}
            </p>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
              {isAr ? `العدد المطلوب بال${unit}` : `Counted in ${unit}`}
            </p>
          </div>
          <div className={`inline-flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
            <div className={`inline-flex items-center rounded-sm border border-[var(--color-deep-accent)]/25 ${isAr ? "flex-row-reverse" : ""}`}>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label={isAr ? "إنقاص" : "Decrease"}
                className="w-9 h-9 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <Minus size={13} />
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                aria-label={isAr ? "الكمية" : "Quantity"}
                className="w-14 h-9 bg-transparent text-center text-sm font-semibold tabular-nums text-[var(--color-text)] focus:outline-none"
              />
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label={isAr ? "زيادة" : "Increase"}
                className="w-9 h-9 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
              >
                <Plus size={13} />
              </button>
            </div>
            <span className="text-xs text-[var(--color-text-muted)] whitespace-nowrap">{unit}</span>
          </div>
        </div>
      </div>

      {/* Item notes */}
      <div className="space-y-1.5">
        <label
          htmlFor="item-notes"
          className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}
        >
          {isAr ? "ملاحظات على هذه القطعة" : "Notes on this piece"}
        </label>
        <textarea
          id="item-notes"
          rows={3}
          value={state.inquiryNotes}
          onChange={(e) => onChange({ inquiryNotes: e.target.value })}
          className={`w-full px-3 py-2.5 rounded-sm bg-[var(--color-surface)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none ${isAr ? "text-right" : ""}`}
          placeholder={
            isAr ? "أي تفاصيل خاصة بهذه القطعة…" : "Anything specific about this piece…"
          }
        />
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <motion.button
          onClick={handleCommit}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-sm bg-[var(--color-accent)] text-[var(--color-dark)] text-sm font-semibold tracking-wide hover:bg-[var(--color-accent-hover)] transition-colors cursor-pointer ${isAr ? "flex-row-reverse" : ""}`}
        >
          {hasCommitted && !isEditing ? <Check size={16} /> : <ClipboardList size={16} strokeWidth={1.75} />}
          {primaryLabel}
        </motion.button>

        <AnimatePresence initial={false}>
          {hasCommitted && !isEditing && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`text-xs text-[var(--color-text-muted)] overflow-hidden ${isAr ? "text-right" : "text-center"}`}
            >
              {isAr
                ? "هذه القطعة في موجزك. أي تعديل هنا يحدّثها بدل إضافة نسخة جديدة."
                : "This piece is in your brief. Further changes update it rather than adding a copy."}
            </motion.p>
          )}
        </AnimatePresence>

        {!isEditing && (
          <button
            onClick={handleAddAnother}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-sm border border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] text-sm font-medium hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text)] transition-colors cursor-pointer ${isAr ? "flex-row-reverse" : ""}`}
          >
            <Layers size={15} strokeWidth={1.5} />
            {isAr ? "صمّم قطعة أخرى" : "Configure another piece"}
            <Arrow size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

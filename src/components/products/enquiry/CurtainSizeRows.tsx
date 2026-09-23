"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { SelectableRow } from "./fields";
import type { EnquiryContext } from "./types";
import type { CurtainSize } from "@/types/configurator";

/**
 * Window measurements, one row per window.
 *
 * A hotel rarely has one window size, so a single width × height field would
 * force the real answer into a notes box where nobody can cost it. Rows keep
 * it structured; the measuring-visit toggle replaces them outright, because
 * someone who wants us to come and measure has no numbers to type.
 */

/** Stable row id. `crypto.randomUUID` needs a secure context; HTTP dev needs the fallback. */
export function newRowId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `size-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function emptySizeRow(): CurtainSize {
  return { id: newRowId(), label: "", widthCm: "", heightCm: "", quantity: "1" };
}

/** Rows carrying both measurements — a half-filled row is not a window. */
export function usableSizes(rows: CurtainSize[]): CurtainSize[] {
  return rows.filter((row) => row.widthCm.trim() && row.heightCm.trim());
}

export function CurtainSizeRows({ config, update, isAr }: EnquiryContext) {
  const rows = config.curtainSizes;

  const patch = (id: string, updates: Partial<CurtainSize>) =>
    update({ curtainSizes: rows.map((r) => (r.id === id ? { ...r, ...updates } : r)) });

  const numberField = `w-full px-2.5 py-2 rounded-sm bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-xs focus:outline-none focus:border-[var(--color-accent)] transition-colors ${isAr ? "text-right" : ""}`;
  const labelClass = `block text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`;

  return (
    <div className="space-y-4">
      <SelectableRow
        selected={config.requestMeasurement}
        onToggle={() => update({ requestMeasurement: !config.requestMeasurement })}
        title={isAr ? "أفضّل أن يحضر أحدكم للقياس" : "I'd rather you came and measured"}
        description={
          isAr
            ? "نرتب زيارة قياس داخل القاهرة الكبرى."
            : "We'll arrange a measuring visit within Greater Cairo."
        }
        isAr={isAr}
        testId="measure-visit"
      />

      <AnimatePresence initial={false}>
        {!config.requestMeasurement && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden"
          >
            <p className={`text-xs text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}>
              {isAr
                ? "أضف صفًا لكل نافذة أو لكل مقاس مختلف. القياسات بالسنتيمتر."
                : "One row per window, or per distinct size. Measurements in centimetres."}
            </p>

            {rows.map((row, index) => (
              <div
                key={row.id}
                className="rounded-sm border border-[var(--color-deep-accent)]/25 p-3 space-y-2.5"
              >
                <div className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => patch(row.id, { label: e.target.value })}
                    aria-label={isAr ? "الغرفة أو النافذة" : "Room or window"}
                    className={`flex-1 px-2.5 py-2 rounded-sm bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-xs placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors ${isAr ? "text-right" : ""}`}
                    placeholder={
                      isAr ? `نافذة ${index + 1} (اختياري)` : `Window ${index + 1} (optional label)`
                    }
                  />
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => update({ curtainSizes: rows.filter((r) => r.id !== row.id) })}
                      aria-label={isAr ? "احذف الصف" : "Remove row"}
                      className="flex-shrink-0 p-2 text-[var(--color-text-muted)] hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} strokeWidth={1.5} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label htmlFor={`cq-w-${row.id}`} className={labelClass}>
                      {isAr ? "العرض (سم)" : "Width (cm)"}
                    </label>
                    <input
                      id={`cq-w-${row.id}`}
                      type="number"
                      min={1}
                      inputMode="numeric"
                      value={row.widthCm}
                      onChange={(e) => patch(row.id, { widthCm: e.target.value })}
                      className={numberField}
                      placeholder="180"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor={`cq-h-${row.id}`} className={labelClass}>
                      {isAr ? "الارتفاع (سم)" : "Height (cm)"}
                    </label>
                    <input
                      id={`cq-h-${row.id}`}
                      type="number"
                      min={1}
                      inputMode="numeric"
                      value={row.heightCm}
                      onChange={(e) => patch(row.id, { heightCm: e.target.value })}
                      className={numberField}
                      placeholder="260"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor={`cq-q-${row.id}`} className={labelClass}>
                      {isAr ? "العدد" : "How many"}
                    </label>
                    <input
                      id={`cq-q-${row.id}`}
                      type="number"
                      min={1}
                      inputMode="numeric"
                      value={row.quantity}
                      onChange={(e) => patch(row.id, { quantity: e.target.value })}
                      className={numberField}
                      placeholder="1"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => update({ curtainSizes: [...rows, emptySizeRow()] })}
              className={`inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-accent)] hover:underline underline-offset-4 ${isAr ? "flex-row-reverse" : ""}`}
            >
              <Plus size={13} strokeWidth={1.75} />
              {isAr ? "أضف نافذة أخرى" : "Add another window"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

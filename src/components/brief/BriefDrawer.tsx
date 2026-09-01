"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { startLenis, stopLenis } from "@/components/providers/LenisProvider";
import { X, Minus, Plus, Pencil, Trash2, ClipboardList, ArrowRight, ArrowLeft } from "lucide-react";
import { useBriefStore, safeQuantity } from "@/lib/brief/store";
import { lineItemChips, lineItemTitle, UNIT_LABELS } from "@/lib/brief/format";

/**
 * The brief drawer — reachable from every page via the header button.
 *
 * Mounted once in the locale layout rather than per page, so its contents
 * survive navigation between the catalog and the configurator. Uses logical
 * properties (`end-0`, `border-s`) so it opens from the correct side in
 * Arabic; the showroom drawer this replaces was pinned to `right-0` and did
 * not mirror.
 */
export function BriefDrawer() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const open = useBriefStore((s) => s.drawerOpen);
  const close = useBriefStore((s) => s.closeDrawer);
  const items = useBriefStore((s) => s.items);
  const hydrated = useBriefStore((s) => s.hydrated);
  const removeItem = useBriefStore((s) => s.removeItem);
  const setQuantity = useBriefStore((s) => s.setQuantity);

  const panelRef = useRef<HTMLDivElement>(null);

  // Scroll lock (native + Lenis) and Escape to close.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    stopLenis();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      startLenis();
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  // Focus trap — the mobile nav already sets this standard, and a drawer that
  // lets Tab wander behind its own overlay is worse than one that never opened.
  useEffect(() => {
    if (!open || !panelRef.current) return;
    const panel = panelRef.current;
    panel.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const visibleItems = hydrated ? items : [];
  const totalPieces = visibleItems.reduce((sum, i) => sum + safeQuantity(i.quantity), 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-black/55 backdrop-blur-sm"
            onClick={close}
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={isAr ? "الموجز" : "Your brief"}
            initial={{ x: isAr ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isAr ? "-100%" : "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed top-0 bottom-0 end-0 z-[100] w-full max-w-md flex flex-col bg-[var(--color-bg)] border-s border-[var(--color-deep-accent)]/20 shadow-[var(--shadow-lg)] outline-none"
            data-lenis-prevent
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-[var(--color-deep-accent)]/15">
              <div>
                <h2 className="text-lg font-bold text-[var(--color-heading)] leading-tight">
                  {isAr ? "موجزك" : "Your Brief"}
                </h2>
                <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                  {visibleItems.length === 0
                    ? isAr ? "لا توجد عناصر بعد" : "No items yet"
                    : isAr
                      ? `${visibleItems.length} منتج · ${totalPieces} قطعة`
                      : `${visibleItems.length} product${visibleItems.length === 1 ? "" : "s"} · ${totalPieces} piece${totalPieces === 1 ? "" : "s"}`}
                </p>
              </div>
              <button
                onClick={close}
                aria-label={isAr ? "إغلاق" : "Close"}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5">
              {visibleItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-16">
                  <div className="w-14 h-14 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
                    <ClipboardList size={24} strokeWidth={1.3} className="text-[var(--color-text-muted)]" />
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] max-w-[16rem] leading-relaxed">
                    {isAr
                      ? "اختر قماشًا من الكتالوج وصمّم منتجك، ثم أضفه إلى موجزك."
                      : "Pick a fabric from the catalog and configure a product, then add it to your brief."}
                  </p>
                  <Link
                    href={`/${locale}/products`}
                    onClick={close}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] hover:underline underline-offset-4"
                  >
                    {isAr ? "تصفّح الأقمشة" : "Browse fabrics"}
                    <Arrow size={13} />
                  </Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  {visibleItems.map((item) => {
                    const chips = lineItemChips(item, isAr);
                    return (
                      <li
                        key={item.id}
                        className="rounded-sm border border-[var(--color-deep-accent)]/15 bg-[var(--color-surface)] p-4 space-y-3"
                      >
                        <div className={`flex items-start gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
                          <div className={`flex-1 min-w-0 ${isAr ? "text-right" : ""}`}>
                            <p className="text-sm font-semibold text-[var(--color-heading)] leading-snug">
                              {lineItemTitle(item, isAr)}
                            </p>
                            <div className={`flex flex-wrap gap-x-3 gap-y-1 mt-1.5 ${isAr ? "justify-end" : ""}`}>
                              {chips.slice(0, 4).map((chip) => (
                                <span
                                  key={chip.label}
                                  className="inline-flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]"
                                >
                                  {chip.hex && (
                                    <span
                                      className="w-2.5 h-2.5 rounded-full border border-white/15"
                                      style={{ background: chip.hex }}
                                    />
                                  )}
                                  {chip.value}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className={`flex items-center justify-between gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
                          {/* Quantity */}
                          <div className={`inline-flex items-center rounded-sm border border-[var(--color-deep-accent)]/25 ${isAr ? "flex-row-reverse" : ""}`}>
                            <button
                              onClick={() => setQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              aria-label={isAr ? "إنقاص الكمية" : "Decrease quantity"}
                              className="w-7 h-7 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-xs font-semibold tabular-nums text-[var(--color-text)]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => setQuantity(item.id, item.quantity + 1)}
                              aria-label={isAr ? "زيادة الكمية" : "Increase quantity"}
                              className="w-7 h-7 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
                            >
                              <Plus size={12} />
                            </button>
                            <span className="px-2 text-[10px] text-[var(--color-text-muted)] whitespace-nowrap">
                              {UNIT_LABELS[item.category][isAr ? "ar" : "en"]}
                            </span>
                          </div>

                          <div className={`flex items-center gap-1 ${isAr ? "flex-row-reverse" : ""}`}>
                            <Link
                              href={`/${locale}/products/${item.category}?edit=${item.id}`}
                              onClick={close}
                              aria-label={isAr ? "تعديل" : "Edit"}
                              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-sm text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                            >
                              <Pencil size={11} />
                              {isAr ? "تعديل" : "Edit"}
                            </Link>
                            <button
                              onClick={() => removeItem(item.id)}
                              aria-label={isAr ? "إزالة" : "Remove"}
                              className="inline-flex items-center px-2 py-1.5 rounded-sm text-[var(--color-text-muted)] hover:text-red-400 transition-colors cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {visibleItems.length > 0 && (
              <div className="border-t border-[var(--color-deep-accent)]/15 px-6 py-5 space-y-3">
                <Link
                  href={`/${locale}/products/brief`}
                  onClick={close}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-sm bg-[var(--color-accent)] text-[var(--color-dark)] text-sm font-semibold tracking-wide hover:bg-[var(--color-accent-hover)] transition-colors ${isAr ? "flex-row-reverse" : ""}`}
                >
                  {isAr ? "مراجعة وإرسال" : "Review & Send"}
                  <Arrow size={15} />
                </Link>
                <Link
                  href={`/${locale}/products`}
                  onClick={close}
                  className="block text-center text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors underline underline-offset-2"
                >
                  {isAr ? "متابعة التصفح" : "Continue browsing"}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

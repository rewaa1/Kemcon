"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";

import type { Bilingual, EnquiryContext, EnquirySection } from "./types";
import type { ConfiguratorState } from "@/types/configurator";

/**
 * Which drawers are open, and the toggle that seeds one as it opens.
 *
 * Shared rather than held inside `OptionalSections` because the enquiry form
 * opens drawers from outside the list too: an item reopened from the brief
 * shows every section it has answers in, and arriving from the fabric catalog
 * opens the fabric drawer.
 */
export function useOptionalSections(
  sections: EnquirySection[],
  ctx: EnquiryContext,
  update: (updates: Partial<ConfiguratorState>) => void,
  initial?: () => Set<string>
) {
  const [expanded, setExpanded] = useState<Set<string>>(initial ?? (() => new Set()));

  const toggle = (key: string) => {
    const section = sections.find((s) => s.key === key);
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else {
        next.add(key);
        // Opening a section onto nothing is a dead end — measurements seed a row.
        const seed = section?.onOpen?.(ctx);
        if (seed) update(seed);
      }
      return next;
    });
  };

  return { expanded, setExpanded, toggle };
}

/**
 * The "add what you know" drawers: a list of optional questions that stay shut
 * until someone opens one.
 *
 * Extracted from `ProductEnquiryForm` so the mass-production page can offer the
 * curtain questions — layers, measurements, how they open, treatments, photos —
 * in the form a visitor has already met on the curtains page. Two renderings of
 * the same drawers would drift, and the difference would show up as two
 * different-looking versions of one question.
 */
export function OptionalSections({
  sections,
  ctx,
  isAr,
  expanded,
  onToggle,
  headingEn = "Add what you know (optional)",
  headingAr = "أضف ما تعرفه (اختياري)",
}: {
  sections: EnquirySection[];
  ctx: EnquiryContext;
  isAr: boolean;
  expanded: Set<string>;
  onToggle: (key: string) => void;
  headingEn?: string;
  headingAr?: string;
}) {
  const say = (pair: Bilingual) => (isAr ? pair.ar : pair.en);
  const toggleSection = onToggle;

  return (
    <div className="space-y-3">
      <div className={`flex items-center gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
        <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] flex-shrink-0">
          {isAr ? headingAr : headingEn}
        </span>
        <div className="h-px flex-1 bg-[var(--color-deep-accent)]/15" />
      </div>

      <div className="space-y-2.5">
        {sections.map((section) => {
          const Icon = section.icon;
          const isOpen = expanded.has(section.key);
          const summary = section.summary(ctx);
          return (
            <div key={section.key}>
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.div
                    key="open"
                    id={`cq-section-${section.key}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="glass-card rounded-sm p-6 space-y-4"
                  >
                    <div
                      className={`flex items-center justify-between ${isAr ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`flex items-center gap-2.5 ${isAr ? "flex-row-reverse" : ""}`}>
                        <Icon size={15} strokeWidth={1.5} className="text-[var(--color-accent)]" />
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                          {say(section.title)}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSection(section.key)}
                        aria-label={isAr ? "إخفاء" : "Hide"}
                        aria-expanded
                        aria-controls={`cq-section-${section.key}`}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors p-1 -m-1"
                      >
                        <X size={16} strokeWidth={1.5} />
                      </button>
                    </div>

                    {section.render(ctx)}
                  </motion.div>
                ) : (
                  <motion.button
                    key="closed"
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => toggleSection(section.key)}
                    aria-expanded={false}
                    aria-controls={`cq-section-${section.key}`}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-sm border border-dashed border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-accent)]/[0.03] hover:text-[var(--color-text)] transition-all duration-200 group ${isAr ? "flex-row-reverse text-right" : "text-left"}`}
                  >
                    <Icon size={16} strokeWidth={1.5} className="flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight">{say(section.title)}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)]/80 mt-0.5 leading-tight">
                        {say(section.description)}
                      </p>
                    </div>
                    {summary && (
                      <span className="text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-semibold flex-shrink-0">
                        {say(summary)}
                      </span>
                    )}
                    <Plus
                      size={14}
                      strokeWidth={1.75}
                      className="flex-shrink-0 transition-transform duration-200 group-hover:rotate-90 text-[var(--color-text-muted)]/60 group-hover:text-[var(--color-accent)]"
                    />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

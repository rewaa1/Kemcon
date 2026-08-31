"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Compass, Plus, RotateCcw, X } from "lucide-react";
import { useBriefStore } from "@/lib/brief/store";
import { track } from "@/lib/journey/track";
import { scrollToElement } from "@/components/providers/LenisProvider";
import type { BriefType } from "@/lib/brief/types";

/**
 * Two questions that route the visitor, so nobody has to recognise themselves
 * in Kemcon's internal service names.
 *
 * Collapsed by default, deliberately. The category cards already answer "which
 * product" and the service cards are plainly worded, so most visitors need no
 * routing at all — and an expanded form directly beneath the page's editorial
 * opening reads as lead qualification rather than as help. Offered as a quiet
 * line, it costs nothing to ignore and is there for the person who is stuck.
 *
 * It uses the same progressive-disclosure pattern as the optional sections on
 * the Design Plan form, so it is a shape the site already uses.
 */

type Furnishing = "home" | "hotel" | "office" | "unsure";
type Scale = "small" | "medium" | "large";

const FURNISHING: { value: Furnishing; en: string; ar: string }[] = [
  { value: "home", en: "My home", ar: "منزلي" },
  { value: "hotel", en: "A hotel or resort", ar: "فندق أو منتجع" },
  { value: "office", en: "An office or venue", ar: "مكتب أو قاعة" },
  { value: "unsure", en: "Not sure yet", ar: "لست متأكدًا بعد" },
];

const SCALE: { value: Scale; en: string; ar: string }[] = [
  { value: "small", en: "1–5 rooms", ar: "1–5 غرف" },
  { value: "medium", en: "6–50 rooms", ar: "6–50 غرفة" },
  { value: "large", en: "50+ rooms", ar: "أكثر من 50 غرفة" },
];

type Destination = "browse" | "design-plan" | "mass-production";

interface Resolution {
  type: BriefType;
  destination: Destination;
  en: { note: string; cta: string };
  ar: { note: string; cta: string };
  /** Whether to offer the "have us advise you" escape hatch. */
  offerAdvice: boolean;
}

function resolve(furnishing: Furnishing | null, scale: Scale | null): Resolution | null {
  if (!furnishing) return null;

  if (furnishing === "unsure") {
    return {
      type: "design",
      destination: "design-plan",
      en: {
        note: "No problem. Tell us what you have in mind and our architect will take it from there.",
        cta: "Tell us about it",
      },
      ar: {
        note: "لا مشكلة. أخبرنا بما يدور في ذهنك وسيتولى مصممنا المعماري الباقي.",
        cta: "أخبرنا بالتفاصيل",
      },
      offerAdvice: false,
    };
  }

  if (furnishing === "home") {
    return {
      type: "standard",
      destination: "browse",
      en: {
        note: "Pick what you're making below and design it piece by piece — the same materials we put in five-star hotels.",
        cta: "Browse products",
      },
      ar: {
        note: "اختر ما تودّ صنعه بالأسفل وصمّمه قطعة بقطعة — بنفس الخامات التي نوردها لفنادق الخمس نجوم.",
        cta: "تصفّح المنتجات",
      },
      offerAdvice: true,
    };
  }

  // hotel / office — the scale question decides
  if (!scale) return null;

  if (scale === "large") {
    return {
      type: "bulk",
      destination: "mass-production",
      en: {
        note: "At that volume we'll quote it as a contract — tell us the products and quantities and we'll come back with pricing and lead times.",
        cta: "Start a bulk enquiry",
      },
      ar: {
        note: "بهذا الحجم نتعامل معه كعقد — أخبرنا بالمنتجات والكميات وسنعود إليك بالأسعار ومواعيد التسليم.",
        cta: "ابدأ طلب الجملة",
      },
      offerAdvice: false,
    };
  }

  if (scale === "small") {
    return {
      type: "design",
      destination: "design-plan",
      en: {
        note: "For a handful of rooms our in-house architect will put a plan together with you before anything is made.",
        cta: "Request a design plan",
      },
      ar: {
        note: "لعدد قليل من الغرف، سيضع مصممنا المعماري خطة معك قبل تصنيع أي شيء.",
        cta: "اطلب خطة تصميم",
      },
      offerAdvice: false,
    };
  }

  return {
    type: "standard",
    destination: "browse",
    en: {
      note: "Configure each piece below and set the quantity as you go — everything collects into one brief.",
      cta: "Browse products",
    },
    ar: {
      note: "صمّم كل قطعة بالأسفل وحدّد الكمية أثناء ذلك — كل شيء يتجمّع في موجز واحد.",
      cta: "تصفّح المنتجات",
    },
    offerAdvice: true,
  };
}

const chipClass = (active: boolean) =>
  `px-4 py-2.5 rounded-sm text-sm font-medium border transition-all duration-200 cursor-pointer ${
    active
      ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/10"
      : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text)]"
  }`;

export function GuidedIntake({ categoriesAnchor }: { categoriesAnchor: string }) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const router = useRouter();

  const setBriefType = useBriefStore((s) => s.setType);
  const setBriefProject = useBriefStore((s) => s.setProject);

  const [open, setOpen] = useState(false);
  const [furnishing, setFurnishing] = useState<Furnishing | null>(null);
  const [scale, setScale] = useState<Scale | null>(null);

  const needsScale = furnishing === "hotel" || furnishing === "office";
  const resolution = resolve(furnishing, scale);

  const go = (destination: Destination, type: BriefType) => {
    setBriefType(type);

    // Seed what we already know. The destination forms read these back, so the
    // visitor is not asked the same thing twice.
    if (furnishing === "hotel" || furnishing === "office") {
      const value = furnishing === "hotel" ? "hotel" : "office";
      if (type === "bulk") setBriefProject({ projectType: value });
      else setBriefProject({ propertyType: value });
    }

    if (destination === "browse") scrollToElement(categoriesAnchor);
    else router.push(`/${locale}/products/${destination}`);
  };

  const reset = () => {
    setFurnishing(null);
    setScale(null);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-expanded={false}
        aria-controls="guided-intake"
        className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-sm border border-dashed border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-accent)]/[0.03] hover:text-[var(--color-text)] transition-all duration-200 group cursor-pointer ${isAr ? "flex-row-reverse text-right" : "text-left"}`}
      >
        <Compass size={16} strokeWidth={1.5} className="flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-tight">
            {isAr ? "لست متأكدًا من أين تبدأ؟" : "Not sure where to start?"}
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)]/80 mt-0.5 leading-tight">
            {isAr
              ? "أجب عن سؤالين وسنرشدك إلى المكان المناسب."
              : "Answer two quick questions and we'll point you to the right place."}
          </p>
        </div>
        <Plus
          size={14}
          strokeWidth={1.75}
          className="flex-shrink-0 transition-transform duration-200 group-hover:rotate-90 text-[var(--color-text-muted)]/60 group-hover:text-[var(--color-accent)]"
        />
      </button>
    );
  }

  return (
    <motion.div
      id="guided-intake"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-sm p-6 sm:p-7 space-y-5"
    >
      {/* Question 1 */}
      <div role="group" aria-labelledby="intake-q1" className="space-y-3">
        <div className={`flex items-start justify-between gap-4 ${isAr ? "flex-row-reverse" : ""}`}>
          <p
            id="intake-q1"
            className={`text-sm font-semibold text-[var(--color-heading)] ${isAr ? "text-right" : ""}`}
          >
            {isAr ? "ماذا تودّ أن تفرش؟" : "What are you furnishing?"}
          </p>
          <button
            onClick={() => {
              setOpen(false);
              reset();
            }}
            aria-label={isAr ? "إخفاء" : "Hide"}
            aria-expanded
            aria-controls="guided-intake"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors p-1 -m-1 flex-shrink-0 cursor-pointer"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
        <div className={`flex flex-wrap gap-2 ${isAr ? "justify-end" : ""}`}>
          {FURNISHING.map((option) => (
            <button
              key={option.value}
              aria-pressed={furnishing === option.value}
              onClick={() => {
                const next = furnishing === option.value ? null : option.value;
                setFurnishing(next);
                setScale(null);
                // Only a chosen answer is worth recording. Deselecting is the
                // visitor changing their mind, not an answer.
                if (next) track({ t: "intake_answer", question: "furnishing", answer: next });
              }}
              className={chipClass(furnishing === option.value)}
            >
              {isAr ? option.ar : option.en}
            </button>
          ))}
        </div>
      </div>

      {/*
        One live region covering both the follow-up question and the answer, so
        a screen reader is told when either appears. Announcing only the
        resolution left the second question silent.
      */}
      <div aria-live="polite" className="space-y-5 empty:hidden">
        <AnimatePresence initial={false}>
          {needsScale && (
            <motion.div
              key="scale"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div role="group" aria-labelledby="intake-q2" className="space-y-3 pt-1">
                <p
                  id="intake-q2"
                  className={`text-sm font-semibold text-[var(--color-heading)] ${isAr ? "text-right" : ""}`}
                >
                  {isAr ? "كم عدد الغرف؟" : "How many rooms?"}
                </p>
                <div className={`flex flex-wrap gap-2 ${isAr ? "justify-end" : ""}`}>
                  {SCALE.map((option) => (
                    <button
                      key={option.value}
                      aria-pressed={scale === option.value}
                      onClick={() => {
                        const next = scale === option.value ? null : option.value;
                        setScale(next);
                        if (next) track({ t: "intake_answer", question: "scale", answer: next });
                      }}
                      className={chipClass(scale === option.value)}
                    >
                      {isAr ? option.ar : option.en}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {resolution && (
            <motion.div
              key="resolution"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-[var(--color-deep-accent)]/15 space-y-4">
                <p
                  className={`text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xl ${isAr ? "text-right ms-auto" : ""}`}
                >
                  {isAr ? resolution.ar.note : resolution.en.note}
                </p>

                <div
                  className={`flex flex-wrap items-center gap-x-5 gap-y-3 ${isAr ? "flex-row-reverse" : ""}`}
                >
                  <motion.button
                    onClick={() => go(resolution.destination, resolution.type)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-[var(--color-accent)] text-[var(--color-dark)] text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors cursor-pointer ${isAr ? "flex-row-reverse" : ""}`}
                  >
                    {isAr ? resolution.ar.cta : resolution.en.cta}
                    <Arrow size={15} />
                  </motion.button>

                  {/* The visitor who does not want to self-serve. Today this
                      person has no path but to leave or message on WhatsApp,
                      and nothing structured is ever recorded. */}
                  {resolution.offerAdvice && (
                    <button
                      onClick={() => go("design-plan", "design")}
                      className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] underline underline-offset-4 transition-colors cursor-pointer"
                    >
                      {isAr ? "أو دع فريقنا ينصحك" : "Or have our team advise you"}
                    </button>
                  )}

                  <button
                    onClick={reset}
                    className={`inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]/70 hover:text-[var(--color-text)] transition-colors cursor-pointer ${isAr ? "flex-row-reverse me-auto" : "ms-auto"}`}
                  >
                    <RotateCcw size={12} />
                    {isAr ? "إعادة" : "Start over"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

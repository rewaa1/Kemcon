"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useBriefStore } from "@/lib/brief/store";
import { scrollToElement } from "@/components/providers/LenisProvider";
import type { BriefType } from "@/lib/brief/types";

/**
 * Two questions that route the visitor, so nobody has to recognise themselves
 * in Kemcon's internal service names.
 *
 * The section's remaining ambiguity is not "which product" — the category cards
 * answer that — it is "do I configure a piece, request a design plan, or ask
 * for a bulk quote?". A hotel buyer needing 300 panels cannot tell, and someone
 * who wants a room designed for them has to know that "Design Plan" means them.
 *
 * The answers set the brief type, so the brief page later collects the right
 * project fields whichever route the visitor took.
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

  const [furnishing, setFurnishing] = useState<Furnishing | null>(null);
  const [scale, setScale] = useState<Scale | null>(null);

  const needsScale = furnishing === "hotel" || furnishing === "office";
  const resolution = resolve(furnishing, scale);

  const go = (destination: Destination, type: BriefType) => {
    setBriefType(type);

    // Seed what we already know, so the visitor is not asked twice.
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

  return (
    <div className="rounded-sm border border-[var(--color-deep-accent)]/20 bg-[var(--color-surface)]/60 backdrop-blur-sm p-6 sm:p-7 space-y-5">
      {/* Question 1 */}
      <div role="group" aria-labelledby="intake-q1" className="space-y-3">
        <p
          id="intake-q1"
          className={`text-sm font-semibold text-[var(--color-heading)] ${isAr ? "text-right" : ""}`}
        >
          {isAr ? "ماذا تودّ أن تفرش؟" : "What are you furnishing?"}
        </p>
        <div className={`flex flex-wrap gap-2 ${isAr ? "justify-end" : ""}`}>
          {FURNISHING.map((option) => (
            <button
              key={option.value}
              aria-pressed={furnishing === option.value}
              onClick={() => {
                setFurnishing(furnishing === option.value ? null : option.value);
                setScale(null);
              }}
              className={chipClass(furnishing === option.value)}
            >
              {isAr ? option.ar : option.en}
            </button>
          ))}
        </div>
      </div>

      {/* Question 2 — only where it changes the answer */}
      <AnimatePresence initial={false}>
        {needsScale && (
          <motion.div
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
                    onClick={() => setScale(scale === option.value ? null : option.value)}
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

      {/* Resolution */}
      <AnimatePresence initial={false}>
        {resolution && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              aria-live="polite"
              className="pt-4 border-t border-[var(--color-deep-accent)]/15 space-y-4"
            >
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
  );
}

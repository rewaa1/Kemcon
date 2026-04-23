"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { ConfiguratorState } from "@/types/configurator";

interface CustomDescriptionStepProps {
  state: ConfiguratorState;
  onChange: (updates: Partial<ConfiguratorState>) => void;
  locale: string;
}

const EXAMPLES = {
  en: [
    "A curved sectional sofa in charcoal velvet with brushed steel legs",
    "Full-height remote-controlled blackout curtains for a 4m wide window",
    "Matching bed sheets and pillow covers in Egyptian cotton, sage green",
    "A set of dining chairs in walnut frame with ivory linen upholstery",
  ],
  ar: [
    "أريكة قطاعية منحنية بالمخمل الفحمي مع أرجل فولاذية مصقولة",
    "ستائر معتمة كاملة الارتفاع بريموت كنترول لنافذة عرضها 4 متر",
    "مجموعة مطابقة من ملاءات سرير وأغطية وسائد من القطن المصري باللون الأخضر",
    "طقم كراسي طعام بإطار جوزي مع تنجيد من الكتان الأبيض العاجي",
  ],
};

export function CustomDescriptionStep({
  state,
  onChange,
  locale,
}: CustomDescriptionStepProps) {
  const isAr = locale === "ar";
  const examples = EXAMPLES[isAr ? "ar" : "en"];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-heading)]">
          {isAr ? "صف رؤيتك" : "Describe Your Vision"}
        </h2>
        <p className="text-[var(--color-text-muted)] text-sm">
          {isAr
            ? "أخبرنا بما تتخيله وسنجعله حقيقة"
            : "Tell us what you have in mind — we'll bring it to life"}
        </p>
      </div>

      {/* Textarea */}
      <textarea
        rows={6}
        value={state.customDescription}
        onChange={(e) => onChange({ customDescription: e.target.value })}
        className="w-full px-4 py-3.5 rounded-sm bg-[var(--color-surface)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none leading-relaxed"
        placeholder={
          isAr
            ? "صف منتجك المخصص بالتفصيل — المواد والأبعاد والاستخدام..."
            : "Describe your custom piece in detail — materials, dimensions, intended use..."
        }
      />

      {/* Example prompts */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[var(--color-accent)]" />
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest">
            {isAr ? "أمثلة للإلهام" : "Examples for inspiration"}
          </span>
        </div>
        <div className="space-y-2">
          {examples.map((example, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.07 }}
              onClick={() => onChange({ customDescription: example })}
              className="w-full text-left px-4 py-3 rounded-sm border border-[var(--color-deep-accent)]/20 text-sm text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text)] transition-all duration-200 leading-relaxed"
            >
              {example}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

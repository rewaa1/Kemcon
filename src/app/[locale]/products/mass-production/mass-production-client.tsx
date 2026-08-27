"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ArrowUpRight } from "lucide-react";

import { FadeIn } from "@/components/motion/FadeIn";
import { useBriefStore } from "@/lib/brief/store";
import { MAX_INSPIRATION } from "@/lib/brief/format";
import { emptyLineItem } from "@/lib/brief/types";
import { InspirationGallery } from "@/components/shared/InspirationGallery";

const PROJECT_TYPES = [
  { value: "hotel", en: "Hotel", ar: "فندق" },
  { value: "resort", en: "Resort", ar: "منتجع" },
  { value: "office", en: "Corporate Office", ar: "مكتب" },
  { value: "residential", en: "Residential Complex", ar: "مجمع سكني" },
  { value: "restaurant", en: "Restaurant / Venue", ar: "مطعم / قاعة" },
  { value: "other", en: "Other", ar: "أخرى" },
] as const;

const PRODUCTS_NEEDED = [
  { value: "curtains",   en: "Curtains",    ar: "ستائر",       unitEn: "panels",  unitAr: "لوحة",  hintEn: "e.g. 300", hintAr: "مثال: 300", isText: false },
  { value: "chairs",     en: "Chairs",      ar: "كراسي",       unitEn: "units",   unitAr: "قطعة", hintEn: "e.g. 150", hintAr: "مثال: 150", isText: false },
  { value: "sofas",      en: "Sofas",       ar: "أرائك",       unitEn: "units",   unitAr: "قطعة", hintEn: "e.g. 50",  hintAr: "مثال: 50",  isText: false },
  { value: "bed-sheets", en: "Bed Sheets",  ar: "ملاءات سرير", unitEn: "sets",    unitAr: "طقم",  hintEn: "e.g. 200", hintAr: "مثال: 200", isText: false },
  { value: "other",      en: "Other",       ar: "أخرى",        unitEn: "",        unitAr: "",     hintEn: "Describe what you need", hintAr: "صف ما تحتاجه", isText: true  },
] as const;

const TIMELINES = [
  { value: "asap", en: "As Soon As Possible", ar: "في أقرب وقت ممكن" },
  { value: "1-3m", en: "1–3 Months", ar: "1–3 أشهر" },
  { value: "3-6m", en: "3–6 Months", ar: "3–6 أشهر" },
  { value: "6m+", en: "6+ Months", ar: "أكثر من 6 أشهر" },
] as const;

interface FormState {
  projectType: string;
  propertyName: string;
  productsNeeded: string[];
  quantities: Record<string, string>;
  timeline: string;
  notes: string;
  inspirationImages: string[];
}

export default function MassProductionClient() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();
  const handedOff = useRef(false);

  const setBriefType = useBriefStore((s) => s.setType);
  const setBriefProject = useBriefStore((s) => s.setProject);
  const setBriefNotes = useBriefStore((s) => s.setNotes);
  const addBriefItem = useBriefStore((s) => s.addItem);
  const toggleBriefInspiration = useBriefStore((s) => s.toggleInspiration);
  const briefInspiration = useBriefStore((s) => s.inspirationImages);

  const [form, setForm] = useState<FormState>({
    projectType: "",
    propertyName: "",
    productsNeeded: [],
    quantities: {},
    timeline: "",
    notes: "",
    inspirationImages: [],
  });

  const toggleProduct = (value: string) => {
    setForm((prev) => {
      const isOn = prev.productsNeeded.includes(value);
      const quantities = { ...prev.quantities };
      if (isOn) delete quantities[value];
      return {
        ...prev,
        productsNeeded: isOn
          ? prev.productsNeeded.filter((p) => p !== value)
          : [...prev.productsNeeded, value],
        quantities,
      };
    });
  };

  const setQuantity = (value: string, qty: string) => {
    setForm((prev) => ({ ...prev, quantities: { ...prev.quantities, [value]: qty } }));
  };

  /**
   * Each selected product becomes a real line item with its quantity, instead
   * of being flattened into a sentence. That is what lets a hotel refine
   * "300 curtain panels" into a configured piece later without re-entering it.
   */
  const handleContinue = () => {
    // A second press (double-click, or Back then Continue) must not append the
    // same lines again.
    if (handedOff.current) return;
    handedOff.current = true;
    setBriefType("bulk");
    setBriefProject({
      projectType: form.projectType,
      propertyName: form.propertyName,
      timeline: form.timeline,
    });
    if (form.notes) setBriefNotes(form.notes);

    for (const value of form.productsNeeded) {
      const raw = form.quantities[value] ?? "";
      if (value === "other") {
        addBriefItem(emptyLineItem("custom", 1, raw));
      } else {
        addBriefItem(emptyLineItem(value as "curtains" | "chairs" | "sofas" | "bed-sheets", Number(raw) || 1));
      }
    }

    for (const src of form.inspirationImages) {
      if (!briefInspiration.includes(src)) toggleBriefInspiration(src, MAX_INSPIRATION);
    }

    router.push(`/${locale}/products/brief`);
  };

  return (
    <div className="min-h-screen bg-[#1A1D24]">
      {/* Header */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[260px] rounded-full blur-[100px] opacity-[0.08] bg-[#3a6a9a]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <Link
              href={`/${locale}/products`}
              className={`inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-8 ${isAr ? "flex-row-reverse" : ""}`}
            >
              {isAr ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
              {isAr ? "العودة" : "Back"}
            </Link>
          </FadeIn>
          <FadeIn direction="up" delay={0.05}>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3a6a9a] mb-4">
              {isAr ? "B2B / مشاريع كبرى" : "B2B / Large Projects"}
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.1}>
            <h1 className={`text-4xl md:text-5xl font-bold text-[var(--color-heading)] leading-tight mb-4 ${isAr ? "text-right" : ""}`}>
              {isAr ? "الإنتاج بالجملة" : "Mass Production"}
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.15}>
            <p className={`text-[var(--color-text-muted)] text-base leading-relaxed ${isAr ? "text-right" : ""}`}>
              {isAr
                ? "للفنادق والضيافة وعقود الجملة. شارك تفاصيل مشروعك وسيتواصل معك فريقنا المتخصص في أقرب وقت."
                : "For hotels, hospitality, and bulk contracts. Share your project details and our team will be in touch shortly."}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-10">

        {/* Project Info */}
        <div className="glass-card rounded-sm p-6 space-y-6">
          <h2 className={`text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}>
            {isAr ? "تفاصيل المشروع" : "Project Details"}
          </h2>

          {/* Project type */}
          <div className="space-y-2">
            <label className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
              {isAr ? "نوع المشروع" : "Project Type"}
            </label>
            <div className={`flex flex-wrap gap-2 ${isAr ? "justify-end" : ""}`}>
              {PROJECT_TYPES.map((pt) => (
                <button
                  key={pt.value}
                  onClick={() => setForm((p) => ({ ...p, projectType: p.projectType === pt.value ? "" : pt.value }))}
                  className={`px-4 py-2 rounded-sm text-xs font-medium border transition-all duration-200 ${
                    form.projectType === pt.value
                      ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/8"
                      : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50"
                  }`}
                >
                  {isAr ? pt.ar : pt.en}
                </button>
              ))}
            </div>
          </div>

          {/* Property name */}
          <div className="space-y-1.5">
            <label className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
              {isAr ? "اسم الفندق / العقار" : "Hotel / Property Name"}
            </label>
            <input
              type="text"
              value={form.propertyName}
              onChange={(e) => setForm((p) => ({ ...p, propertyName: e.target.value }))}
              className={`w-full px-3 py-2.5 rounded-sm bg-[var(--color-surface)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors ${isAr ? "text-right" : ""}`}
              placeholder={isAr ? "اسم الفندق أو المشروع" : "Hotel or project name"}
            />
          </div>
        </div>

        {/* Products & Quantity */}
        <div className="glass-card rounded-sm p-6 space-y-6">
          <div className={isAr ? "text-right" : ""}>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              {isAr ? "المنتجات والكميات" : "Products & Quantity"}
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]/70 mt-1">
              {isAr
                ? "اختر المنتجات وأدخل الكمية التقريبية لكل منها"
                : "Select the products you need and enter an estimated quantity for each"}
            </p>
          </div>

          {/* Per-product rows */}
          <div className="space-y-2">
            {PRODUCTS_NEEDED.map((prod) => {
              const isSelected = form.productsNeeded.includes(prod.value);
              return (
                <div key={prod.value}>
                  <button
                    onClick={() => toggleProduct(prod.value)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm border transition-all duration-200 ${isAr ? "flex-row-reverse" : ""} ${
                      isSelected
                        ? "border-[var(--color-accent)]/50 bg-[var(--color-accent)]/5"
                        : "border-[var(--color-deep-accent)]/25 hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-accent)]/[0.02]"
                    }`}
                  >
                    {/* Checkbox indicator */}
                    <span className={`w-4 h-4 rounded-sm border flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? "bg-[var(--color-accent)] border-[var(--color-accent)]"
                        : "border-[var(--color-deep-accent)]/40"
                    }`}>
                      {isSelected && <Check size={10} className="text-[var(--color-dark)]" strokeWidth={3} />}
                    </span>
                    <span className={`text-sm font-medium flex-1 ${isAr ? "text-right" : ""} ${
                      isSelected ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]"
                    }`}>
                      {isAr ? prod.ar : prod.en}
                    </span>
                    {!prod.isText && isSelected && (
                      <span className="text-[10px] text-[var(--color-text-muted)]/60 flex-shrink-0">
                        {isAr ? prod.unitAr : prod.unitEn}
                      </span>
                    )}
                  </button>

                  {/* Quantity input — slides in when selected */}
                  <AnimatePresence initial={false}>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <div className={`flex items-center gap-2 pt-2 pb-1 px-1 ${isAr ? "flex-row-reverse" : ""}`}>
                          <div className="w-4 flex-shrink-0" />
                          {prod.isText ? (
                            <input
                              type="text"
                              value={form.quantities[prod.value] ?? ""}
                              onChange={(e) => setQuantity(prod.value, e.target.value)}
                              placeholder={isAr ? prod.hintAr : prod.hintEn}
                              className={`flex-1 px-3 py-2 rounded-sm bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/40 focus:outline-none focus:border-[var(--color-accent)] transition-colors ${isAr ? "text-right" : ""}`}
                            />
                          ) : (
                            <>
                              <input
                                type="number"
                                min={1}
                                value={form.quantities[prod.value] ?? ""}
                                onChange={(e) => setQuantity(prod.value, e.target.value)}
                                placeholder={isAr ? prod.hintAr : prod.hintEn}
                                className={`w-32 px-3 py-2 rounded-sm bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/40 focus:outline-none focus:border-[var(--color-accent)] transition-colors ${isAr ? "text-right" : ""}`}
                              />
                              <span className="text-xs text-[var(--color-text-muted)]">
                                {isAr ? prod.unitAr : prod.unitEn}
                              </span>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <label className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
              {isAr ? "الجدول الزمني" : "Timeline"}
            </label>
            <div className={`flex flex-wrap gap-2 ${isAr ? "justify-end" : ""}`}>
              {TIMELINES.map((tl) => (
                <button
                  key={tl.value}
                  onClick={() => setForm((p) => ({ ...p, timeline: p.timeline === tl.value ? "" : tl.value }))}
                  className={`px-4 py-2 rounded-sm text-xs font-medium border transition-all duration-200 ${
                    form.timeline === tl.value
                      ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/8"
                      : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50"
                  }`}
                >
                  {isAr ? tl.ar : tl.en}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="glass-card rounded-sm p-6 space-y-4">
          <h2 className={`text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}>
            {isAr ? "ملاحظات إضافية" : "Additional Notes"}
          </h2>
          <textarea
            rows={4}
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            className={`w-full px-3 py-2.5 rounded-sm bg-[var(--color-surface)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none ${isAr ? "text-right" : ""}`}
            placeholder={isAr ? "أي تفاصيل إضافية عن المشروع أو المتطلبات الخاصة..." : "Any additional project details or specific requirements..."}
          />
        </div>

        {/* Portfolio Inspiration */}
        <div className="glass-card rounded-sm p-6 space-y-4">
          <div className={`${isAr ? "text-right" : ""}`}>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              {isAr ? "مرجع الأسلوب من مشاريعنا" : "Style Reference from Our Portfolio"}
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {isAr
                ? "اختر صورًا من فنادق نفّذناها كمرجع للأسلوب المطلوب في مشروعك (اختياري)"
                : "Pick photos from hotels we've furnished to reference the style you want for your project (optional)"}
            </p>
          </div>
          <InspirationGallery
            selected={form.inspirationImages}
            onSelect={(src) =>
              setForm((prev) => ({
                ...prev,
                inspirationImages: prev.inspirationImages.includes(src)
                  ? prev.inspirationImages.filter((s) => s !== src)
                  : [...prev.inspirationImages, src],
              }))
            }
            maxSelect={5}
            isAr={isAr}
          />
        </div>

        {/* Hands off to the brief, which is where every path now sends. */}
        <div className="space-y-3">
          <button
            onClick={handleContinue}
            className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-sm bg-[var(--color-accent)] text-[var(--color-dark)] text-sm font-semibold tracking-wide hover:bg-[var(--color-accent-hover)] transition-colors cursor-pointer ${isAr ? "flex-row-reverse" : ""}`}
          >
            {isAr ? "متابعة إلى الموجز" : "Continue to your brief"}
            <ArrowUpRight size={16} strokeWidth={1.75} />
          </button>
          <p className={`text-xs text-[var(--color-text-muted)] ${isAr ? "text-right" : "text-center"}`}>
            {isAr
              ? "يمكنك اختيار الأقمشة لكل بند لاحقًا، أو إرسال الموجز كما هو."
              : "You can pick fabrics for each line later, or send the brief as it is."}
          </p>
        </div>
      </div>
    </div>
  );
}

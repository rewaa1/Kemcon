"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  X,
  Plus,
  Palette,
  Ruler,
  Camera,
  Sparkles,
} from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { InspirationGallery } from "@/components/shared/InspirationGallery";
import { ContactSubmit } from "@/components/shared/ContactSubmit";

const PROPERTY_TYPES = [
  { value: "apartment", en: "Apartment", ar: "شقة" },
  { value: "villa", en: "Villa", ar: "فيلا" },
  { value: "hotel", en: "Hotel", ar: "فندق" },
  { value: "office", en: "Office", ar: "مكتب" },
  { value: "restaurant", en: "Restaurant", ar: "مطعم" },
  { value: "other", en: "Other", ar: "أخرى" },
] as const;

const STYLE_TAGS = [
  { value: "modern", en: "Modern", ar: "عصري" },
  { value: "classic", en: "Classic", ar: "كلاسيكي" },
  { value: "contemporary", en: "Contemporary", ar: "معاصر" },
  { value: "minimalist", en: "Minimalist", ar: "بسيط" },
  { value: "rustic", en: "Rustic", ar: "ريفي" },
  { value: "eclectic", en: "Eclectic", ar: "تلفيقي" },
  { value: "luxury", en: "Luxury", ar: "فاخر" },
  { value: "arabic", en: "Arabic / Oriental", ar: "عربي / شرقي" },
] as const;

const SCOPE_OPTIONS = [
  { value: "single", en: "Single Room", ar: "غرفة واحدة" },
  { value: "multiple", en: "Multiple Rooms", ar: "عدة غرف" },
  { value: "full", en: "Full Property", ar: "العقار كاملًا" },
] as const;

interface FormState {
  propertyType: string;
  scope: string;
  numRooms: string;
  stylePrefs: string[];
  dimensions: string;
  notes: string;
  images: File[];
  inspirationImages: string[];
  name: string;
  phone: string;
  email: string;
}

type OptionalKey = "style" | "dimensions" | "photos" | "inspiration";

export default function DesignPlanClient() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expanded, setExpanded] = useState<Set<OptionalKey>>(new Set());

  const [form, setForm] = useState<FormState>({
    propertyType: "",
    scope: "",
    numRooms: "",
    stylePrefs: [],
    dimensions: "",
    notes: "",
    images: [],
    inspirationImages: [],
    name: "",
    phone: "",
    email: "",
  });

  const toggleSection = (key: OptionalKey) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleStyle = (value: string) => {
    setForm((prev) => ({
      ...prev,
      stylePrefs: prev.stylePrefs.includes(value)
        ? prev.stylePrefs.filter((s) => s !== value)
        : [...prev.stylePrefs, value],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 8);
    setForm((prev) => ({ ...prev, images: files }));
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const buildSummary = () => {
    const lines: string[] = ["Design Plan Request"];
    if (form.propertyType) {
      const pt = PROPERTY_TYPES.find((p) => p.value === form.propertyType);
      lines.push(`Property Type: ${pt?.en ?? form.propertyType}`);
    }
    if (form.scope) {
      const sc = SCOPE_OPTIONS.find((s) => s.value === form.scope);
      lines.push(`Scope: ${sc?.en ?? form.scope}`);
    }
    if (form.scope === "multiple" && form.numRooms) {
      lines.push(`Number of Rooms: ${form.numRooms}`);
    }
    if (form.stylePrefs.length) {
      const labels = form.stylePrefs.map(
        (v) => STYLE_TAGS.find((t) => t.value === v)?.en ?? v
      );
      lines.push(`Style Preferences: ${labels.join(", ")}`);
    }
    if (form.dimensions) lines.push(`Dimensions / Room Details: ${form.dimensions}`);
    if (form.notes) lines.push(`Additional Notes: ${form.notes}`);
    if (form.images.length) lines.push(`Photos: ${form.images.length} file(s) attached`);
    if (form.inspirationImages.length) {
      lines.push(`Portfolio Inspiration: ${form.inspirationImages.map((src) => `https://kemcon.vercel.app${src}`).join(", ")}`);
    }
    return lines.join("\n");
  };

  const buildWhatsAppMessage = () => {
    return encodeURIComponent(
      `Hello Kemcon,\n\nI'd like to request a design plan.\n\n${buildSummary()}\n\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}`
    );
  };

  const optionalSections: {
    key: OptionalKey;
    icon: typeof Palette;
    titleEn: string;
    titleAr: string;
    descEn: string;
    descAr: string;
    countEn: string;
    countAr: string;
    count: number;
  }[] = [
    {
      key: "style",
      icon: Palette,
      titleEn: "Style preferences",
      titleAr: "الأسلوب المفضّل",
      descEn: "Pick the vibe — modern, classic, luxury…",
      descAr: "اختر الطابع — عصري، كلاسيكي، فاخر…",
      countEn: "selected",
      countAr: "مختار",
      count: form.stylePrefs.length,
    },
    {
      key: "dimensions",
      icon: Ruler,
      titleEn: "Dimensions & room details",
      titleAr: "الأبعاد وتفاصيل الغرفة",
      descEn: "Share measurements or layout notes",
      descAr: "شارك القياسات أو ملاحظات التخطيط",
      countEn: "added",
      countAr: "مضاف",
      count: form.dimensions ? 1 : 0,
    },
    {
      key: "photos",
      icon: Camera,
      titleEn: "Reference photos",
      titleAr: "صور مرجعية",
      descEn: "Upload current room or inspiration images",
      descAr: "ارفع صور الغرفة الحالية أو صور إلهام",
      countEn: "uploaded",
      countAr: "مرفوع",
      count: form.images.length,
    },
    {
      key: "inspiration",
      icon: Sparkles,
      titleEn: "Inspire from our portfolio",
      titleAr: "إلهام من مشاريعنا",
      descEn: "Pick photos from hotels we've furnished",
      descAr: "اختر صورًا من فنادق نفّذناها",
      countEn: "selected",
      countAr: "مختار",
      count: form.inspirationImages.length,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[260px] rounded-full blur-[100px] opacity-8 bg-[#c8a45a]" />
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
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c8a45a] mb-4">
              {isAr ? "خدمة التصميم" : "Design Service"}
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.1}>
            <h1 className={`text-4xl md:text-5xl font-bold text-[var(--color-heading)] leading-tight mb-4 ${isAr ? "text-right" : ""}`}>
              {isAr ? "اطلب خطة تصميم" : "Request a Design Plan"}
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.15}>
            <p className={`text-[var(--color-text-muted)] text-base leading-relaxed ${isAr ? "text-right" : ""}`}>
              {isAr
                ? "شارك ما تعرفه عن مشروعك — كل الحقول اختيارية ماعدا بيانات التواصل. سيراجع مصممنا المعماري موجزك ويتواصل معك خلال 3–5 أيام عمل."
                : "Share what you know about your project — all fields are optional except contact details. Our architect will review your brief and reach out within 3–5 business days."}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8">

        {/* Project Basics — always visible */}
        <div className="glass-card rounded-sm p-6 space-y-6">
          <h2 className={`text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}>
            {isAr ? "تفاصيل المشروع" : "Project Details"}
          </h2>

          {/* Property type */}
          <div className="space-y-2">
            <label className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
              {isAr ? "نوع العقار" : "Property Type"}
            </label>
            <div className={`flex flex-wrap gap-2 ${isAr ? "justify-end" : ""}`}>
              {PROPERTY_TYPES.map((pt) => (
                <button
                  key={pt.value}
                  onClick={() => setForm((p) => ({ ...p, propertyType: p.propertyType === pt.value ? "" : pt.value }))}
                  className={`px-4 py-2 rounded-sm text-xs font-medium border transition-all duration-200 ${
                    form.propertyType === pt.value
                      ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/8"
                      : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50"
                  }`}
                >
                  {isAr ? pt.ar : pt.en}
                </button>
              ))}
            </div>
          </div>

          {/* Scope */}
          <div className="space-y-2">
            <label className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
              {isAr ? "نطاق التصميم" : "Design Scope"}
            </label>
            <div className={`flex flex-wrap gap-2 ${isAr ? "justify-end" : ""}`}>
              {SCOPE_OPTIONS.map((sc) => (
                <button
                  key={sc.value}
                  onClick={() => setForm((p) => ({ ...p, scope: p.scope === sc.value ? "" : sc.value, numRooms: "" }))}
                  className={`px-4 py-2 rounded-sm text-xs font-medium border transition-all duration-200 ${
                    form.scope === sc.value
                      ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/8"
                      : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50"
                  }`}
                >
                  {isAr ? sc.ar : sc.en}
                </button>
              ))}
            </div>
          </div>

          {/* Number of rooms (conditional) */}
          <AnimatePresence>
            {form.scope === "multiple" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <label className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
                  {isAr ? "عدد الغرف" : "Number of Rooms"}
                </label>
                <input
                  type="number"
                  min={2}
                  value={form.numRooms}
                  onChange={(e) => setForm((p) => ({ ...p, numRooms: e.target.value }))}
                  className={`w-32 px-3 py-2.5 rounded-sm bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors ${isAr ? "text-right" : ""}`}
                  placeholder="e.g. 4"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Project Notes — always visible */}
        <div className="glass-card rounded-sm p-6 space-y-3">
          <h2 className={`text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}>
            {isAr ? "ملاحظات المشروع" : "Project Notes"}
          </h2>
          <textarea
            rows={4}
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            className={`w-full px-3 py-2.5 rounded-sm bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none ${isAr ? "text-right" : ""}`}
            placeholder={
              isAr
                ? "صف مشروعك ورؤيتك ومتطلباتك الخاصة…"
                : "Describe your project, vision, or specific requirements…"
            }
          />
        </div>

        {/* Optional sections — progressive disclosure */}
        <div className="space-y-3">
          <div className={`flex items-center gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] flex-shrink-0">
              {isAr ? "أضف ما يساعد (اختياري)" : "Add what's helpful (optional)"}
            </span>
            <div className="h-px flex-1 bg-[var(--color-deep-accent)]/15" />
          </div>

          <div className="space-y-2.5">
            {optionalSections.map(({ key, icon: Icon, titleEn, titleAr, descEn, descAr, countEn, countAr, count }) => {
              const isOpen = expanded.has(key);
              return (
                <div key={key}>
                  <AnimatePresence mode="wait" initial={false}>
                    {isOpen ? (
                      <motion.div
                        key="open"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="glass-card rounded-sm p-6 space-y-4"
                      >
                        <div className={`flex items-center justify-between ${isAr ? "flex-row-reverse" : ""}`}>
                          <div className={`flex items-center gap-2.5 ${isAr ? "flex-row-reverse" : ""}`}>
                            <Icon size={15} strokeWidth={1.5} className="text-[var(--color-accent)]" />
                            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                              {isAr ? titleAr : titleEn}
                            </h3>
                          </div>
                          <button
                            onClick={() => toggleSection(key)}
                            aria-label={isAr ? "إخفاء" : "Hide"}
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors p-1 -m-1"
                          >
                            <X size={16} strokeWidth={1.5} />
                          </button>
                        </div>

                        {key === "style" && (
                          <div className={`flex flex-wrap gap-2 ${isAr ? "justify-end" : ""}`}>
                            {STYLE_TAGS.map((tag) => (
                              <button
                                key={tag.value}
                                onClick={() => toggleStyle(tag.value)}
                                className={`px-4 py-2 rounded-sm text-xs font-medium border transition-all duration-200 ${
                                  form.stylePrefs.includes(tag.value)
                                    ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/8"
                                    : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50"
                                }`}
                              >
                                {isAr ? tag.ar : tag.en}
                              </button>
                            ))}
                          </div>
                        )}

                        {key === "dimensions" && (
                          <textarea
                            rows={3}
                            value={form.dimensions}
                            onChange={(e) => setForm((p) => ({ ...p, dimensions: e.target.value }))}
                            className={`w-full px-3 py-2.5 rounded-sm bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none ${isAr ? "text-right" : ""}`}
                            placeholder={isAr ? "مثال: غرفة المعيشة 5×7 م، ارتفاع السقف 3 م" : "e.g. Living room 5×7 m, ceiling height 3 m"}
                          />
                        )}

                        {key === "photos" && (
                          <>
                            <p className={`text-xs text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}>
                              {isAr
                                ? "حتى 8 صور. ستحتاج لإرفاقها يدويًا في البريد أو واتساب."
                                : "Up to 8 images. You'll need to attach them manually in email or WhatsApp."}
                            </p>
                            <input
                              ref={fileInputRef}
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            {form.images.length === 0 ? (
                              <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex flex-col items-center gap-2 py-8 border-2 border-dashed border-[var(--color-deep-accent)]/30 rounded-sm text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text)] transition-all duration-200"
                              >
                                <Upload size={22} strokeWidth={1.5} />
                                <span className="text-sm">{isAr ? "اضغط لرفع الصور" : "Click to upload images"}</span>
                              </button>
                            ) : (
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {form.images.map((file, i) => (
                                  <div key={i} className="relative group aspect-square rounded-sm overflow-hidden border border-[var(--color-deep-accent)]/20">
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={file.name}
                                      className="w-full h-full object-cover"
                                    />
                                    <button
                                      onClick={() => removeImage(i)}
                                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X size={10} className="text-white" />
                                    </button>
                                  </div>
                                ))}
                                {form.images.length < 8 && (
                                  <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-sm border-2 border-dashed border-[var(--color-deep-accent)]/30 flex items-center justify-center text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 transition-all duration-200"
                                  >
                                    <Upload size={16} strokeWidth={1.5} />
                                  </button>
                                )}
                              </div>
                            )}
                          </>
                        )}

                        {key === "inspiration" && (
                          <>
                            <p className={`text-xs text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}>
                              {isAr ? descAr : descEn}
                            </p>
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
                          </>
                        )}
                      </motion.div>
                    ) : (
                      <motion.button
                        key="closed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => toggleSection(key)}
                        className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-sm border border-dashed border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-accent)]/[0.03] hover:text-[var(--color-text)] transition-all duration-200 group ${isAr ? "flex-row-reverse text-right" : "text-left"}`}
                      >
                        <Icon size={16} strokeWidth={1.5} className="flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-tight">
                            {isAr ? titleAr : titleEn}
                          </p>
                          <p className="text-[11px] text-[var(--color-text-muted)]/80 mt-0.5 leading-tight">
                            {isAr ? descAr : descEn}
                          </p>
                        </div>
                        {count > 0 && (
                          <span className="text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-semibold flex-shrink-0">
                            {count} {isAr ? countAr : countEn}
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

        <ContactSubmit
          isAr={isAr}
          locale={locale}
          name={form.name}
          phone={form.phone}
          email={form.email}
          onChange={(field, value) => setForm((p) => ({ ...p, [field]: value }))}
          buildSummary={buildSummary}
          buildWhatsAppMessage={buildWhatsAppMessage}
          photos={form.images}
          successDescEn="Your brief has been delivered to kemcon@yahoo.com. Our architect will be in touch within 3–5 business days."
          successDescAr="وصل موجزك إلى فريقنا على kemcon@yahoo.com. سيتواصل معك مصممنا المعماري خلال 3–5 أيام عمل."
        />
      </div>
    </div>
  );
}

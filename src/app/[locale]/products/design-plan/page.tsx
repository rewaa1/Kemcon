"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Mail, MessageCircle, MapPin, CheckCircle, Upload, X } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { InspirationGallery } from "@/components/shared/InspirationGallery";

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

export default function DesignPlanPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sent, setSent] = useState(false);

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
    if (form.images.length) lines.push(`Images: ${form.images.length} file(s) — please attach them manually`);
    if (form.inspirationImages.length) {
      lines.push(`Portfolio Inspiration: ${form.inspirationImages.map((src) => `https://kemcon.vercel.app${src}`).join(", ")}`);
    }
    return lines.join("\n");
  };

  const isContactValid = form.name.trim() && form.phone.trim() && form.email.trim();

  const buildMailtoLink = () => {
    const subject = encodeURIComponent("Kemcon — Design Plan Request");
    const body = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\n${buildSummary()}`
    );
    return `mailto:info@kemcon.com?subject=${subject}&body=${body}`;
  };

  const buildWhatsAppMessage = () => {
    return encodeURIComponent(
      `Hello Kemcon,\n\nI'd like to request a design plan.\n\n${buildSummary()}\n\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}`
    );
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6 py-16 text-center max-w-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="w-16 h-16 rounded-full bg-[#25D366]/15 flex items-center justify-center"
          >
            <CheckCircle size={32} className="text-[#25D366]" />
          </motion.div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[var(--color-heading)]">
              {isAr ? "تم إرسال موجزك!" : "Brief Sent!"}
            </h3>
            <p className="text-[var(--color-text-muted)] text-sm">
              {isAr
                ? "تم تحضير رسالتك. أرسلها وسيتواصل معك مصممنا المعماري خلال 3–5 أيام عمل."
                : "Your message is ready. Hit send and our architect will be in touch within 3–5 business days."}
            </p>
          </div>
          <button
            onClick={() => setSent(false)}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors underline underline-offset-2"
          >
            {isAr ? "العودة للنموذج" : "Back to form"}
          </button>
        </motion.div>
      </div>
    );
  }

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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-10">

        {/* Property & Scope */}
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
                  className={`w-32 px-3 py-2.5 rounded-sm bg-[var(--color-surface)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors ${isAr ? "text-right" : ""}`}
                  placeholder="e.g. 4"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Style Preferences */}
        <div className="glass-card rounded-sm p-6 space-y-4">
          <h2 className={`text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}>
            {isAr ? "الأسلوب المفضّل" : "Style Preferences"}
          </h2>
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
        </div>

        {/* Dimensions & Notes */}
        <div className="glass-card rounded-sm p-6 space-y-5">
          <h2 className={`text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}>
            {isAr ? "تفاصيل إضافية" : "Additional Details"}
          </h2>

          <div className="space-y-1.5">
            <label className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
              {isAr ? "الأبعاد / تفاصيل الغرفة" : "Dimensions / Room Details"}
            </label>
            <textarea
              rows={3}
              value={form.dimensions}
              onChange={(e) => setForm((p) => ({ ...p, dimensions: e.target.value }))}
              className={`w-full px-3 py-2.5 rounded-sm bg-[var(--color-surface)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none ${isAr ? "text-right" : ""}`}
              placeholder={isAr ? "مثال: غرفة المعيشة 5×7 م، ارتفاع السقف 3 م" : "e.g. Living room 5×7 m, ceiling height 3 m"}
            />
          </div>

          <div className="space-y-1.5">
            <label className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
              {isAr ? "ملاحظات وإلهام" : "Notes & Inspiration"}
            </label>
            <textarea
              rows={4}
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              className={`w-full px-3 py-2.5 rounded-sm bg-[var(--color-surface)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none ${isAr ? "text-right" : ""}`}
              placeholder={isAr ? "أضف أي تفاصيل أخرى — أو روابط لصور إلهام من الإنترنت..." : "Any other details — or links to inspiration images..."}
            />
          </div>
        </div>

        {/* Image upload */}
        <div className="glass-card rounded-sm p-6 space-y-4">
          <h2 className={`text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}>
            {isAr ? "صور مرجعية" : "Reference Images"}
          </h2>
          <p className={`text-xs text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}>
            {isAr
              ? "ارفع صور الغرفة الحالية أو صور إلهام (حتى 8 صور). ستحتاج لإرفاقها يدويًا في البريد أو واتساب."
              : "Upload current room photos or inspiration images (up to 8). You'll need to attach them manually in email or WhatsApp."}
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
              className={`w-full flex flex-col items-center gap-3 py-10 border-2 border-dashed border-[var(--color-deep-accent)]/30 rounded-sm text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text)] transition-all duration-200`}
            >
              <Upload size={24} strokeWidth={1.5} />
              <span className="text-sm">{isAr ? "اضغط لرفع الصور" : "Click to upload images"}</span>
            </button>
          ) : (
            <div className="space-y-3">
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
            </div>
          )}
        </div>

        {/* Portfolio Inspiration */}
        <div className="glass-card rounded-sm p-6 space-y-4">
          <div className={`${isAr ? "text-right" : ""}`}>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              {isAr ? "إلهام من مشاريعنا" : "Inspire from Our Portfolio"}
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {isAr
                ? "اختر صورًا من فنادق نفّذناها كمرجع لأسلوب تصميمك (اختياري)"
                : "Pick photos from hotels we've furnished as a style reference (optional)"}
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

        {/* Contact */}
        <div className="glass-card rounded-sm p-6 space-y-5">
          <h2 className={`text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}>
            {isAr ? "بيانات التواصل *" : "Contact Details *"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
                {isAr ? "الاسم الكامل *" : "Full Name *"}
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className={`w-full px-3 py-2.5 rounded-sm bg-[var(--color-surface)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors ${isAr ? "text-right" : ""}`}
                placeholder={isAr ? "اسمك" : "Your name"}
              />
            </div>
            <div className="space-y-1.5">
              <label className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
                {isAr ? "رقم الهاتف *" : "Phone Number *"}
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className={`w-full px-3 py-2.5 rounded-sm bg-[var(--color-surface)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors ${isAr ? "text-right" : ""}`}
                placeholder="+20 xxx xxx xxx"
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
                {isAr ? "البريد الإلكتروني *" : "Email Address *"}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className={`w-full px-3 py-2.5 rounded-sm bg-[var(--color-surface)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors ${isAr ? "text-right" : ""}`}
                placeholder="your@email.com"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <motion.a
              href={isContactValid ? buildMailtoLink() : undefined}
              whileHover={isContactValid ? { scale: 1.02 } : {}}
              whileTap={isContactValid ? { scale: 0.98 } : {}}
              className={`flex flex-col items-center gap-2 p-5 rounded-sm border transition-all duration-200 text-center ${
                isContactValid
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-dark)] cursor-pointer hover:bg-[var(--color-accent-hover)]"
                  : "border-[var(--color-deep-accent)]/20 text-[var(--color-text-muted)] cursor-not-allowed opacity-50"
              }`}
            >
              <Mail size={22} strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">{isAr ? "إرسال بالبريد" : "Send by Email"}</p>
                <p className="text-[10px] opacity-70 mt-0.5">info@kemcon.com</p>
              </div>
            </motion.a>

            <motion.a
              href={isContactValid ? `https://wa.me/201223122276?text=${buildWhatsAppMessage()}` : undefined}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => isContactValid && setSent(true)}
              whileHover={isContactValid ? { scale: 1.02 } : {}}
              whileTap={isContactValid ? { scale: 0.98 } : {}}
              className={`flex flex-col items-center gap-2 p-5 rounded-sm border transition-all duration-200 text-center ${
                isContactValid
                  ? "border-[#25D366]/50 bg-[#25D366]/10 text-[#25D366] cursor-pointer hover:bg-[#25D366]/20"
                  : "border-[var(--color-deep-accent)]/20 text-[var(--color-text-muted)] cursor-not-allowed opacity-50"
              }`}
            >
              <MessageCircle size={22} strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">WhatsApp</p>
                <p className="text-[10px] opacity-70 mt-0.5">{isAr ? "دردشة فورية" : "Chat instantly"}</p>
              </div>
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open("https://maps.google.com/?q=Cairo+Egypt", "_blank")}
              className="flex flex-col items-center gap-2 p-5 rounded-sm border border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text)] transition-all duration-200 text-center"
            >
              <MapPin size={22} strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">{isAr ? "زيارة المعرض" : "Visit Showroom"}</p>
                <p className="text-[10px] opacity-70 mt-0.5">{isAr ? "القاهرة، مصر" : "Cairo, Egypt"}</p>
              </div>
            </motion.button>
          </div>

          {!isContactValid && (
            <p className={`text-xs text-[var(--color-text-muted)] ${isAr ? "text-right" : "text-center"}`}>
              {isAr
                ? "* أدخل الاسم والهاتف والبريد الإلكتروني لإرسال موجزك"
                : "* Please fill in your name, phone and email to send your brief"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

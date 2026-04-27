"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Mail, MessageCircle, MapPin, CheckCircle } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
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
  { value: "curtains", en: "Curtains", ar: "ستائر" },
  { value: "chairs", en: "Chairs", ar: "كراسي" },
  { value: "sofas", en: "Sofas", ar: "أرائك" },
  { value: "bed-sheets", en: "Bed Sheets", ar: "ملاءات سرير" },
  { value: "other", en: "Other", ar: "أخرى" },
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
  quantity: string;
  timeline: string;
  notes: string;
  inspirationImages: string[];
  name: string;
  phone: string;
  email: string;
}

export default function MassProductionPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [sent, setSent] = useState(false);

  const [form, setForm] = useState<FormState>({
    projectType: "",
    propertyName: "",
    productsNeeded: [],
    quantity: "",
    timeline: "",
    notes: "",
    inspirationImages: [],
    name: "",
    phone: "",
    email: "",
  });

  const toggleProduct = (value: string) => {
    setForm((prev) => ({
      ...prev,
      productsNeeded: prev.productsNeeded.includes(value)
        ? prev.productsNeeded.filter((p) => p !== value)
        : [...prev.productsNeeded, value],
    }));
  };

  const buildSummary = () => {
    const lines: string[] = ["Mass Production Inquiry"];
    if (form.projectType) {
      const pt = PROJECT_TYPES.find((p) => p.value === form.projectType);
      lines.push(`Project Type: ${pt?.en ?? form.projectType}`);
    }
    if (form.propertyName) lines.push(`Property / Hotel Name: ${form.propertyName}`);
    if (form.productsNeeded.length) {
      const labels = form.productsNeeded.map(
        (v) => PRODUCTS_NEEDED.find((p) => p.value === v)?.en ?? v
      );
      lines.push(`Products Needed: ${labels.join(", ")}`);
    }
    if (form.quantity) lines.push(`Estimated Quantity: ${form.quantity}`);
    if (form.timeline) {
      const tl = TIMELINES.find((t) => t.value === form.timeline);
      lines.push(`Timeline: ${tl?.en ?? form.timeline}`);
    }
    if (form.notes) lines.push(`Additional Notes: ${form.notes}`);
    if (form.inspirationImages.length) {
      lines.push(`Portfolio Inspiration: ${form.inspirationImages.map((src) => `https://kemcon.vercel.app${src}`).join(", ")}`);
    }
    return lines.join("\n");
  };

  const isContactValid = form.name.trim() && form.phone.trim() && form.email.trim();

  const buildMailtoLink = () => {
    const subject = encodeURIComponent("Kemcon — Mass Production Inquiry");
    const body = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\n${buildSummary()}`
    );
    return `mailto:info@kemcon.com?subject=${subject}&body=${body}`;
  };

  const buildWhatsAppMessage = () => {
    return encodeURIComponent(
      `Hello Kemcon,\n\nI'd like to discuss a mass production project.\n\n${buildSummary()}\n\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}`
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
              {isAr ? "تم إرسال استفساركم!" : "Inquiry Sent!"}
            </h3>
            <p className="text-[var(--color-text-muted)] text-sm">
              {isAr
                ? "تم تحضير رسالتك. أرسلها وسيتواصل معك فريقنا قريبًا."
                : "Your message is ready. Hit send and our team will be in touch shortly."}
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[260px] rounded-full blur-[100px] opacity-8 bg-[#3a6a9a]" />
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
          <h2 className={`text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}>
            {isAr ? "المنتجات والكميات" : "Products & Quantity"}
          </h2>

          {/* Products needed */}
          <div className="space-y-2">
            <label className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
              {isAr ? "المنتجات المطلوبة" : "Products Needed"}
            </label>
            <div className={`flex flex-wrap gap-2 ${isAr ? "justify-end" : ""}`}>
              {PRODUCTS_NEEDED.map((prod) => (
                <button
                  key={prod.value}
                  onClick={() => toggleProduct(prod.value)}
                  className={`px-4 py-2 rounded-sm text-xs font-medium border transition-all duration-200 ${
                    form.productsNeeded.includes(prod.value)
                      ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/8"
                      : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50"
                  }`}
                >
                  {isAr ? prod.ar : prod.en}
                </button>
              ))}
            </div>
          </div>

          {/* Estimated quantity */}
          <div className="space-y-1.5">
            <label className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
              {isAr ? "الكمية التقريبية" : "Estimated Quantity"}
            </label>
            <textarea
              rows={2}
              value={form.quantity}
              onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))}
              className={`w-full px-3 py-2.5 rounded-sm bg-[var(--color-surface)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none ${isAr ? "text-right" : ""}`}
              placeholder={isAr ? "مثال: 300 ستارة، 200 كرسي..." : "e.g. 300 curtain panels, 200 chairs..."}
            />
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
                ? "* أدخل الاسم والهاتف والبريد الإلكتروني لإرسال استفساراتك"
                : "* Please fill in your name, phone and email to send your inquiry"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

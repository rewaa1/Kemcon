"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin, CheckCircle } from "lucide-react";
import { fabrics } from "@/data/fabrics";
import { colors } from "@/data/colors";
import { patterns } from "@/data/patterns";
import { frameMaterials, frameFinishes, fillingOptions } from "@/data/frames";
import type { ConfiguratorState, CategoryType } from "@/types/configurator";

interface InquiryStepProps {
  state: ConfiguratorState;
  onChange: (updates: Partial<ConfiguratorState>) => void;
  locale: string;
  category: CategoryType;
  categoryLabel: string;
}

export function InquiryStep({
  state,
  onChange,
  locale,
  category,
  categoryLabel,
}: InquiryStepProps) {
  const isAr = locale === "ar";
  const [whatsappSent, setWhatsappSent] = useState(false);

  const fabric = fabrics.find((f) => f.id === state.fabricId);
  const color = colors.find((c) => c.id === state.colorId);
  const pattern = patterns.find((p) => p.id === state.patternId);
  const frame = frameMaterials.find((m) => m.id === state.frameMaterialId);
  const finish = frameFinishes.find((f) => f.id === state.frameFinishId);
  const filling = fillingOptions.find((f) => f.id === state.fillingId);

  const buildSummaryText = () => {
    const lines: string[] = [`Category: ${categoryLabel}`];
    if (fabric) lines.push(`Fabric: ${fabric.name}`);
    if (color) lines.push(`Color: ${color.name} (${color.hex})`);
    if (pattern) lines.push(`Pattern: ${pattern.name}`);
    if (category === "curtains") {
      if (state.curtainControl) lines.push(`Control: ${state.curtainControl}`);
      if (state.requestMeasurement) lines.push("Measurement: Visit requested");
      else if (state.curtainWidth && state.curtainHeight)
        lines.push(`Size: ${state.curtainWidth}cm × ${state.curtainHeight}cm`);
    }
    if (category === "chairs" || category === "sofas") {
      if (frame) lines.push(`Frame: ${frame.name}`);
      if (finish) lines.push(`Finish: ${finish.name}`);
      if (filling) lines.push(`Filling: ${filling.name}`);
    }
    if (state.inquiryNotes) lines.push(`Notes: ${state.inquiryNotes}`);
    if (state.aiImageUrl) lines.push(`AI Room View: ${state.aiImageUrl}`);
    if (state.aiDetailImageUrl) lines.push(`AI Fabric Detail: ${state.aiDetailImageUrl}`);
    if (state.inspirationImages.length) {
      lines.push(`Inspiration References: ${state.inspirationImages.map((src) => `https://kemcon.vercel.app${src}`).join(", ")}`);
    }
    return lines.join("\n");
  };

  const buildWhatsAppMessage = () => {
    const summary = buildSummaryText();
    return encodeURIComponent(
      `Hello Kemcon,\n\nI would like to inquire about a custom order:\n\n${summary}\n\nName: ${state.inquiryName}\nPhone: ${state.inquiryPhone}\nEmail: ${state.inquiryEmail}`
    );
  };

  const buildMailtoLink = () => {
    const subject = encodeURIComponent(`Kemcon Inquiry — ${categoryLabel}`);
    const body = encodeURIComponent(
      `Name: ${state.inquiryName}\nPhone: ${state.inquiryPhone}\n\n${buildSummaryText()}`
    );
    return `mailto:info@kemcon.com?subject=${subject}&body=${body}`;
  };

  const isFormValid =
    state.inquiryName.trim() && state.inquiryPhone.trim() && state.inquiryEmail.trim();

  const summaryItems = [
    fabric && { label: isAr ? "القماش" : "Fabric", value: isAr ? fabric.nameAr : fabric.name, color: undefined },
    color && {
      label: isAr ? "اللون" : "Color",
      value: isAr ? color.nameAr : color.name,
      color: color.hex,
    },
    pattern && { label: isAr ? "النمط" : "Pattern", value: isAr ? pattern.nameAr : pattern.name, color: undefined },
    category === "curtains" && state.curtainControl && {
      label: isAr ? "التحكم" : "Control",
      value: state.curtainControl === "manual" ? (isAr ? "يدوي" : "Manual") : (isAr ? "ريموت" : "Remote"),
      color: undefined,
    },
    category === "curtains" && state.requestMeasurement && {
      label: isAr ? "القياس" : "Measurement",
      value: isAr ? "زيارة مطلوبة" : "Visit requested",
      color: undefined,
    },
    category === "curtains" &&
      !state.requestMeasurement &&
      state.curtainWidth &&
      state.curtainHeight && {
        label: isAr ? "الأبعاد" : "Size",
        value: `${state.curtainWidth} × ${state.curtainHeight} cm`,
        color: undefined,
      },
    (category === "chairs" || category === "sofas") &&
      frame && { label: isAr ? "الإطار" : "Frame", value: isAr ? frame.nameAr : frame.name, color: frame.hex },
    (category === "chairs" || category === "sofas") &&
      finish && { label: isAr ? "التشطيب" : "Finish", value: isAr ? finish.nameAr : finish.name, color: finish.hex },
    (category === "chairs" || category === "sofas") &&
      filling && { label: isAr ? "الحشو" : "Filling", value: isAr ? filling.nameAr : filling.name, color: undefined },
  ].filter(Boolean) as { label: string; value: string; color?: string }[];

  if (whatsappSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 py-16 text-center"
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
            {isAr ? "تم فتح واتساب!" : "WhatsApp Opened!"}
          </h3>
          <p className="text-[var(--color-text-muted)] text-sm max-w-sm">
            {isAr
              ? "تم تحضير رسالتك على واتساب. أرسلها وسيتواصل معك فريقنا قريباً."
              : "Your message is ready in WhatsApp. Hit send and our team will be in touch shortly."}
          </p>
        </div>
        <button
          onClick={() => setWhatsappSent(false)}
          className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors underline underline-offset-2"
        >
          {isAr ? "العودة للاستفسار" : "Back to inquiry"}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-heading)]">
          {isAr ? "تفاصيل الاستفسار" : "Inquiry Details"}
        </h2>
        <p className="text-[var(--color-text-muted)] text-sm">
          {isAr
            ? "راجع اختياراتك وأرسل استفساراتك"
            : "Review your selections and send your inquiry"}
        </p>
      </div>

      {/* Selection summary */}
      {summaryItems.length > 0 && (
        <div className="glass-card rounded-sm p-5 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
            {isAr ? "ملخص اختياراتك" : "Your Selections"}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {summaryItems.map((item) => (
              <div key={item.label} className="space-y-0.5">
                <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">
                  {item.label}
                </p>
                <div className="flex items-center gap-1.5">
                  {item.color && (
                    <div
                      className="w-3 h-3 rounded-full border border-white/15 flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                  )}
                  <p className="text-sm font-medium text-[var(--color-text)]">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* AI visualization thumbnail */}
          {state.aiDisplayUrl && (
            <div className="pt-3 border-t border-[var(--color-deep-accent)]/15 flex items-center gap-4">
              <div className="w-14 h-20 rounded-sm overflow-hidden border border-[var(--color-deep-accent)]/20 flex-shrink-0">
                <img
                  src={state.aiDisplayUrl}
                  alt="AI curtain preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text)]">
                  {isAr ? "المعاينة التوليدية" : "AI Preview"}
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                  {isAr ? "سيتم إرفاق الصورة مع استفسارك" : "Included with your inquiry"}
                </p>
              </div>
            </div>
          )}

          {/* Inspiration gallery thumbnails */}
          {state.inspirationImages.length > 0 && (
            <div className="pt-3 border-t border-[var(--color-deep-accent)]/15 space-y-2">
              <p className="text-xs font-medium text-[var(--color-text)]">
                {isAr ? "صور الإلهام المختارة" : "Selected Inspiration"}
                <span className="ml-1.5 text-[10px] text-[var(--color-text-muted)]">
                  ({isAr ? `${state.inspirationImages.length} صور` : `${state.inspirationImages.length} images`})
                </span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {state.inspirationImages.map((src) => (
                  <div key={src} className="w-12 h-12 rounded-sm overflow-hidden border border-[var(--color-deep-accent)]/20 flex-shrink-0">
                    <img src={src} alt="Inspiration" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)]">
                {isAr ? "ستُرسل مراجع هذه الصور مع استفسارك" : "References included with your inquiry"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Contact form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-[var(--color-text-muted)] font-medium">
            {isAr ? "الاسم الكامل *" : "Full Name *"}
          </label>
          <input
            type="text"
            value={state.inquiryName}
            onChange={(e) => onChange({ inquiryName: e.target.value })}
            className="w-full px-3 py-2.5 rounded-sm bg-[var(--color-surface)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            placeholder={isAr ? "الاسم" : "Your name"}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-[var(--color-text-muted)] font-medium">
            {isAr ? "رقم الهاتف *" : "Phone Number *"}
          </label>
          <input
            type="tel"
            value={state.inquiryPhone}
            onChange={(e) => onChange({ inquiryPhone: e.target.value })}
            className="w-full px-3 py-2.5 rounded-sm bg-[var(--color-surface)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            placeholder={isAr ? "رقم هاتفك" : "+20 xxx xxx xxx"}
          />
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs text-[var(--color-text-muted)] font-medium">
            {isAr ? "البريد الإلكتروني *" : "Email Address *"}
          </label>
          <input
            type="email"
            value={state.inquiryEmail}
            onChange={(e) => onChange({ inquiryEmail: e.target.value })}
            className="w-full px-3 py-2.5 rounded-sm bg-[var(--color-surface)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            placeholder={isAr ? "بريدك الإلكتروني" : "your@email.com"}
          />
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs text-[var(--color-text-muted)] font-medium">
            {isAr ? "ملاحظات إضافية" : "Additional Notes"}
          </label>
          <textarea
            rows={3}
            value={state.inquiryNotes}
            onChange={(e) => onChange({ inquiryNotes: e.target.value })}
            className="w-full px-3 py-2.5 rounded-sm bg-[var(--color-surface)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
            placeholder={isAr ? "أي تفاصيل إضافية..." : "Any additional details or requirements..."}
          />
        </div>
      </div>

      {/* CTA buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Email */}
        <motion.a
          href={isFormValid ? buildMailtoLink() : undefined}
          whileHover={isFormValid ? { scale: 1.02 } : {}}
          whileTap={isFormValid ? { scale: 0.98 } : {}}
          className={`
            flex flex-col items-center gap-2 p-5 rounded-sm border
            transition-all duration-200 text-center
            ${isFormValid
              ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-dark)] cursor-pointer hover:bg-[var(--color-accent-hover)]"
              : "border-[var(--color-deep-accent)]/20 text-[var(--color-text-muted)] cursor-not-allowed opacity-50"
            }
          `}
        >
          <Mail size={22} strokeWidth={1.5} />
          <div>
            <p className="text-sm font-semibold">{isAr ? "إرسال بالبريد" : "Send by Email"}</p>
            <p className="text-[10px] opacity-70 mt-0.5">info@kemcon.com</p>
          </div>
        </motion.a>

        {/* WhatsApp */}
        <motion.a
          href={isFormValid ? `https://wa.me/201223122276?text=${buildWhatsAppMessage()}` : undefined}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => isFormValid && setWhatsappSent(true)}
          whileHover={isFormValid ? { scale: 1.02 } : {}}
          whileTap={isFormValid ? { scale: 0.98 } : {}}
          className={`
            flex flex-col items-center gap-2 p-5 rounded-sm border
            transition-all duration-200 text-center
            ${isFormValid
              ? "border-[#25D366]/50 bg-[#25D366]/10 text-[#25D366] cursor-pointer hover:bg-[#25D366]/20"
              : "border-[var(--color-deep-accent)]/20 text-[var(--color-text-muted)] cursor-not-allowed opacity-50"
            }
          `}
        >
          <MessageCircle size={22} strokeWidth={1.5} />
          <div>
            <p className="text-sm font-semibold">WhatsApp</p>
            <p className="text-[10px] opacity-70 mt-0.5">{isAr ? "دردشة فورية" : "Chat instantly"}</p>
          </div>
        </motion.a>

        {/* Showroom */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            window.open("https://maps.google.com/?q=Cairo+Egypt", "_blank");
          }}
          className="flex flex-col items-center gap-2 p-5 rounded-sm border border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text)] transition-all duration-200 text-center"
        >
          <MapPin size={22} strokeWidth={1.5} />
          <div>
            <p className="text-sm font-semibold">{isAr ? "زيارة المعرض" : "Visit Showroom"}</p>
            <p className="text-[10px] opacity-70 mt-0.5">{isAr ? "القاهرة، مصر" : "Cairo, Egypt"}</p>
          </div>
        </motion.button>
      </div>

      {!isFormValid && (
        <p className="text-center text-xs text-[var(--color-text-muted)]">
          {isAr
            ? "* يرجى ملء الاسم والهاتف والبريد الإلكتروني لإرسال استفساراتك"
            : "* Please fill in your name, phone and email to send your inquiry"}
        </p>
      )}
    </div>
  );
}

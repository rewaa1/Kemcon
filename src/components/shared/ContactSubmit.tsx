"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader2,
  CheckCircle,
  MessageCircle,
  MapPin,
} from "lucide-react";

interface ContactSubmitProps {
  isAr: boolean;
  locale: string;
  name: string;
  phone: string;
  email: string;
  onChange: (field: "name" | "phone" | "email", value: string) => void;
  buildSummary: () => string;
  buildWhatsAppMessage: () => string;
  photos?: File[];
  submitLabelEn?: string;
  submitLabelAr?: string;
  successTitleEn?: string;
  successTitleAr?: string;
  successDescEn?: string;
  successDescAr?: string;
}

type Status = "idle" | "submitting" | "sent" | "error";

export function ContactSubmit({
  isAr,
  locale,
  name,
  phone,
  email,
  onChange,
  buildSummary,
  buildWhatsAppMessage,
  photos = [],
  submitLabelEn = "Send Brief",
  submitLabelAr = "إرسال الموجز",
  successTitleEn = "Brief Sent!",
  successTitleAr = "تم إرسال موجزك!",
  successDescEn = "Your brief has been delivered to kemcon@yahoo.com. Our team will be in touch within 3–5 business days.",
  successDescAr = "وصل موجزك إلى فريقنا على kemcon@yahoo.com. سيتواصل معك فريقنا خلال 3–5 أيام عمل.",
}: ContactSubmitProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isValid = !!(name.trim() && phone.trim() && email.trim());

  const handleSubmit = async () => {
    if (!isValid || status === "submitting") return;
    setStatus("submitting");
    setErrorMsg("");

    const fd = new FormData();
    fd.append("name", name);
    fd.append("phone", phone);
    fd.append("email", email);
    fd.append("message", buildSummary());
    fd.append("locale", locale);
    photos.forEach((file) => fd.append("photos", file));

    try {
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setErrorMsg(
          data.error ||
            (isAr
              ? "فشل إرسال الرسالة. حاول مرة أخرى."
              : "Failed to send. Please try again.")
        );
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setErrorMsg(
        isAr
          ? "تعذر الاتصال بالخادم. تحقق من اتصالك."
          : "Could not reach the server. Check your connection."
      );
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-sm p-8 flex flex-col items-center gap-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="w-14 h-14 rounded-full bg-[var(--color-accent)]/12 flex items-center justify-center"
        >
          <CheckCircle size={28} className="text-[var(--color-accent)]" />
        </motion.div>

        <div className="space-y-2 max-w-xs">
          <h3 className="text-lg font-bold text-[var(--color-heading)]">
            {isAr ? successTitleAr : successTitleEn}
          </h3>
          <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
            {isAr ? successDescAr : successDescEn}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 w-full">
          <a
            href={`https://wa.me/201223122276?text=${buildWhatsAppMessage()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#25D366] hover:underline underline-offset-2 transition-colors"
          >
            <MessageCircle size={15} strokeWidth={1.5} />
            {isAr ? "تفضل واتساب؟ راسلنا مباشرة" : "Prefer WhatsApp? Message us directly"}
          </a>
          <button
            onClick={() => setStatus("idle")}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors underline underline-offset-2"
          >
            {isAr ? "العودة للنموذج" : "Back to form"}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Contact fields */}
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
              value={name}
              onChange={(e) => onChange("name", e.target.value)}
              className={`w-full px-3 py-2.5 rounded-sm bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors ${isAr ? "text-right" : ""}`}
              placeholder={isAr ? "اسمك" : "Your name"}
            />
          </div>
          <div className="space-y-1.5">
            <label className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
              {isAr ? "رقم الهاتف *" : "Phone Number *"}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className={`w-full px-3 py-2.5 rounded-sm bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors ${isAr ? "text-right" : ""}`}
              placeholder="+20 xxx xxx xxx"
            />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <label className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
              {isAr ? "البريد الإلكتروني *" : "Email Address *"}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => onChange("email", e.target.value)}
              className={`w-full px-3 py-2.5 rounded-sm bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors ${isAr ? "text-right" : ""}`}
              placeholder="your@email.com"
            />
          </div>
        </div>
      </div>

      {/* Submit button */}
      <motion.button
        onClick={handleSubmit}
        disabled={!isValid || status === "submitting"}
        whileHover={isValid && status !== "submitting" ? { scale: 1.01 } : {}}
        whileTap={isValid && status !== "submitting" ? { scale: 0.99 } : {}}
        className={`w-full flex items-center justify-center gap-3 py-4 rounded-sm text-sm font-semibold tracking-wide transition-all duration-200 ${
          isValid && status !== "submitting"
            ? "bg-[var(--color-accent)] text-[var(--color-dark)] hover:bg-[var(--color-accent-hover)] cursor-pointer"
            : "bg-[var(--color-deep-accent)]/15 text-[var(--color-text-muted)] cursor-not-allowed"
        }`}
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {isAr ? "جارٍ الإرسال…" : "Sending…"}
          </>
        ) : (
          <>
            <Send size={16} strokeWidth={1.75} />
            {isAr ? submitLabelAr : submitLabelEn}
          </>
        )}
      </motion.button>

      {/* Validation hint */}
      {!isValid && (
        <p className={`text-xs text-[var(--color-text-muted)] ${isAr ? "text-right" : "text-center"}`}>
          {isAr
            ? "* أدخل الاسم والهاتف والبريد الإلكتروني للإرسال"
            : "* Please fill in your name, phone and email to send"}
        </p>
      )}

      {/* Error */}
      <AnimatePresence>
        {status === "error" && errorMsg && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-sm text-red-400 ${isAr ? "text-right" : "text-center"}`}
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Secondary options */}
      <div className={`flex items-center justify-center gap-4 pt-1 flex-wrap ${isAr ? "flex-row-reverse" : ""}`}>
        <a
          href={`https://wa.me/201223122276?text=${buildWhatsAppMessage()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-[#25D366]/80 hover:text-[#25D366] transition-colors"
        >
          <MessageCircle size={13} strokeWidth={1.5} />
          {isAr ? "تفضل واتساب؟" : "Prefer WhatsApp?"}
        </a>
        <span className="text-[var(--color-deep-accent)]/30 text-xs">·</span>
        <button
          onClick={() => window.open("https://maps.app.goo.gl/P258pkoaV3g7dLHP7", "_blank")}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <MapPin size={13} strokeWidth={1.5} />
          {isAr ? "زيارة المعرض" : "Visit Showroom"}
        </button>
      </div>
    </div>
  );
}

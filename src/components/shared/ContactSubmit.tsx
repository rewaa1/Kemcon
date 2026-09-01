"use client";

import { useRef, useState } from "react";
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
  buildSummary: (photoUrls?: string[]) => string;
  buildWhatsAppMessage: (photoUrls?: string[]) => string;
  photos?: File[];
  /** Identifies the form in the CRM: "contact" | "brief" | "quick". */
  formType?: string;
  /** For briefs: standard | bulk | design. */
  briefType?: string | null;
  /**
   * Structured data to file alongside the prose summary, so a configured order
   * survives in the CRM as more than a wall of text.
   */
  buildMeta?: () => Record<string, unknown>;
  submitLabelEn?: string;
  submitLabelAr?: string;
  successTitleEn?: string;
  successTitleAr?: string;
  successDescEn?: string;
  successDescAr?: string;
  /** Fired once, after the brief has been accepted by `/api/contact`. */
  onSuccess?: () => void;
  /**
   * A gate on top of the contact fields, for a form with required questions of
   * its own. Sending stays disabled until this is true, and `extraHint*`
   * explains what is still missing — the contact hint would otherwise point at
   * fields the visitor has already filled in.
   */
  extraValid?: boolean;
  extraHintEn?: string;
  extraHintAr?: string;
}

type Status = "idle" | "submitting" | "sent" | "error";

import { KEMCON_EMAIL, KEMCON_WHATSAPP, SHOWROOM_MAP_URL } from "@/lib/config";
import { track } from "@/lib/journey/track";

async function uploadPhotos(files: File[]): Promise<string[]> {
  return Promise.all(
    files.map(async (file) => {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error ?? "Upload failed");
      }
      const json = (await res.json()) as { url: string };
      return json.url;
    })
  );
}

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
  formType = "brief",
  briefType = null,
  buildMeta,
  submitLabelEn = "Send Brief",
  submitLabelAr = "إرسال الموجز",
  successTitleEn = "Brief Sent!",
  successTitleAr = "تم إرسال موجزك!",
  successDescEn = `Your brief has been delivered to ${KEMCON_EMAIL}. Our team will be in touch within 3–5 business days.`,
  successDescAr = `وصل موجزك إلى فريقنا على ${KEMCON_EMAIL}. سيتواصل معك فريقنا خلال 3–5 أيام عمل.`,
  onSuccess,
  extraValid = true,
  extraHintEn,
  extraHintAr,
}: ContactSubmitProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [submitStep, setSubmitStep] = useState<"uploading" | "sending" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [whatsappUploading, setWhatsappUploading] = useState(false);
  /**
   * The WhatsApp message is frozen at the moment of a successful send.
   * `onSuccess` may clear the underlying brief, which would otherwise leave the
   * success card offering an empty message. Snapshotting also means the link
   * keeps the uploaded photo URLs, which it previously dropped.
   */
  const [sentWhatsAppText, setSentWhatsAppText] = useState("");

  /**
   * Whether this visitor has started filling the form. The gap between
   * `form_start` and `form_submit` is the abandonment rate — the number that
   * says whether the form itself is the thing losing people.
   */
  const startedRef = useRef(false);

  const handleFieldChange = (field: "name" | "phone" | "email", value: string) => {
    if (!startedRef.current && value.trim()) {
      startedRef.current = true;
      track({ t: "form_start", formType });
    }
    onChange(field, value);
  };

  const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneDigits = phone.replace(/\D/g, "").length;
  const contactValid = !!(
    name.trim() &&
    EMAIL_RE.test(email.trim()) &&
    phoneDigits >= 7 &&
    phoneDigits <= 15
  );
  const isValid = contactValid && extraValid;

  /**
   * Both channels post the same brief to `/api/contact`; only `channel`
   * differs. The CRM records every submission either way — `channel` says how
   * the visitor expects to hear back, not whether we kept a copy.
   */
  const buildPayload = (channel: "email" | "whatsapp", photoUrls: string[]) => {
    const fd = new FormData();
    fd.append("name", name);
    fd.append("phone", phone);
    fd.append("email", email);
    fd.append("message", buildSummary(photoUrls));
    fd.append("locale", locale);
    fd.append("channel", channel);
    fd.append("formType", formType);
    if (briefType) fd.append("briefType", briefType);
    if (photoUrls.length > 0) fd.append("attachments", JSON.stringify(photoUrls));
    const meta = buildMeta?.();
    if (meta) fd.append("meta", JSON.stringify(meta));
    return fd;
  };

  /**
   * Files a WhatsApp enquiry before the chat opens.
   *
   * Deliberately not awaited: `window.open` must stay in the same task as the
   * click or the popup blocker eats it. The request outlives this call, and a
   * failure is logged rather than surfaced — the visitor is already on their
   * way to WhatsApp, where the message reaches us regardless.
   */
  const recordWhatsAppLead = (photoUrls: string[]) => {
    // Tracked before the guard: choosing WhatsApp is the visitor's decision
    // whether or not they gave us enough to file a lead from it.
    track({ t: "whatsapp_click", formType });
    if (!name.trim() || !(phone.trim() || email.trim())) return;
    void fetch("/api/contact", {
      method: "POST",
      body: buildPayload("whatsapp", photoUrls),
    }).catch((e: unknown) => {
      console.warn("[ContactSubmit] WhatsApp lead was not recorded:", e);
    });
  };

  const handleSubmit = async () => {
    if (!isValid || status === "submitting") return;
    setStatus("submitting");
    setSubmitStep(null);
    setErrorMsg("");

    let photoUrls: string[] = [];
    if (photos.length > 0) {
      setSubmitStep("uploading");
      try {
        photoUrls = await uploadPhotos(photos);
      } catch {
        setErrorMsg(
          isAr
            ? "فشل رفع الصور. حاول مرة أخرى."
            : "Failed to upload photos. Please try again."
        );
        setStatus("error");
        return;
      }
    }

    setSubmitStep("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: buildPayload("email", photoUrls),
      });
      const data = (await res.json().catch((e: unknown) => {
        console.warn("[ContactSubmit] Failed to parse response JSON:", e);
        return {};
      })) as { error?: string };
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
      setSentWhatsAppText(buildWhatsAppMessage(photoUrls));
      setStatus("sent");
      // The end of the funnel. Recorded only once the server has accepted it,
      // so a failed send is not counted as a conversion.
      track({ t: "form_submit", formType, briefType });
      onSuccess?.();
    } catch {
      setErrorMsg(
        isAr
          ? "تعذر الاتصال بالخادم. تحقق من اتصالك."
          : "Could not reach the server. Check your connection."
      );
      setStatus("error");
    } finally {
      setSubmitStep(null);
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
            href={`https://wa.me/${KEMCON_WHATSAPP}?text=${sentWhatsAppText || buildWhatsAppMessage()}`}
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
            <label htmlFor="cs-name" className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
              {isAr ? "الاسم الكامل *" : "Full Name *"}
            </label>
            <input
              id="cs-name"
              type="text"
              value={name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className={`w-full px-3 py-2.5 rounded-sm bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors ${isAr ? "text-right" : ""}`}
              placeholder={isAr ? "اسمك" : "Your name"}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="cs-phone" className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
              {isAr ? "رقم الهاتف *" : "Phone Number *"}
            </label>
            <input
              id="cs-phone"
              type="tel"
              value={phone}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              className={`w-full px-3 py-2.5 rounded-sm bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors ${isAr ? "text-right" : ""}`}
              placeholder="+20 xxx xxx xxx"
            />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <label htmlFor="cs-email" className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
              {isAr ? "البريد الإلكتروني *" : "Email Address *"}
            </label>
            <input
              id="cs-email"
              type="email"
              value={email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
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
            {submitStep === "uploading"
              ? (isAr ? "جارٍ رفع الصور…" : "Uploading photos…")
              : (isAr ? "جارٍ الإرسال…" : "Sending…")}
          </>
        ) : (
          <>
            <Send size={16} strokeWidth={1.75} />
            {isAr ? submitLabelAr : submitLabelEn}
          </>
        )}
      </motion.button>

      {/* Validation hint — whichever half is actually missing */}
      {!isValid && (
        <p className={`text-xs text-[var(--color-text-muted)] ${isAr ? "text-right" : "text-center"}`}>
          {!contactValid
            ? isAr
              ? "* أدخل الاسم والهاتف والبريد الإلكتروني للإرسال"
              : "* Please fill in your name, phone and email to send"
            : (isAr ? extraHintAr : extraHintEn) ??
              (isAr ? "* أكمل الحقول المطلوبة أعلاه" : "* Please complete the required fields above")}
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
        <button
          disabled={whatsappUploading}
          onClick={async () => {
            if (photos.length > 0) {
              setWhatsappUploading(true);
              try {
                const urls = await uploadPhotos(photos);
                recordWhatsAppLead(urls);
                window.open(`https://wa.me/${KEMCON_WHATSAPP}?text=${buildWhatsAppMessage(urls)}`, "_blank");
              } catch {
                recordWhatsAppLead([]);
                window.open(`https://wa.me/${KEMCON_WHATSAPP}?text=${buildWhatsAppMessage()}`, "_blank");
              } finally {
                setWhatsappUploading(false);
              }
            } else {
              recordWhatsAppLead([]);
              window.open(`https://wa.me/${KEMCON_WHATSAPP}?text=${buildWhatsAppMessage()}`, "_blank");
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs text-[#25D366]/80 hover:text-[#25D366] transition-colors disabled:opacity-60 disabled:cursor-wait"
        >
          {whatsappUploading
            ? <Loader2 size={13} className="animate-spin text-[#25D366]" />
            : <MessageCircle size={13} strokeWidth={1.5} />}
          {whatsappUploading
            ? (isAr ? "جارٍ رفع الصور…" : "Uploading photos…")
            : (isAr ? "تفضل واتساب؟" : "Prefer WhatsApp?")}
        </button>
        <span className="text-[var(--color-deep-accent)]/30 text-xs">·</span>
        <button
          onClick={() => window.open(SHOWROOM_MAP_URL, "_blank")}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <MapPin size={13} strokeWidth={1.5} />
          {isAr ? "زيارة المعرض" : "Visit Showroom"}
        </button>
      </div>
    </div>
  );
}

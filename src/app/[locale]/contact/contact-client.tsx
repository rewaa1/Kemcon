"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Store, Factory, Phone, Clock, MessageCircle, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { FadeIn } from "@/components/motion/FadeIn";

import {
  KEMCON_EMAIL,
  KEMCON_WHATSAPP as WHATSAPP_NUMBER,
  SHOWROOM_MAP_URL as SHOWROOM_URL,
  FACTORY_MAP_URL as FACTORY_URL,
} from "@/lib/config";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactClient() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const isAr = locale === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setErrorMessage(
          data.error ||
            (isAr ? "فشل إرسال الرسالة. حاول مرة أخرى." : "Failed to send message. Please try again.")
        );
        setStatus("error");
        return;
      }

      setStatus("sent");
      setForm({ name: "", phone: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 6000);
    } catch {
      setErrorMessage(
        isAr ? "تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت." : "Could not reach the server. Check your connection."
      );
      setStatus("error");
    }
  };

  const handleWhatsApp = () => {
    const lines = [
      isAr ? `مرحباً، أنا ${form.name || "مهتم بخدماتكم"}.` : `Hello, I'm ${form.name || "interested in your services"}.`,
      form.message ? (isAr ? `\nرسالتي: ${form.message}` : `\nMessage: ${form.message}`) : "",
    ].join("");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`, "_blank");
  };

  const inputClass =
    "w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/25 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/15 transition-all duration-300 text-sm";

  const contactMethods = [
    {
      icon: Mail,
      label: isAr ? "راسلنا بالبريد" : "Email Us",
      desc: isAr ? "نرد خلال 24 ساعة" : "We reply within 24 hours",
      value: KEMCON_EMAIL,
      href: `mailto:${KEMCON_EMAIL}`,
      color: "#9aacbe",
      external: false,
    },
    {
      icon: MessageCircle,
      label: isAr ? "واتساب / اتصال" : "WhatsApp / Call",
      desc: isAr ? "دردشة أو اتصال خلال ساعات العمل" : "Chat or call during business hours",
      value: "+20 12 23122276",
      href: `https://wa.me/${WHATSAPP_NUMBER}`,
      color: "#25D366",
      external: true,
    },
    {
      icon: Phone,
      label: isAr ? "هاتف ثابت" : "Landline",
      desc: isAr ? "للاستفسارات العامة" : "For general inquiries",
      value: "02 23546722",
      href: "tel:+20223546722",
      color: "#9aacbe",
      external: false,
    },
    {
      icon: Store,
      label: isAr ? "زيارة المعرض" : "Visit Showroom",
      desc: isAr ? "معرضنا في القاهرة، مصر" : "Our showroom, Cairo, Egypt",
      value: isAr ? "اعرض على الخريطة ←" : "View on map →",
      href: SHOWROOM_URL,
      color: "#c8a45a",
      external: true,
    },
    {
      icon: Factory,
      label: isAr ? "زيارة المصنع" : "Visit Factory",
      desc: isAr ? "مصنعنا في القاهرة، مصر" : "Our factory, Cairo, Egypt",
      value: isAr ? "اعرض على الخريطة ←" : "View on map →",
      href: FACTORY_URL,
      color: "#9aacbe",
      external: true,
    },
  ];

  return (
    <>
      <PageHero
        label={t("label")}
        title={t("title")}
        description={t("description")}
        image="/images/contact-hero.jpg"
        alt=""
      />

      <section className="py-20 md:py-28 bg-[var(--color-bg-secondary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-start">

            {/* Form — 3 columns */}
            <FadeIn direction="up" className="lg:col-span-3">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-text-muted)] mb-8">
                {isAr ? "أرسل رسالة" : "Send a Message"}
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2"
                    >
                      {t("form.name")} *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2"
                    >
                      {t("form.phone")}
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      dir="ltr"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2"
                  >
                    {t("form.email")} *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    dir="ltr"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2"
                  >
                    {t("form.message")} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <AnimatePresence>
                  {status === "sent" && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-[var(--color-accent)]"
                    >
                      {t("form.success")}
                    </motion.p>
                  )}
                  {status === "error" && errorMessage && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-red-400"
                    >
                      {errorMessage}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className={`flex flex-col sm:flex-row gap-3 pt-1 ${isAr ? "sm:flex-row-reverse" : ""}`}>
                  {/* Email submit */}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex items-center justify-center gap-2 h-12 px-8 text-xs font-semibold uppercase tracking-[0.18em] bg-[var(--color-accent)] text-[var(--color-dark)] hover:bg-[var(--color-accent-hover)] transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Mail size={13} />
                    )}
                    {status === "sending"
                      ? isAr ? "جارٍ الإرسال..." : "Sending..."
                      : t("form.submit")}
                  </button>

                  {/* WhatsApp */}
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="inline-flex items-center justify-center gap-2 h-12 px-8 text-xs font-semibold uppercase tracking-[0.18em] border border-[#25D366]/35 text-[#4ade80] hover:bg-[#25D366]/10 transition-colors duration-300"
                  >
                    <MessageCircle size={13} />
                    {isAr ? "واتساب" : "WhatsApp"}
                  </button>
                </div>

                <p className="text-xs text-[var(--color-text-muted)] pt-1">
                  {isAr
                    ? "سنرد على بريدك الإلكتروني خلال 24 ساعة."
                    : "We typically reply to your email within 24 hours."}
                </p>
              </form>
            </FadeIn>

            {/* Sidebar — 2 columns */}
            <FadeIn direction="up" delay={0.1} className="lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-text-muted)] mb-8">
                {isAr ? "تواصل مباشرة" : "Reach Us Directly"}
              </p>

              <div className="space-y-3">
                {contactMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <a
                      key={method.label}
                      href={method.href}
                      target={method.external ? "_blank" : undefined}
                      rel={method.external ? "noopener noreferrer" : undefined}
                      className="group flex items-start gap-4 p-5 bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/15 hover:border-[var(--color-deep-accent)]/35 transition-all duration-300"
                    >
                      <div
                        className="flex-shrink-0 w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        style={{
                          background: `${method.color}14`,
                          border: `1px solid ${method.color}28`,
                        }}
                      >
                        <Icon size={16} strokeWidth={1.4} style={{ color: method.color }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--color-heading)] mb-0.5">
                          {method.label}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] mb-2">
                          {method.desc}
                        </p>
                        <p
                          className="text-xs font-medium truncate"
                          style={{ color: method.color }}
                        >
                          {method.value}
                        </p>
                      </div>

                      <Arrow
                        size={13}
                        className="flex-shrink-0 mt-0.5 text-[var(--color-text-muted)] opacity-30 group-hover:opacity-70 transition-opacity duration-300"
                      />
                    </a>
                  );
                })}
              </div>

              {/* Working hours */}
              <div className="mt-3 flex items-start gap-4 p-5 bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/15">
                <Clock
                  size={16}
                  strokeWidth={1.4}
                  className="flex-shrink-0 mt-0.5 text-[var(--color-text-muted)]"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-1.5">
                    {isAr ? "ساعات العمل" : "Working Hours"}
                  </p>
                  <p className="text-sm text-[var(--color-heading)]" dir={isAr ? "rtl" : "ltr"}>
                    {t("info.hours")}
                  </p>
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>
    </>
  );
}

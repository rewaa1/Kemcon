"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PageHero } from "@/components/ui/PageHero";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [formState, setFormState] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setFormState("success");
    setTimeout(() => setFormState("idle"), 3000);
  };

  return (
    <>
      {/* Hero Banner */}
      <PageHero
        label={t("label")}
        title={t("title")}
        description={t("description")}
        image="https://images.unsplash.com/photo-1660557989695-14fac79c086d?q=80&w=2000&auto=format&fit=crop"
        alt="Contact Us"
      />

      {/* Contact Content */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <FadeIn direction="left" className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground/70 mb-2">
                      {t("form.name")}
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-sm bg-warm-white border border-accent/20 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/70 mb-2">
                      {t("form.email")}
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-sm bg-warm-white border border-accent/20 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground/70 mb-2">
                      {t("form.phone")}
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-sm bg-warm-white border border-accent/20 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/70 mb-2">
                      {t("form.subject")}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-sm bg-warm-white border border-accent/20 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all duration-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">
                    {t("form.message")}
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-sm bg-warm-white border border-accent/20 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Status Messages */}
                {formState === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-sm bg-accent/10 border border-accent/20 text-accent text-sm"
                  >
                    {t("form.success")}
                  </motion.div>
                )}
                {formState === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-sm bg-error/10 border border-error/20 text-error text-sm"
                  >
                    {t("form.error")}
                  </motion.div>
                )}

                <Button type="submit" variant="primary" size="lg">
                  {t("form.submit")}
                </Button>
              </form>
            </FadeIn>

            {/* Contact Info */}
            <FadeIn direction="right" className="lg:col-span-2">
              <div className="p-8 md:p-10 rounded-sm bg-gradient-dark text-warm-white h-full">
                <h3 className="text-2xl font-bold mb-8">
                  {t("label")}
                </h3>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-sm bg-accent/20 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Address</h4>
                      <p className="text-warm-white/60 text-sm">{t("info.address")}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-sm bg-accent/20 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Phone</h4>
                      <p className="text-warm-white/60 text-sm" dir="ltr">{t("info.phone")}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-sm bg-accent/20 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Email</h4>
                      <p className="text-warm-white/60 text-sm">{t("info.email")}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-sm bg-accent/20 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Working Hours</h4>
                      <p className="text-warm-white/60 text-sm">{t("info.hours")}</p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-warm-white/10 mt-10 pt-8">
                  <h4 className="font-semibold text-sm mb-4">Follow Us</h4>
                  <div className="flex gap-3">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-sm bg-warm-white/10 flex items-center justify-center hover:bg-accent transition-colors duration-300"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}

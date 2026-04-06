"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";

const navLinks = [
  { key: "home", href: "" },
  { key: "about", href: "/about" },
  { key: "products", href: "/products" },
  { key: "clients", href: "/clients" },
  { key: "contact", href: "/contact" },
];

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tContact = useTranslations("contact");
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-dark text-warm-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <FadeIn delay={0} className="lg:col-span-1">
            <Link href={`/${locale}`} className="inline-block mb-6">
              <span
                className="text-3xl font-bold tracking-wider"
                style={{ fontFamily: "var(--font-heading-en)" }}
              >
                KEM<span className="text-accent">CON</span>
              </span>
            </Link>
            <p className="text-warm-white/60 leading-relaxed mb-6 text-sm">
              {t("description")}
            </p>
            <p className="text-accent text-sm italic">
              {t("tagline")}
            </p>
          </FadeIn>

          {/* Quick Links */}
          <FadeIn delay={0.1}>
            <h4 className="text-lg font-semibold mb-6 text-warm-white">
              {t("quickLinks")}
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-warm-white/60 hover:text-accent transition-colors duration-300 text-sm"
                  >
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </FadeIn>

          {/* Contact Info */}
          <FadeIn delay={0.2}>
            <h4 className="text-lg font-semibold mb-6 text-warm-white">
              {t("getInTouch")}
            </h4>
            <ul className="space-y-3 text-sm text-warm-white/60">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-1 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{tContact("info.address")}</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-1 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span dir="ltr">{tContact("info.phone")}</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-1 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{tContact("info.email")}</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-1 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{tContact("info.hours")}</span>
              </li>
            </ul>
          </FadeIn>

          {/* Social */}
          <FadeIn delay={0.3}>
            <h4 className="text-lg font-semibold mb-6 text-warm-white">
              {t("followUs")}
            </h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-sm bg-warm-white/10 flex items-center justify-center hover:bg-accent transition-colors duration-300 group"
              >
                <svg className="w-5 h-5 text-warm-white/60 group-hover:text-warm-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-warm-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-warm-white/40">
            <p>
              © {currentYear} Kemcon. {t("rights")}.
            </p>
            <div className="gold-divider md:hidden" />
          </div>
        </div>
      </div>
    </footer>
  );
}

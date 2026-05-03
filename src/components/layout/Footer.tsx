"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Store, Factory, Phone } from "lucide-react";
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
  const isAr = locale === "ar";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-dark text-warm-white border-t border-[var(--color-deep-accent)]/30">
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
              <li className="flex items-center gap-3">
                <Store size={16} className="text-accent shrink-0" strokeWidth={1.5} />
                <a
                  href="https://maps.app.goo.gl/P258pkoaV3g7dLHP7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors duration-300"
                >
                  {isAr ? "المعرض — القاهرة، مصر" : "Showroom — Cairo, Egypt"}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Factory size={16} className="text-accent shrink-0" strokeWidth={1.5} />
                <a
                  href="https://maps.app.goo.gl/DCcFrvaM21skeTs1A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors duration-300"
                >
                  {isAr ? "المصنع — القاهرة، مصر" : "Factory — Cairo, Egypt"}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-accent shrink-0" strokeWidth={1.5} />
                <a href="https://wa.me/201223122276" target="_blank" rel="noopener noreferrer" dir="ltr" className="hover:text-accent transition-colors duration-300">
                  +20 12 23122276
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-accent shrink-0" strokeWidth={1.5} />
                <a href="tel:+20223546722" dir="ltr" className="hover:text-accent transition-colors duration-300">
                  02 23546722
                </a>
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
                href="https://web.facebook.com/profile.php?id=100076584950929"
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

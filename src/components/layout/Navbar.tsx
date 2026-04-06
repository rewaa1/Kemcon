"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { cn } from "@/lib/utils";

const navLinks = [
  { key: "home", href: "" },
  { key: "about", href: "/about" },
  { key: "products", href: "/products" },
  { key: "clients", href: "/clients" },
  { key: "contact", href: "/contact" },
];

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    if (href === "") return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname.startsWith(fullPath);
  };

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-background/90 backdrop-blur-xl shadow-md border-b border-accent/10"
            : "bg-transparent"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2 group">
              <div className="relative">
                <span
                  className={cn(
                    "text-2xl md:text-3xl font-bold tracking-wider transition-colors duration-300",
                    scrolled ? "text-foreground" : "text-warm-white"
                  )}
                  style={{ fontFamily: "var(--font-heading-en)" }}
                >
                  KEM
                  <span className="text-accent">CON</span>
                </span>
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-accent"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={`/${locale}${link.href}`}
                  className={cn(
                    "relative text-sm font-medium tracking-wide uppercase transition-colors duration-300 py-2",
                    isActive(link.href)
                      ? "text-accent"
                      : scrolled
                      ? "text-foreground/70 hover:text-accent"
                      : "text-warm-white/80 hover:text-warm-white"
                  )}
                >
                  {t(link.key)}
                  {isActive(link.href) && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                      layoutId="activeNav"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher light={!scrolled} />

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                <motion.span
                  className={cn(
                    "block w-6 h-0.5 transition-colors",
                    scrolled ? "bg-foreground" : "bg-warm-white"
                  )}
                  animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                />
                <motion.span
                  className={cn(
                    "block w-6 h-0.5 transition-colors",
                    scrolled ? "bg-foreground" : "bg-warm-white"
                  )}
                  animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                />
                <motion.span
                  className={cn(
                    "block w-6 h-0.5 transition-colors",
                    scrolled ? "bg-foreground" : "bg-warm-white"
                  )}
                  animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                />
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-background shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="flex flex-col pt-24 px-8 gap-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.key}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={`/${locale}${link.href}`}
                      className={cn(
                        "block py-3 text-lg font-medium border-b border-accent/10 transition-colors",
                        isActive(link.href)
                          ? "text-accent"
                          : "text-foreground/70 hover:text-accent"
                      )}
                    >
                      {t(link.key)}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

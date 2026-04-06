"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ light = false }: { light?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <motion.button
      onClick={switchLocale}
      className={cn(
        "relative inline-flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm font-medium border transition-all duration-300 cursor-pointer",
        light
          ? "border-warm-white/30 text-warm-white hover:bg-warm-white/10"
          : "border-accent/30 text-foreground hover:border-accent hover:bg-accent/5"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className={cn(locale === "en" ? "font-semibold" : "opacity-50")}>
        EN
      </span>
      <span className="text-accent">|</span>
      <span className={cn(locale === "ar" ? "font-semibold" : "opacity-50")}>
        عربي
      </span>
    </motion.button>
  );
}

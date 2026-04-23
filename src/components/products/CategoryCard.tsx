"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { CategoryType } from "@/types/configurator";

const CATEGORY_GRADIENTS: Record<CategoryType, string> = {
  curtains:
    "linear-gradient(135deg, #1a1520 0%, #2e1f3a 40%, #1a1520 100%)",
  chairs:
    "linear-gradient(135deg, #1a1815 0%, #3a2a1a 40%, #1a1815 100%)",
  sofas:
    "linear-gradient(135deg, #151a1a 0%, #1a3030 40%, #151a1a 100%)",
  "bed-sheets":
    "linear-gradient(135deg, #1a1820 0%, #1f2038 40%, #1a1820 100%)",
  custom:
    "linear-gradient(135deg, #1a1515 0%, #38181a 40%, #1a1515 100%)",
};

const CATEGORY_ACCENT: Record<CategoryType, string> = {
  curtains: "#7a5a9a",
  chairs: "#9a7a4a",
  sofas: "#4a8a7a",
  "bed-sheets": "#4a5a9a",
  custom: "#9a4a5a",
};

interface CategoryCardProps {
  category: CategoryType;
  name: string;
  description: string;
  href: string;
  locale: string;
  index: number;
}

export function CategoryCard({
  category,
  name,
  description,
  href,
  locale,
  index,
}: CategoryCardProps) {
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const accent = CATEGORY_ACCENT[category];
  const gradient = CATEGORY_GRADIENTS[category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={href} className="group block h-full">
        <div
          className="relative h-full rounded-sm overflow-hidden border border-[var(--color-deep-accent)]/15 transition-all duration-500 group-hover:border-[var(--color-accent)]/30"
          style={{ background: gradient }}
        >
          {/* Accent corner glow */}
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-35 pointer-events-none"
            style={{ background: accent }}
          />

          <div className="relative p-7 flex flex-col h-full min-h-[220px]">
            {/* Category accent line */}
            <div
              className="w-8 h-0.5 mb-5 rounded-full transition-all duration-300 group-hover:w-14"
              style={{ background: accent }}
            />

            <h3 className="text-xl font-bold text-[var(--color-heading)] mb-3 leading-tight">
              {name}
            </h3>

            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed flex-1">
              {description}
            </p>

            {/* CTA */}
            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[var(--color-deep-accent)]/15">
              <span
                className="text-xs font-semibold uppercase tracking-widest transition-colors duration-200"
                style={{ color: accent }}
              >
                {isAr ? "ابدأ التصميم" : "Start Designing"}
              </span>
              <ArrowIcon
                size={14}
                className={`transition-all duration-300 ${isAr ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
                style={{ color: accent }}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

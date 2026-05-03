"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { CategoryType } from "@/types/configurator";

const CATEGORY_IMAGE: Record<CategoryType, string> = {
  curtains: "/cards/curtains.jpg",
  chairs: "/cards/chairs.jpg",
  sofas: "/cards/sofas.jpg",
  "bed-sheets": "/cards/bedsheets.jpg",
  custom: "/cards/customsolution.jpg",
};

const CATEGORY_ACCENT: Record<CategoryType, string> = {
  curtains: "#b0a4c8",
  chairs: "#c8aa7a",
  sofas: "#7ac8b4",
  "bed-sheets": "#8a9ece",
  custom: "#ce8a9a",
};

interface CategoryCardProps {
  category: CategoryType;
  name: string;
  description: string;
  href: string;
  locale: string;
  index: number;
  fullWidth?: boolean;
}

export function CategoryCard({
  category,
  name,
  description,
  href,
  locale,
  index,
  fullWidth = false,
}: CategoryCardProps) {
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const accent = CATEGORY_ACCENT[category];
  const image = CATEGORY_IMAGE[category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="h-full"
    >
      <Link href={href} className="group block h-full">
        <div
          className={`relative overflow-hidden border border-white/[0.06] transition-colors duration-500 group-hover:border-white/[0.12] ${
            fullWidth ? "min-h-[150px]" : "min-h-[290px]"
          }`}
        >
          {/* Background image */}
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes={fullWidth ? "100vw" : "(max-width: 640px) 100vw, 50vw"}
          />

          {/* Overlay */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              fullWidth
                ? "bg-gradient-to-r from-[#111318]/92 via-[#111318]/65 to-[#111318]/25"
                : "bg-gradient-to-t from-[#111318]/96 via-[#111318]/55 to-[#111318]/10"
            }`}
          />

          {/* Content */}
          <div
            className={`relative h-full p-7 flex ${
              fullWidth
                ? `items-center justify-between gap-8 ${isAr ? "flex-row-reverse" : ""}`
                : "flex-col justify-end"
            }`}
          >
            {fullWidth ? (
              <>
                <div className={isAr ? "text-right" : ""}>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.3em] mb-2 opacity-80"
                    style={{ color: accent }}
                  >
                    {isAr ? "طلب مخصص" : "Custom Order"}
                  </p>
                  <h3 className="text-2xl font-bold text-[var(--color-heading)] mb-2 leading-tight">
                    {name}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-md">
                    {description}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-2 shrink-0 ${isAr ? "flex-row-reverse" : ""}`}
                  style={{ color: accent }}
                >
                  <span className="text-xs font-semibold uppercase tracking-widest whitespace-nowrap">
                    {isAr ? "ابدأ التصميم" : "Start Designing"}
                  </span>
                  <ArrowIcon
                    size={14}
                    className={`transition-transform duration-300 ${isAr ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
                  />
                </div>
              </>
            ) : (
              <>
                <div
                  className="w-7 h-0.5 mb-4 transition-all duration-300 group-hover:w-12"
                  style={{ background: accent }}
                />
                <h3 className="text-xl font-bold text-[var(--color-heading)] mb-2 leading-tight">
                  {name}
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-5">
                  {description}
                </p>
                <div
                  className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}
                  style={{ color: accent }}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-widest">
                    {isAr ? "ابدأ التصميم" : "Start Designing"}
                  </span>
                  <ArrowIcon
                    size={13}
                    className={`transition-transform duration-300 ${isAr ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

"use client";

import { FadeIn } from "@/components/motion/FadeIn";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
  className?: string;
}

export function SectionHeading({
  label,
  title,
  description,
  align = "center",
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-16 md:mb-20",
        align === "center" && "text-center",
        className
      )}
    >
      {label && (
        <FadeIn delay={0}>
          <span
            className={cn(
              "inline-block text-xs sm:text-sm font-medium tracking-[0.25em] uppercase mb-5",
              light ? "text-light-accent" : "text-accent"
            )}
          >
            {label}
          </span>
        </FadeIn>
      )}
      <FadeIn delay={0.1}>
        <h2
          className={cn(
            "text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5",
            light ? "text-warm-white" : "text-foreground"
          )}
        >
          {title}
        </h2>
      </FadeIn>
      <FadeIn delay={0.2}>
        <div
          className={cn(
            "gold-divider my-7",
            align === "center" && "gold-divider-center"
          )}
        />
      </FadeIn>
      {description && (
        <FadeIn delay={0.3}>
          <p
            className={cn(
              "text-base md:text-lg max-w-2xl leading-relaxed",
              align === "center" && "mx-auto",
              light ? "text-warm-white/70" : "text-foreground/55"
            )}
          >
            {description}
          </p>
        </FadeIn>
      )}
    </div>
  );
}

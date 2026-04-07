"use client";

import { FadeIn } from "@/components/motion/FadeIn";

interface PageHeroProps {
  label: string;
  title: string;
  description?: string;
  image: string;
  alt?: string;
}

export function PageHero({ label, title, description, image, alt }: PageHeroProps) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={image}
          alt={alt || title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-dark/70" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn>
          <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase">
            {label}
          </span>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warm-white mt-4 leading-tight">
            {title}
          </h1>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="gold-divider mt-6" />
        </FadeIn>
        {description && (
          <FadeIn delay={0.2}>
            <p className="text-warm-white/70 mt-6 max-w-2xl text-lg">
              {description}
            </p>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

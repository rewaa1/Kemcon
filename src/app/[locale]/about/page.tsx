"use client";

import { useTranslations } from "next-intl";
import { PageHero } from "@/components/ui/PageHero";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerContainer, staggerItem } from "@/components/motion/StaggerContainer";
import { motion } from "framer-motion";
import { CTABanner } from "@/components/sections/CTABanner";

const timeline = [
  { year: "1999", titleEN: "Founded", titleAR: "التأسيس" },
  { year: "2005", titleEN: "Expanded to Saudi Arabia", titleAR: "التوسع إلى السعودية" },
  { year: "2010", titleEN: "Entered UAE Market", titleAR: "دخول سوق الإمارات" },
  { year: "2015", titleEN: "500+ Hotels Milestone", titleAR: "إنجاز خدمة 500+ فندق" },
  { year: "2020", titleEN: "Jordan Operations", titleAR: "عمليات الأردن" },
  { year: "2024", titleEN: "B2C Launch in Egypt", titleAR: "إطلاق B2C في مصر" },
];

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <>
      {/* Hero Banner */}
      <PageHero
        label={t("label")}
        title={t("title")}
        description={t("heroDescription")}
        image="https://images.unsplash.com/photo-1611048267451-e6ed903d4a38?q=80&w=2000&auto=format&fit=crop"
        alt="About Kemcon"
      />

      {/* Story */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-6">
              {t("description")}
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
              {t("descriptionSecondary")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-28 bg-background-secondary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="" title="Our Journey" />

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-accent/20 hidden md:block" />

            <StaggerContainer className="space-y-12" staggerDelay={0.15}>
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  variants={staggerItem}
                  className={`flex flex-col md:flex-row items-center gap-6 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-end" : "md:text-start"}`}>
                    <div className="p-6 rounded-sm bg-warm-white border border-accent/10 hover:border-accent/30 hover:shadow-md transition-all duration-300">
                      <span className="text-3xl font-bold text-accent">{item.year}</span>
                      <p className="text-foreground/70 mt-2">{item.titleEN}</p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="w-4 h-4 rounded-full bg-accent border-4 border-background-secondary shrink-0 z-10 hidden md:block" />

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn direction="left">
              <div className="p-10 md:p-12 rounded-sm bg-warm-white border border-accent/10 h-full">
                <div className="w-12 h-12 rounded-sm bg-accent/10 flex items-center justify-center text-accent mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-foreground/60 leading-relaxed">
                  To be the definitive standard of luxury in fabrics and furnishings across the Middle East — setting the benchmark for quality that hotels and homes aspire to.
                </p>
              </div>
            </FadeIn>
            <FadeIn direction="right">
              <div className="p-10 md:p-12 rounded-sm bg-warm-white border border-accent/10 h-full">
                <div className="w-12 h-12 rounded-sm bg-accent/10 flex items-center justify-center text-accent mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-foreground/60 leading-relaxed">
                  To craft exceptional fabrics and furnishings that transform spaces into havens of comfort and elegance, while maintaining the artisanal quality that has defined us for over two decades.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

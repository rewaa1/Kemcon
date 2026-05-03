"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { PageHero } from "@/components/ui/PageHero";
import { FadeIn } from "@/components/motion/FadeIn";
import { CTABanner } from "@/components/sections/CTABanner";

export default function AboutClient() {
  const t = useTranslations("about");
  const locale = useLocale();
  const isAr = locale === "ar";

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

      {/* Leadership */}
      <section className="py-20 md:py-28 bg-background-secondary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className={`text-xs font-semibold uppercase tracking-[0.3em] text-accent mb-3 ${isAr ? "text-right" : ""}`}>
              {isAr ? "قيادتنا" : "Leadership"}
            </p>
            <h2 className={`text-3xl md:text-4xl font-bold text-foreground mb-16 ${isAr ? "text-right" : ""}`}>
              {isAr ? "الرجل خلف الرؤية" : "The Man Behind the Vision"}
            </h2>
          </FadeIn>

          <div className={`flex flex-col md:flex-row gap-12 md:gap-16 items-center ${isAr ? "md:flex-row-reverse" : ""}`}>
            {/* Photo */}
            <FadeIn direction={isAr ? "right" : "left"} className="w-full md:w-2/5 flex-shrink-0">
              <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-surface border border-accent/10">
                {/* Placeholder — replace src with real image path once uploaded */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-foreground/20">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-xs tracking-widest uppercase">Photo coming soon</span>
                </div>
                {/* Uncomment and set src once the image is uploaded:
                <img
                  src="/team/kamal-soliman.jpg"
                  alt="Kamal Soliman"
                  className="w-full h-full object-cover object-top"
                /> */}
                {/* Subtle accent corner */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-deep-accent" />
              </div>
            </FadeIn>

            {/* Bio */}
            <FadeIn direction={isAr ? "left" : "right"} delay={0.1} className="flex-1">
              <p className={`text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-2 ${isAr ? "text-right" : ""}`}>
                {isAr ? "المؤسس والرئيس التنفيذي" : "Founder & CEO"}
              </p>
              <h3 className={`text-3xl md:text-4xl font-bold text-foreground mb-1 ${isAr ? "text-right" : ""}`}>
                {isAr ? "كمال سليمان" : "Kamal Soliman"}
              </h3>
              <p className={`text-sm text-foreground/40 mb-8 ${isAr ? "text-right" : ""}`}>
                {isAr ? "مهندس معماري" : "Architecture Engineer"}
              </p>

              <div className={`space-y-4 text-foreground/65 leading-relaxed ${isAr ? "text-right" : ""}`}>
                <p>
                  {isAr
                    ? "بعقله الهندسي وحسّه الفني، أرسى كمال سليمان دعائم كيمكون منذ عام 1985، ليحوّلها من مشروع ناشئ إلى مجموعة تصنيعية رائدة تخدم كبرى سلاسل الفنادق في الشرق الأوسط."
                    : "With an engineer's precision and an artist's eye, Kamal Soliman founded Kemcon in 1985 and built it from the ground up into a leading manufacturing group serving elite hotel chains across the Middle East."}
                </p>
                <p>
                  {isAr
                    ? "أشرف شخصياً على تطوير ذراع التصنيع إيجيتكس، وقاد توسّع المجموعة في الأسواق الإقليمية، مؤمناً دوماً بأن الجودة الحقيقية تولد من التفاصيل التي لا يراها أحد."
                    : "He personally oversaw the development of Egytex, the group's manufacturing arm, and led its regional expansion — driven by the belief that true quality is born in the details no one else notices."}
                </p>
              </div>

              {/* Divider */}
              <div className={`mt-10 pt-8 border-t border-accent/10 flex flex-wrap gap-8 ${isAr ? "justify-end" : ""}`}>
                {[
                  { value: "40+", label: isAr ? "عاماً من الخبرة" : "Years of Experience" },
                  { value: "500+", label: isAr ? "فندق تم تجهيزه" : "Hotels Furnished" },
                  { value: "4", label: isAr ? "أسواق إقليمية" : "Regional Markets" },
                ].map((stat) => (
                  <div key={stat.label} className={isAr ? "text-right" : ""}>
                    <p className="text-2xl font-bold text-accent">{stat.value}</p>
                    <p className="text-xs text-foreground/45 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn direction="left">
              <div className="p-10 md:p-12 rounded-sm bg-surface border border-accent/10 h-full">
                <div className="w-12 h-12 rounded-sm bg-accent/10 flex items-center justify-center text-accent mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{t("vision.title")}</h3>
                <p className="text-foreground/60 leading-relaxed">
                  {t("vision.body")}
                </p>
              </div>
            </FadeIn>
            <FadeIn direction="right">
              <div className="p-10 md:p-12 rounded-sm bg-surface border border-accent/10 h-full">
                <div className="w-12 h-12 rounded-sm bg-accent/10 flex items-center justify-center text-accent mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{t("mission.title")}</h3>
                <p className="text-foreground/60 leading-relaxed">
                  {t("mission.body")}
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

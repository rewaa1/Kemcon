import { getTranslations, getLocale } from "next-intl/server";

export async function CompanyIntro() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "intro" });

  return (
    <section className="bg-background py-20 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-10 h-px bg-accent" />
          <span className="text-accent text-xs font-medium tracking-[0.25em] uppercase">
            {t("eyebrow")}
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <p className="text-warm-white/75 text-base leading-relaxed">{t("p1")}</p>
          <p className="text-warm-white/75 text-base leading-relaxed">{t("p2")}</p>
          <p className="text-warm-white/75 text-base leading-relaxed">{t("p3")}</p>
        </div>
      </div>
    </section>
  );
}

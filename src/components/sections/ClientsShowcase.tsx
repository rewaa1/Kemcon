"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/motion/FadeIn";

const brandLogos = [
  { name: "Sheraton",        logo: "/clients/cairosheraton/sheraton_logo_white_bg.png" },
  { name: "Le Méridien",     logo: "/clients/meridienhelioplis/le_meridien_white_bg.png" },
  { name: "Four Seasons",    logo: "/clients/fourseasonscairo/fourseasons_logo.png" },
  { name: "Hilton",          logo: "/clients/ramseshilton/Hilton-logo.png" },
  { name: "Marriott",        logo: "/clients/marriottmenahouse/marriott-logo.png" },
  { name: "Hyatt",           logo: "/clients/hyattoctober/logo.png" },
  { name: "Steigenberger",   logo: "/clients/steigenberger-aldau/Steigenberger-logo.webp" },
  { name: "Sofitel",         logo: "/clients/sofitel-hurghada/logo.png" },
  { name: "InterContinental",logo: "/clients/intercontinental-city/logo.webp" },
  { name: "Rotana",          logo: "/clients/rotana-sharm/logo.png" },
  { name: "Kempinski",       logo: "/clients/kempinski-yanbu/logo.png" },
  { name: "Fairmont",        logo: "/clients/fairmont-makkah/logo.png" },
  { name: "Rixos",           logo: "/clients/rixos-sharm/logo1.png" },
  { name: "Mövenpick",       logo: "/clients/movenpick-gouna/logo.png" },
  { name: "St. Regis",       logo: "/clients/st-regis/logo.png" },
  { name: "Radisson Blu",    logo: "/clients/radisson-alex/logo.png" },
];

export function ClientsShowcase() {
  const t = useTranslations("clients");
  const locale = useLocale();

  return (
    <section className="py-28 md:py-40 bg-background-secondary relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeading
          label={t("label")}
          title={t("title")}
          description={t("description")}
        />

        <FadeIn>
          <div className="relative overflow-hidden py-10 group">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background-secondary to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background-secondary to-transparent z-10 pointer-events-none" />

            <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
              {[...brandLogos, ...brandLogos].map((brand, index) => (
                <div
                  key={`${brand.name}-${index}`}
                  className="flex-shrink-0 mx-5 flex items-center justify-center"
                >
                  <div className="w-36 h-24 rounded-sm bg-white flex items-center justify-center px-4 py-3 shadow-sm">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={120}
                      height={56}
                      className="object-contain w-auto max-h-14"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-6">
            <Link
              href={`/${locale}/clients`}
              className="text-sm text-foreground/50 hover:text-accent transition-colors duration-200 underline underline-offset-4"
            >
              {t("cta")}
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

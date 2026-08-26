"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/motion/FadeIn";

const brandLogos = [
  { name: "Sheraton",        logo: "https://2e3n0iobhs.ufs.sh/f/ijFqTGBRjXKot6JY7ZO5Ixie0E7aCrF3KzymN162BkLWTqpZ" },
  { name: "Le Méridien",     logo: "https://2e3n0iobhs.ufs.sh/f/ijFqTGBRjXKoDAxkiJKtTGSY50nBevl9JkXw2hLZPHzxc1IR" },
  { name: "Four Seasons",    logo: "https://2e3n0iobhs.ufs.sh/f/ijFqTGBRjXKoTQjXDuCIqDsOE6oZFJyjVC4Pbl5viu03Hkh1" },
  { name: "Hilton",          logo: "https://2e3n0iobhs.ufs.sh/f/ijFqTGBRjXKoSGIUWaa3y8qcB6ekDnxL7t2AaHzC9ITRVMs1" },
  { name: "Marriott",        logo: "https://2e3n0iobhs.ufs.sh/f/ijFqTGBRjXKopUdECHYGuPH375xOmAQUV4DWMbaqJ9knshdy" },
  { name: "Hyatt",           logo: "https://2e3n0iobhs.ufs.sh/f/ijFqTGBRjXKorFTKBtflJrQhzGdw5Smi6apVgP1EUBTyCskA" },
  { name: "Steigenberger",   logo: "https://2e3n0iobhs.ufs.sh/f/ijFqTGBRjXKoplZKMoYGuPH375xOmAQUV4DWMbaqJ9knshdy" },
  { name: "Sofitel",         logo: "https://2e3n0iobhs.ufs.sh/f/ijFqTGBRjXKoLQ8AwDnszxb8nrMGymHSQJXtdBkRKE6Y72iZ" },
  { name: "InterContinental",logo: "https://2e3n0iobhs.ufs.sh/f/ijFqTGBRjXKoBlvCFHTJCRvDNA8b0LQJX9lSTUMyfKqerOI5" },
  { name: "Rotana",          logo: "https://2e3n0iobhs.ufs.sh/f/ijFqTGBRjXKogSmYcXtYOp3EzU4ZnwhGQeDvAoaFf6CP5d2r" },
  { name: "Kempinski",       logo: "https://2e3n0iobhs.ufs.sh/f/ijFqTGBRjXKormyMjVlJrQhzGdw5Smi6apVgP1EUBTyCskAM" },
  { name: "Fairmont",        logo: "https://2e3n0iobhs.ufs.sh/f/ijFqTGBRjXKobi0ntahcZ4kVF5fpBX80NsPjxCT369rzStoO" },
  { name: "Rixos",           logo: "https://2e3n0iobhs.ufs.sh/f/ijFqTGBRjXKoSGgBrGc3y8qcB6ekDnxL7t2AaHzC9ITRVMs1" },
  { name: "Mövenpick",       logo: "https://2e3n0iobhs.ufs.sh/f/ijFqTGBRjXKoCjQtBvRHg31aI7PxDs8urdqY20hzBbpyQtiN" },
  { name: "St. Regis",       logo: "https://2e3n0iobhs.ufs.sh/f/ijFqTGBRjXKoRhK8uVPyYsPZxbmrvTI2RHMhcCD9fUa8tzpn" },
  { name: "Radisson Blu",    logo: "https://2e3n0iobhs.ufs.sh/f/ijFqTGBRjXKoVIbMa9a2LDzfdtyXCZN81pHvqeShcjA0Kuro" },
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

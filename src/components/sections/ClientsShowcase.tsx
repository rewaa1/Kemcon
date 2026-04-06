"use client";

import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/motion/FadeIn";

const hotelLogos = [
  { name: "Hilton Hotels", initials: "H" },
  { name: "Marriott International", initials: "M" },
  { name: "Four Seasons", initials: "FS" },
  { name: "Kempinski", initials: "K" },
  { name: "Steigenberger", initials: "S" },
  { name: "Mövenpick", initials: "MP" },
  { name: "Rotana Hotels", initials: "R" },
  { name: "Sofitel", initials: "SF" },
];

export function ClientsShowcase() {
  const t = useTranslations("clients");

  return (
    <section className="py-20 md:py-32 bg-background-secondary relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label={t("label")}
          title={t("title")}
          description={t("description")}
        />

        {/* Marquee */}
        <FadeIn>
          <div className="relative overflow-hidden py-8">
            {/* Gradient masks */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background-secondary to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background-secondary to-transparent z-10" />

            <div className="flex animate-marquee">
              {[...hotelLogos, ...hotelLogos].map((hotel, index) => (
                <div
                  key={`${hotel.name}-${index}`}
                  className="flex-shrink-0 mx-8 flex items-center justify-center"
                >
                  <div className="w-32 h-20 rounded-sm bg-warm-white border border-accent/10 flex items-center justify-center hover:border-accent/30 hover:shadow-md transition-all duration-300 group">
                    <div className="text-center">
                      <span className="text-2xl font-bold text-accent/40 group-hover:text-accent transition-colors duration-300" style={{ fontFamily: "var(--font-heading-en)" }}>
                        {hotel.initials}
                      </span>
                      <p className="text-[10px] text-foreground/30 mt-1 group-hover:text-foreground/50 transition-colors">
                        {hotel.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

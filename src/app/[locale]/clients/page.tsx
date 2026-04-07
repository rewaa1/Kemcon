"use client";

import { useTranslations } from "next-intl";
import { PageHero } from "@/components/ui/PageHero";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerContainer, staggerItem } from "@/components/motion/StaggerContainer";
import { motion } from "framer-motion";
import { CTABanner } from "@/components/sections/CTABanner";

const hotelPartners = [
  { name: "Hilton Hotels & Resorts", region: "Egypt, Saudi Arabia", initials: "H" },
  { name: "Marriott International", region: "Egypt, UAE", initials: "M" },
  { name: "Four Seasons Hotels", region: "Egypt", initials: "FS" },
  { name: "Kempinski Hotels", region: "Jordan, Egypt", initials: "K" },
  { name: "Steigenberger Hotels", region: "Egypt", initials: "S" },
  { name: "Mövenpick Hotels", region: "Egypt, Jordan", initials: "MP" },
  { name: "Rotana Hotels", region: "UAE, Egypt", initials: "R" },
  { name: "Sofitel Hotels", region: "Egypt", initials: "SF" },
];

const testimonials = [
  {
    quote: "Kemcon has been our trusted partner for over a decade. Their quality is consistently exceptional.",
    author: "Hotel Operations Director",
    hotel: "Five-Star Resort, Cairo",
  },
  {
    quote: "The attention to detail in every piece is remarkable. Our guests notice the difference.",
    author: "Interior Design Manager",
    hotel: "Luxury Hotel, Dubai",
  },
  {
    quote: "From custom fabrics to complete furnishing solutions, Kemcon delivers beyond expectations.",
    author: "Procurement Manager",
    hotel: "International Chain, Riyadh",
  },
];

const regions = [
  { name: "Egypt", flag: "🇪🇬", count: "200+" },
  { name: "Saudi Arabia", flag: "🇸🇦", count: "150+" },
  { name: "Emirates", flag: "🇦🇪", count: "100+" },
  { name: "Jordan", flag: "🇯🇴", count: "50+" },
];

export default function ClientsPage() {
  const t = useTranslations("clients");

  return (
    <>
      {/* Hero Banner */}
      <PageHero
        label={t("label")}
        title={t("title")}
        description={t("description")}
        image="https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?q=80&w=2000&auto=format&fit=crop"
        alt="Our Clients"
      />

      {/* Regions */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6" staggerDelay={0.1}>
            {regions.map((region) => (
              <motion.div
                key={region.name}
                variants={staggerItem}
                className="text-center p-6 rounded-sm bg-warm-white border border-accent/10"
              >
                <span className="text-4xl mb-3 block">{region.flag}</span>
                <h3 className="text-lg font-bold text-foreground">{region.name}</h3>
                <p className="text-accent font-semibold mt-1">{region.count}</p>
                <p className="text-foreground/50 text-xs mt-1">Hotels Served</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="" title="Our Valued Partners" />

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6" staggerDelay={0.08}>
            {hotelPartners.map((hotel) => (
              <motion.div
                key={hotel.name}
                variants={staggerItem}
                className="group p-8 rounded-sm bg-warm-white border border-accent/10 hover:border-accent/30 hover:shadow-md transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-background-secondary flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors duration-300">
                  <span className="text-xl font-bold text-accent" style={{ fontFamily: "var(--font-heading-en)" }}>
                    {hotel.initials}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{hotel.name}</h3>
                <p className="text-xs text-foreground/50">{hotel.region}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="" title="What They Say" />

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.15}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="p-8 rounded-sm bg-warm-white border border-accent/10 relative"
              >
                {/* Quote mark */}
                <span className="text-6xl text-accent/20 font-serif absolute top-4 left-6">&ldquo;</span>
                <p className="text-foreground/70 leading-relaxed mb-6 pt-8 italic">
                  {testimonial.quote}
                </p>
                <div className="gold-divider mb-4" />
                <p className="text-foreground font-semibold text-sm">{testimonial.author}</p>
                <p className="text-foreground/50 text-xs mt-1">{testimonial.hotel}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

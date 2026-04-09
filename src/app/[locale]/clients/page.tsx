"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerContainer, staggerItem } from "@/components/motion/StaggerContainer";
import { motion, AnimatePresence } from "framer-motion";
import { CTABanner } from "@/components/sections/CTABanner";
import Image from "next/image";
import { featuredClients, partnerBrands, testimonials, regions, type FeaturedClient } from "@/data/clients";

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  images,
  name,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[];
  name: string;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-dark/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface border border-accent/20 flex items-center justify-center text-warm-white hover:border-accent/50 transition-colors text-lg"
        onClick={onClose}
      >
        ✕
      </button>

      {/* Prev */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface border border-accent/20 flex items-center justify-center text-warm-white hover:border-accent/50 transition-colors text-xl"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        ‹
      </button>

      {/* Image */}
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt={`${name} — room ${index + 1}`}
          className="max-w-[90vw] max-h-[75vh] w-auto h-auto rounded-sm object-contain"
        />
      </motion.div>

      {/* Next */}
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface border border-accent/20 flex items-center justify-center text-warm-white hover:border-accent/50 transition-colors text-xl"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >
        ›
      </button>

      {/* Counter + thumbnails */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="flex gap-1.5">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); }}
              className={`relative w-10 h-7 rounded-[2px] overflow-hidden border transition-all duration-200 ${
                i === index ? "border-accent" : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="40px" />
            </button>
          ))}
        </div>
        <p className="text-text-muted text-xs">{index + 1} / {images.length}</p>
      </div>
    </motion.div>
  );
}

// ─── Client Card ──────────────────────────────────────────────────────────────

function ClientCard({ client }: { client: FeaturedClient }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const prev = () => setLightboxIndex((i) => (i - 1 + client.rooms.length) % client.rooms.length);
  const next = () => setLightboxIndex((i) => (i + 1) % client.rooms.length);

  return (
    <>
      <motion.div
        variants={staggerItem}
        className="group rounded-sm overflow-hidden border border-accent/12 hover:border-accent/30 transition-all duration-300 bg-surface cursor-pointer"
        onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
      >
        {/* Featured image — fixed aspect, no zoom */}
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={client.featured}
            alt={client.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent" />
          {/* Room count badge */}
          <div className="absolute bottom-2.5 right-2.5 bg-dark/70 backdrop-blur-sm rounded-[2px] px-2 py-1 flex items-center gap-1">
            <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-warm-white text-[10px]">{client.rooms.length} photos</span>
          </div>
        </div>

        {/* Info row */}
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="w-11 h-8 relative flex-shrink-0 bg-white rounded-[2px] overflow-hidden">
            <Image
              src={client.logo}
              alt={`${client.name} logo`}
              fill
              className="object-contain p-1"
              sizes="44px"
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-heading leading-snug truncate">{client.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-text-muted text-xs truncate">{client.region}</span>
              <span className="text-accent/30 text-[10px]">•</span>
              <span className="text-accent text-[10px] tracking-wider flex-shrink-0">{"★".repeat(client.stars)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={client.rooms}
            name={client.name}
            index={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
            onPrev={prev}
            onNext={next}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ClientsPage() {
  const t = useTranslations("clients");

  return (
    <>
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
                className="text-center p-6 rounded-sm bg-surface border border-accent/10"
              >
                <span className="text-4xl mb-3 block">{region.flag}</span>
                <h3 className="text-lg font-bold text-heading">{region.name}</h3>
                <p className="text-accent font-semibold mt-1">{region.count}</p>
                <p className="text-text-muted text-xs mt-1">Hotels Served</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Clients */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Our Partners" title="Our Clients" />
          <StaggerContainer
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            staggerDelay={0.08}
          >
            {featuredClients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Partner Brands */}
      <section className="py-20 md:py-28 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="" title="Our Valued Partners" />
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6" staggerDelay={0.08}>
            {partnerBrands.map((hotel) => (
              <motion.div
                key={hotel.name}
                variants={staggerItem}
                className="group p-8 rounded-sm bg-surface border border-accent/10 hover:border-accent/30 hover:shadow-md transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-background flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors duration-300">
                  <span className="text-xl font-bold text-accent" style={{ fontFamily: "var(--font-heading-en)" }}>
                    {hotel.initials}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-heading mb-1">{hotel.name}</h3>
                <p className="text-xs text-text-muted">{hotel.region}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="" title="What They Say" />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.15}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="p-8 rounded-sm bg-surface border border-accent/10 relative"
              >
                <span className="text-6xl text-accent/20 font-serif absolute top-4 left-6">&ldquo;</span>
                <p className="text-text-muted leading-relaxed mb-6 pt-8 italic">{testimonial.quote}</p>
                <div className="gold-divider mb-4" />
                <p className="text-heading font-semibold text-sm">{testimonial.author}</p>
                <p className="text-text-muted text-xs mt-1">{testimonial.hotel}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

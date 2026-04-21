"use client";

import { useTranslations } from "next-intl";
import { useState, useMemo, useEffect, useRef } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { motion, AnimatePresence } from "framer-motion";
import { CTABanner } from "@/components/sections/CTABanner";
import Image from "next/image";
import { featuredClients, partnerBrands, testimonials, regions, type FeaturedClient } from "@/data/clients";

const ALL_TAB = "All Destinations";
const PAGE_SIZE = 12;

function getCountry(region: string): string {
  if (region.includes("KSA") || region.includes("Saudi Arabia")) return "Saudi Arabia";
  if (region.includes("UAE") || region.includes("Emirates")) return "UAE";
  if (region.includes("Oman")) return "Oman";
  return "Egypt";
}

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
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-dark/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface border border-accent/20 flex items-center justify-center text-warm-white hover:border-accent/50 transition-colors"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        ✕
      </button>

      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface border border-accent/20 flex items-center justify-center text-warm-white hover:border-accent/50 transition-colors text-2xl leading-none"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous image"
      >
        ‹
      </button>

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
          alt={`${name} — ${index + 1}`}
          className="max-w-[90vw] max-h-[75vh] w-auto h-auto rounded-sm object-contain"
        />
      </motion.div>

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface border border-accent/20 flex items-center justify-center text-warm-white hover:border-accent/50 transition-colors text-2xl leading-none"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next image"
      >
        ›
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="hidden sm:flex gap-1.5">
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
        <div className="flex sm:hidden gap-1.5">
          {images.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-200 ${
                i === index ? "w-4 h-1.5 bg-accent" : "w-1.5 h-1.5 bg-accent/30"
              }`}
            />
          ))}
        </div>
        <p className="text-text-muted text-xs">{index + 1} / {images.length}</p>
      </div>
    </motion.div>
  );
}

// ─── Client Card ──────────────────────────────────────────────────────────────

function ClientCard({ client, index }: { client: FeaturedClient; index: number }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const isPriority = index < 8;

  const prev = () => setLightboxIndex((i) => (i - 1 + client.rooms.length) % client.rooms.length);
  const next = () => setLightboxIndex((i) => (i + 1) % client.rooms.length);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index, 7) * 0.05, duration: 0.4 }}
        className="group relative rounded-sm overflow-hidden border border-accent/10 hover:border-accent/35 bg-surface cursor-pointer transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
        onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
      >
        {/* Featured image */}
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={client.featured}
            alt={client.name}
            fill
            priority={isPriority}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/10 to-transparent" />

          {/* View Gallery overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-2 border border-accent/40 rounded-[2px] px-4 py-2 bg-dark/55 backdrop-blur-sm">
              <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-warm-white text-xs tracking-[0.12em] uppercase">View Gallery</span>
            </div>
          </div>

          {/* Photo count badge */}
          <div className="absolute bottom-2.5 right-2.5 bg-dark/60 backdrop-blur-sm rounded-[2px] px-2 py-0.5">
            <span className="text-warm-white/80 text-[10px] tabular-nums">{client.rooms.length} photos</span>
          </div>
        </div>

        {/* Card footer */}
        <div className="px-4 py-3.5 flex items-center gap-3 border-t border-accent/8">
          <div className="w-12 h-8 relative flex-shrink-0 bg-white rounded-[2px] overflow-hidden">
            <Image
              src={client.logo}
              alt={`${client.name} logo`}
              fill
              className="object-contain p-1"
              sizes="48px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-heading leading-snug truncate">{client.name}</h3>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-text-muted text-xs truncate">{client.region}</span>
              <span className="text-accent/60 text-[9px] flex-shrink-0 ml-1.5 tracking-wide">{"★".repeat(client.stars ?? 5)}</span>
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

// ─── Destination Filter ───────────────────────────────────────────────────────

function DestinationFilter({
  regions,
  counts,
  active,
  total,
  onChange,
}: {
  regions: string[];
  counts: Record<string, number>;
  active: string;
  total: number;
  onChange: (r: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const grouped = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const r of regions) {
      const country = getCountry(r);
      (map[country] ??= []).push(r);
    }
    return map;
  }, [regions]);

  const countryKeys = ["Egypt", "Saudi Arabia", "Oman", "UAE"].filter((c) => grouped[c]);
  const activeCount = active === ALL_TAB ? total : (counts[active] ?? 0);

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between gap-3">
        <p className="text-text-muted text-sm hidden sm:block">
          Showing{" "}
          <span className="text-heading font-medium">{activeCount}</span>{" "}
          {activeCount === 1 ? "property" : "properties"}
          {active !== ALL_TAB && (
            <> in <span className="text-accent">{active.split(",")[0]}</span></>
          )}
        </p>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Country quick-pills — desktop */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onChange(ALL_TAB)}
              className={`px-3 py-1.5 text-xs tracking-wide rounded-[2px] border transition-all duration-200 ${
                active === ALL_TAB
                  ? "border-accent/40 text-heading bg-surface"
                  : "border-accent/10 text-text-muted hover:border-accent/25 hover:text-heading"
              }`}
            >
              All
            </button>
            {countryKeys.map((country) => {
              const isActive = active !== ALL_TAB && getCountry(active) === country;
              return (
                <button
                  key={country}
                  onClick={() => { const first = grouped[country]?.[0]; if (first) onChange(first); }}
                  className={`px-3 py-1.5 text-xs tracking-wide rounded-[2px] border transition-all duration-200 ${
                    isActive
                      ? "border-accent/40 text-heading bg-surface"
                      : "border-accent/10 text-text-muted hover:border-accent/25 hover:text-heading"
                  }`}
                >
                  {country}
                </button>
              );
            })}
            <div className="h-4 w-px bg-accent/15 mx-1" />
          </div>

          {/* Destination dropdown */}
          <div className="relative flex-1 sm:flex-none" ref={dropdownRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="w-full sm:min-w-[200px] flex items-center gap-2 px-3 py-1.5 text-xs border border-accent/20 rounded-[2px] bg-surface hover:border-accent/40 transition-all duration-200"
            >
              <svg className="w-3.5 h-3.5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="flex-1 text-left truncate text-heading">{active === ALL_TAB ? ALL_TAB : active}</span>
              <span className="text-[10px] text-accent tabular-nums mr-1">{activeCount}</span>
              <motion.svg
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-3.5 h-3.5 text-text-muted flex-shrink-0"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 right-0 sm:left-auto sm:right-0 sm:w-64 top-full mt-1.5 bg-surface border border-accent/20 rounded-[2px] shadow-xl z-20 overflow-y-auto max-h-72"
                >
                  <button
                    onClick={() => { onChange(ALL_TAB); setOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs tracking-wide transition-colors ${
                      active === ALL_TAB ? "text-heading bg-accent/8" : "text-text-muted hover:text-heading hover:bg-accent/5"
                    }`}
                  >
                    All Destinations
                    <span className="float-right text-[10px] text-accent tabular-nums">{total}</span>
                  </button>

                  <div className="h-px bg-accent/10 my-1" />

                  {countryKeys.map((country) => (
                    <div key={country}>
                      <p className="px-4 py-1.5 text-[10px] text-text-muted tracking-[0.12em] uppercase font-medium">
                        {country}
                      </p>
                      {grouped[country].map((region) => (
                        <button
                          key={region}
                          onClick={() => { onChange(region); setOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-xs tracking-wide transition-colors ${
                            active === region ? "text-heading bg-accent/8" : "text-text-muted hover:text-heading hover:bg-accent/5"
                          }`}
                        >
                          {region.split(",")[0]}
                          <span className="float-right text-[10px] text-accent tabular-nums">{counts[region]}</span>
                        </button>
                      ))}
                      <div className="h-px bg-accent/8 my-1" />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ClientsPage() {
  const t = useTranslations("clients");
  const [activeFilter, setActiveFilter] = useState(ALL_TAB);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { regionList, counts } = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of featuredClients) {
      map[c.region] = (map[c.region] ?? 0) + 1;
    }
    return { regionList: Object.keys(map).sort(), counts: map };
  }, []);

  const filteredClients = useMemo(
    () =>
      activeFilter === ALL_TAB
        ? featuredClients
        : featuredClients.filter((c) => c.region === activeFilter),
    [activeFilter]
  );

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeFilter]);

  const visibleClients = filteredClients.slice(0, visibleCount);
  const hasMore = visibleCount < filteredClients.length;

  return (
    <>
      <PageHero
        label={t("label")}
        title={t("title")}
        description={t("description")}
        image="https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?q=80&w=2000&auto=format&fit=crop"
        alt="Our Clients"
      />

      {/* Region stats — clean grid, no emoji */}
      <section className="py-0 bg-background-secondary border-y border-accent/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-accent/8">
            {regions.map((region, i) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="text-center py-10 px-6"
              >
                <p
                  className="text-3xl md:text-4xl font-bold text-heading"
                  style={{ fontFamily: "var(--font-heading-en)" }}
                >
                  {region.count}
                </p>
                <p className="text-accent text-xs tracking-[0.15em] uppercase mt-2 font-medium">{region.name}</p>
                <p className="text-text-muted text-xs mt-1">Hotels Served</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients grid */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Our Partners" title="Our Clients" />

          <DestinationFilter
            regions={regionList}
            counts={counts}
            active={activeFilter}
            total={featuredClients.length}
            onChange={setActiveFilter}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {visibleClients.map((client, i) => (
                <ClientCard key={client.id} client={client} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Load more */}
          {hasMore && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="inline-flex items-center gap-3 px-8 py-3 border border-accent/20 rounded-[2px] text-sm text-heading hover:border-accent/45 hover:bg-surface transition-all duration-300 tracking-wider"
              >
                <span>Load More</span>
                <span className="text-text-muted text-xs tabular-nums">
                  {filteredClients.length - visibleCount} remaining
                </span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Partner Brands */}
      <section className="py-20 md:py-24 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="" title="Our Valued Partners" />
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-accent/8 border border-accent/8">
            {partnerBrands.map((hotel, i) => (
              <motion.div
                key={hotel.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="group p-6 sm:p-8 bg-background-secondary hover:bg-surface transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-full border border-accent/15 group-hover:border-accent/40 flex items-center justify-center mb-4 transition-all duration-300">
                  <span
                    className="text-sm font-bold text-accent"
                    style={{ fontFamily: "var(--font-heading-en)" }}
                  >
                    {hotel.initials}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-heading mb-1 leading-snug">{hotel.name}</h3>
                <p className="text-xs text-text-muted">{hotel.region}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="" title="What They Say" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12, duration: 0.4 }}
                className="p-8 rounded-sm bg-surface border border-accent/10 relative flex flex-col"
              >
                <div className="text-5xl text-accent/15 font-serif leading-none mb-4">&ldquo;</div>
                <p className="text-text-muted leading-relaxed italic flex-1 mb-6">{testimonial.quote}</p>
                <div>
                  <div className="gold-divider mb-4" />
                  <p className="text-heading font-semibold text-sm">{testimonial.author}</p>
                  <p className="text-text-muted text-xs mt-1">{testimonial.hotel}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

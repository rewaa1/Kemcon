"use client";

import { useTranslations } from "next-intl";
// `useMemo`, `useEffect` and `useRef` were only needed by the lightbox and the
// destination filter — both commented out below. Restore them alongside.
import { useState } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
// `AnimatePresence` was only used by the lightbox and the filter dropdown.
import { motion } from "framer-motion";
import { CTABanner } from "@/components/sections/CTABanner";
import Image from "next/image";
import { partnerBrands, regions, type FeaturedClient } from "@/data/clients";
import { track } from "@/lib/journey/track";
import { MARK_VERSION } from "@/lib/logoMarkVersion";

// const ALL_TAB = "All Destinations";
const PAGE_SIZE = 12;

/**
 * Routes a logo through the normaliser that renders it as a uniform bone mark.
 *
 * `unoptimized` on the resulting <Image> is deliberate: the route already
 * returns a small, correctly sized PNG, so sending it through `/_next/image`
 * again would only re-encode what we just encoded. The version carries the
 * pipeline's identity into the URL, so a change to it reaches browsers holding
 * an immutable copy of the old mark.
 */
function logoMarkSrc(url: string): string {
  return `/api/logo?u=${encodeURIComponent(url)}&v=${MARK_VERSION}`;
}

// ─── Country grouping (used by the commented-out destination filter) ──────────

// function getCountry(region: string): string {
//   if (region.includes("KSA") || region.includes("Saudi Arabia")) return "Saudi Arabia";
//   if (region.includes("UAE") || region.includes("Emirates")) return "UAE";
//   if (region.includes("Oman")) return "Oman";
//   return "Egypt";
// }

// ─── Lightbox ─────────────────────────────────────────────────────────────────
// Commented out along with the hotel photography: the cards are no longer
// clickable and there is no gallery to open.

// function Lightbox({
//   images,
//   name,
//   index,
//   onClose,
//   onPrev,
//   onNext,
//   onJump,
// }: {
//   images: string[];
//   name: string;
//   index: number;
//   onClose: () => void;
//   onPrev: () => void;
//   onNext: () => void;
//   onJump: (i: number) => void;
// }) {
//   useEffect(() => {
//     const prev = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => { document.body.style.overflow = prev; };
//   }, []);
//
//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//       if (e.key === "ArrowLeft") onPrev();
//       if (e.key === "ArrowRight") onNext();
//     };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [onClose, onPrev, onNext]);
//
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 bg-dark/95 backdrop-blur-sm flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <button
//         className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface border border-accent/20 flex items-center justify-center text-warm-white hover:border-accent/50 transition-colors"
//         onClick={onClose}
//         aria-label="Close lightbox"
//       >
//         ✕
//       </button>
//
//       <button
//         className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface border border-accent/20 flex items-center justify-center text-warm-white hover:border-accent/50 transition-colors text-2xl leading-none"
//         onClick={(e) => { e.stopPropagation(); onPrev(); }}
//         aria-label="Previous image"
//       >
//         ‹
//       </button>
//
//       <motion.div
//         key={index}
//         initial={{ opacity: 0, scale: 0.97 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.2 }}
//         className="flex items-center justify-center"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <Image
//           src={images[index]}
//           alt={`${name} — ${index + 1}`}
//           width={1200}
//           height={900}
//           className="max-w-[90vw] max-h-[75vh] rounded-sm object-contain"
//           style={{ width: "auto", height: "auto" }}
//         />
//       </motion.div>
//
//       <button
//         className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface border border-accent/20 flex items-center justify-center text-warm-white hover:border-accent/50 transition-colors text-2xl leading-none"
//         onClick={(e) => { e.stopPropagation(); onNext(); }}
//         aria-label="Next image"
//       >
//         ›
//       </button>
//
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
//         <div className="hidden sm:flex gap-1.5">
//           {images.map((img, i) => (
//             <button
//               key={i}
//               onClick={(e) => { e.stopPropagation(); onJump(i); }}
//               className={`relative w-10 h-7 rounded-[2px] overflow-hidden border transition-all duration-200 ${
//                 i === index ? "border-accent" : "border-transparent opacity-50 hover:opacity-80"
//               }`}
//             >
//               <Image src={img} alt="" fill className="object-cover" sizes="40px" />
//             </button>
//           ))}
//         </div>
//         <div className="flex sm:hidden gap-1.5">
//           {images.map((_, i) => (
//             <div
//               key={i}
//               className={`rounded-full transition-all duration-200 ${
//                 i === index ? "w-4 h-1.5 bg-accent" : "w-1.5 h-1.5 bg-accent/30"
//               }`}
//             />
//           ))}
//         </div>
//         <p className="text-text-muted text-xs">{index + 1} / {images.length}</p>
//       </div>
//     </motion.div>
//   );
// }

// ─── Client Card ──────────────────────────────────────────────────────────────

function ClientCard({ client, index }: { client: FeaturedClient; index: number }) {
  // Photography is off for now, so the property name carries the card: a
  // destination label above it, the name set in the English display face, and a
  // hairline plus star rating along the bottom. No featured image, no gallery,
  // and nothing to click.
  //
  // The logo is a faint mark rather than the boxed white chip it used to be.
  // It arrives already normalised — trimmed, monochrome, on transparency — from
  // `/api/logo`, because the source files are far too inconsistent for CSS to
  // reconcile: see `@/lib/logoMark` for what varies. That is why nothing here
  // filters or blends; the mark only needs an opacity.

  const [logoFailed, setLogoFailed] = useState(false);

  // const t = useTranslations("clients");
  // const [lightboxOpen, setLightboxOpen] = useState(false);
  // const [lightboxIndex, setLightboxIndex] = useState(0);
  // const isPriority = index < 8;
  // const preloadedRef = useRef(false);

  // Which images this visitor actually looked at, and since when.
  //
  // A Set rather than a counter because arrowing back and forth through a
  // gallery would otherwise report far more images than were really seen —
  // "viewed 12 of 30" has to mean twelve distinct photos.
  //
  // const viewedRef = useRef<Set<number>>(new Set());
  // const openedAtRef = useRef(0);

  // const handleMouseEnter = () => {
  //   if (preloadedRef.current) return;
  //   preloadedRef.current = true;
  //   client.rooms.slice(0, 3).forEach((src) => {
  //     const img = new window.Image();
  //     img.src = `/_next/image?url=${encodeURIComponent(src)}&w=1920&q=75`;
  //   });
  // };

  // const openGallery = () => {
  //   viewedRef.current = new Set([0]);
  //   openedAtRef.current = Date.now();
  //   setLightboxIndex(0);
  //   setLightboxOpen(true);
  //   // Emitted on open as well as close so a visitor who navigates away with the
  //   // lightbox still up is recorded as having previewed this property.
  //   track({ t: "client_gallery_open", clientId: client.id, region: client.region });
  // };

  // const closeGallery = () => {
  //   setLightboxOpen(false);
  //   const viewed = viewedRef.current;
  //   track({
  //     t: "client_gallery_close",
  //     clientId: client.id,
  //     region: client.region,
  //     imagesViewed: viewed.size,
  //     totalImages: client.rooms.length,
  //     maxIndex: viewed.size > 0 ? Math.max(...viewed) : 0,
  //     dwellMs: Date.now() - openedAtRef.current,
  //   });
  // };

  // `Set.add` is idempotent, so recording from inside the updater is safe even
  // though React may invoke it twice in development's strict mode.
  //
  // const step = (delta: number) =>
  //   setLightboxIndex((i) => {
  //     const target = (i + delta + client.rooms.length) % client.rooms.length;
  //     viewedRef.current.add(target);
  //     return target;
  //   });

  // const prev = () => step(-1);
  // const next = () => step(1);

  // const jump = (i: number) => {
  //   viewedRef.current.add(i);
  //   setLightboxIndex(i);
  // };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 7) * 0.05, duration: 0.4 }}
      className="group relative h-full min-h-[190px] flex flex-col rounded-sm border border-accent/10 hover:border-accent/30 bg-surface px-6 py-6 transition-colors duration-500"
    >
      {/* Destination label + faint brand mark */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <span className="text-accent/70 text-[10px] tracking-[0.18em] uppercase leading-relaxed">
          {client.region}
        </span>
        {/* A mark that will not load is dropped rather than left to the
            browser, which paints its broken-image placeholder — a torn icon in
            a box, louder than the mark it replaces. This is reachable: the
            normaliser only accepts logos on our own UploadThing hosts, so a
            hotel the CRM publishes with a logo hosted anywhere else lands
            here. The card reads perfectly well without it. */}
        {!logoFailed && (
          <div className="relative w-[74px] h-8 flex-shrink-0">
            <Image
              src={logoMarkSrc(client.logo)}
              alt=""
              aria-hidden
              fill
              unoptimized
              onError={() => setLogoFailed(true)}
              className="object-contain object-right opacity-65 group-hover:opacity-95 transition-opacity duration-500"
              sizes="74px"
            />
          </div>
        )}
      </div>

      {/* Property name */}
      <h3
        className="text-[1.15rem] leading-[1.35] text-heading"
        style={{ fontFamily: "var(--font-heading-en)" }}
      >
        {client.name}
      </h3>

      {/* Hairline + rating */}
      <div className="mt-auto pt-5 flex items-end justify-between gap-3">
        <span className="block h-px w-8 bg-accent/25 group-hover:w-14 group-hover:bg-accent/50 transition-all duration-500" />
        <span className="text-accent/50 text-[9px] flex-shrink-0 tracking-wide leading-none">
          {"★".repeat(client.stars ?? 5)}
        </span>
      </div>

      {/* Featured image, hover overlay and photo-count badge — commented out
          along with the rest of the hotel photography.

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

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 border border-accent/40 rounded-[2px] px-4 py-2 bg-dark/55 backdrop-blur-sm">
            <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-warm-white text-xs tracking-[0.12em] uppercase">{t("viewGallery")}</span>
          </div>
        </div>

        <div className="absolute bottom-2.5 right-2.5 bg-dark/60 backdrop-blur-sm rounded-[2px] px-2 py-0.5">
          <span className="text-warm-white/80 text-[10px] tabular-nums">{client.rooms.length} {t("photos")}</span>
        </div>
      </div>
      */}
    </motion.div>
  );

  // The card used to be wrapped in a fragment with the gallery lightbox, and
  // the wrapper carried `onMouseEnter={handleMouseEnter}` and
  // `onClick={openGallery}`:
  //
  // <AnimatePresence>
  //   {lightboxOpen && (
  //     <Lightbox
  //       images={client.rooms}
  //       name={client.name}
  //       index={lightboxIndex}
  //       onClose={closeGallery}
  //       onPrev={prev}
  //       onNext={next}
  //       onJump={jump}
  //     />
  //   )}
  // </AnimatePresence>
}

// ─── Destination Filter ───────────────────────────────────────────────────────
// Commented out: the grid now lists every property, unfiltered.

// function DestinationFilter({
//   regions,
//   counts,
//   countryCounts,
//   active,
//   total,
//   onChange,
// }: {
//   regions: string[];
//   counts: Record<string, number>;
//   countryCounts: Record<string, number>;
//   active: string;
//   total: number;
//   onChange: (r: string) => void;
// }) {
//   const t = useTranslations("clients");
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//
//   useEffect(() => {
//     if (!open) return;
//     const onMouse = (e: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === "Escape") setOpen(false);
//     };
//     document.addEventListener("mousedown", onMouse);
//     document.addEventListener("keydown", onKey);
//     return () => {
//       document.removeEventListener("mousedown", onMouse);
//       document.removeEventListener("keydown", onKey);
//     };
//   }, [open]);
//
//   const grouped = useMemo(() => {
//     const map: Record<string, string[]> = {};
//     for (const r of regions) {
//       const country = getCountry(r);
//       (map[country] ??= []).push(r);
//     }
//     return map;
//   }, [regions]);
//
//   const countryKeys = ["Egypt", "Saudi Arabia", "Oman", "UAE"].filter((c) => grouped[c]);
//   const activeCount =
//     active === ALL_TAB ? total : (counts[active] ?? countryCounts[active] ?? 0);
//
//   return (
//     <div className="mb-10">
//       <div className="flex items-center justify-between gap-3">
//         <p className="text-text-muted text-sm">
//           <span className="text-heading font-medium">{activeCount}</span>{" "}
//           <span className="hidden sm:inline">
//             {activeCount === 1 ? t("property") : t("properties")}
//             {active !== ALL_TAB && (
//               <> {t("in")} <span className="text-accent">{active.split(",")[0]}</span></>
//             )}
//           </span>
//           <span className="sm:hidden text-xs">{activeCount === 1 ? t("property") : t("properties")}</span>
//         </p>
//
//         <div className="flex items-center gap-2 w-full sm:w-auto">
//           Country quick-pills — desktop
//           <div className="hidden md:flex items-center gap-1">
//             <button
//               onClick={() => onChange(ALL_TAB)}
//               className={`px-3 py-1.5 text-xs tracking-wide rounded-[2px] border transition-all duration-200 ${
//                 active === ALL_TAB
//                   ? "border-accent/40 text-heading bg-surface"
//                   : "border-accent/10 text-text-muted hover:border-accent/25 hover:text-heading"
//               }`}
//             >
//               {t("all")}
//             </button>
//             {countryKeys.map((country) => {
//               const isActive = active === country;
//               return (
//                 <button
//                   key={country}
//                   onClick={() => onChange(country)}
//                   className={`px-3 py-1.5 text-xs tracking-wide rounded-[2px] border transition-all duration-200 ${
//                     isActive
//                       ? "border-accent/40 text-heading bg-surface"
//                       : "border-accent/10 text-text-muted hover:border-accent/25 hover:text-heading"
//                   }`}
//                 >
//                   {country}
//                 </button>
//               );
//             })}
//             <div className="h-4 w-px bg-accent/15 mx-1" />
//           </div>
//
//           Destination dropdown
//           <div className="relative flex-1 sm:flex-none" ref={dropdownRef}>
//             <button
//               onClick={() => setOpen((v) => !v)}
//               className="w-full sm:min-w-[200px] flex items-center gap-2 px-3 py-1.5 text-xs border border-accent/20 rounded-[2px] bg-surface hover:border-accent/40 transition-all duration-200"
//             >
//               <svg className="w-3.5 h-3.5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//               </svg>
//               <span className="flex-1 text-left truncate text-heading">{active === ALL_TAB ? t("allDestinations") : active}</span>
//               <span className="text-[10px] text-accent tabular-nums mr-1">{activeCount}</span>
//               <motion.svg
//                 animate={{ rotate: open ? 180 : 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="w-3.5 h-3.5 text-text-muted flex-shrink-0"
//                 fill="none" stroke="currentColor" viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </motion.svg>
//             </button>
//
//             <AnimatePresence>
//               {open && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -4 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -4 }}
//                   transition={{ duration: 0.18 }}
//                   className="absolute left-0 right-0 sm:left-auto sm:right-0 sm:w-64 top-full mt-1.5 bg-surface border border-accent/20 rounded-[2px] shadow-xl z-20 overflow-y-auto max-h-72 overscroll-contain"
//                   data-lenis-prevent
//                 >
//                   <button
//                     onClick={() => { onChange(ALL_TAB); setOpen(false); }}
//                     className={`w-full text-left px-4 py-2 text-xs tracking-wide transition-colors ${
//                       active === ALL_TAB ? "text-heading bg-accent/8" : "text-text-muted hover:text-heading hover:bg-accent/5"
//                     }`}
//                   >
//                     {t("allDestinations")}
//                     <span className="float-right text-[10px] text-accent tabular-nums">{total}</span>
//                   </button>
//
//                   <div className="h-px bg-accent/10 my-1" />
//
//                   {countryKeys.map((country) => (
//                     <div key={country}>
//                       <p className="px-4 py-1.5 text-[10px] text-text-muted tracking-[0.12em] uppercase font-medium">
//                         {country}
//                       </p>
//                       {grouped[country].map((region) => (
//                         <button
//                           key={region}
//                           onClick={() => { onChange(region); setOpen(false); }}
//                           className={`w-full text-left px-4 py-2 text-xs tracking-wide transition-colors ${
//                             active === region ? "text-heading bg-accent/8" : "text-text-muted hover:text-heading hover:bg-accent/5"
//                           }`}
//                         >
//                           {region.split(",")[0]}
//                           <span className="float-right text-[10px] text-accent tabular-nums">{counts[region]}</span>
//                         </button>
//                       ))}
//                       <div className="h-px bg-accent/8 my-1" />
//                     </div>
//                   ))}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// ─── Page ─────────────────────────────────────────────────────────────────────

interface ClientsClientProps {
  featuredClients: FeaturedClient[];
}

export default function ClientsClient({ featuredClients }: ClientsClientProps) {
  const t = useTranslations("clients");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Filter state and derived region counts — commented out with the filter bar.
  //
  // const [activeFilter, setActiveFilter] = useState(ALL_TAB);
  // const gridRef = useRef<HTMLElement>(null);
  //
  // const { regionList, counts, countryCounts } = useMemo(() => {
  //   const map: Record<string, number> = {};
  //   const cmap: Record<string, number> = {};
  //   for (const c of featuredClients) {
  //     map[c.region] = (map[c.region] ?? 0) + 1;
  //     const country = getCountry(c.region);
  //     cmap[country] = (cmap[country] ?? 0) + 1;
  //   }
  //   return { regionList: Object.keys(map).sort(), counts: map, countryCounts: cmap };
  // }, [featuredClients]);
  //
  // const filteredClients = useMemo(() => {
  //   if (activeFilter === ALL_TAB) return featuredClients;
  //   if (activeFilter in counts) return featuredClients.filter((c) => c.region === activeFilter);
  //   return featuredClients.filter((c) => getCountry(c.region) === activeFilter);
  // }, [activeFilter, counts, featuredClients]);
  //
  // const handleFilterChange = (filter: string) => {
  //   setActiveFilter(filter);
  //   setVisibleCount(PAGE_SIZE);
  //   gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  //   track({ t: "clients_filter", region: filter });
  // };

  const visibleClients = featuredClients.slice(0, visibleCount);
  const hasMore = visibleCount < featuredClients.length;

  return (
    <>
      <PageHero
        label={t("label")}
        title={t("title")}
        description={t("description")}
        image="/images/clients-hero.jpg"
        alt=""
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
                <p className="text-text-muted text-xs mt-1">{t("hotelsServed")}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients grid */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label={t("gridLabel")} title={t("gridTitle")} />

          {/* Destination filter — commented out.

          <DestinationFilter
            regions={regionList}
            counts={counts}
            countryCounts={countryCounts}
            active={activeFilter}
            total={featuredClients.length}
            onChange={handleFilterChange}
          />
          */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {visibleClients.map((client, i) => (
              <ClientCard key={client.id} client={client} index={i} />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="mt-12 text-center">
              <button
                onClick={() => {
                  const next = visibleCount + PAGE_SIZE;
                  setVisibleCount(next);
                  track({ t: "clients_load_more", visibleCount: next });
                }}
                className="inline-flex items-center gap-3 px-8 py-3 border border-accent/20 rounded-[2px] text-sm text-heading hover:border-accent/45 hover:bg-surface transition-all duration-300 tracking-wider"
              >
                <span>{t("loadMore")}</span>
                <span className="text-text-muted text-xs tabular-nums">
                  {featuredClients.length - visibleCount} {t("remaining")}
                </span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Partner Brands */}
      {/* <section className="py-20 md:py-24 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="" title={t("partnersTitle")} />
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
      </section> */}

      <CTABanner />
    </>
  );
}

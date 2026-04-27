"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronLeft } from "lucide-react";
import { GALLERY_CLIENTS } from "@/lib/galleryData";

interface InspirationGalleryProps {
  selected: string[];
  onSelect: (src: string) => void;
  maxSelect?: number;
  isAr?: boolean;
}

export function InspirationGallery({
  selected,
  onSelect,
  maxSelect = 5,
  isAr = false,
}: InspirationGalleryProps) {
  const [activeClient, setActiveClient] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const toggleImage = (src: string) => {
    if (selected.includes(src) || selected.length < maxSelect) {
      onSelect(src);
    }
  };

  const client = GALLERY_CLIENTS.find((c) => c.slug === activeClient);

  return (
    <div className="space-y-4">
      {/* Selected thumbnails strip */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className={`flex items-center justify-between ${isAr ? "flex-row-reverse" : ""}`}>
              <span className="text-xs text-[var(--color-accent)] font-medium">
                {isAr
                  ? `${selected.length} من ${maxSelect} صور مختارة`
                  : `${selected.length} of ${maxSelect} selected`}
              </span>
              <button
                onClick={() => selected.slice().forEach((s) => onSelect(s))}
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] underline underline-offset-2 transition-colors"
              >
                {isAr ? "مسح الكل" : "Clear all"}
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {selected.map((src) => (
                <motion.div
                  key={src}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative w-16 h-16 rounded-sm overflow-hidden border border-[var(--color-accent)]/50 group flex-shrink-0"
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="64px" />
                  <button
                    onClick={() => onSelect(src)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Client images view */}
      <AnimatePresence mode="wait">
        {activeClient && client ? (
          <motion.div
            key="images"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Back header */}
            <button
              onClick={() => setActiveClient(null)}
              className={`flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors ${isAr ? "flex-row-reverse" : ""}`}
            >
              <ChevronLeft size={16} className={isAr ? "rotate-180" : ""} />
              <span className="font-medium text-[var(--color-heading)]">{client.name}</span>
              <span className="text-xs">
                {isAr ? "← جميع الفنادق" : "← All hotels"}
              </span>
            </button>

            {/* Images grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {client.images.map((src) => {
                const isSelected = selected.includes(src);
                const isDisabled = !isSelected && selected.length >= maxSelect;
                return (
                  <motion.button
                    key={src}
                    onClick={() => toggleImage(src)}
                    whileHover={!isDisabled ? { scale: 1.02 } : {}}
                    className={`relative aspect-video rounded-sm overflow-hidden border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-[var(--color-accent)] shadow-[0_0_0_3px_rgba(200,164,90,0.25)]"
                        : isDisabled
                        ? "border-transparent opacity-40 cursor-not-allowed"
                        : "border-transparent hover:border-[var(--color-accent)]/50 cursor-pointer"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${client.name} room`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[var(--color-accent)]/20 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-[var(--color-accent)] flex items-center justify-center shadow-lg">
                          <Check size={14} className="text-[var(--color-dark)]" strokeWidth={2.5} />
                        </div>
                      </div>
                    )}
                    {/* Lightbox trigger */}
                    {!isSelected && !isDisabled && (
                      <div
                        className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors"
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setLightbox(src);
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {selected.length >= maxSelect && (
              <p className="text-xs text-[var(--color-text-muted)] text-center">
                {isAr
                  ? `وصلت إلى الحد الأقصى (${maxSelect} صور). أزل صورة لاختيار أخرى.`
                  : `Max ${maxSelect} images reached. Remove one to select another.`}
              </p>
            )}
          </motion.div>
        ) : (
          /* Client card grid */
          <motion.div
            key="clients"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {GALLERY_CLIENTS.map((c) => {
              const selectedCount = c.images.filter((img) => selected.includes(img)).length;
              return (
                <motion.button
                  key={c.slug}
                  onClick={() => setActiveClient(c.slug)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative aspect-video rounded-sm overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={c.images[0]}
                    alt={c.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Hotel name */}
                  <div className="absolute bottom-0 inset-x-0 p-2.5">
                    <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
                      {c.name}
                    </p>
                    <p className="text-white/60 text-[10px] mt-0.5">
                      {isAr ? `${c.images.length} صور` : `${c.images.length} photos`}
                    </p>
                  </div>

                  {/* Selected badge */}
                  {selectedCount > 0 && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--color-accent)] flex items-center justify-center shadow">
                      <span className="text-[10px] font-bold text-[var(--color-dark)]">{selectedCount}</span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={18} className="text-white" />
            </button>
            <div className="relative max-w-3xl max-h-[80vh] w-full h-full">
              <Image
                src={lightbox}
                alt="Inspiration"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

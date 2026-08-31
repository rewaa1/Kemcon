"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Minus,
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { ContactSubmit } from "@/components/shared/ContactSubmit";
import { InspirationGallery } from "@/components/shared/InspirationGallery";
import { useBriefStore, safeQuantity } from "@/lib/brief/store";
import { scrollToTop } from "@/components/providers/LenisProvider";
import {
  BRIEF_TYPE_LABELS,
  buildBriefWhatsAppText,
  formatBrief,
  lineItemChips,
  lineItemTitle,
  UNIT_LABELS,
  MAX_INSPIRATION,
  type BriefSnapshot,
} from "@/lib/brief/format";
import { KEMCON_EMAIL } from "@/lib/config";

const PROPERTY_TYPES = [
  { value: "apartment", en: "Apartment", ar: "شقة" },
  { value: "villa", en: "Villa", ar: "فيلا" },
  { value: "hotel", en: "Hotel", ar: "فندق" },
  { value: "office", en: "Office", ar: "مكتب" },
  { value: "restaurant", en: "Restaurant", ar: "مطعم" },
  { value: "other", en: "Other", ar: "أخرى" },
] as const;

const SCOPE_OPTIONS = [
  { value: "single", en: "Single Room", ar: "غرفة واحدة" },
  { value: "multiple", en: "Multiple Rooms", ar: "عدة غرف" },
  { value: "full", en: "Full Property", ar: "العقار كاملًا" },
] as const;

const STYLE_TAGS = [
  { value: "modern", en: "Modern", ar: "عصري" },
  { value: "classic", en: "Classic", ar: "كلاسيكي" },
  { value: "contemporary", en: "Contemporary", ar: "معاصر" },
  { value: "minimalist", en: "Minimalist", ar: "بسيط" },
  { value: "rustic", en: "Rustic", ar: "ريفي" },
  { value: "eclectic", en: "Eclectic", ar: "تلفيقي" },
  { value: "luxury", en: "Luxury", ar: "فاخر" },
  { value: "arabic", en: "Arabic / Oriental", ar: "عربي / شرقي" },
] as const;

const PROJECT_TYPES = [
  { value: "hotel", en: "Hotel", ar: "فندق" },
  { value: "resort", en: "Resort", ar: "منتجع" },
  { value: "office", en: "Corporate Office", ar: "مكتب" },
  { value: "residential", en: "Residential Complex", ar: "مجمع سكني" },
  { value: "restaurant", en: "Restaurant / Venue", ar: "مطعم / قاعة" },
  { value: "other", en: "Other", ar: "أخرى" },
] as const;

const TIMELINES = [
  { value: "asap", en: "As Soon As Possible", ar: "في أقرب وقت ممكن" },
  { value: "1-3m", en: "1–3 Months", ar: "1–3 أشهر" },
  { value: "3-6m", en: "3–6 Months", ar: "3–6 أشهر" },
  { value: "6m+", en: "6+ Months", ar: "أكثر من 6 أشهر" },
] as const;

const chipClass = (active: boolean) =>
  `px-4 py-2 rounded-sm text-xs font-medium border transition-all duration-200 cursor-pointer ${
    active
      ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/8"
      : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50"
  }`;

/**
 * `/products/brief` — the single send point for the whole services section.
 *
 * Everything that used to submit separately (the configurator's `mailto:`, the
 * Design Plan form, the Mass Production form) converges here and POSTs once
 * through `ContactSubmit`.
 */
export default function BriefClient() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const hydrated = useBriefStore((s) => s.hydrated);
  const type = useBriefStore((s) => s.type);
  const items = useBriefStore((s) => s.items);
  const project = useBriefStore((s) => s.project);
  const notes = useBriefStore((s) => s.notes);
  const inspirationImages = useBriefStore((s) => s.inspirationImages);
  const photos = useBriefStore((s) => s.photos);
  const contact = useBriefStore((s) => s.contact);

  const setProject = useBriefStore((s) => s.setProject);
  const setNotes = useBriefStore((s) => s.setNotes);
  const setContact = useBriefStore((s) => s.setContact);
  const setPhotos = useBriefStore((s) => s.setPhotos);
  const toggleInspiration = useBriefStore((s) => s.toggleInspiration);
  const removeItem = useBriefStore((s) => s.removeItem);
  const setQuantity = useBriefStore((s) => s.setQuantity);
  const clear = useBriefStore((s) => s.clear);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  /**
   * Once sent, the brief itself is cleared — so the working sections must come
   * off the page entirely. Leaving them mounted showed "Brief Sent!" buried
   * beneath an empty-state card telling the visitor their brief was empty.
   */
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (sent) scrollToTop();
  }, [sent]);

  // Derived rather than set in an effect: object URLs are a pure function of
  // the selected files, and the effect only handles revoking them.
  const previewUrls = useMemo(() => photos.map((f) => URL.createObjectURL(f)), [photos]);
  useEffect(
    () => () => previewUrls.forEach((url) => URL.revokeObjectURL(url)),
    [previewUrls]
  );

  const processFiles = useCallback(
    (incoming: File[]) => {
      const imageFiles = incoming.filter((f) => f.type.startsWith("image/"));
      const merged = [...photos, ...imageFiles];
      const deduplicated = merged.filter(
        (f, i) => merged.findIndex((m) => m.name === f.name && m.size === f.size) === i
      );
      setPhotos(deduplicated.slice(0, 8));
    },
    [photos, setPhotos]
  );

  const toggleStyle = (value: string) => {
    setProject({
      stylePrefs: project.stylePrefs.includes(value)
        ? project.stylePrefs.filter((s) => s !== value)
        : [...project.stylePrefs, value],
    });
  };

  const snapshot: BriefSnapshot = { type, items, project, notes, inspirationImages, contact };
  const buildSummary = (photoUrls?: string[]) => formatBrief(snapshot, photoUrls ?? []);
  const buildWhatsAppMessage = (photoUrls?: string[]) =>
    buildBriefWhatsAppText(snapshot, isAr, photoUrls ?? []);

  const totalPieces = items.reduce((sum, i) => sum + safeQuantity(i.quantity), 0);

  /**
   * The same brief, structured, for the CRM to file next to the prose version.
   *
   * Chips are resolved to English labels rather than sent as raw fabric and
   * colour ids: those ids mean nothing outside this codebase, and a lead that
   * can only be read by re-parsing a paragraph is not much of a record.
   */
  const buildMeta = () => ({
    briefType: type,
    totalPieces,
    notes,
    inspirationImages,
    project: Object.fromEntries(
      Object.entries(project).filter(([, value]) =>
        Array.isArray(value) ? value.length > 0 : Boolean(value)
      )
    ),
    items: items.map((item) => ({
      category: item.category,
      quantity: safeQuantity(item.quantity),
      title: lineItemTitle(item, false),
      notes: item.notes,
      aiImageUrl: item.aiImageUrl,
      options: Object.fromEntries(
        lineItemChips(item, false).map((chip) => [chip.label, chip.value])
      ),
    })),
  });
  /**
   * Render any project data that exists, not just the fields the current brief
   * type would collect.
   *
   * `formatBrief` submits every non-empty project field regardless of type, so
   * gating purely on type meant a visitor who switched type — one click from
   * the guided intake — could be sending details they could no longer see or
   * remove. What is on screen is now what gets sent.
   */
  const hasDesignData = !!(
    project.propertyType ||
    project.scope ||
    project.numRooms ||
    project.stylePrefs.length ||
    project.dimensions
  );
  const hasBulkData = !!(project.projectType || project.propertyName);

  const showDesignFields = type === "design" || hasDesignData;
  const showBulkFields = type === "bulk" || hasBulkData;

  // Until the persisted store has been read back, render the same neutral
  // shell the server produced.
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#1A1D24] pt-28 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-40 rounded-sm bg-[var(--color-surface)] animate-pulse mb-4" />
          <div className="h-24 rounded-sm bg-[var(--color-surface)] animate-pulse" />
        </div>
      </div>
    );
  }

  const isEmpty = items.length === 0 && type === "standard";

  return (
    <div className="min-h-screen bg-[#1A1D24]">
      {/* Header */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[260px] rounded-full blur-[100px] opacity-[0.08] bg-[#c8a45a]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <Link
              href={`/${locale}/products`}
              className={`inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-8 ${isAr ? "flex-row-reverse" : ""}`}
            >
              {isAr ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
              {isAr ? "العودة إلى الكتالوج" : "Back to catalog"}
            </Link>
          </FadeIn>
          <FadeIn direction="up" delay={0.05}>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c8a45a] mb-4">
              {sent
                ? isAr ? "تم الإرسال" : "Sent"
                : BRIEF_TYPE_LABELS[type][isAr ? "ar" : "en"]}
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.1}>
            <h1
              className={`text-4xl md:text-5xl font-bold text-[var(--color-heading)] leading-tight mb-4 ${isAr ? "text-right" : ""}`}
            >
              {sent
                ? isAr ? "شكرًا لك" : "Thank you"
                : isAr ? "موجزك" : "Your Brief"}
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.15}>
            <p
              className={`text-[var(--color-text-muted)] text-base leading-relaxed ${isAr ? "text-right" : ""}`}
            >
              {sent
                ? isAr
                  ? "وصل موجزك إلى فريقنا. سنراجع كل التفاصيل ونعود إليك قريبًا."
                  : "Your brief has reached our team. We'll go through every detail and come back to you shortly."
                : isAr
                  ? "راجع كل شيء، أضف ما يساعدنا، ثم أرسله في رسالة واحدة. سيتواصل معك فريقنا خلال 3–5 أيام عمل."
                  : "Review everything, add anything that helps, then send it as one message. Our team replies within 3–5 business days."}
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8">
        {!sent && (
          <>
        {/* Items */}
        {isEmpty ? (
          <div className="glass-card rounded-sm p-10 flex flex-col items-center gap-5 text-center">
            <div className="w-14 h-14 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
              <ClipboardList size={24} strokeWidth={1.3} className="text-[var(--color-text-muted)]" />
            </div>
            <p className="text-sm text-[var(--color-text-muted)] max-w-sm leading-relaxed">
              {isAr
                ? "موجزك فارغ. اختر قماشًا من الكتالوج وصمّم قطعتك الأولى — أو أخبرنا بما تحتاجه مباشرة."
                : "Your brief is empty. Pick a fabric from the catalog and configure your first piece — or just tell us what you need."}
            </p>
            <div className={`flex flex-wrap items-center justify-center gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
              <Link
                href={`/${locale}/products`}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[var(--color-accent)] text-[var(--color-dark)] text-xs font-semibold uppercase tracking-widest hover:bg-[var(--color-accent-hover)] transition-colors ${isAr ? "flex-row-reverse" : ""}`}
              >
                {isAr ? "تصفّح الأقمشة" : "Browse fabrics"}
                <Arrow size={13} />
              </Link>
              <Link
                href={`/${locale}/products/custom`}
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] underline underline-offset-2 transition-colors"
              >
                {isAr ? "صف ما تحتاجه" : "Describe what you need"}
              </Link>
            </div>
          </div>
        ) : (
          items.length > 0 && (
            <div className="glass-card rounded-sm p-6 space-y-4">
              <div className={`flex items-center justify-between ${isAr ? "flex-row-reverse" : ""}`}>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                  {isAr ? "القطع" : "Pieces"}
                </h2>
                <span className="text-[11px] text-[var(--color-text-muted)] tabular-nums">
                  {isAr
                    ? `${items.length} منتج · ${totalPieces} قطعة`
                    : `${items.length} product${items.length === 1 ? "" : "s"} · ${totalPieces} piece${totalPieces === 1 ? "" : "s"}`}
                </span>
              </div>

              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-sm border border-[var(--color-deep-accent)]/15 bg-[var(--color-bg)] p-4 space-y-3"
                  >
                    <div className={`flex items-start gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
                      {item.aiImageUrl && (
                        <div className="relative w-14 h-20 rounded-sm overflow-hidden border border-[var(--color-deep-accent)]/20 flex-shrink-0">
                          <Image src={item.aiImageUrl} alt="" fill className="object-cover" sizes="56px" />
                        </div>
                      )}
                      <div className={`flex-1 min-w-0 ${isAr ? "text-right" : ""}`}>
                        <p className="text-sm font-semibold text-[var(--color-heading)] leading-snug">
                          {lineItemTitle(item, isAr)}
                        </p>
                        <div className={`flex flex-wrap gap-x-3 gap-y-1 mt-2 ${isAr ? "justify-end" : ""}`}>
                          {lineItemChips(item, isAr).map((chip) => (
                            <span
                              key={chip.label}
                              className="inline-flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]"
                            >
                              {chip.hex && (
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-white/15"
                                  style={{ background: chip.hex }}
                                />
                              )}
                              <span className="opacity-70">{chip.label}:</span> {chip.value}
                            </span>
                          ))}
                        </div>
                        {item.notes && (
                          <p className="text-[11px] text-[var(--color-text-muted)] mt-2 italic">
                            “{item.notes}”
                          </p>
                        )}
                      </div>
                    </div>

                    <div className={`flex items-center justify-between gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
                      <div className={`inline-flex items-center rounded-sm border border-[var(--color-deep-accent)]/25 ${isAr ? "flex-row-reverse" : ""}`}>
                        <button
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label={isAr ? "إنقاص الكمية" : "Decrease quantity"}
                          className="w-8 h-8 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-9 text-center text-xs font-semibold tabular-nums text-[var(--color-text)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                          aria-label={isAr ? "زيادة الكمية" : "Increase quantity"}
                          className="w-8 h-8 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                        <span className="px-2 text-[10px] text-[var(--color-text-muted)] whitespace-nowrap">
                          {UNIT_LABELS[item.category][isAr ? "ar" : "en"]}
                        </span>
                      </div>

                      <div className={`flex items-center gap-1 ${isAr ? "flex-row-reverse" : ""}`}>
                        <Link
                          href={`/${locale}/products/${item.category}?edit=${item.id}`}
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-sm text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                        >
                          <Pencil size={11} />
                          {isAr ? "تعديل" : "Edit"}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label={isAr ? "إزالة" : "Remove"}
                          className="inline-flex items-center px-2 py-1.5 rounded-sm text-[var(--color-text-muted)] hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className={`flex items-center justify-between gap-4 flex-wrap ${isAr ? "flex-row-reverse" : ""}`}>
                <Link
                  href={`/${locale}/products`}
                  className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] hover:underline underline-offset-4 ${isAr ? "flex-row-reverse" : ""}`}
                >
                  <Plus size={13} />
                  {isAr ? "أضف قطعة أخرى" : "Add another piece"}
                </Link>
                <button
                  onClick={() => {
                    const ok = window.confirm(
                      isAr
                        ? "سيتم حذف كل القطع من موجزك. هل أنت متأكد؟"
                        : "This removes every piece from your brief. Are you sure?"
                    );
                    if (ok) clear();
                  }}
                  className="text-[11px] text-[var(--color-text-muted)] hover:text-red-400 transition-colors underline underline-offset-2 cursor-pointer"
                >
                  {isAr ? "إفراغ الموجز" : "Clear brief"}
                </button>
              </div>
            </div>
          )
        )}

        {/* Project details */}
        {(showDesignFields || showBulkFields) && (
          <div className="glass-card rounded-sm p-6 space-y-6">
            <h2 className={`text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}>
              {isAr ? "تفاصيل المشروع" : "Project Details"}
            </h2>

            {showBulkFields && (
              <>
                <div className="space-y-2">
                  <label className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
                    {isAr ? "نوع المشروع" : "Project Type"}
                  </label>
                  <div className={`flex flex-wrap gap-2 ${isAr ? "justify-end" : ""}`}>
                    {PROJECT_TYPES.map((pt) => (
                      <button
                        key={pt.value}
                        onClick={() =>
                          setProject({ projectType: project.projectType === pt.value ? "" : pt.value })
                        }
                        className={chipClass(project.projectType === pt.value)}
                      >
                        {isAr ? pt.ar : pt.en}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="brief-property-name"
                    className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}
                  >
                    {isAr ? "اسم العقار / الفندق" : "Property / Hotel Name"}
                  </label>
                  <input
                    id="brief-property-name"
                    type="text"
                    value={project.propertyName}
                    onChange={(e) => setProject({ propertyName: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-sm bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors ${isAr ? "text-right" : ""}`}
                    placeholder={isAr ? "مثال: فندق النيل" : "e.g. Nile Grand Hotel"}
                  />
                </div>
              </>
            )}

            {showDesignFields && (
              <>
                <div className="space-y-2">
                  <label className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
                    {isAr ? "نوع العقار" : "Property Type"}
                  </label>
                  <div className={`flex flex-wrap gap-2 ${isAr ? "justify-end" : ""}`}>
                    {PROPERTY_TYPES.map((pt) => (
                      <button
                        key={pt.value}
                        onClick={() =>
                          setProject({ propertyType: project.propertyType === pt.value ? "" : pt.value })
                        }
                        className={chipClass(project.propertyType === pt.value)}
                      >
                        {isAr ? pt.ar : pt.en}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
                    {isAr ? "نطاق التصميم" : "Design Scope"}
                  </label>
                  <div className={`flex flex-wrap gap-2 ${isAr ? "justify-end" : ""}`}>
                    {SCOPE_OPTIONS.map((sc) => (
                      <button
                        key={sc.value}
                        onClick={() =>
                          setProject({
                            scope: project.scope === sc.value ? "" : sc.value,
                            numRooms: "",
                          })
                        }
                        className={chipClass(project.scope === sc.value)}
                      >
                        {isAr ? sc.ar : sc.en}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {project.scope === "multiple" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <label
                        htmlFor="brief-rooms"
                        className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}
                      >
                        {isAr ? "عدد الغرف" : "Number of Rooms"}
                      </label>
                      <input
                        id="brief-rooms"
                        type="number"
                        min={2}
                        value={project.numRooms}
                        onChange={(e) => setProject({ numRooms: e.target.value })}
                        className={`w-32 px-3 py-2.5 rounded-sm bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors ${isAr ? "text-right" : ""}`}
                        placeholder="e.g. 4"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <label className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}>
                    {isAr ? "الأسلوب المفضّل" : "Style Preferences"}
                  </label>
                  <div className={`flex flex-wrap gap-2 ${isAr ? "justify-end" : ""}`}>
                    {STYLE_TAGS.map((tag) => (
                      <button
                        key={tag.value}
                        onClick={() => toggleStyle(tag.value)}
                        className={chipClass(project.stylePrefs.includes(tag.value))}
                      >
                        {isAr ? tag.ar : tag.en}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="brief-dimensions"
                    className={`block text-xs text-[var(--color-text-muted)] font-medium ${isAr ? "text-right" : ""}`}
                  >
                    {isAr ? "الأبعاد وتفاصيل الغرفة" : "Dimensions & Room Details"}
                  </label>
                  <textarea
                    id="brief-dimensions"
                    rows={3}
                    value={project.dimensions}
                    onChange={(e) => setProject({ dimensions: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-sm bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none ${isAr ? "text-right" : ""}`}
                    placeholder={
                      isAr
                        ? "مثال: غرفة المعيشة 5×7 م، ارتفاع السقف 3 م"
                        : "e.g. Living room 5×7 m, ceiling height 3 m"
                    }
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Timeline — relevant to every brief type */}
        <div className="glass-card rounded-sm p-6 space-y-3">
          <h2 className={`text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}>
            {isAr ? "الجدول الزمني" : "Timeline"}
          </h2>
          <div className={`flex flex-wrap gap-2 ${isAr ? "justify-end" : ""}`}>
            {TIMELINES.map((tl) => (
              <button
                key={tl.value}
                onClick={() => setProject({ timeline: project.timeline === tl.value ? "" : tl.value })}
                className={chipClass(project.timeline === tl.value)}
              >
                {isAr ? tl.ar : tl.en}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="glass-card rounded-sm p-6 space-y-3">
          <h2 className={`text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}>
            {isAr ? "ملاحظات" : "Notes"}
          </h2>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            aria-label={isAr ? "ملاحظات" : "Notes"}
            className={`w-full px-3 py-2.5 rounded-sm bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none ${isAr ? "text-right" : ""}`}
            placeholder={
              isAr
                ? "صف مشروعك ورؤيتك ومتطلباتك الخاصة…"
                : "Describe your project, vision, or specific requirements…"
            }
          />
        </div>

        {/* Reference photos */}
        <div className="glass-card rounded-sm p-6 space-y-3">
          <h2 className={`text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}>
            {isAr ? "صور مرجعية" : "Reference Photos"}
          </h2>
          <p className={`text-xs text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}>
            {isAr
              ? "حتى 8 صور. تُرفع وتُرفق تلقائيًا عند الإرسال."
              : "Up to 8 images. Uploaded and attached automatically when you send."}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              processFiles(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
            className="hidden"
          />
          {photos.length === 0 ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={(e) => {
                e.preventDefault();
                dragCounter.current++;
                setIsDragging(true);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={() => {
                dragCounter.current--;
                if (dragCounter.current === 0) setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                dragCounter.current = 0;
                setIsDragging(false);
                processFiles(Array.from(e.dataTransfer.files));
              }}
              className={`w-full flex flex-col items-center gap-2 py-8 border-2 border-dashed rounded-sm transition-all duration-200 cursor-pointer ${
                isDragging
                  ? "border-[var(--color-accent)]/60 bg-[var(--color-accent)]/5 text-[var(--color-text)]"
                  : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text)]"
              }`}
            >
              <Upload size={22} strokeWidth={1.5} />
              <span className="text-sm">
                {isDragging
                  ? isAr ? "أفلت الصور هنا" : "Drop images here"
                  : isAr ? "اضغط أو اسحب للرفع" : "Click or drag images here"}
              </span>
            </button>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {photos.map((file, i) => (
                <div
                  key={`${file.name}-${file.size}`}
                  className="relative group aspect-square rounded-sm overflow-hidden border border-[var(--color-deep-accent)]/20"
                >
                  {previewUrls[i] && (
                    <Image
                      src={previewUrls[i]}
                      alt={file.name}
                      fill
                      className="object-cover"
                      sizes="120px"
                      unoptimized
                    />
                  )}
                  <button
                    onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                    aria-label={isAr ? "إزالة الصورة" : "Remove image"}
                    className="absolute top-1 end-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}
              {photos.length < 8 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  aria-label={isAr ? "إضافة صور" : "Add images"}
                  className="aspect-square rounded-sm border-2 border-dashed border-[var(--color-deep-accent)]/30 flex items-center justify-center text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 transition-all duration-200 cursor-pointer"
                >
                  <Upload size={16} strokeWidth={1.5} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Portfolio inspiration */}
        <div className="glass-card rounded-sm p-6 space-y-4">
          <div className={isAr ? "text-right" : ""}>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              {isAr ? "إلهام من مشاريعنا" : "Inspire from Our Portfolio"}
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {isAr
                ? "اختر صورًا من فنادق نفّذناها كمرجع للأسلوب المطلوب (اختياري)"
                : "Pick photos from hotels we've furnished to reference the style you want (optional)"}
            </p>
          </div>
          <InspirationGallery
            selected={inspirationImages}
            onSelect={(src) => toggleInspiration(src, MAX_INSPIRATION)}
            maxSelect={MAX_INSPIRATION}
            isAr={isAr}
          />
        </div>

          </>
        )}

        <ContactSubmit
          isAr={isAr}
          locale={locale}
          name={contact.name}
          phone={contact.phone}
          email={contact.email}
          onChange={(field, value) => setContact({ [field]: value })}
          buildSummary={buildSummary}
          buildWhatsAppMessage={buildWhatsAppMessage}
          photos={photos}
          formType="brief"
          briefType={type}
          buildMeta={buildMeta}
          successDescEn={`Your brief has been delivered to ${KEMCON_EMAIL}. Our team will be in touch within 3–5 business days.`}
          successDescAr={`وصل موجزك إلى فريقنا على ${KEMCON_EMAIL}. سيتواصل معك فريقنا خلال 3–5 أيام عمل.`}
          onSuccess={() => {
            setSent(true);
            clear();
          }}
        />
      </div>
    </div>
  );
}

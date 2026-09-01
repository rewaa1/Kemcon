"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, ClipboardList, Plus, X } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { ContactSubmit } from "@/components/shared/ContactSubmit";
import { propertyTypes, propertyTypeIsNamed } from "@/data/propertyTypes";
import { useBriefStore } from "@/lib/brief/store";
import { track } from "@/lib/journey/track";
import {
  configuratorStateFromLineItem,
  emptyProject,
  lineItemFromConfigurator,
  type BriefLineItem,
} from "@/lib/brief/types";
import {
  buildBriefWhatsAppText,
  formatBrief,
  lineItemChips,
  lineItemTitle,
  type BriefSnapshot,
} from "@/lib/brief/format";
import {
  initialConfiguratorState,
  type CategoryType,
  type ConfiguratorState,
} from "@/types/configurator";
import { KEMCON_EMAIL } from "@/lib/config";
import { usableSizes } from "./CurtainSizeRows";
import { ChipGroup, FieldLabel, Stepper, inputClass } from "./fields";
import { sectionsFor, specFor } from "./specs";
import type { EnquiryContext } from "./types";

/**
 * One form per product category — no wizard.
 *
 * Every category used to walk a six-step configurator that led with fabric
 * swatches. What actually decides a quote is far duller: how many, for what
 * kind of building, one product answer, and how to reach you. Those four are
 * the required block here, on one screen; everything the wizard collected
 * survives as optional sections that stay shut until someone wants them.
 *
 * The differences between categories live in `specs.tsx`. This file owns the
 * spine — state, edit mode, tracking, validation, submission — so a new
 * category is a spec, not another thousand-line form.
 *
 * Two ways out, because both are real:
 *   - Send it now (the common case: one product and nothing else).
 *   - Add it to the brief, for someone ordering across categories.
 * Both end at the same `/api/contact` and the same CRM record.
 */

interface ProductEnquiryFormProps {
  category: CategoryType;
  locale: string;
  /** From `?fabric=` — the fabric catalog deep-links straight into this form. */
  initialFabricId?: string;
  initialFabricFamilyId?: string;
  /** From `?edit=` — a brief line item being changed rather than a new enquiry. */
  editId?: string;
}

export function ProductEnquiryForm({
  category,
  locale,
  initialFabricId,
  initialFabricFamilyId,
  editId,
}: ProductEnquiryFormProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const spec = specFor(category);
  const sections = sectionsFor(spec);
  const say = <T extends { en: string; ar: string }>(pair: T) => (isAr ? pair.ar : pair.en);

  const hydrated = useBriefStore((s) => s.hydrated);
  const briefItems = useBriefStore((s) => s.items);
  const briefProject = useBriefStore((s) => s.project);
  const contact = useBriefStore((s) => s.contact);
  const setContact = useBriefStore((s) => s.setContact);
  const addItem = useBriefStore((s) => s.addItem);
  const replaceItem = useBriefStore((s) => s.replaceItem);
  const setBriefProject = useBriefStore((s) => s.setProject);
  const setBriefNotes = useBriefStore((s) => s.setNotes);
  const setBriefPhotos = useBriefStore((s) => s.setPhotos);
  const setBriefType = useBriefStore((s) => s.setType);

  const [config, setConfig] = useState<ConfiguratorState>({
    ...initialConfiguratorState,
    ...(initialFabricId && {
      fabricId: initialFabricId,
      fabricFamilyId: initialFabricFamilyId ?? null,
    }),
  });
  const [quantity, setQuantity] = useState(1);
  const [propertyType, setPropertyType] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [notes, setNotes] = useState("");
  const [images, setImages] = useState<File[]>([]);

  /**
   * Arriving from the fabric catalog means the visitor has already picked a
   * fabric, so that section opens with it visible rather than making them hunt
   * for where their choice went.
   */
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(initialFabricId ? ["fabric"] : [])
  );

  /** Set once this enquiry exists as a brief line item, so re-adding updates it. */
  const [committedId, setCommittedId] = useState<string | null>(editId ?? null);

  // ── Edit mode ─────────────────────────────────────────────────────────────
  // Seeded during render rather than in an effect: React's documented pattern
  // for reacting to changed input. The persisted store is empty during SSR and
  // on the first client pass, so this cannot run at initialisation.
  const [seededFor, setSeededFor] = useState<string | null>(null);
  if (editId && hydrated && seededFor !== editId) {
    const item = briefItems.find((i) => i.id === editId);
    if (item) {
      setSeededFor(editId);
      setConfig((prev) => configuratorStateFromLineItem(item, prev));
      setQuantity(Math.max(1, item.quantity));
      if (item.notes) setNotes(item.notes);
      // Reopen whichever optional sections this item has data in — a visitor
      // who came back to change one detail should not have to remember which
      // drawer it was behind.
      setExpanded(new Set(sections.filter((s) => s.hasData(item)).map((s) => s.key)));
    }
  }

  /**
   * Seed the property fields from the brief, so the guided intake and the
   * Design Plan form do not have to be answered a second time here.
   */
  const [seededProject, setSeededProject] = useState(false);
  if (hydrated && !seededProject) {
    setSeededProject(true);
    if (briefProject.propertyType) setPropertyType(briefProject.propertyType);
    if (briefProject.propertyName) setPropertyName(briefProject.propertyName);
  }

  // Strict mode mounts effects twice in development, which would otherwise
  // double this in the funnel.
  const viewTracked = useRef(false);
  useEffect(() => {
    if (viewTracked.current) return;
    viewTracked.current = true;
    track({ t: "product_view", category });
  }, [category]);

  const update = useCallback((updates: Partial<ConfiguratorState>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
    if (updates.fabricId) {
      track({
        t: "fabric_select",
        fabricId: updates.fabricId,
        familyId: updates.fabricFamilyId ?? undefined,
      });
    }
    if (updates.colorId) track({ t: "color_select", colorId: updates.colorId });
  }, []);

  const ctx: EnquiryContext = {
    config,
    update,
    locale,
    isAr,
    images,
    setImages,
    notes,
    setNotes,
  };

  const toggleSection = (key: string) => {
    const section = sections.find((s) => s.key === key);
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else {
        next.add(key);
        const seed = section?.onOpen?.(ctx);
        if (seed) update(seed);
      }
      return next;
    });
  };

  const needsPropertyName = propertyTypeIsNamed(propertyType);

  // ── What gets sent ────────────────────────────────────────────────────────
  const buildLineItem = useCallback(
    (id?: string): BriefLineItem =>
      lineItemFromConfigurator(
        // Half-filled measurement rows are someone who started typing and moved
        // on, not a window anyone can cost.
        { ...config, curtainSizes: usableSizes(config.curtainSizes) },
        category,
        quantity,
        id
      ),
    [config, category, quantity]
  );

  const buildSnapshot = useCallback(
    (): BriefSnapshot => ({
      type: "standard",
      items: [buildLineItem(committedId ?? undefined)],
      project: {
        ...emptyProject,
        propertyType,
        propertyName: needsPropertyName ? propertyName : "",
      },
      notes,
      inspirationImages: config.inspirationImages,
      contact,
    }),
    [
      buildLineItem,
      committedId,
      propertyType,
      propertyName,
      needsPropertyName,
      notes,
      config.inspirationImages,
      contact,
    ]
  );

  const buildSummary = useCallback(
    (photoUrls: string[] = []) => formatBrief(buildSnapshot(), photoUrls),
    [buildSnapshot]
  );

  const buildWhatsAppMessage = useCallback(
    (photoUrls: string[] = []) => buildBriefWhatsAppText(buildSnapshot(), isAr, photoUrls),
    [buildSnapshot, isAr]
  );

  /** Structured twin of the prose summary, so the CRM holds more than a blob. */
  const buildMeta = useCallback(() => {
    const item = buildLineItem();
    return {
      briefType: "standard",
      totalPieces: quantity,
      notes,
      project: {
        propertyType,
        ...(needsPropertyName && propertyName ? { propertyName } : {}),
      },
      items: [
        {
          category,
          quantity,
          title: lineItemTitle(item, false),
          options: Object.fromEntries(
            lineItemChips(item, false).map((chip) => [chip.label, chip.value])
          ),
        },
      ],
    };
  }, [buildLineItem, category, quantity, notes, propertyType, needsPropertyName, propertyName]);

  /** Push this enquiry into the brief, for someone ordering across categories. */
  const commitToBrief = () => {
    const draft = buildLineItem(committedId ?? undefined);
    setBriefType("standard");
    if (committedId) replaceItem({ ...draft, id: committedId });
    else {
      addItem(draft);
      setCommittedId(draft.id);
      track({ t: "brief_item_add", category, quantity });
    }
    setBriefProject({
      propertyType,
      propertyName: needsPropertyName ? propertyName : "",
    });
    if (notes) setBriefNotes(notes);
    if (images.length) setBriefPhotos(images);
    router.push(`/${locale}/products/brief`);
  };

  // ── Validation ────────────────────────────────────────────────────────────
  // Named one at a time so the hint points at the next thing to do, rather than
  // listing every requirement at someone who has met most of them.
  const missing = !propertyType
    ? { en: "* Tell us what you're furnishing to send", ar: "* اختر نوع المكان لإتمام الإرسال" }
    : needsPropertyName && !propertyName.trim()
      ? { en: "* Add the name of the property to send", ar: "* أضف اسم المكان لإتمام الإرسال" }
      : spec.required.validate(config);
  const detailsValid = missing === null;

  /**
   * The "configured" milestone, once per visit.
   *
   * There is no `configurator_step` to emit any more, so without this the CRM
   * funnel would only ever see this page at `product_view` until someone
   * actually sent something — making everyone who specified a piece and then
   * left invisible at the stage they really reached.
   */
  const configuredTracked = useRef(false);
  useEffect(() => {
    if (configuredTracked.current || !detailsValid) return;
    configuredTracked.current = true;
    track({ t: "enquiry_configured", category });
  }, [detailsValid, category]);

  // Until the persisted brief has been read back, render the neutral shell the
  // server produced — anything else is a hydration mismatch.
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#1A1D24] pt-28 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="h-8 w-40 rounded-sm bg-[var(--color-surface)] animate-pulse" />
          <div className="h-24 rounded-sm bg-[var(--color-surface)] animate-pulse" />
          <div className="h-56 rounded-sm bg-[var(--color-surface)] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1D24]">
      {/* ── Header ── */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[260px] rounded-full blur-[100px] opacity-[0.08] bg-[#c8a45a]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <Link
              href={editId ? `/${locale}/products/brief` : `/${locale}/products`}
              className={`inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-8 ${isAr ? "flex-row-reverse" : ""}`}
            >
              {isAr ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
              {editId
                ? isAr
                  ? "العودة إلى الموجز"
                  : "Back to your brief"
                : isAr
                  ? "العودة"
                  : "Back"}
            </Link>
          </FadeIn>
          <FadeIn direction="up" delay={0.05}>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c8a45a] mb-4">
              {say(spec.eyebrow)}
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.1}>
            <h1
              className={`text-4xl md:text-5xl font-bold text-[var(--color-heading)] leading-tight mb-4 ${isAr ? "text-right" : ""}`}
            >
              {say(editId ? spec.editTitle : spec.title)}
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.15}>
            <p
              className={`text-[var(--color-text-muted)] text-base leading-relaxed ${isAr ? "text-right" : ""}`}
            >
              {say(spec.intro)}
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8">
        {/* ── Required: the answers that make a quote possible ── */}
        <div className="glass-card rounded-sm p-6 space-y-7">
          <h2
            className={`text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}
          >
            {`${say(spec.requiredHeading)} *`}
          </h2>

          {/* How many */}
          <div className="space-y-2">
            <FieldLabel isAr={isAr} htmlFor="cq-quantity">
              {say(spec.quantityLabel)}
            </FieldLabel>
            <Stepper
              id="cq-quantity"
              isAr={isAr}
              value={quantity}
              onChange={setQuantity}
              unitLabel={say(quantity === 1 ? spec.unit.one : spec.unit.many)}
              decreaseLabel={isAr ? "أنقص العدد" : "Decrease quantity"}
              increaseLabel={isAr ? "زد العدد" : "Increase quantity"}
            />
          </div>

          {/* Property type */}
          <div className="space-y-2">
            <FieldLabel isAr={isAr}>
              {isAr ? "ما الذي تقوم بتأثيثه؟" : "What are you furnishing?"}
            </FieldLabel>
            <ChipGroup
              isAr={isAr}
              testId="property-type"
              value={propertyType || null}
              onChange={(v) => setPropertyType(v ?? "")}
              options={propertyTypes.map((pt) => ({
                value: pt.value,
                label: isAr ? pt.ar : pt.en,
              }))}
            />
          </div>

          {/* A named institution is worth knowing by name */}
          <AnimatePresence>
            {needsPropertyName && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <FieldLabel isAr={isAr} htmlFor="cq-property-name">
                  {isAr ? "ما اسمه؟" : "What is it called?"}
                </FieldLabel>
                <input
                  id="cq-property-name"
                  type="text"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  className={inputClass(isAr)}
                  placeholder={isAr ? "مثال: فندق النيل الكبير" : "e.g. The Grand Nile Hotel"}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* The one product answer this category needs */}
          {spec.required.render(ctx)}
        </div>

        {/* ── Optional sections ── */}
        <div className="space-y-3">
          <div className={`flex items-center gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] flex-shrink-0">
              {isAr ? "أضف ما تعرفه (اختياري)" : "Add what you know (optional)"}
            </span>
            <div className="h-px flex-1 bg-[var(--color-deep-accent)]/15" />
          </div>

          <div className="space-y-2.5">
            {sections.map((section) => {
              const Icon = section.icon;
              const isOpen = expanded.has(section.key);
              const summary = section.summary(ctx);
              return (
                <div key={section.key}>
                  <AnimatePresence mode="wait" initial={false}>
                    {isOpen ? (
                      <motion.div
                        key="open"
                        id={`cq-section-${section.key}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="glass-card rounded-sm p-6 space-y-4"
                      >
                        <div
                          className={`flex items-center justify-between ${isAr ? "flex-row-reverse" : ""}`}
                        >
                          <div
                            className={`flex items-center gap-2.5 ${isAr ? "flex-row-reverse" : ""}`}
                          >
                            <Icon
                              size={15}
                              strokeWidth={1.5}
                              className="text-[var(--color-accent)]"
                            />
                            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                              {say(section.title)}
                            </h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleSection(section.key)}
                            aria-label={isAr ? "إخفاء" : "Hide"}
                            aria-expanded
                            aria-controls={`cq-section-${section.key}`}
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors p-1 -m-1"
                          >
                            <X size={16} strokeWidth={1.5} />
                          </button>
                        </div>

                        {section.render(ctx)}
                      </motion.div>
                    ) : (
                      <motion.button
                        key="closed"
                        type="button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => toggleSection(section.key)}
                        aria-expanded={false}
                        aria-controls={`cq-section-${section.key}`}
                        className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-sm border border-dashed border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-accent)]/[0.03] hover:text-[var(--color-text)] transition-all duration-200 group ${isAr ? "flex-row-reverse text-right" : "text-left"}`}
                      >
                        <Icon size={16} strokeWidth={1.5} className="flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-tight">{say(section.title)}</p>
                          <p className="text-[11px] text-[var(--color-text-muted)]/80 mt-0.5 leading-tight">
                            {say(section.description)}
                          </p>
                        </div>
                        {summary && (
                          <span className="text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-semibold flex-shrink-0">
                            {say(summary)}
                          </span>
                        )}
                        <Plus
                          size={14}
                          strokeWidth={1.75}
                          className="flex-shrink-0 transition-transform duration-200 group-hover:rotate-90 text-[var(--color-text-muted)]/60 group-hover:text-[var(--color-accent)]"
                        />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Finish ── */}
        {editId ? (
          /* Edit mode arrives from the brief, where contact details already
             live — asking for them again here would be a second, competing form. */
          <div className="space-y-3">
            <button
              type="button"
              onClick={commitToBrief}
              disabled={!detailsValid}
              className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-sm text-sm font-semibold tracking-wide transition-colors ${
                detailsValid
                  ? "bg-[var(--color-accent)] text-[var(--color-dark)] hover:bg-[var(--color-accent-hover)] cursor-pointer"
                  : "bg-[var(--color-deep-accent)]/15 text-[var(--color-text-muted)] cursor-not-allowed"
              } ${isAr ? "flex-row-reverse" : ""}`}
            >
              {isAr ? "حفظ التغييرات" : "Save changes"}
              <ArrowUpRight size={16} strokeWidth={1.75} />
            </button>
            {missing && (
              <p
                className={`text-xs text-[var(--color-text-muted)] ${isAr ? "text-right" : "text-center"}`}
              >
                {say(missing)}
              </p>
            )}
          </div>
        ) : (
          <>
            <ContactSubmit
              isAr={isAr}
              locale={locale}
              name={contact.name}
              phone={contact.phone}
              email={contact.email}
              onChange={(field, value) => setContact({ [field]: value })}
              buildSummary={buildSummary}
              buildWhatsAppMessage={buildWhatsAppMessage}
              buildMeta={buildMeta}
              photos={images}
              formType={category}
              briefType="standard"
              extraValid={detailsValid}
              extraHintEn={missing?.en}
              extraHintAr={missing?.ar}
              submitLabelEn="Send Enquiry"
              submitLabelAr="إرسال الطلب"
              successTitleEn="Enquiry Sent!"
              successTitleAr="تم إرسال طلبك!"
              successDescEn={`Your enquiry has been delivered to ${KEMCON_EMAIL}. Our team will be in touch within 3–5 business days.`}
              successDescAr={`وصل طلبك إلى فريقنا على ${KEMCON_EMAIL}. سيتواصل معك فريقنا خلال 3–5 أيام عمل.`}
            />

            {/* The other real path: someone ordering across categories. */}
            <div className={`flex items-center gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
              <div className="h-px flex-1 bg-[var(--color-deep-accent)]/15" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] flex-shrink-0">
                {isAr ? "أو" : "Or"}
              </span>
              <div className="h-px flex-1 bg-[var(--color-deep-accent)]/15" />
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={commitToBrief}
                disabled={!detailsValid}
                className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-sm border text-sm font-medium tracking-wide transition-all duration-200 ${
                  detailsValid
                    ? "border-[var(--color-accent)]/40 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/[0.06] cursor-pointer"
                    : "border-[var(--color-deep-accent)]/20 text-[var(--color-text-muted)]/60 cursor-not-allowed"
                } ${isAr ? "flex-row-reverse" : ""}`}
              >
                <ClipboardList size={15} strokeWidth={1.6} />
                {isAr ? "أضفها إلى موجزي" : "Add to my brief"}
              </button>
              <p
                className={`text-xs text-[var(--color-text-muted)] ${isAr ? "text-right" : "text-center"}`}
              >
                {isAr
                  ? "لطلب أكثر من نوع من المفروشات في رسالة واحدة."
                  : "To order more than one kind of furnishing in a single enquiry."}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

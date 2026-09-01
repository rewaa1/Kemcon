"use client";

import { Camera, ClipboardList, Palette, ShieldCheck } from "lucide-react";
import { FabricPicker } from "./FabricPicker";
import { ColorPicker } from "./ColorPicker";
import { PatternPicker } from "./PatternPicker";
import { fabrics } from "@/data/fabrics";
import { colors } from "@/data/colors";
import { patterns } from "@/data/patterns";
import { PhotoUploader } from "./PhotoUploader";
import { SelectableRow } from "./fields";
import type { EnquirySection } from "./types";

/**
 * The sections every category offers, in the order they are shown.
 *
 * Treatments are here rather than on curtains alone because they are a
 * property of the fabric, not of the product: a hospital wants antimicrobial
 * bed covers as much as antimicrobial curtains, and a hotel's fire code covers
 * its upholstery too.
 */

export const treatmentsSection: EnquirySection = {
  key: "treatments",
  icon: ShieldCheck,
  title: { en: "Fabric treatments", ar: "معالجة القماش" },
  description: {
    en: "Anti-fungal, antibacterial, fire-retardant",
    ar: "مضاد للفطريات والبكتيريا، ومقاوم للحريق",
  },
  summary: ({ config }) => {
    const count = [config.treatmentAntimicrobial, config.treatmentFireRetardant].filter(
      Boolean
    ).length;
    return count ? { en: `${count} selected`, ar: `${count} مختار` } : null;
  },
  hasData: (item) => !!(item.treatmentAntimicrobial || item.treatmentFireRetardant),
  render: ({ config, update, isAr }) => (
    <div className="space-y-2.5">
      <SelectableRow
        selected={config.treatmentAntimicrobial}
        onToggle={() => update({ treatmentAntimicrobial: !config.treatmentAntimicrobial })}
        title={isAr ? "مضاد للفطريات والبكتيريا" : "Anti-fungal & antibacterial"}
        description={
          isAr
            ? "تشطيب صحي على القماش — معتاد في المستشفيات والعيادات والمدارس."
            : "A hygienic finish on the fabric — usual for hospitals, clinics and schools."
        }
        isAr={isAr}
        testId="treatment-option"
      />
      <SelectableRow
        selected={config.treatmentFireRetardant}
        onToggle={() => update({ treatmentFireRetardant: !config.treatmentFireRetardant })}
        title={isAr ? "مقاوم للحريق" : "Fire-retardant (burn-treated)"}
        description={
          isAr
            ? "معالجة مقاومة للهب، تشترطها معظم أكواد الفنادق والأماكن العامة."
            : "Flame-resistant treatment, required by most hotel and public-venue codes."
        }
        isAr={isAr}
        testId="treatment-option"
      />
    </div>
  ),
};

/** A labelled divider between the three pickers inside the fabric section. */
function PickerHeading({ children, isAr }: { children: string; isAr: boolean }) {
  return (
    <p
      className={`text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}
    >
      {children}
    </p>
  );
}

export const fabricSection: EnquirySection = {
  key: "fabric",
  icon: Palette,
  title: { en: "Fabric, colour & pattern", ar: "القماش واللون والنمط" },
  description: {
    en: "Pick now, or leave it to our team",
    ar: "اختر الآن، أو اترك الأمر لفريقنا",
  },
  summary: ({ config }) => {
    const fabric = fabrics.find((f) => f.id === config.fabricId);
    const color = colors.find((c) => c.id === config.colorId);
    const pattern = patterns.find((p) => p.id === config.patternId);
    const en = [fabric?.name, color?.name, pattern?.name].filter(Boolean).join(" / ");
    const ar = [fabric?.nameAr, color?.nameAr, pattern?.nameAr].filter(Boolean).join(" / ");
    return en || ar ? { en: en || ar, ar: ar || en } : null;
  },
  hasData: (item) => !!(item.fabricId || item.colorId || item.patternId),
  render: ({ config, update, locale, isAr }) => (
    <div className="space-y-7">
      <p className={`text-xs text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}>
        {isAr
          ? "لست مضطرًا للاختيار الآن — يمكن لفريقنا أن يوصي بالقماش المناسب."
          : "You don't have to choose now — our team can recommend a fabric."}
      </p>

      <div className="space-y-3">
        <PickerHeading isAr={isAr}>{isAr ? "القماش" : "Fabric"}</PickerHeading>
        <FabricPicker state={config} onChange={update} locale={locale} />
      </div>

      <div className="h-px bg-[var(--color-deep-accent)]/15" />

      <div className="space-y-3">
        <PickerHeading isAr={isAr}>{isAr ? "اللون" : "Colour"}</PickerHeading>
        <ColorPicker state={config} onChange={update} locale={locale} />
      </div>

      <div className="h-px bg-[var(--color-deep-accent)]/15" />

      <div className="space-y-3">
        <PickerHeading isAr={isAr}>{isAr ? "النمط" : "Pattern"}</PickerHeading>
        <p className={`text-[11px] text-[var(--color-text-muted)]/80 ${isAr ? "text-right" : ""}`}>
          {isAr
            ? "تظهر المعاينة بلونك المختار."
            : "The preview is drawn in the colour you picked."}
        </p>
        <PatternPicker state={config} onChange={update} locale={locale} />
      </div>
    </div>
  ),
};

export const photosSection: EnquirySection = {
  key: "photos",
  icon: Camera,
  title: { en: "Photos", ar: "صور" },
  description: {
    en: "The room as it is today, or a look you like",
    ar: "صور المكان الحالي، أو الشكل الذي يعجبك",
  },
  summary: ({ images }) =>
    images.length
      ? { en: `${images.length} uploaded`, ar: `${images.length} مرفوعة` }
      : null,
  // Photos live on the brief, not the line item, so a reopened item never has any.
  hasData: () => false,
  render: ({ images, setImages, isAr }) => (
    <PhotoUploader images={images} onChange={setImages} isAr={isAr} />
  ),
};

export const notesSection: EnquirySection = {
  key: "notes",
  icon: ClipboardList,
  title: { en: "Anything else", ar: "أي شيء آخر" },
  description: {
    en: "Deadlines, site conditions, anything unusual",
    ar: "المواعيد، ظروف الموقع، أي تفاصيل خاصة",
  },
  summary: ({ notes }) => (notes.trim() ? { en: "Added", ar: "مضاف" } : null),
  hasData: (item) => !!item.notes,
  render: ({ notes, setNotes, isAr }) => (
    <textarea
      rows={4}
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      className={`w-full px-3 py-2.5 rounded-sm bg-[var(--color-bg)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none ${isAr ? "text-right" : ""}`}
      placeholder={
        isAr
          ? "مثال: التسليم قبل افتتاح الفندق في مارس…"
          : "e.g. Delivery before the hotel opens in March…"
      }
    />
  ),
};

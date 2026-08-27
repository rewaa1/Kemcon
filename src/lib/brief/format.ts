import { fabrics, fabricFamilies } from "@/data/fabrics";
import { colors } from "@/data/colors";
import { patterns } from "@/data/patterns";
import { frameMaterials, frameFinishes, fillingOptions } from "@/data/frames";
import { SITE_URL } from "@/lib/metadata";
import type { CategoryType } from "@/types/configurator";
import type { BriefContact, BriefLineItem, BriefProject, BriefType } from "./types";

export const CATEGORY_LABELS: Record<CategoryType, { en: string; ar: string }> = {
  curtains: { en: "Curtains", ar: "ستائر" },
  chairs: { en: "Chairs", ar: "كراسي" },
  sofas: { en: "Sofas", ar: "أرائك" },
  "bed-sheets": { en: "Bed Sheets", ar: "ملاءات سرير" },
  custom: { en: "Custom", ar: "مخصص" },
};

export const BRIEF_TYPE_LABELS: Record<BriefType, { en: string; ar: string }> = {
  standard: { en: "Product brief", ar: "موجز المنتجات" },
  bulk: { en: "Bulk / hospitality order", ar: "طلب بالجملة" },
  design: { en: "Design plan request", ar: "طلب خطة تصميم" },
};

/**
 * What a quantity actually counts, per category.
 *
 * Curtains are quoted in panels, not curtains — "300" alone is ambiguous to
 * anyone costing the job. The old Mass Production form carried these units and
 * lost them into a text blob; derived from the category so no extra field has
 * to be persisted or migrated.
 */
export const UNIT_LABELS: Record<CategoryType, { en: string; ar: string }> = {
  curtains: { en: "panels", ar: "لوحة" },
  chairs: { en: "units", ar: "قطعة" },
  sofas: { en: "units", ar: "قطعة" },
  "bed-sheets": { en: "sets", ar: "طقم" },
  custom: { en: "items", ar: "قطعة" },
};

/** Maximum portfolio inspiration images on a brief, enforced everywhere. */
export const MAX_INSPIRATION = 5;

/** "300 panels" / "٣٠٠ لوحة" — a quantity with the unit it is counted in. */
export function quantityLabel(
  category: CategoryType,
  quantity: number,
  isAr: boolean
): string {
  const unit = UNIT_LABELS[category][isAr ? "ar" : "en"];
  return `${Math.max(1, quantity)} ${unit}`;
}

/**
 * Inspiration and reference images may be absolute (UploadThing, which is what
 * `GALLERY_CLIENTS` and `/api/upload` both return today) or a legacy path under
 * `/public`. Prefixing an already-absolute URL produces a broken link, so
 * resolve conditionally rather than always concatenating `SITE_URL`.
 */
export function absoluteImageUrl(src: string): string {
  return /^https?:\/\//i.test(src) ? src : `${SITE_URL}${src}`;
}

export interface Chip {
  label: string;
  value: string;
  hex?: string;
}

/** Locale-aware chips for rendering a line item in the UI. */
export function lineItemChips(item: BriefLineItem, isAr: boolean): Chip[] {
  const fabric = fabrics.find((f) => f.id === item.fabricId);
  const color = colors.find((c) => c.id === item.colorId);
  const pattern = patterns.find((p) => p.id === item.patternId);
  const frame = frameMaterials.find((m) => m.id === item.frameMaterialId);
  const finish = frameFinishes.find((f) => f.id === item.frameFinishId);
  const filling = fillingOptions.find((f) => f.id === item.fillingId);

  const chips: Chip[] = [];

  if (fabric) {
    chips.push({ label: isAr ? "القماش" : "Fabric", value: isAr ? fabric.nameAr : fabric.name });
  }
  if (color) {
    chips.push({
      label: isAr ? "اللون" : "Colour",
      value: isAr ? color.nameAr : color.name,
      hex: color.hex,
    });
  }
  if (pattern) {
    chips.push({ label: isAr ? "النمط" : "Pattern", value: isAr ? pattern.nameAr : pattern.name });
  }

  if (item.category === "curtains") {
    if (item.curtainControl) {
      chips.push({
        label: isAr ? "التحكم" : "Control",
        value:
          item.curtainControl === "manual"
            ? isAr ? "يدوي" : "Manual"
            : isAr ? "ريموت" : "Remote",
      });
    }
    if (item.requestMeasurement) {
      chips.push({
        label: isAr ? "القياس" : "Measurement",
        value: isAr ? "زيارة مطلوبة" : "Visit requested",
      });
    } else if (item.curtainWidth && item.curtainHeight) {
      chips.push({
        label: isAr ? "المقاس" : "Size",
        value: `${item.curtainWidth} × ${item.curtainHeight} cm`,
      });
    }
  }

  if (item.category === "chairs" || item.category === "sofas") {
    if (frame) chips.push({ label: isAr ? "الهيكل" : "Frame", value: isAr ? frame.nameAr : frame.name });
    if (finish) chips.push({ label: isAr ? "التشطيب" : "Finish", value: isAr ? finish.nameAr : finish.name });
    if (filling) chips.push({ label: isAr ? "الحشو" : "Filling", value: isAr ? filling.nameAr : filling.name });
    if (item.cushionAdd === true) {
      chips.push({
        label: isAr ? "الوسائد" : "Cushions",
        value: `${item.cushionQty ?? ""} · ${
          item.cushionSameFabric
            ? isAr ? "نفس القماش" : "same fabric"
            : isAr ? "قماش يُحدَّد" : "fabric TBC"
        }`,
      });
    } else if (item.cushionAdd === false) {
      chips.push({ label: isAr ? "الوسائد" : "Cushions", value: isAr ? "لا" : "No" });
    }
  }

  if (item.category === "bed-sheets") {
    if (item.pillowAdd === true) {
      chips.push({
        label: isAr ? "المخدات" : "Pillows",
        value: `${item.pillowSize ?? ""} · ${item.pillowFill ?? ""}`,
      });
    } else if (item.pillowAdd === false) {
      chips.push({ label: isAr ? "المخدات" : "Pillows", value: isAr ? "لا" : "No" });
    }
  }

  if (item.category === "custom" && item.customDescription) {
    chips.push({
      label: isAr ? "الوصف" : "Description",
      value:
        item.customDescription.length > 80
          ? `${item.customDescription.slice(0, 80)}…`
          : item.customDescription,
    });
  }

  return chips;
}

/** Short one-line title for a line item, e.g. "Curtains — Velvet / Sage". */
export function lineItemTitle(item: BriefLineItem, isAr: boolean): string {
  const category = CATEGORY_LABELS[item.category][isAr ? "ar" : "en"];
  const fabric = fabrics.find((f) => f.id === item.fabricId);
  const color = colors.find((c) => c.id === item.colorId);
  const parts = [fabric && (isAr ? fabric.nameAr : fabric.name), color && (isAr ? color.nameAr : color.name)]
    .filter(Boolean)
    .join(" / ");
  return parts ? `${category} — ${parts}` : category;
}

/** English detail block for one line item, for the email body. */
function formatLineItem(item: BriefLineItem, index: number): string {
  const lines: string[] = [];
  const category = CATEGORY_LABELS[item.category].en;
  const qty = ` — ${quantityLabel(item.category, item.quantity, false)}`;
  lines.push(`${index + 1}. ${category}${qty}`);

  const fabric = fabrics.find((f) => f.id === item.fabricId);
  const family = fabricFamilies.find((f) => f.id === item.fabricFamilyId);
  const color = colors.find((c) => c.id === item.colorId);
  const pattern = patterns.find((p) => p.id === item.patternId);
  const frame = frameMaterials.find((m) => m.id === item.frameMaterialId);
  const finish = frameFinishes.find((f) => f.id === item.frameFinishId);
  const filling = fillingOptions.find((f) => f.id === item.fillingId);

  const push = (label: string, value: string) => lines.push(`     ${label}: ${value}`);

  if (fabric) push("Fabric", family ? `${fabric.name} (${family.name})` : fabric.name);
  if (color) push("Colour", `${color.name} (${color.hex})`);
  if (pattern) push("Pattern", pattern.name);

  if (item.category === "curtains") {
    if (item.curtainControl) push("Control", item.curtainControl);
    if (item.requestMeasurement) push("Measurement", "Site visit requested");
    else if (item.curtainWidth && item.curtainHeight)
      push("Size", `${item.curtainWidth}cm × ${item.curtainHeight}cm`);
  }

  if (item.category === "chairs" || item.category === "sofas") {
    if (frame) push("Frame", frame.name);
    if (finish) push("Finish", finish.name);
    if (filling) push("Filling", filling.name);
    if (item.cushionAdd === true) {
      push(
        "Cushions",
        `${item.cushionQty ?? "?"} per piece — ${
          item.cushionSameFabric ? "same fabric" : "fabric to be specified"
        }`
      );
    } else if (item.cushionAdd === false) {
      push("Cushions", "No");
    }
  }

  if (item.category === "bed-sheets") {
    if (item.pillowAdd === true) push("Pillows", `${item.pillowSize} size — ${item.pillowFill} fill`);
    else if (item.pillowAdd === false) push("Pillows", "No");
  }

  if (item.category === "custom" && item.customDescription) {
    push("Description", item.customDescription);
  }

  if (item.notes) push("Item notes", item.notes);
  if (item.aiImageUrl) push("AI room view", item.aiImageUrl);
  if (item.aiDetailImageUrl) push("AI fabric detail", item.aiDetailImageUrl);

  return lines.join("\n");
}

export interface BriefSnapshot {
  type: BriefType;
  items: BriefLineItem[];
  project: BriefProject;
  notes: string;
  inspirationImages: string[];
  contact: BriefContact;
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartment: "Apartment",
  villa: "Villa",
  hotel: "Hotel",
  office: "Office",
  restaurant: "Restaurant",
  other: "Other",
};

const SCOPE_LABELS: Record<string, string> = {
  single: "Single Room",
  multiple: "Multiple Rooms",
  full: "Full Property",
};

const PROJECT_TYPE_LABELS: Record<string, string> = {
  hotel: "Hotel",
  resort: "Resort",
  office: "Corporate Office",
  residential: "Residential Complex",
  restaurant: "Restaurant / Venue",
  other: "Other",
};

const TIMELINE_LABELS: Record<string, string> = {
  asap: "As Soon As Possible",
  "1-3m": "1–3 Months",
  "3-6m": "3–6 Months",
  "6m+": "6+ Months",
};

const STYLE_LABELS: Record<string, string> = {
  modern: "Modern",
  classic: "Classic",
  contemporary: "Contemporary",
  minimalist: "Minimalist",
  rustic: "Rustic",
  eclectic: "Eclectic",
  luxury: "Luxury",
  arabic: "Arabic / Oriental",
};

/**
 * The full brief as plain text, in English, for the Kemcon team's inbox.
 * `photoUrls` are the Cloudinary URLs returned by `/api/upload`, passed in
 * after upload rather than read from the store (the store holds `File`s).
 */
export function formatBrief(brief: BriefSnapshot, photoUrls: string[] = []): string {
  const blocks: string[] = [];

  blocks.push(`BRIEF TYPE: ${BRIEF_TYPE_LABELS[brief.type].en}`);

  const p = brief.project;
  const projectLines: string[] = [];
  if (p.propertyType) projectLines.push(`  Property type: ${PROPERTY_TYPE_LABELS[p.propertyType] ?? p.propertyType}`);
  if (p.propertyName) projectLines.push(`  Property / hotel name: ${p.propertyName}`);
  if (p.projectType) projectLines.push(`  Project type: ${PROJECT_TYPE_LABELS[p.projectType] ?? p.projectType}`);
  if (p.scope) projectLines.push(`  Scope: ${SCOPE_LABELS[p.scope] ?? p.scope}`);
  if (p.scope === "multiple" && p.numRooms) projectLines.push(`  Number of rooms: ${p.numRooms}`);
  if (p.stylePrefs.length)
    projectLines.push(`  Style preferences: ${p.stylePrefs.map((s) => STYLE_LABELS[s] ?? s).join(", ")}`);
  if (p.dimensions) projectLines.push(`  Dimensions / room details: ${p.dimensions}`);
  if (p.timeline) projectLines.push(`  Timeline: ${TIMELINE_LABELS[p.timeline] ?? p.timeline}`);
  if (projectLines.length) blocks.push(`PROJECT\n${projectLines.join("\n")}`);

  if (brief.items.length) {
    const total = brief.items.reduce((sum, i) => sum + Math.max(1, i.quantity), 0);
    blocks.push(
      `ITEMS (${brief.items.length} product${brief.items.length === 1 ? "" : "s"}, ${total} piece${total === 1 ? "" : "s"})\n` +
        brief.items.map(formatLineItem).join("\n\n")
    );
  }

  if (brief.notes) blocks.push(`NOTES\n  ${brief.notes.replace(/\n/g, "\n  ")}`);

  if (photoUrls.length) {
    blocks.push(
      `REFERENCE PHOTOS\n${photoUrls.map((url, i) => `  ${i + 1}. ${url}`).join("\n")}`
    );
  }

  if (brief.inspirationImages.length) {
    blocks.push(
      `PORTFOLIO INSPIRATION\n${brief.inspirationImages
        .map((src, i) => `  ${i + 1}. ${absoluteImageUrl(src)}`)
        .join("\n")}`
    );
  }

  return blocks.join("\n\n");
}

/** The same brief as a pre-filled WhatsApp message, URL-encoded. */
export function buildBriefWhatsAppText(
  brief: BriefSnapshot,
  isAr: boolean,
  photoUrls: string[] = []
): string {
  const greeting = isAr ? "مرحباً كمكون،" : "Hello Kemcon,";
  const intro = isAr
    ? "أود إرسال هذا الموجز."
    : "I'd like to send you this brief.";
  const nameLabel = isAr ? "الاسم" : "Name";
  const phoneLabel = isAr ? "الهاتف" : "Phone";
  const emailLabel = isAr ? "البريد الإلكتروني" : "Email";

  return encodeURIComponent(
    `${greeting}\n\n${intro}\n\n${formatBrief(brief, photoUrls)}\n\n` +
      `${nameLabel}: ${brief.contact.name}\n` +
      `${phoneLabel}: ${brief.contact.phone}\n` +
      `${emailLabel}: ${brief.contact.email}`
  );
}

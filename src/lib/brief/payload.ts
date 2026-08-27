import { fabrics, fabricFamilies } from "@/data/fabrics";
import { colors } from "@/data/colors";
import { patterns } from "@/data/patterns";
import { frameMaterials, frameFinishes, fillingOptions } from "@/data/frames";
import { absoluteImageUrl, formatBrief, UNIT_LABELS, type BriefSnapshot } from "./format";
import type { BriefLineItem } from "./types";

/**
 * The structured form of a brief, as it crosses the wire to `/api/contact`.
 *
 * The email body is a rendered string, which is fine for a person reading an
 * inbox and useless for a CRM. This carries the same brief as data so it can be
 * stored as rows and queried later.
 *
 * Every catalog reference is sent as **both** its id and its resolved name. The
 * ids are the source of truth, but the catalog itself lives in this repo's
 * TypeScript (`src/data/*`), so the CRM cannot resolve them on its own — and a
 * lead that reads "fabric: velvet-royal-01" is not much better than no lead.
 *
 * Note there is no `contact` field. Name, phone and email are carried by the
 * validated form fields and read from there by the route; accepting them here
 * as well would let a crafted request store details the server never checked.
 */

export interface BriefItemPayload {
  category: string;
  quantity: number;
  /** What the quantity counts — panels, units, sets. */
  unit: string;

  fabricId: string | null;
  fabricName: string | null;
  fabricFamily: string | null;
  colorId: string | null;
  colorName: string | null;
  colorHex: string | null;
  patternId: string | null;
  patternName: string | null;

  /** Category-specific choices, kept as JSON rather than 15 nullable columns. */
  options: Record<string, string | number | boolean | null>;

  aiImageUrl: string | null;
  aiDetailImageUrl: string | null;
  notes: string | null;
}

export interface BriefPayload {
  /** Stable across retries of one submission, so a repeat is not a new lead. */
  submissionId: string;
  type: string;
  locale: string;

  project: {
    propertyType: string | null;
    propertyName: string | null;
    projectType: string | null;
    scope: string | null;
    numRooms: string | null;
    stylePrefs: string[];
    dimensions: string | null;
    timeline: string | null;
  };

  notes: string | null;
  photoUrls: string[];
  inspirationUrls: string[];
  items: BriefItemPayload[];

  /** The exact text that was emailed, kept verbatim for reference. */
  summary: string;
}

function itemOptions(item: BriefLineItem): BriefItemPayload["options"] {
  const frame = frameMaterials.find((m) => m.id === item.frameMaterialId);
  const finish = frameFinishes.find((f) => f.id === item.frameFinishId);
  const filling = fillingOptions.find((f) => f.id === item.fillingId);

  const options: BriefItemPayload["options"] = {};

  if (item.category === "curtains") {
    options.control = item.curtainControl;
    options.requestMeasurement = item.requestMeasurement;
    if (item.curtainWidth) options.widthCm = item.curtainWidth;
    if (item.curtainHeight) options.heightCm = item.curtainHeight;
  }

  if (item.category === "chairs" || item.category === "sofas") {
    if (frame) options.frame = frame.name;
    if (finish) options.finish = finish.name;
    if (filling) options.filling = filling.name;
    if (item.cushionAdd !== null) {
      options.cushions = item.cushionAdd;
      if (item.cushionAdd) {
        options.cushionQty = item.cushionQty;
        options.cushionSameFabric = item.cushionSameFabric;
      }
    }
  }

  if (item.category === "bed-sheets" && item.pillowAdd !== null) {
    options.pillows = item.pillowAdd;
    if (item.pillowAdd) {
      options.pillowFill = item.pillowFill;
      options.pillowSize = item.pillowSize;
    }
  }

  if (item.category === "custom" && item.customDescription) {
    options.description = item.customDescription;
  }

  return options;
}

function toItemPayload(item: BriefLineItem): BriefItemPayload {
  const fabric = fabrics.find((f) => f.id === item.fabricId);
  const family = fabricFamilies.find((f) => f.id === item.fabricFamilyId);
  const color = colors.find((c) => c.id === item.colorId);
  const pattern = patterns.find((p) => p.id === item.patternId);

  return {
    category: item.category,
    quantity: Math.max(1, item.quantity),
    unit: UNIT_LABELS[item.category].en,
    fabricId: item.fabricId,
    fabricName: fabric?.name ?? null,
    fabricFamily: family?.name ?? null,
    colorId: item.colorId,
    colorName: color?.name ?? null,
    colorHex: color?.hex ?? null,
    patternId: item.patternId,
    patternName: pattern?.name ?? null,
    options: itemOptions(item),
    aiImageUrl: item.aiImageUrl,
    aiDetailImageUrl: item.aiDetailImageUrl,
    notes: item.notes || null,
  };
}

const blankToNull = (value: string) => (value.trim() ? value.trim() : null);

export function buildBriefPayload(
  snapshot: BriefSnapshot,
  locale: string,
  submissionId: string,
  photoUrls: string[] = []
): BriefPayload {
  const p = snapshot.project;

  return {
    submissionId,
    type: snapshot.type,
    locale,
    project: {
      propertyType: blankToNull(p.propertyType),
      propertyName: blankToNull(p.propertyName),
      projectType: blankToNull(p.projectType),
      scope: blankToNull(p.scope),
      numRooms: blankToNull(p.numRooms),
      stylePrefs: p.stylePrefs,
      dimensions: blankToNull(p.dimensions),
      timeline: blankToNull(p.timeline),
    },
    notes: blankToNull(snapshot.notes),
    photoUrls,
    inspirationUrls: snapshot.inspirationImages.map(absoluteImageUrl),
    items: snapshot.items.map(toItemPayload),
    summary: formatBrief(snapshot, photoUrls),
  };
}

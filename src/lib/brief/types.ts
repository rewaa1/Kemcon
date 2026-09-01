import type { CategoryType, ConfiguratorState, CurtainSize } from "@/types/configurator";

/**
 * The brief is the single lead-capture object for the whole services section.
 *
 * It replaces three previously separate submission paths (the configurator's
 * `mailto:` hand-off, the Design Plan form, and the Mass Production form) with
 * one structure that always POSTs to `/api/contact`.
 *
 * `type` selects which project-level fields the brief page collects. It is
 * derived from where the visitor entered, never asked directly:
 *   standard — configured line items (from the catalog / configurator)
 *   bulk     — hospitality volume order (entered via /products/mass-production)
 *   design   — architect brief, usually with no line items (via /products/design-plan)
 */
export type BriefType = "standard" | "bulk" | "design";

/**
 * One configured product in the brief.
 *
 * This is `ConfiguratorState` minus the contact fields (which belong to the
 * brief, not to an item) and minus `aiDisplayUrl` (a blob URL — it dies on
 * reload and must never be persisted). `quantity` is new: it is what makes a
 * bulk brief expressible without discarding fabric and colour choices, which
 * is what the old Mass Production form did.
 */
export interface BriefLineItem {
  id: string;
  category: CategoryType;
  quantity: number;

  fabricFamilyId: string | null;
  fabricId: string | null;
  colorGroupId: string | null;
  colorId: string | null;
  patternId: string | null;

  // Curtains
  curtainControl: "manual" | "remote" | null;
  /** Layer ids from `@/data/curtainLayers`; the count is the length. */
  curtainLayerIds: string[];
  curtainSizes: CurtainSize[];
  requestMeasurement: boolean;

  // Fabric treatments — offered on every textile category
  treatmentAntimicrobial: boolean;
  treatmentFireRetardant: boolean;

  // Chairs / sofas
  frameMaterialId: string | null;
  frameFinishId: string | null;
  fillingId: string | null;
  cushionAdd: boolean | null;
  cushionSameFabric: boolean | null;
  cushionQty: number | null;

  // Bed covers
  bedSize: string | null;
  pillowAdd: boolean | null;
  pillowFill: string | null;
  pillowSize: string | null;

  // Custom
  customDescription: string;

  notes: string;
}

/**
 * Project-level context. Which subset is collected depends on `BriefType`;
 * the fields are flat rather than a discriminated union so a visitor who
 * starts a design brief and then adds configured items keeps everything.
 */
export interface BriefProject {
  // design
  propertyType: string;
  scope: string;
  numRooms: string;
  stylePrefs: string[];
  dimensions: string;
  // bulk
  projectType: string;
  propertyName: string;
  timeline: string;
}

export interface BriefContact {
  name: string;
  phone: string;
  email: string;
}

export const emptyProject: BriefProject = {
  propertyType: "",
  scope: "",
  numRooms: "",
  stylePrefs: [],
  dimensions: "",
  projectType: "",
  propertyName: "",
  timeline: "",
};

export const emptyContact: BriefContact = { name: "", phone: "", email: "" };

/**
 * Stable id for a line item. `crypto.randomUUID` needs a secure context; the
 * fallback keeps local HTTP development working.
 */
function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * A line item with a category and quantity but no fabric chosen yet.
 *
 * This is what a bulk enquiry produces: "300 curtain panels" is a real line
 * item even before anyone picks a velvet. The old Mass Production form
 * captured the same information but discarded it into a text blob, so it could
 * never be refined into a configured piece later.
 */
export function emptyLineItem(
  category: CategoryType,
  quantity = 1,
  customDescription = ""
): BriefLineItem {
  return {
    id: newId(),
    category,
    quantity: Math.max(1, quantity),
    fabricFamilyId: null,
    fabricId: null,
    colorGroupId: null,
    colorId: null,
    patternId: null,
    curtainControl: null,
    curtainLayerIds: [],
    curtainSizes: [],
    requestMeasurement: false,
    treatmentAntimicrobial: false,
    treatmentFireRetardant: false,
    frameMaterialId: null,
    frameFinishId: null,
    fillingId: null,
    cushionAdd: null,
    cushionSameFabric: null,
    cushionQty: null,
    bedSize: null,
    pillowAdd: null,
    pillowFill: null,
    pillowSize: null,
    customDescription,
    notes: "",
  };
}

/** Build a line item from the configurator's working state. */
export function lineItemFromConfigurator(
  state: ConfiguratorState,
  category: CategoryType,
  quantity = 1,
  id?: string
): BriefLineItem {
  return {
    id: id ?? newId(),
    category,
    quantity,
    fabricFamilyId: state.fabricFamilyId,
    fabricId: state.fabricId,
    colorGroupId: state.colorGroupId,
    colorId: state.colorId,
    patternId: state.patternId,
    curtainControl: state.curtainControl,
    curtainLayerIds: state.curtainLayerIds,
    curtainSizes: state.curtainSizes,
    requestMeasurement: state.requestMeasurement,
    treatmentAntimicrobial: state.treatmentAntimicrobial,
    treatmentFireRetardant: state.treatmentFireRetardant,
    frameMaterialId: state.frameMaterialId,
    frameFinishId: state.frameFinishId,
    fillingId: state.fillingId,
    cushionAdd: state.cushionAdd,
    cushionSameFabric: state.cushionSameFabric,
    cushionQty: state.cushionQty,
    bedSize: state.bedSize,
    pillowAdd: state.pillowAdd,
    pillowFill: state.pillowFill,
    pillowSize: state.pillowSize,
    customDescription: state.customDescription,
    notes: state.inquiryNotes,
  };
}

/**
 * Seed form state from an existing line item, so "edit" reopens the enquiry
 * form exactly as the visitor left it.
 */
export function configuratorStateFromLineItem(
  item: BriefLineItem,
  base: ConfiguratorState
): ConfiguratorState {
  return {
    ...base,
    fabricFamilyId: item.fabricFamilyId,
    fabricId: item.fabricId,
    colorGroupId: item.colorGroupId,
    colorId: item.colorId,
    patternId: item.patternId,
    curtainControl: item.curtainControl,
    curtainLayerIds: item.curtainLayerIds ?? [],
    curtainSizes: item.curtainSizes ?? [],
    requestMeasurement: item.requestMeasurement,
    treatmentAntimicrobial: item.treatmentAntimicrobial ?? false,
    treatmentFireRetardant: item.treatmentFireRetardant ?? false,
    frameMaterialId: item.frameMaterialId,
    frameFinishId: item.frameFinishId,
    fillingId: item.fillingId,
    cushionAdd: item.cushionAdd,
    cushionSameFabric: item.cushionSameFabric,
    cushionQty: item.cushionQty,
    bedSize: item.bedSize ?? null,
    pillowAdd: item.pillowAdd,
    pillowFill: item.pillowFill,
    pillowSize: item.pillowSize,
    customDescription: item.customDescription,
    inquiryNotes: item.notes,
  };
}

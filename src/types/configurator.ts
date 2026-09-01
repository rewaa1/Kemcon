export type CategoryType = "curtains" | "chairs" | "sofas" | "bed-covers" | "custom";

/**
 * One window's measurements on a curtain enquiry. Strings — these are inputs.
 */
export interface CurtainSize {
  id: string;
  /** Optional room or window label, e.g. "Master bedroom". */
  label: string;
  widthCm: string;
  heightCm: string;
  quantity: string;
}

/**
 * Everything a visitor can specify about a piece, across every category.
 *
 * Flat rather than a discriminated union on purpose: a brief line item is
 * built straight from this, and a union would mean re-narrowing the type at
 * every call site that only wants to read a fabric id. Fields not relevant to
 * a category simply stay at their initial value.
 *
 * The name is historical — this was the step-by-step configurator's working
 * state. The configurator is gone; every category is now a single enquiry form
 * (`ProductEnquiryForm`), and this is the shape those forms collect.
 */
export interface ConfiguratorState {
  fabricFamilyId: string | null;
  fabricId: string | null;
  colorGroupId: string | null;
  colorId: string | null;
  patternId: string | null;

  // ── Curtains ──────────────────────────────────────────────────────────────
  curtainControl: "manual" | "remote" | null;
  /** Layer ids from `@/data/curtainLayers` — the count is the length. */
  curtainLayerIds: string[];
  curtainSizes: CurtainSize[];
  requestMeasurement: boolean;

  // ── Chairs / sofas ────────────────────────────────────────────────────────
  frameMaterialId: string | null;
  frameFinishId: string | null;
  fillingId: string | null;
  cushionAdd: boolean | null;
  cushionSameFabric: boolean | null;
  cushionQty: number | null;

  // ── Bed covers ────────────────────────────────────────────────────────────
  /** Bed size id from `@/data/bedSizes`. */
  bedSize: string | null;
  pillowAdd: boolean | null;
  pillowFill: string | null;
  pillowSize: string | null;

  // ── Fabric treatments — offered on every textile category ─────────────────
  /** Anti-fungal and antibacterial fabric treatment. */
  treatmentAntimicrobial: boolean;
  /** Fire-retardant (burn-treated) fabric. */
  treatmentFireRetardant: boolean;

  // ── Custom ────────────────────────────────────────────────────────────────
  customDescription: string;

  // ── Portfolio inspiration ─────────────────────────────────────────────────
  inspirationImages: string[];

  // ── Enquiry ───────────────────────────────────────────────────────────────
  inquiryName: string;
  inquiryPhone: string;
  inquiryEmail: string;
  inquiryNotes: string;
}

export const initialConfiguratorState: ConfiguratorState = {
  fabricFamilyId: null,
  fabricId: null,
  colorGroupId: null,
  colorId: null,
  patternId: null,
  curtainControl: null,
  curtainLayerIds: [],
  curtainSizes: [],
  requestMeasurement: false,
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
  treatmentAntimicrobial: false,
  treatmentFireRetardant: false,
  customDescription: "",
  inspirationImages: [],
  inquiryName: "",
  inquiryPhone: "",
  inquiryEmail: "",
  inquiryNotes: "",
};

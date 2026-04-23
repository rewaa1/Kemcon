export type CategoryType = "curtains" | "chairs" | "sofas" | "bed-sheets" | "custom";

export type StepType =
  | "fabric"
  | "color"
  | "pattern"
  | "curtainOptions"
  | "chairOptions"
  | "inquiry"
  | "customDescription";

export const CATEGORY_STEPS: Record<CategoryType, StepType[]> = {
  curtains: ["fabric", "color", "pattern", "curtainOptions", "inquiry"],
  chairs: ["fabric", "color", "pattern", "chairOptions", "inquiry"],
  sofas: ["fabric", "color", "pattern", "chairOptions", "inquiry"],
  "bed-sheets": ["fabric", "color", "pattern", "inquiry"],
  custom: ["customDescription", "inquiry"],
};

export interface ConfiguratorState {
  fabricFamilyId: string | null;
  fabricId: string | null;
  colorGroupId: string | null;
  colorId: string | null;
  patternId: string | null;
  // Curtain-specific
  curtainControl: "manual" | "remote" | null;
  curtainWidth: string;
  curtainHeight: string;
  requestMeasurement: boolean;
  // Chair/sofa-specific
  frameMaterialId: string | null;
  frameFinishId: string | null;
  fillingId: string | null;
  // Custom
  customDescription: string;
  // Inquiry
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
  curtainWidth: "",
  curtainHeight: "",
  requestMeasurement: false,
  frameMaterialId: null,
  frameFinishId: null,
  fillingId: null,
  customDescription: "",
  inquiryName: "",
  inquiryPhone: "",
  inquiryEmail: "",
  inquiryNotes: "",
};

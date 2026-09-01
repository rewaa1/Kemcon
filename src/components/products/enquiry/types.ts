import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { BriefLineItem } from "@/lib/brief/types";
import type { CategoryType, ConfiguratorState } from "@/types/configurator";

/**
 * The contract between `ProductEnquiryForm` and the five category specs.
 *
 * Every form asks the same three things — how many, what building, how to
 * reach you — and differs only in the one product question that makes *that*
 * category quotable, plus which optional sections are worth offering. So the
 * shell owns the whole spine and a spec supplies the difference.
 */

/** Everything a field needs to read and write the enquiry. */
export interface EnquiryContext {
  config: ConfiguratorState;
  update: (updates: Partial<ConfiguratorState>) => void;
  locale: string;
  isAr: boolean;
  /** Reference photos — shell state, not part of the configured piece. */
  images: File[];
  setImages: (next: File[]) => void;
  /** Free-text notes, which belong to the brief rather than to the line item. */
  notes: string;
  setNotes: (next: string) => void;
}

/** A bilingual string pair. Forms are hand-translated, not keyed through next-intl. */
export interface Bilingual {
  en: string;
  ar: string;
}

/** One collapsible optional section. */
export interface EnquirySection {
  key: string;
  icon: LucideIcon;
  title: Bilingual;
  /** One line under the title on the collapsed row. */
  description: Bilingual;
  /**
   * What the collapsed row shows on the right once answered — "3 windows",
   * "Manual". Null while untouched, which is what keeps a long list of shut
   * drawers readable.
   */
  summary: (ctx: EnquiryContext) => Bilingual | null;
  render: (ctx: EnquiryContext) => ReactNode;
  /**
   * Whether an existing line item has data in this section, so reopening one
   * from the brief reveals the fields it was actually configured with.
   */
  hasData: (item: BriefLineItem) => boolean;
  /**
   * Opening a section onto nothing is a dead end. Return a patch to seed it —
   * the curtain measurements section uses this to add its first empty row.
   */
  onOpen?: (ctx: EnquiryContext) => Partial<ConfiguratorState> | void;
}

export interface CategorySpec {
  category: CategoryType;
  /** URL segment under `/products`. */
  slug: string;
  eyebrow: Bilingual;
  /** Heading over the required block — the eyebrow does not always read as a noun. */
  requiredHeading: Bilingual;
  title: Bilingual;
  editTitle: Bilingual;
  intro: Bilingual;
  /** What one unit is called next to the quantity stepper. */
  unit: { one: Bilingual; many: Bilingual };
  /** The label above the quantity stepper — "How many chairs do you need?" */
  quantityLabel: Bilingual;
  /**
   * The single product answer this category cannot be quoted without.
   * `validate` returns the hint to show while it is missing, or null when met.
   */
  required: {
    render: (ctx: EnquiryContext) => ReactNode;
    validate: (config: ConfiguratorState) => Bilingual | null;
  };
  /** Category-specific sections, offered before the shared ones. */
  optional: EnquirySection[];
  /**
   * Whether to offer the shared fabric & colour picker. False only for custom,
   * where the visitor is describing something we have not built yet.
   */
  offersFabric: boolean;
}

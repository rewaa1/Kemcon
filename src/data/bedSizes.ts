export interface BedSize {
  id: string;
  name: string;
  nameAr: string;
  /** Mattress dimensions the cover is cut for. */
  dimensions: string;
}

/**
 * Bed sizes a cover is made to.
 *
 * This is the one answer a bed-cover enquiry cannot be quoted without — the
 * fabric and the colour can be settled later, the cut cannot. Dimensions are
 * the mattress, not the finished cover; drop and tuck are added in the
 * workshop and vary by bed height.
 */
export const bedSizes: BedSize[] = [
  { id: "single", name: "Single", nameAr: "فردي", dimensions: "90 × 200 cm" },
  { id: "double", name: "Double", nameAr: "مزدوج", dimensions: "140 × 200 cm" },
  { id: "queen", name: "Queen", nameAr: "كوين", dimensions: "160 × 200 cm" },
  { id: "king", name: "King", nameAr: "كينج", dimensions: "180 × 200 cm" },
  { id: "super-king", name: "Super King", nameAr: "سوبر كينج", dimensions: "200 × 200 cm" },
];

export function bedSizeById(id: string): BedSize | undefined {
  return bedSizes.find((s) => s.id === id);
}

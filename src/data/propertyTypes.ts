export interface PropertyType {
  value: string;
  en: string;
  ar: string;
  /**
   * Whether the property has a name worth asking for. A hotel, hospital,
   * school or office is a named institution and knowing which one changes how
   * the enquiry is handled; a flat is just a flat.
   */
  named: boolean;
}

/**
 * Every property type the site offers, in one place.
 *
 * `format.ts` derives its email labels from this list, so adding a type here
 * is enough to make it render correctly in the team's inbox.
 */
export const propertyTypes: PropertyType[] = [
  { value: "apartment", en: "Apartment", ar: "شقة", named: false },
  { value: "villa", en: "Villa", ar: "فيلا", named: false },
  { value: "hotel", en: "Hotel / Resort", ar: "فندق أو منتجع", named: true },
  { value: "hospital", en: "Hospital / Clinic", ar: "مستشفى أو عيادة", named: true },
  { value: "school", en: "School / University", ar: "مدرسة أو جامعة", named: true },
  { value: "office", en: "Office", ar: "مكتب", named: true },
  { value: "restaurant", en: "Restaurant / Venue", ar: "مطعم أو قاعة", named: true },
  { value: "other", en: "Other", ar: "أخرى", named: false },
];

/** Whether picking this property type should reveal the "name of it" field. */
export function propertyTypeIsNamed(value: string): boolean {
  return propertyTypes.find((p) => p.value === value)?.named ?? false;
}

/** English label for the team's inbox, falling back to the raw value. */
export function propertyTypeLabel(value: string): string {
  return propertyTypes.find((p) => p.value === value)?.en ?? value;
}

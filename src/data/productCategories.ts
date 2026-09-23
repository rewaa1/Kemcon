/**
 * Backs the `ItemList` JSON-LD on `/services`.
 *
 * This must mirror what the page actually links to. It previously advertised
 * nine entries — including `/services/configure` and `/services/showroom`,
 * which no longer exist — while the page rendered four cards.
 */
export const productCategories = [
  { name: "Bespoke Curtains", path: "/services/curtains" },
  { name: "Custom Chairs", path: "/services/chairs" },
  { name: "Bespoke Sofas", path: "/services/sofas" },
  { name: "Premium Bed Covers", path: "/services/bed-covers" },
  { name: "Custom Solutions", path: "/services/custom" },
  { name: "Design & Plan", path: "/services/design-plan" },
  { name: "Mass Production", path: "/services/mass-production" },
];

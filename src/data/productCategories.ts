/**
 * Backs the `ItemList` JSON-LD on `/products`.
 *
 * This must mirror what the page actually links to. It previously advertised
 * nine entries — including `/products/configure` and `/products/showroom`,
 * which no longer exist — while the page rendered four cards.
 */
export const productCategories = [
  { name: "Bespoke Curtains", path: "/products/curtains" },
  { name: "Custom Chairs", path: "/products/chairs" },
  { name: "Bespoke Sofas", path: "/products/sofas" },
  { name: "Premium Bed Covers", path: "/products/bed-covers" },
  { name: "Custom Solutions", path: "/products/custom" },
  { name: "Design & Plan", path: "/products/design-plan" },
  { name: "Mass Production", path: "/products/mass-production" },
];

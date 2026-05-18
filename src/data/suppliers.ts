export type SupplierRegion =
  | "Europe"
  | "Americas"
  | "Asia"
  | "Middle East & Africa";

export interface Supplier {
  id: string;
  name: string;
  country: string;
  region: SupplierRegion;
  specialty: string;
  url: string;
  logo: string; // place files under /public/suppliers/<id>/logo.png
}

export const suppliers: Supplier[] = [
  // ── Middle East & Africa ──────────────────────────────────────────────────
  {
    id: "seda",
    name: "Seda Fabrics",
    country: "Egypt",
    region: "Middle East & Africa",
    specialty: "Egyptian cotton, linen & woven furnishing fabrics",
    url: "https://www.sedacollection.com/",
    logo: "/suppliers/seda-logo.png",
  },
  {
    id: "Texmar",
    name: "Texmar Fabrics",
    country: "Egypt",
    region: "Middle East & Africa",
    specialty: "Premium Egyptian long-staple cotton fabrics",
    url: "https://www.texmarfabrics.com/home",
    logo: "/suppliers/texmar-logo.png",
  },
  {
    id: "mardini",
    name: "Radwan Mardini",
    country: "Egypt",
    region: "Middle East & Africa",
    specialty: "Premium Egyptian long-staple cotton fabrics",
    url: "https://radwanmardini.com/",
    logo: "/suppliers/mardini-logo.png",
  },
  {
    id: "bibtex",
    name: "Bbibtex",
    country: "Egypt",
    region: "Middle East & Africa",
    specialty: "Premium Egyptian long-staple cotton fabrics",
    url: "https://bibtex.net/index.php/en/",
    logo: "/suppliers/bibtex-logo.png",
  },
  {
    id: "raytex",
    name: "Raytex",
    country: "Egypt",
    region: "Middle East & Africa",
    specialty: "Premium Egyptian long-staple cotton fabrics",
    url: "http://raytexgroup.com/",
    logo: "/suppliers/raytex.png",
  },
];

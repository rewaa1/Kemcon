export type SupplierRegion = "Europe" | "Americas" | "Asia" | "Middle East & Africa";

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
  // ── Europe ────────────────────────────────────────────────────────────────
  {
    id: "kvadrat",
    name: "Kvadrat",
    country: "Denmark",
    region: "Europe",
    specialty: "High-performance upholstery & drapery textiles",
    url: "https://www.kvadrat.dk",
    logo: "/suppliers/kvadrat/logo.png",
  },
  {
    id: "dedar",
    name: "Dedar",
    country: "Italy",
    region: "Europe",
    specialty: "Luxury decorative fabrics & velvets",
    url: "https://www.dedar.com",
    logo: "/suppliers/dedar/logo.png",
  },
  {
    id: "rubelli",
    name: "Rubelli",
    country: "Italy",
    region: "Europe",
    specialty: "Venetian silk, jacquard & brocade",
    url: "https://www.rubelli.com",
    logo: "/suppliers/rubelli/logo.png",
  },
  {
    id: "zimmer-rohde",
    name: "Zimmer + Rohde",
    country: "Germany",
    region: "Europe",
    specialty: "Premium curtain & upholstery fabrics",
    url: "https://www.zimmer-rohde.com",
    logo: "/suppliers/zimmer-rohde/logo.png",
  },
  {
    id: "sahco",
    name: "Sahco",
    country: "Germany",
    region: "Europe",
    specialty: "Luxury furnishing fabrics & sheers",
    url: "https://www.sahco.com",
    logo: "/suppliers/sahco/logo.png",
  },
  {
    id: "lelievre",
    name: "Lelièvre",
    country: "France",
    region: "Europe",
    specialty: "Decorative fabrics, chenille & bouclé",
    url: "https://www.lelievre.com",
    logo: "/suppliers/lelievre/logo.png",
  },
  {
    id: "romo",
    name: "Romo",
    country: "United Kingdom",
    region: "Europe",
    specialty: "Designer upholstery & contract fabrics",
    url: "https://www.romo.com",
    logo: "/suppliers/romo/logo.png",
  },
  {
    id: "creation-baumann",
    name: "Création Baumann",
    country: "Switzerland",
    region: "Europe",
    specialty: "Technical sun-protection & acoustic textiles",
    url: "https://www.creationbaumann.com",
    logo: "/suppliers/creation-baumann/logo.png",
  },

  // ── Americas ──────────────────────────────────────────────────────────────
  {
    id: "maharam",
    name: "Maharam",
    country: "United States",
    region: "Americas",
    specialty: "Contract & hospitality performance textiles",
    url: "https://www.maharam.com",
    logo: "/suppliers/maharam/logo.png",
  },
  {
    id: "sunbrella",
    name: "Sunbrella",
    country: "United States",
    region: "Americas",
    specialty: "Outdoor, solution-dyed acrylic & blackout fabrics",
    url: "https://www.sunbrella.com",
    logo: "/suppliers/sunbrella/logo.png",
  },

  // ── Asia ──────────────────────────────────────────────────────────────────
  {
    id: "reliance-industries",
    name: "Reliance Industries",
    country: "India",
    region: "Asia",
    specialty: "Polyester, synthetic blends & technical fibers",
    url: "https://www.ril.com",
    logo: "/suppliers/reliance-industries/logo.png",
  },
  {
    id: "vardhman",
    name: "Vardhman Textiles",
    country: "India",
    region: "Asia",
    specialty: "Cotton yarn, linen & woven fabrics",
    url: "https://www.vardhman.com",
    logo: "/suppliers/vardhman/logo.png",
  },

  // ── Middle East & Africa ──────────────────────────────────────────────────
  {
    id: "egytex",
    name: "Egytex",
    country: "Egypt",
    region: "Middle East & Africa",
    specialty: "Egyptian cotton, linen & woven furnishing fabrics",
    url: "https://www.kemcon.com",
    logo: "/suppliers/egytex/logo.png",
  },
  {
    id: "nile-textile",
    name: "Nile Textile",
    country: "Egypt",
    region: "Middle East & Africa",
    specialty: "Premium Egyptian long-staple cotton fabrics",
    url: "https://www.niletextile.com",
    logo: "/suppliers/nile-textile/logo.png",
  },
];

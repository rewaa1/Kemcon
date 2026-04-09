// ─── Featured Clients ────────────────────────────────────────────────────────
// Each entry renders as a card on the clients page with a lightbox gallery.

export const featuredClients = [
  {
    id: "sheraton-cairo",
    name: "Sheraton Cairo Hotel",
    region: "Cairo, Egypt",
    stars: 5,
    logo: "/clinets/cairosheraton/sheraton_logo_white_bg.png",
    featured: "/clinets/cairosheraton/cairosheratonwallpaper.jpg",
    rooms: [
      "/clinets/cairosheraton/sheratoncairo-room1.webp",
      "/clinets/cairosheraton/sheratoncairo-room2.webp",
      "/clinets/cairosheraton/sheratoncairo-room3.webp",
      "/clinets/cairosheraton/sheratoncairo-room4.webp",
      "/clinets/cairosheraton/sheratoncairo-room5.webp",
      "/clinets/cairosheraton/sheratoncairo-room6.webp",
      "/clinets/cairosheraton/sheratoncairo-room7.webp",
    ],
  },
  {
    id: "meridien-heliopolis",
    name: "Meridian Heliopolis",
    region: "Cairo, Egypt",
    stars: 5,
    logo: "/clinets/meridienhelioplis/le_meridien_white_bg.png",
    featured: "/clinets/meridienhelioplis/meridienwallpaper.jfif",
    rooms: [
      "/clinets/meridienhelioplis/hotel-meridien-heliopolis-room1.jpg",
      "/clinets/meridienhelioplis/hotel-meridien-heliopolis-room2.jpg",
      "/clinets/meridienhelioplis/cairo-le-meridien-heliopolis-room3.jfif",
      "/clinets/meridienhelioplis/hotel-meridien-heliopolis-general-1256d9f4.jpg",
      "/clinets/meridienhelioplis/meridienheliopolisroom4.jpg",
      "/clinets/meridienhelioplis/meridienheliopolisroom5.jpg",
      "/clinets/meridienhelioplis/meridienheliopolisroom6.jpg",
    ],
  },
  {
    id: "four-seasons-cairo",
    name: "Four Seasons Cairo",
    region: "Cairo, Egypt",
    stars: 5,
    logo: "/clinets/fourseasonscairo/fourseasons_logo.png",
    featured: "/clinets/fourseasonscairo/wallpaper.jpg",
    rooms: [
      "/clinets/fourseasonscairo/fourseasonscairo-room1.webp",
      "/clinets/fourseasonscairo/fourseasonscairo-room2.webp",
      "/clinets/fourseasonscairo/fourseasonscairo-room3.webp",
      "/clinets/fourseasonscairo/fourseasonscairo-room4.webp",
      "/clinets/fourseasonscairo/fourseasonscairo-room5.webp",
      "/clinets/fourseasonscairo/fourseasonscairo-room6.webp",
      "/clinets/fourseasonscairo/fourseasonscairo-room7.webp",
    ],
  },
  {
    id: "ramses-hilton",
    name: "Ramses Hilton",
    region: "Cairo, Egypt",
    stars: 5,
    logo: "/clinets/ramseshilton/Hilton-logo.png",
    featured: "/clinets/ramseshilton/wallpaper.webp",
    rooms: [
      "/clinets/ramseshilton/ramseshilton-room-1.webp",
      "/clinets/ramseshilton/ramseshilton-room-2.webp",
      "/clinets/ramseshilton/ramseshilton-room-3.webp",
      "/clinets/ramseshilton/ramseshilton-room-4.webp",
      "/clinets/ramseshilton/ramseshilton-room-5.webp",
      "/clinets/ramseshilton/ramseshilton-room-6.webp",
      "/clinets/ramseshilton/ramseshilton-room-7.webp",
    ],
  },
  {
    id: "world-trade-center",
    name: "Hilton World Trade Center",
    region: "Cairo, Egypt",
    stars: 5,
    logo: "/clinets/ramseshilton/Hilton-logo.png",
    featured: "/clinets/tradecenter/wallpaper.webp",
    rooms: [
      "/clinets/tradecenter/tradecenter-room-6.webp",
      "/clinets/tradecenter/tradecenter-room-4.webp",
      "/clinets/tradecenter/tradecenter-room-5.webp",
      "/clinets/tradecenter/tradecenter-room-1.webp",
      "/clinets/tradecenter/tradecenter-room-7.webp",
      "/clinets/tradecenter/tradecenter-room-2.webp",
      "/clinets/tradecenter/tradecenter-room-3.webp",
    ],
  },
  {
    id: "Helnan-dreamland-hotel",
    name: "Helnan Dreamland Hotel & Conference Center",
    region: "Giza, Egypt",
    stars: 5,
    logo: "/clinets/dreamland/helnan-logo.webp",
    featured: "/clinets/dreamland/wallpaper.webp",
    rooms: [
      "/clinets/dreamland/dreamland-room-2.webp",
      "/clinets/dreamland/dreamland-room-3.webp",
      "/clinets/dreamland/dreamland-room-4.webp",
      "/clinets/dreamland/dreamland-room-5.webp",
      "/clinets/dreamland/dreamland-room-6.webp",
      "/clinets/dreamland/dreamland-room-7.webp",
      "/clinets/dreamland/dreamland-room-1.webp",
    ],
  },
];

export type FeaturedClient = (typeof featuredClients)[0];

// ─── Partner Brands ───────────────────────────────────────────────────────────

export const partnerBrands = [
  {
    name: "Hilton Hotels & Resorts",
    region: "Egypt, Saudi Arabia",
    initials: "H",
  },
  { name: "Marriott International", region: "Egypt, UAE", initials: "M" },
  { name: "Four Seasons Hotels", region: "Egypt", initials: "FS" },
  { name: "Kempinski Hotels", region: "Jordan, Egypt", initials: "K" },
  { name: "Steigenberger Hotels", region: "Egypt", initials: "S" },
  { name: "Mövenpick Hotels", region: "Egypt, Jordan", initials: "MP" },
  { name: "Rotana Hotels", region: "UAE, Egypt", initials: "R" },
  { name: "Sofitel Hotels", region: "Egypt", initials: "SF" },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const testimonials = [
  {
    quote:
      "Kemcon has been our trusted partner for over a decade. Their quality is consistently exceptional.",
    author: "Hotel Operations Director",
    hotel: "Five-Star Resort, Cairo",
  },
  {
    quote:
      "The attention to detail in every piece is remarkable. Our guests notice the difference.",
    author: "Interior Design Manager",
    hotel: "Luxury Hotel, Dubai",
  },
  {
    quote:
      "From custom fabrics to complete furnishing solutions, Kemcon delivers beyond expectations.",
    author: "Procurement Manager",
    hotel: "International Chain, Riyadh",
  },
];

// ─── Regions ──────────────────────────────────────────────────────────────────

export const regions = [
  { name: "Egypt", flag: "🇪🇬", count: "200+" },
  { name: "Saudi Arabia", flag: "🇸🇦", count: "150+" },
  { name: "Emirates", flag: "🇦🇪", count: "100+" },
  { name: "Jordan", flag: "🇯🇴", count: "50+" },
];

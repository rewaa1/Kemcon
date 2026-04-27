export interface GalleryClient {
  slug: string;
  name: string;
  images: string[];
}

export const GALLERY_CLIENTS: GalleryClient[] = [
  {
    slug: "al-haram",
    name: "Al Haram Hotel",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/al-haram/al-haram-room-${i + 1}.webp`),
  },
  {
    slug: "alamein-marassi",
    name: "Alamein Marassi",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/alamein-marassi/alamein-marassi-room-${i + 1}.webp`),
  },
  {
    slug: "cairomarriott",
    name: "Cairo Marriott",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/cairomarriott/cairomarriott-room-${i + 1}.webp`),
  },
  {
    slug: "cairosheraton",
    name: "Cairo Sheraton",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/cairosheraton/sheratoncairo-room${i + 1}.webp`),
  },
  {
    slug: "charmillion",
    name: "Charmillion Club",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/charmillion/charmillion-room-${i + 1}.webp`),
  },
  {
    slug: "cleopatra-sharm",
    name: "Cleopatra Sharm",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/cleopatra-sharm/cleopatra-sharm-room-${i + 1}.webp`),
  },
  {
    slug: "cleopatra-sidi",
    name: "Cleopatra Sidi",
    images: Array.from({ length: 5 }, (_, i) => `/clinets/cleopatra-sidi/cleopatra-sidi-room-${i + 1}.webp`),
  },
  {
    slug: "concord-sharm",
    name: "Concord Sharm",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/concord-sharm/concord-sharm-room-${i + 1}.webp`),
  },
  {
    slug: "concordelsalam",
    name: "Concord El Salam",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/concordelsalam/concord-room-${i + 1}.webp`),
  },
  {
    slug: "conradcairo",
    name: "Conrad Cairo",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/conradcairo/conradcairo-room-${i + 1}.webp`),
  },
  {
    slug: "coral-hurghada",
    name: "Coral Beach Hurghada",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/coral-hurghada/coral-hurghada-room-${i + 1}.webp`),
  },
  {
    slug: "coral-sharm",
    name: "Coral Beach Sharm",
    images: Array.from({ length: 5 }, (_, i) => `/clinets/coral-sharm/coral-beach-room-${i + 1}.webp`),
  },
  {
    slug: "cove-oman",
    name: "The Cove Oman",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/cove-oman/cove-oman-room-${i + 1}.webp`),
  },
  {
    slug: "dreamland",
    name: "Dreamland Aqua Park",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/dreamland/dreamland-room-${i + 1}.webp`),
  },
  {
    slug: "fairmont-makkah",
    name: "Fairmont Makkah",
    images: Array.from({ length: 8 }, (_, i) => `/clinets/fairmont-makkah/fairmont-makkah-room-${i + 1}.webp`),
  },
  {
    slug: "fanar-oman",
    name: "Al Fanar Oman",
    images: Array.from({ length: 6 }, (_, i) => `/clinets/fanar-oman/fanar-room-${i + 1}.webp`),
  },
  {
    slug: "four-seasons-nile",
    name: "Four Seasons Nile Plaza",
    images: [
      "/clinets/four-seasons-nile/four-seasons-room-1.jpg",
      "/clinets/four-seasons-nile/four-seasons-room-2.jpg",
      "/clinets/four-seasons-nile/four-seasons-room-3.webp",
      "/clinets/four-seasons-nile/four-seasons-room-4.webp",
      "/clinets/four-seasons-nile/four-seasons-room-5.webp",
      "/clinets/four-seasons-nile/four-seasons-room-6.webp",
      "/clinets/four-seasons-nile/four-seasons-room-7.webp",
      "/clinets/four-seasons-nile/four-seasons-room-8.jpg",
    ],
  },
  {
    slug: "four-seasons-san",
    name: "Four Seasons San Stefano",
    images: Array.from({ length: 9 }, (_, i) => `/clinets/four-seasons-san/four-seasons-san-room-${i + 1}.webp`),
  },
  {
    slug: "four-seasons-sharm",
    name: "Four Seasons Sharm",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/four-seasons-sharm/four-seasons-sharm-room-${i + 1}.webp`),
  },
  {
    slug: "fourseasonscairo",
    name: "Four Seasons Cairo Residence",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/fourseasonscairo/four-seasons-residence-room-${i + 1}.webp`),
  },
  {
    slug: "helnan-sharm",
    name: "Helnan Sharm",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/helnan-sharm/helnan-shram-room-${i + 1}.webp`),
  },
  {
    slug: "hilton-green-plaza",
    name: "Hilton Green Plaza",
    images: Array.from({ length: 8 }, (_, i) => `/clinets/hilton-green-plaza/hilton-green-plaza-room-${i + 1}.webp`),
  },
  {
    slug: "hilton-hurghada",
    name: "Hilton Hurghada",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/hilton-hurghada/hilton-hurghada-room-${i + 1}.webp`),
  },
  {
    slug: "hilton-king",
    name: "Hilton King's Ranch",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/hilton-king/hiton-king-room-${i + 1}.webp`),
  },
  {
    slug: "hilton-pyramid",
    name: "Hilton Pyramid",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/hilton-pyramid/hiton-pyramid-room-${i + 1}.webp`),
  },
  {
    slug: "hyattoctober",
    name: "Hyatt October",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/hyattoctober/hyatt-room-${i + 1}.webp`),
  },
  {
    slug: "intercontinental-city",
    name: "InterContinental City Stars",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/intercontinental-city/intercontinental-room-${i + 1}.webp`),
  },
  {
    slug: "kempinski-yanbu",
    name: "Kempinski Yanbu",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/kempinski-yanbu/kempinski-yanbu-room-${i + 1}.webp`),
  },
  {
    slug: "marriottmenahouse",
    name: "Marriott Mena House",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/marriottmenahouse/marriott-mena-house-room-${i + 1}.webp`),
  },
  {
    slug: "meridienhelioplis",
    name: "Le Méridien Heliopolis",
    images: [
      "/clinets/meridienhelioplis/hotel-meridien-heliopolis-room1.jpg",
      "/clinets/meridienhelioplis/hotel-meridien-heliopolis-room2.jpg",
      "/clinets/meridienhelioplis/cairo-le-meridien-heliopolis-room3.webp",
    ],
  },
  {
    slug: "movenpick-gouna",
    name: "Mövenpick El Gouna",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/movenpick-gouna/movenpick-gouna-room-${i + 1}.webp`),
  },
  {
    slug: "movenpick-makkah",
    name: "Mövenpick Makkah",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/movenpick-makkah/movenpick-makkah-room-${i + 1}.webp`),
  },
  {
    slug: "movenpick-medinah",
    name: "Mövenpick Medinah",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/movenpick-medinah/movenpick-medinah-room-${i + 1}.webp`),
  },
  {
    slug: "radisson-alex",
    name: "Radisson Blu Alexandria",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/radisson-alex/radisson-alex-room-${i + 1}.webp`),
  },
  {
    slug: "ramseshilton",
    name: "Ramses Hilton",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/ramseshilton/ramseshilton-room-${i + 1}.webp`),
  },
  {
    slug: "reef-oasis",
    name: "Reef Oasis",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/reef-oasis/reef-oasis-room-${i + 1}.webp`),
  },
  {
    slug: "rixos-magawish",
    name: "Rixos Magawish",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/rixos-magawish/rixos-magawish-room-${i + 1}.webp`),
  },
  {
    slug: "rixos-sharm",
    name: "Rixos Sharm",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/rixos-sharm/rixos-sharm-room-${i + 1}.webp`),
  },
  {
    slug: "robinson-soma-bay",
    name: "Robinson Soma Bay",
    images: Array.from({ length: 4 }, (_, i) => `/clinets/robinson-soma-bay/robinson-soma-bay-room-${i + 1}.webp`),
  },
  {
    slug: "rotana-oman",
    name: "Rotana Oman",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/rotana-oman/rotana-room-${i + 1}.webp`),
  },
  {
    slug: "rotana-sharm",
    name: "Rotana Sharm",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/rotana-sharm/rotana-sharm-room-${i + 1}.webp`),
  },
  {
    slug: "semiramis-int",
    name: "Semiramis InterContinental",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/semiramis-int/semiramis-int-room-${i + 1}.webp`),
  },
  {
    slug: "sheraton-montazah",
    name: "Sheraton Montazah",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/sheraton-montazah/sheraton-montazah-room-${i + 1}.webp`),
  },
  {
    slug: "sheraton-soma-bay",
    name: "Sheraton Soma Bay",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/sheraton-soma-bay/sheraton-soma-bay-room-${i + 1}.webp`),
  },
  {
    slug: "sofitel-aswan",
    name: "Sofitel Legend Aswan",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/sofitel-aswan/sofitel-aswan-room-${i + 1}.webp`),
  },
  {
    slug: "sofitel-hurghada",
    name: "Sofitel Hurghada",
    images: Array.from({ length: 5 }, (_, i) => `/clinets/sofitel-hurghada/sofitel-hurghada-room-${i + 1}.webp`),
  },
  {
    slug: "st-regis",
    name: "St. Regis",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/st-regis/st-regis-room-${i + 1}.webp`),
  },
  {
    slug: "staybridge",
    name: "Staybridge Suites",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/staybridge/staybridge-room-${i + 1}.webp`),
  },
  {
    slug: "steigenberger-aldau",
    name: "Steigenberger Aldau",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/steigenberger-aldau/steigenberger-aldau-room-${i + 1}.webp`),
  },
  {
    slug: "steigenberger-cecil",
    name: "Steigenberger Cecil",
    images: Array.from({ length: 5 }, (_, i) => `/clinets/steigenberger-cecil/steigenberger-alex-room-${i + 1}.webp`),
  },
  {
    slug: "the-red",
    name: "The Red Sea Hotel",
    images: Array.from({ length: 6 }, (_, i) => `/clinets/the-red/room-${i + 1}.webp`),
  },
  {
    slug: "tradecenter",
    name: "Trade Center Hotel",
    images: Array.from({ length: 7 }, (_, i) => `/clinets/tradecenter/tradecenter-room-${i + 1}.webp`),
  },
];

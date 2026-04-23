export interface ColorGroup {
  id: string;
  name: string;
  nameAr: string;
}

export interface Color {
  id: string;
  name: string;
  nameAr: string;
  hex: string;
  groupId: string;
}

export const colorGroups: ColorGroup[] = [
  { id: "neutrals", name: "Neutrals", nameAr: "محايدة" },
  { id: "warm", name: "Warm Tones", nameAr: "دافئة" },
  { id: "cool", name: "Cool Tones", nameAr: "باردة" },
  { id: "earth", name: "Earth Tones", nameAr: "ترابية" },
  { id: "jewel", name: "Jewel Tones", nameAr: "جواهرية" },
  { id: "pastels", name: "Pastels", nameAr: "باستيل" },
  { id: "dark", name: "Deep & Dark", nameAr: "داكنة" },
];

export const colors: Color[] = [
  // Neutrals
  { id: "ivory", name: "Ivory", nameAr: "عاجي", hex: "#FFFFF0", groupId: "neutrals" },
  { id: "cream", name: "Cream", nameAr: "كريمي", hex: "#FFFDD0", groupId: "neutrals" },
  { id: "pearl", name: "Pearl", nameAr: "لؤلؤي", hex: "#EAE0C8", groupId: "neutrals" },
  { id: "linen", name: "Linen", nameAr: "كتاني", hex: "#E8DCC8", groupId: "neutrals" },
  { id: "bone", name: "Bone", nameAr: "عظمي", hex: "#D9CDB4", groupId: "neutrals" },
  { id: "champagne", name: "Champagne", nameAr: "شمبانيا", hex: "#F7E7CE", groupId: "neutrals" },
  { id: "sand", name: "Sand", nameAr: "رملي", hex: "#C2B280", groupId: "neutrals" },
  { id: "silver", name: "Silver", nameAr: "فضي", hex: "#C0C0C0", groupId: "neutrals" },
  { id: "stone", name: "Stone", nameAr: "حجري", hex: "#928E85", groupId: "neutrals" },
  { id: "white", name: "Pure White", nameAr: "أبيض ناصع", hex: "#F8F8F8", groupId: "neutrals" },
  { id: "off-white", name: "Off White", nameAr: "أبيض محايد", hex: "#F5F0E8", groupId: "neutrals" },
  { id: "greige", name: "Greige", nameAr: "رمادي بيج", hex: "#C8B99A", groupId: "neutrals" },

  // Warm Tones
  { id: "blush", name: "Blush", nameAr: "وردي خفيف", hex: "#F4C2C2", groupId: "warm" },
  { id: "rose-gold", name: "Rose Gold", nameAr: "ذهبي وردي", hex: "#B76E79", groupId: "warm" },
  { id: "coral", name: "Coral", nameAr: "مرجاني", hex: "#FF7F7F", groupId: "warm" },
  { id: "terracotta", name: "Terracotta", nameAr: "تراكوتا", hex: "#C1603E", groupId: "warm" },
  { id: "rust", name: "Rust", nameAr: "صدئي", hex: "#B7410E", groupId: "warm" },
  { id: "amber", name: "Amber", nameAr: "كهرماني", hex: "#FFBF00", groupId: "warm" },
  { id: "honey", name: "Honey", nameAr: "عسلي", hex: "#E8A020", groupId: "warm" },
  { id: "copper", name: "Copper", nameAr: "نحاسي", hex: "#B87333", groupId: "warm" },
  { id: "apricot", name: "Apricot", nameAr: "مشمشي", hex: "#FBCEB1", groupId: "warm" },
  { id: "peach", name: "Peach", nameAr: "خوخي", hex: "#FFCBA4", groupId: "warm" },

  // Cool Tones
  { id: "sky-blue", name: "Sky Blue", nameAr: "أزرق سماوي", hex: "#87CEEB", groupId: "cool" },
  { id: "powder-blue", name: "Powder Blue", nameAr: "أزرق باودر", hex: "#B0C4DE", groupId: "cool" },
  { id: "slate-blue", name: "Slate Blue", nameAr: "أزرق رمادي", hex: "#6A7FA8", groupId: "cool" },
  { id: "navy", name: "Navy", nameAr: "كحلي", hex: "#001F5B", groupId: "cool" },
  { id: "duck-egg", name: "Duck Egg", nameAr: "أزرق بيضة البط", hex: "#8DB6B6", groupId: "cool" },
  { id: "teal", name: "Teal", nameAr: "تيل", hex: "#008080", groupId: "cool" },
  { id: "sage", name: "Sage Green", nameAr: "أخضر مريمية", hex: "#9CAF88", groupId: "cool" },
  { id: "mint", name: "Mint", nameAr: "نعناعي", hex: "#98FF98", groupId: "cool" },
  { id: "eucalyptus", name: "Eucalyptus", nameAr: "كافوري", hex: "#5C8374", groupId: "cool" },
  { id: "steel-blue", name: "Steel Blue", nameAr: "أزرق فولاذي", hex: "#4682B4", groupId: "cool" },

  // Earth Tones
  { id: "tan", name: "Tan", nameAr: "تان", hex: "#D2B48C", groupId: "earth" },
  { id: "camel", name: "Camel", nameAr: "جملي", hex: "#C19A6B", groupId: "earth" },
  { id: "khaki", name: "Khaki", nameAr: "كاكي", hex: "#C3B091", groupId: "earth" },
  { id: "mocha", name: "Mocha", nameAr: "موكا", hex: "#967969", groupId: "earth" },
  { id: "chocolate", name: "Chocolate", nameAr: "شوكولاتة", hex: "#7B3F00", groupId: "earth" },
  { id: "espresso", name: "Espresso", nameAr: "إسبريسو", hex: "#4A2511", groupId: "earth" },
  { id: "mushroom", name: "Mushroom", nameAr: "فطري", hex: "#A9927A", groupId: "earth" },
  { id: "walnut", name: "Walnut", nameAr: "جوزي", hex: "#773F1A", groupId: "earth" },
  { id: "sienna", name: "Sienna", nameAr: "سيينا", hex: "#A0522D", groupId: "earth" },
  { id: "umber", name: "Raw Umber", nameAr: "أمبر", hex: "#826644", groupId: "earth" },

  // Jewel Tones
  { id: "emerald", name: "Emerald", nameAr: "زمرد", hex: "#50C878", groupId: "jewel" },
  { id: "sapphire", name: "Sapphire", nameAr: "ياقوت أزرق", hex: "#0F52BA", groupId: "jewel" },
  { id: "ruby", name: "Ruby", nameAr: "ياقوت أحمر", hex: "#9B111E", groupId: "jewel" },
  { id: "amethyst", name: "Amethyst", nameAr: "جمشت", hex: "#9966CC", groupId: "jewel" },
  { id: "topaz", name: "Topaz", nameAr: "توباز", hex: "#FFC87C", groupId: "jewel" },
  { id: "jade", name: "Jade", nameAr: "يشم", hex: "#00A36C", groupId: "jewel" },
  { id: "garnet", name: "Garnet", nameAr: "عقيق", hex: "#733635", groupId: "jewel" },
  { id: "onyx", name: "Onyx", nameAr: "أونكس", hex: "#353839", groupId: "jewel" },
  { id: "cobalt", name: "Cobalt", nameAr: "كوبالت", hex: "#0047AB", groupId: "jewel" },
  { id: "tourmaline", name: "Tourmaline", nameAr: "تورمالين", hex: "#2E8B57", groupId: "jewel" },

  // Pastels
  { id: "pastel-pink", name: "Pastel Pink", nameAr: "وردي باستيل", hex: "#FFD1DC", groupId: "pastels" },
  { id: "pastel-blue", name: "Pastel Blue", nameAr: "أزرق باستيل", hex: "#AEC6CF", groupId: "pastels" },
  { id: "pastel-green", name: "Pastel Green", nameAr: "أخضر باستيل", hex: "#B5EAD7", groupId: "pastels" },
  { id: "pastel-yellow", name: "Pastel Yellow", nameAr: "أصفر باستيل", hex: "#FFDFD3", groupId: "pastels" },
  { id: "pastel-lilac", name: "Pastel Lilac", nameAr: "بنفسجي باستيل", hex: "#C8A2C8", groupId: "pastels" },
  { id: "pastel-peach", name: "Pastel Peach", nameAr: "خوخي باستيل", hex: "#FFDAB9", groupId: "pastels" },
  { id: "pastel-mint", name: "Pastel Mint", nameAr: "نعناعي باستيل", hex: "#C8F0D8", groupId: "pastels" },
  { id: "pastel-lavender", name: "Lavender", nameAr: "لافندر", hex: "#E6E6FA", groupId: "pastels" },

  // Deep & Dark
  { id: "charcoal", name: "Charcoal", nameAr: "فحمي", hex: "#36454F", groupId: "dark" },
  { id: "midnight", name: "Midnight Blue", nameAr: "أزرق منتصف الليل", hex: "#191970", groupId: "dark" },
  { id: "forest", name: "Forest Green", nameAr: "أخضر الغابة", hex: "#228B22", groupId: "dark" },
  { id: "burgundy", name: "Burgundy", nameAr: "بوردو", hex: "#800020", groupId: "dark" },
  { id: "plum", name: "Plum", nameAr: "برقوقي", hex: "#8E4585", groupId: "dark" },
  { id: "oxblood", name: "Oxblood", nameAr: "أحمر داكن", hex: "#4A0404", groupId: "dark" },
  { id: "jet", name: "Jet Black", nameAr: "أسود حالك", hex: "#343434", groupId: "dark" },
  { id: "graphite", name: "Graphite", nameAr: "غرافيت", hex: "#474747", groupId: "dark" },
  { id: "dark-teal", name: "Dark Teal", nameAr: "تيل داكن", hex: "#003840", groupId: "dark" },
  { id: "dark-olive", name: "Dark Olive", nameAr: "زيتوني داكن", hex: "#3C3A00", groupId: "dark" },
];

export interface FrameMaterial {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  hex: string;
  image?: string;
}

export interface FrameFinish {
  id: string;
  name: string;
  nameAr: string;
  hex: string;
}

export interface FillingOption {
  id: string;
  name: string;
  nameAr: string;
  firmness: "soft" | "medium" | "firm";
  description: string;
  descriptionAr: string;
}

export const frameMaterials: FrameMaterial[] = [
  {
    id: "oak",
    name: "Oak",
    nameAr: "خشب البلوط",
    description: "Durable light-grain hardwood",
    descriptionAr: "خشب صلب بحبيبات خفيفة ومتين",
    hex: "#C19A6B",
    image: "/frames/oak.jpg",
  },
  {
    id: "walnut",
    name: "Walnut",
    nameAr: "خشب الجوز",
    description: "Rich dark-grain premium hardwood",
    descriptionAr: "خشب صلب فاخر بحبيبات داكنة غنية",
    hex: "#5C3317",
    image: "/frames/walnut.jpg",
  },
  {
    id: "mahogany",
    name: "Mahogany",
    nameAr: "خشب الماهوجني",
    description: "Classic reddish-brown tropical wood",
    descriptionAr: "خشب استوائي كلاسيكي بني محمر",
    hex: "#7D2027",
    image: "/frames/mahogany.jpg",
  },
  {
    id: "teak",
    name: "Teak",
    nameAr: "خشب الساج",
    description: "Weather-resistant aromatic hardwood",
    descriptionAr: "خشب صلب عطري مقاوم للعوامل",
    hex: "#8B6914",
    image: "/frames/teak.jpg",
  },
  {
    id: "beech",
    name: "Beech",
    nameAr: "خشب الزان",
    description: "Fine-grained, versatile European wood",
    descriptionAr: "خشب أوروبي متعدد الاستخدامات",
    hex: "#D4A574",
    image: "/frames/beech.jpg",
  },
  {
    id: "cherry",
    name: "Cherry",
    nameAr: "خشب الكرز",
    description: "Warm reddish-pink American hardwood",
    descriptionAr: "خشب أمريكي دافئ بدرجات وردية محمرة",
    hex: "#A0522D",
    image: "/frames/cherry.jpg",
  },
  {
    id: "ebony",
    name: "Ebony",
    nameAr: "خشب الأبنوس",
    description: "Ultra-premium near-black exotic hardwood",
    descriptionAr: "خشب غريب فاخر للغاية بلون أسود",
    hex: "#1C1008",
    image: "/frames/ebony.jpg",
  },
  {
    id: "maple",
    name: "Maple",
    nameAr: "خشب القيقب",
    description: "Pale fine-grain Scandinavian hardwood",
    descriptionAr: "خشب إسكندنافي فاتح بحبيبات ناعمة",
    hex: "#F0D9B5",
    image: "/frames/maple.jpg",
  },
  {
    id: "brushed-steel",
    name: "Brushed Steel",
    nameAr: "فولاذ مصقول",
    description: "Contemporary industrial metal frame",
    descriptionAr: "إطار معدني صناعي معاصر",
    hex: "#8C8C8C",
    image: "/frames/brushed-steel.jpg",
  },
  {
    id: "matte-black-steel",
    name: "Matte Black Steel",
    nameAr: "فولاذ أسود مطفي",
    description: "Bold contemporary matte black metal",
    descriptionAr: "معدن أسود مطفي عصري جريء",
    hex: "#1A1A1A",
    image: "/frames/matte-black-steel.jpg",
  },
  // {
  //   id: "polished-chrome",
  //   name: "Polished Chrome",
  //   nameAr: "كروم مصقول",
  //   description: "Classic mirror-polished chrome finish",
  //   descriptionAr: "تشطيب كروم مصقول كلاسيكي كالمرآة",
  //   hex: "#C8C8C8",
  //   image: "/frames/polished-chrome.jpg",
  // },
  {
    id: "brass",
    name: "Brass",
    nameAr: "نحاس أصفر",
    description: "Warm antique-inspired brass hardware",
    descriptionAr: "أجهزة نحاسية دافئة بإلهام عتيق",
    hex: "#B5A642",
    image: "/frames/brass.jpg",
  },
  {
    id: "antique-bronze",
    name: "Antique Bronze",
    nameAr: "برونز عتيق",
    description: "Dark warm bronze with aged patina",
    descriptionAr: "برونز داكن دافئ بطبقة عتيقة",
    hex: "#6E4B2A",
    image: "/frames/antique-bronze.jpg",
  },
];

export const frameFinishes: FrameFinish[] = [
  { id: "natural", name: "Natural", nameAr: "طبيعي", hex: "#C8A878" },
  { id: "dark-stain", name: "Dark Stain", nameAr: "صبغ داكن", hex: "#3A2010" },
  {
    id: "light-stain",
    name: "Light Stain",
    nameAr: "صبغ فاتح",
    hex: "#D4B890",
  },
  {
    id: "white-paint",
    name: "Painted White",
    nameAr: "أبيض مطلي",
    hex: "#F5F2ED",
  },
  {
    id: "black-paint",
    name: "Painted Black",
    nameAr: "أسود مطلي",
    hex: "#2A2A2A",
  },
  {
    id: "antique-gold",
    name: "Antique Gold",
    nameAr: "ذهبي عتيق",
    hex: "#9A7820",
  },
  { id: "matte", name: "Matte Clear", nameAr: "شفاف مطفي", hex: "#B8A888" },
  { id: "lacquered", name: "High Gloss", nameAr: "لامع عالي", hex: "#D0C0A0" },
];

export const fillingOptions: FillingOption[] = [
  {
    id: "soft-foam",
    name: "Soft Foam",
    nameAr: "إسفنج ناعم",
    firmness: "soft",
    description: "Plush sink-in comfort, cloud-like feel",
    descriptionAr: "راحة وثيرة بإحساس السحابة الناعمة",
  },
  {
    id: "medium-foam",
    name: "Medium Foam",
    nameAr: "إسفنج متوسط",
    firmness: "medium",
    description: "Balanced support and comfort",
    descriptionAr: "توازن مثالي بين الدعم والراحة",
  },
  {
    id: "firm-foam",
    name: "Firm Foam",
    nameAr: "إسفنج صلب",
    firmness: "firm",
    description: "Structured support for upright posture",
    descriptionAr: "دعم منظم لوضعية جلوس مستقيمة",
  },
  {
    id: "memory-foam",
    name: "Memory Foam",
    nameAr: "إسفنج ذاكرة",
    firmness: "medium",
    description: "Contour-adapting visco-elastic foam",
    descriptionAr: "إسفنج متكيف مع الجسم بشكل كامل",
  },
  {
    id: "down-feather",
    name: "Duck Down & Feather",
    nameAr: "ريش بط وزغب",
    firmness: "soft",
    description: "Luxurious natural down feather fill",
    descriptionAr: "حشو طبيعي فاخر من ريش البط",
  },
  {
    id: "goose-down",
    name: "Premium Goose Down",
    nameAr: "زغب أوزة فاخر",
    firmness: "soft",
    description: "Ultra-premium Canadian goose down",
    descriptionAr: "زغب أوزة كندية فاخر للغاية",
  },
  {
    id: "pocket-spring",
    name: "Pocket Spring",
    nameAr: "ياي جيبي",
    firmness: "firm",
    description: "Individual pocket springs for longevity",
    descriptionAr: "نوابض جيبية منفردة لعمر طويل",
  },
];

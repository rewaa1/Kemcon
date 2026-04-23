export interface Pattern {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  cssPattern: string;
}

export const patterns: Pattern[] = [
  {
    id: "solid",
    name: "Solid",
    nameAr: "سادة",
    description: "Clean, uninterrupted single colour",
    descriptionAr: "لون واحد نظيف وموحد",
    cssPattern: "none",
  },
  {
    id: "striped",
    name: "Striped",
    nameAr: "مخطط",
    description: "Classic vertical or horizontal stripes",
    descriptionAr: "خطوط كلاسيكية رأسية أو أفقية",
    cssPattern:
      "repeating-linear-gradient(90deg, transparent 0px, transparent 12px, rgba(216,210,200,0.35) 12px, rgba(216,210,200,0.35) 14px)",
  },
  {
    id: "herringbone",
    name: "Herringbone",
    nameAr: "هيرينغبون",
    description: "V-shaped zigzag weave pattern",
    descriptionAr: "نمط نسيج متعرج على شكل حرف V",
    cssPattern:
      "repeating-linear-gradient(45deg, rgba(216,210,200,0.25) 0px, rgba(216,210,200,0.25) 2px, transparent 2px, transparent 10px), repeating-linear-gradient(-45deg, rgba(216,210,200,0.25) 0px, rgba(216,210,200,0.25) 2px, transparent 2px, transparent 10px)",
  },
  {
    id: "checkered",
    name: "Checkered",
    nameAr: "مربعات",
    description: "Classic woven check / plaid",
    descriptionAr: "نمط مربعات منسوجة كلاسيكي",
    cssPattern:
      "repeating-linear-gradient(0deg, rgba(216,210,200,0.3) 0px, rgba(216,210,200,0.3) 2px, transparent 2px, transparent 14px), repeating-linear-gradient(90deg, rgba(216,210,200,0.3) 0px, rgba(216,210,200,0.3) 2px, transparent 2px, transparent 14px)",
  },
  {
    id: "geometric",
    name: "Geometric",
    nameAr: "هندسي",
    description: "Bold modern geometric repeat",
    descriptionAr: "نمط هندسي عصري جريء متكرر",
    cssPattern:
      "repeating-linear-gradient(60deg, rgba(216,210,200,0.2) 0px, rgba(216,210,200,0.2) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-60deg, rgba(216,210,200,0.2) 0px, rgba(216,210,200,0.2) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(0deg, rgba(216,210,200,0.2) 0px, rgba(216,210,200,0.2) 1px, transparent 1px, transparent 10px)",
  },
  {
    id: "damask",
    name: "Damask",
    nameAr: "دمشقي",
    description: "Ornate reversible damask motifs",
    descriptionAr: "نقوش دمشقية زخرفية قابلة للعكس",
    cssPattern:
      "radial-gradient(ellipse at 50% 50%, rgba(216,210,200,0.3) 0%, rgba(216,210,200,0.1) 40%, transparent 60%), radial-gradient(ellipse at 0% 0%, rgba(216,210,200,0.15) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(216,210,200,0.15) 0%, transparent 50%)",
  },
  {
    id: "floral",
    name: "Floral",
    nameAr: "زهري",
    description: "Refined botanical floral print",
    descriptionAr: "نبات وزهور نباتية راقية ودقيقة",
    cssPattern:
      "radial-gradient(circle at 25% 25%, rgba(216,210,200,0.25) 0%, transparent 30%), radial-gradient(circle at 75% 75%, rgba(216,210,200,0.25) 0%, transparent 30%), radial-gradient(circle at 75% 25%, rgba(216,210,200,0.15) 0%, transparent 20%), radial-gradient(circle at 25% 75%, rgba(216,210,200,0.15) 0%, transparent 20%)",
  },
  {
    id: "paisley",
    name: "Paisley",
    nameAr: "بيزلي",
    description: "Intricately curved teardrop motifs",
    descriptionAr: "نقوش دمعة منحنية بتفاصيل دقيقة",
    cssPattern:
      "radial-gradient(ellipse at 40% 30%, rgba(216,210,200,0.3) 0%, transparent 40%), radial-gradient(circle at 60% 70%, rgba(216,210,200,0.2) 0%, transparent 25%), radial-gradient(ellipse at 20% 80%, rgba(216,210,200,0.25) 0%, transparent 35%)",
  },
  {
    id: "abstract",
    name: "Abstract",
    nameAr: "تجريدي",
    description: "Contemporary abstract brushstroke",
    descriptionAr: "تجريدي معاصر بضربات فرشاة عصرية",
    cssPattern:
      "linear-gradient(32deg, rgba(216,210,200,0.2) 0%, transparent 50%), linear-gradient(130deg, rgba(216,210,200,0.15) 0%, transparent 60%), linear-gradient(200deg, rgba(216,210,200,0.2) 0%, transparent 45%)",
  },
  {
    id: "moroccan",
    name: "Moroccan",
    nameAr: "مغربي",
    description: "Intricate Moorish trellis motifs",
    descriptionAr: "نقوش مغربية أندلسية معقدة ورائعة",
    cssPattern:
      "repeating-linear-gradient(0deg, rgba(216,210,200,0.2) 0px, rgba(216,210,200,0.2) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(60deg, rgba(216,210,200,0.2) 0px, rgba(216,210,200,0.2) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(-60deg, rgba(216,210,200,0.2) 0px, rgba(216,210,200,0.2) 1px, transparent 1px, transparent 20px)",
  },
];

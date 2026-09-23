export interface CurtainLayer {
  id: string;
  name: string;
  nameAr: string;
  /** Where the layer sits in the stack — the thing people actually need told. */
  position: string;
  positionAr: string;
  description: string;
  descriptionAr: string;
}

/**
 * The three layers a curtain is built from, inner to outer.
 *
 * Hotels almost always specify all three; a flat often takes one or two. The
 * enquiry form asks which layers rather than "how many", because the count is
 * just the length of the answer and the names are what the workshop needs.
 */
export const curtainLayers: CurtainLayer[] = [
  {
    id: "sheer",
    name: "Sheer Layer (Voile)",
    nameAr: "الطبقة الشفافة (الفوال)",
    position: "Innermost — closest to the glass",
    positionAr: "الطبقة الداخلية — الأقرب إلى الزجاج",
    description:
      "Lets in soft daylight while providing daytime privacy.",
    descriptionAr:
      "تسمح بدخول ضوء نهاري ناعم مع توفير خصوصية أثناء النهار.",
  },
  {
    id: "drapery",
    name: "Decorative / Drapery Layer",
    nameAr: "الطبقة الديكورية (الدرابيه)",
    position: "Middle — the fabric the room sees",
    positionAr: "الطبقة الوسطى — القماش الظاهر في الغرفة",
    description:
      "Ornamental fabric — linen, velvet, or a patterned weave — that carries the room's aesthetic.",
    descriptionAr:
      "قماش زخرفي — كتان أو مخمل أو نسيج منقوش — يمنح الغرفة طابعها الجمالي.",
  },
  {
    id: "blackout",
    name: "Blackout Layer (Lining)",
    nameAr: "طبقة العتمة (البطانة)",
    position: "Outermost / back — the heavy lining",
    positionAr: "الطبقة الخارجية أو الخلفية — البطانة الثقيلة",
    description:
      "Heavy, tightly woven material for complete light blocking, thermal insulation, and sound dampening.",
    descriptionAr:
      "مادة ثقيلة محكمة النسج لحجب الضوء تمامًا، والعزل الحراري، وتخفيف الصوت.",
  },
];

export const curtainLayerIds = curtainLayers.map((l) => l.id);

export function curtainLayerById(id: string): CurtainLayer | undefined {
  return curtainLayers.find((l) => l.id === id);
}

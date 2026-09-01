"use client";

import { Layers, Ruler, Sliders } from "lucide-react";
import { curtainLayers } from "@/data/curtainLayers";
import { bedSizes, bedSizeById } from "@/data/bedSizes";
import { frameMaterials, frameFinishes, fillingOptions } from "@/data/frames";
import { CurtainSizeRows, emptySizeRow, usableSizes } from "./CurtainSizeRows";
import {
  ChipGroup,
  FieldLabel,
  OptionCard,
  OptionCardGrid,
  SelectableRow,
  Stepper,
  inputClass,
} from "./fields";
import { fabricSection, notesSection, photosSection, treatmentsSection } from "./sharedSections";
import type { CategorySpec, EnquirySection } from "./types";
import type { CategoryType } from "@/types/configurator";

/**
 * What makes each category's form different.
 *
 * Everything shared — quantity, property, contact, treatments, fabric, photos,
 * notes — lives in `ProductEnquiryForm`. A spec adds only the one required
 * product question and the optional sections that make sense for that product.
 *
 * Chairs and sofas are deliberately built from one factory: they are the same
 * enquiry with different nouns, and the two drifting apart is exactly what
 * copy-pasting them would eventually cause.
 */

// ── Curtains ────────────────────────────────────────────────────────────────

const curtainMeasurementsSection: EnquirySection = {
  key: "sizes",
  icon: Ruler,
  title: { en: "Measurements", ar: "المقاسات" },
  description: {
    en: "Window sizes, or ask us to come and measure",
    ar: "مقاسات النوافذ، أو اطلب منا الحضور للقياس",
  },
  summary: ({ config }) => {
    if (config.requestMeasurement) {
      return { en: "Site visit requested", ar: "زيارة للقياس" };
    }
    const count = usableSizes(config.curtainSizes).length;
    return count
      ? { en: `${count} window${count === 1 ? "" : "s"}`, ar: `${count} نافذة` }
      : null;
  },
  hasData: (item) => !!(item.curtainSizes?.length || item.requestMeasurement),
  onOpen: ({ config }) =>
    config.curtainSizes.length === 0 ? { curtainSizes: [emptySizeRow()] } : undefined,
  render: (ctx) => <CurtainSizeRows {...ctx} />,
};

const curtainControlSection: EnquirySection = {
  key: "control",
  icon: Sliders,
  title: { en: "How they open", ar: "طريقة الفتح" },
  description: {
    en: "Drawn by hand, or on a motor and remote",
    ar: "بالسحب اليدوي، أو بمحرك وريموت",
  },
  summary: ({ config }) =>
    config.curtainControl === "manual"
      ? { en: "Manual", ar: "يدوي" }
      : config.curtainControl === "remote"
        ? { en: "Remote-controlled", ar: "بريموت" }
        : null,
  hasData: (item) => !!item.curtainControl,
  render: ({ config, update, isAr }) => (
    <OptionCardGrid>
      <OptionCard
        selected={config.curtainControl === "manual"}
        onClick={() =>
          update({ curtainControl: config.curtainControl === "manual" ? null : "manual" })
        }
        title={isAr ? "يدوي" : "Manual"}
        description={isAr ? "تُسحب باليد أو بعصا أو حبل." : "Drawn by hand, or with a wand or cord."}
        isAr={isAr}
      />
      <OptionCard
        selected={config.curtainControl === "remote"}
        onClick={() =>
          update({ curtainControl: config.curtainControl === "remote" ? null : "remote" })
        }
        title={isAr ? "بريموت" : "Remote-controlled"}
        description={
          isAr ? "سكة بمحرك، تعمل بريموت أو مفتاح حائط." : "Motorised track, on a remote or a wall switch."
        }
        isAr={isAr}
      />
    </OptionCardGrid>
  ),
};

const curtainsSpec: CategorySpec = {
  category: "curtains",
  slug: "curtains",
  eyebrow: { en: "Curtains", ar: "ستائر" },
  requiredHeading: { en: "Your Curtains", ar: "ستائرك" },
  title: { en: "Request a curtain quote", ar: "اطلب عرض سعر للستائر" },
  editTitle: { en: "Edit your curtains", ar: "عدّل ستائرك" },
  intro: {
    en: "Three questions about your project and how to reach you — that's all we need. Add measurements, fabric and treatments if you know them, or leave them to us.",
    ar: "ثلاثة أسئلة عن مشروعك وبيانات التواصل — هذا كل المطلوب. أضف المقاسات والقماش والمعالجات إن كنت تعرفها، أو اتركها لنا.",
  },
  unit: { one: { en: "panel", ar: "لوحة" }, many: { en: "panels", ar: "لوحة" } },
  quantityLabel: {
    en: "How many curtains do you need?",
    ar: "كم عدد الستائر المطلوبة؟",
  },
  required: {
    validate: (config) =>
      config.curtainLayerIds.length === 0
        ? {
            en: "* Choose at least one curtain layer to send",
            ar: "* اختر طبقة واحدة على الأقل لإتمام الإرسال",
          }
        : null,
    render: ({ config, update, isAr }) => {
      const selected = config.curtainLayerIds;
      const toggle = (id: string) =>
        update({
          curtainLayerIds: selected.includes(id)
            ? selected.filter((l) => l !== id)
            : // Keep the canonical inner-to-outer order however they are clicked.
              curtainLayers
                .filter((l) => l.id === id || selected.includes(l.id))
                .map((l) => l.id),
        });

      return (
        <div className="space-y-3">
          <FieldLabel
            isAr={isAr}
            hint={
              isAr
                ? "معظم الفنادق تستخدم الطبقات الثلاث. اختر ما تحتاجه."
                : "Most hotels use all three. Pick the ones you need."
            }
            action={
              selected.length < curtainLayers.length ? (
                <button
                  type="button"
                  onClick={() => update({ curtainLayerIds: curtainLayers.map((l) => l.id) })}
                  className="flex-shrink-0 text-[10px] uppercase tracking-[0.18em] font-semibold text-[var(--color-accent)] hover:underline underline-offset-4"
                >
                  {isAr ? "اختر الثلاث" : "Select all three"}
                </button>
              ) : undefined
            }
          >
            {isAr ? "كم عدد الطبقات؟" : "How many layers?"}
          </FieldLabel>

          <div className="space-y-2.5">
            {curtainLayers.map((layer) => (
              <SelectableRow
                key={layer.id}
                selected={selected.includes(layer.id)}
                onToggle={() => toggle(layer.id)}
                title={isAr ? layer.nameAr : layer.name}
                sub={isAr ? layer.positionAr : layer.position}
                description={isAr ? layer.descriptionAr : layer.description}
                isAr={isAr}
                testId="curtain-layer"
              />
            ))}
          </div>

          {selected.length > 0 && (
            <p
              className={`flex items-center gap-1.5 text-xs text-[var(--color-accent)] ${isAr ? "flex-row-reverse text-right" : ""}`}
            >
              <Layers size={13} strokeWidth={1.75} />
              {isAr
                ? `${selected.length} من ${curtainLayers.length} طبقات`
                : `${selected.length} of ${curtainLayers.length} layers selected`}
            </p>
          )}
        </div>
      );
    },
  },
  optional: [curtainMeasurementsSection, curtainControlSection],
  offersFabric: true,
};

// ── Chairs and sofas ────────────────────────────────────────────────────────

const finishSection: EnquirySection = {
  key: "finish",
  icon: Sliders,
  title: { en: "Frame finish", ar: "تشطيب الهيكل" },
  description: { en: "How the wood is stained or painted", ar: "طريقة صبغ الخشب أو طلائه" },
  summary: ({ config }) => {
    const finish = frameFinishes.find((f) => f.id === config.frameFinishId);
    if (!finish) return null;
    return { en: finish.name, ar: finish.nameAr };
  },
  hasData: (item) => !!item.frameFinishId,
  render: ({ config, update, isAr }) => (
    <ChipGroup
      isAr={isAr}
      value={config.frameFinishId}
      onChange={(v) => update({ frameFinishId: v })}
      options={frameFinishes.map((f) => ({
        value: f.id,
        label: isAr ? f.nameAr : f.name,
        hex: f.hex,
      }))}
    />
  ),
};

const fillingSection: EnquirySection = {
  key: "filling",
  icon: Layers,
  title: { en: "Filling", ar: "الحشو" },
  description: { en: "How soft or firm it should sit", ar: "درجة النعومة أو الصلابة" },
  summary: ({ config }) => {
    const filling = fillingOptions.find((f) => f.id === config.fillingId);
    if (!filling) return null;
    return { en: filling.name, ar: filling.nameAr };
  },
  hasData: (item) => !!item.fillingId,
  render: ({ config, update, isAr }) => (
    <OptionCardGrid>
      {fillingOptions.map((filling) => (
        <OptionCard
          key={filling.id}
          selected={config.fillingId === filling.id}
          onClick={() =>
            update({ fillingId: config.fillingId === filling.id ? null : filling.id })
          }
          title={isAr ? filling.nameAr : filling.name}
          description={isAr ? filling.descriptionAr : filling.description}
          isAr={isAr}
        />
      ))}
    </OptionCardGrid>
  ),
};

const cushionsSection: EnquirySection = {
  key: "cushions",
  icon: Layers,
  title: { en: "Scatter cushions", ar: "وسائد إضافية" },
  description: { en: "Matching or contrast, and how many", ar: "بنفس القماش أو مختلف، وكم عددها" },
  summary: ({ config }) => {
    if (config.cushionAdd === false) return { en: "None", ar: "بدون" };
    if (config.cushionAdd !== true) return null;
    const qty = config.cushionQty ?? 0;
    return { en: `${qty} per piece`, ar: `${qty} لكل قطعة` };
  },
  hasData: (item) => item.cushionAdd !== null,
  render: ({ config, update, isAr }) => (
    <div className="space-y-4">
      <OptionCardGrid>
        <OptionCard
          selected={config.cushionAdd === true}
          onClick={() => update({ cushionAdd: true, cushionQty: config.cushionQty ?? 2 })}
          title={isAr ? "نعم، أضف وسائد" : "Yes, add cushions"}
          isAr={isAr}
        />
        <OptionCard
          selected={config.cushionAdd === false}
          onClick={() =>
            update({ cushionAdd: false, cushionQty: null, cushionSameFabric: null })
          }
          title={isAr ? "لا، بدون وسائد" : "No cushions"}
          isAr={isAr}
        />
      </OptionCardGrid>

      {config.cushionAdd === true && (
        <div className="space-y-4">
          <div className="space-y-2">
            <FieldLabel isAr={isAr}>{isAr ? "كم وسادة لكل قطعة؟" : "How many per piece?"}</FieldLabel>
            <Stepper
              isAr={isAr}
              value={config.cushionQty ?? 2}
              onChange={(n) => update({ cushionQty: n })}
              decreaseLabel={isAr ? "أنقص عدد الوسائد" : "Decrease cushions"}
              increaseLabel={isAr ? "زد عدد الوسائد" : "Increase cushions"}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel isAr={isAr}>{isAr ? "القماش" : "Cushion fabric"}</FieldLabel>
            <OptionCardGrid>
              <OptionCard
                selected={config.cushionSameFabric === true}
                onClick={() => update({ cushionSameFabric: true })}
                title={isAr ? "نفس قماش القطعة" : "Same as the piece"}
                isAr={isAr}
              />
              <OptionCard
                selected={config.cushionSameFabric === false}
                onClick={() => update({ cushionSameFabric: false })}
                title={isAr ? "قماش مختلف — يُحدَّد لاحقًا" : "A contrast — decide later"}
                isAr={isAr}
              />
            </OptionCardGrid>
          </div>
        </div>
      )}
    </div>
  ),
};

/**
 * Chairs and sofas differ only in wording and icon, so they are one factory
 * rather than two near-identical specs waiting to drift.
 */
function seatingSpec(category: Extract<CategoryType, "chairs" | "sofas">): CategorySpec {
  const isChairs = category === "chairs";
  const noun = {
    en: isChairs ? "chairs" : "sofas",
    ar: isChairs ? "الكراسي" : "الأرائك",
  };

  return {
    category,
    slug: category,
    eyebrow: { en: isChairs ? "Chairs" : "Sofas", ar: isChairs ? "كراسي" : "أرائك" },
    requiredHeading: {
      en: isChairs ? "Your Chairs" : "Your Sofas",
      ar: isChairs ? "كراسيك" : "أرائكك",
    },
    title: {
      en: isChairs ? "Request a chair quote" : "Request a sofa quote",
      ar: isChairs ? "اطلب عرض سعر للكراسي" : "اطلب عرض سعر للأرائك",
    },
    editTitle: {
      en: isChairs ? "Edit your chairs" : "Edit your sofas",
      ar: isChairs ? "عدّل كراسيك" : "عدّل أرائكك",
    },
    intro: {
      en: `Tell us how many ${noun.en} you need, what you're furnishing, and the frame. Finish, filling, fabric and cushions are yours to add now or settle with our team later.`,
      ar: `أخبرنا بعدد ${noun.ar} المطلوبة، وما الذي تؤثثه، ونوع الهيكل. أما التشطيب والحشو والقماش والوسائد فيمكنك تحديدها الآن أو مع فريقنا لاحقًا.`,
    },
    unit: { one: { en: "piece", ar: "قطعة" }, many: { en: "pieces", ar: "قطعة" } },
    quantityLabel: {
      en: isChairs ? "How many chairs do you need?" : "How many sofas do you need?",
      ar: isChairs ? "كم عدد الكراسي المطلوبة؟" : "كم عدد الأرائك المطلوبة؟",
    },
    required: {
      validate: (config) =>
        config.frameMaterialId
          ? null
          : {
              en: "* Choose a frame material to send",
              ar: "* اختر خامة الهيكل لإتمام الإرسال",
            },
      render: ({ config, update, isAr }) => (
        <div className="space-y-3">
          <FieldLabel
            isAr={isAr}
            hint={
              isAr
                ? "الهيكل يحدد التكلفة والمتانة. إن لم تكن متأكدًا، اختر الأقرب وسنراجعه معك."
                : "The frame drives cost and durability. If you're unsure, pick the closest and we'll confirm it with you."
            }
          >
            {isAr ? "خامة الهيكل" : "Frame material"}
          </FieldLabel>
          <OptionCardGrid>
            {frameMaterials.map((material) => (
              <OptionCard
                key={material.id}
                selected={config.frameMaterialId === material.id}
                onClick={() =>
                  update({
                    frameMaterialId:
                      config.frameMaterialId === material.id ? null : material.id,
                  })
                }
                title={isAr ? material.nameAr : material.name}
                description={isAr ? material.descriptionAr : material.description}
                isAr={isAr}
                testId="frame-material"
              />
            ))}
          </OptionCardGrid>
        </div>
      ),
    },
    optional: [finishSection, fillingSection, cushionsSection],
    offersFabric: true,
  };
}

// ── Bed covers ──────────────────────────────────────────────────────────────

const pillowsSection: EnquirySection = {
  key: "pillows",
  icon: Layers,
  title: { en: "Matching pillows", ar: "مخدات مطابقة" },
  description: { en: "Add pillows in the same fabric", ar: "أضف مخدات بنفس القماش" },
  summary: ({ config }) => {
    if (config.pillowAdd === false) return { en: "None", ar: "بدون" };
    if (config.pillowAdd !== true) return null;
    const parts = [config.pillowSize, config.pillowFill].filter(Boolean).join(" · ");
    return parts ? { en: parts, ar: parts } : { en: "Yes", ar: "نعم" };
  },
  hasData: (item) => item.pillowAdd !== null,
  render: ({ config, update, isAr }) => (
    <div className="space-y-4">
      <OptionCardGrid>
        <OptionCard
          selected={config.pillowAdd === true}
          onClick={() => update({ pillowAdd: true })}
          title={isAr ? "نعم، أضف مخدات" : "Yes, add pillows"}
          isAr={isAr}
        />
        <OptionCard
          selected={config.pillowAdd === false}
          onClick={() => update({ pillowAdd: false, pillowFill: null, pillowSize: null })}
          title={isAr ? "لا، بدون مخدات" : "No pillows"}
          isAr={isAr}
        />
      </OptionCardGrid>

      {config.pillowAdd === true && (
        <div className="space-y-4">
          <div className="space-y-2">
            <FieldLabel isAr={isAr}>{isAr ? "المقاس" : "Pillow size"}</FieldLabel>
            <ChipGroup
              isAr={isAr}
              value={config.pillowSize}
              onChange={(v) => update({ pillowSize: v })}
              options={[
                { value: "standard", label: isAr ? "قياسي" : "Standard", sub: "50 × 75 cm" },
                { value: "queen", label: isAr ? "كوين" : "Queen", sub: "50 × 90 cm" },
                { value: "king", label: isAr ? "كينج" : "King", sub: "50 × 100 cm" },
              ]}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel isAr={isAr}>{isAr ? "الحشو" : "Fill"}</FieldLabel>
            <ChipGroup
              isAr={isAr}
              value={config.pillowFill}
              onChange={(v) => update({ pillowFill: v })}
              options={[
                { value: "cotton", label: isAr ? "قطن" : "Cotton" },
                { value: "polyester", label: isAr ? "بوليستر" : "Polyester" },
                { value: "down", label: isAr ? "ريش وزغب" : "Down & feather" },
                { value: "memory", label: isAr ? "إسفنج ذاكرة" : "Memory foam" },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  ),
};

const bedCoversSpec: CategorySpec = {
  category: "bed-covers",
  slug: "bed-covers",
  eyebrow: { en: "Bed Covers", ar: "مفارش سرير" },
  requiredHeading: { en: "Your Bed Covers", ar: "مفارشك" },
  title: { en: "Request a bed cover quote", ar: "اطلب عرض سعر لمفارش السرير" },
  editTitle: { en: "Edit your bed covers", ar: "عدّل مفارش سريرك" },
  intro: {
    en: "Tell us how many sets you need, what you're furnishing, and the bed size. Fabric, treatments and matching pillows are yours to add now or settle with our team later.",
    ar: "أخبرنا بعدد الأطقم المطلوبة، وما الذي تؤثثه، ومقاس السرير. أما القماش والمعالجات والمخدات المطابقة فيمكنك تحديدها الآن أو مع فريقنا لاحقًا.",
  },
  unit: { one: { en: "set", ar: "طقم" }, many: { en: "sets", ar: "طقم" } },
  quantityLabel: {
    en: "How many bed cover sets do you need?",
    ar: "كم عدد أطقم المفارش المطلوبة؟",
  },
  required: {
    validate: (config) =>
      config.bedSize
        ? null
        : { en: "* Choose a bed size to send", ar: "* اختر مقاس السرير لإتمام الإرسال" },
    render: ({ config, update, isAr }) => {
      const bed = config.bedSize ? bedSizeById(config.bedSize) : undefined;
      return (
        <div className="space-y-3">
          <FieldLabel
            isAr={isAr}
            hint={
              isAr
                ? "المقاس هو الشيء الوحيد الذي لا يمكن تحديده لاحقًا — القماش يمكن."
                : "The size is the one thing that can't be settled later — the fabric can."
            }
          >
            {isAr ? "مقاس السرير" : "Bed size"}
          </FieldLabel>
          <ChipGroup
            isAr={isAr}
            testId="bed-size"
            value={config.bedSize}
            onChange={(v) => update({ bedSize: v })}
            options={bedSizes.map((size) => ({
              value: size.id,
              label: isAr ? size.nameAr : size.name,
              sub: size.dimensions,
            }))}
          />
          {bed && (
            <p className={`text-xs text-[var(--color-accent)] ${isAr ? "text-right" : ""}`}>
              {isAr
                ? `مقاس المرتبة ${bed.dimensions} — يُضاف السدل والطي في الورشة.`
                : `Mattress ${bed.dimensions} — drop and tuck are added in the workshop.`}
            </p>
          )}
        </div>
      );
    },
  },
  optional: [pillowsSection],
  offersFabric: true,
};

// ── Custom ──────────────────────────────────────────────────────────────────

const customSpec: CategorySpec = {
  category: "custom",
  slug: "custom",
  eyebrow: { en: "Something else", ar: "شيء آخر" },
  requiredHeading: { en: "What You Need", ar: "ما تحتاجه" },
  title: { en: "Tell us what you need", ar: "أخبرنا بما تحتاجه" },
  editTitle: { en: "Edit your request", ar: "عدّل طلبك" },
  intro: {
    en: "Tablecloths, cushions, headboards, wall panels — if it is made of fabric, our workshop has probably made it. Describe it and we'll come back with what's possible.",
    ar: "مفارش طاولات، وسائد، ظهور أسرّة، ألواح جدارية — إن كان مصنوعًا من القماش فغالبًا صنعته ورشتنا. صف ما تريد وسنعود إليك بما يمكن تنفيذه.",
  },
  unit: { one: { en: "piece", ar: "قطعة" }, many: { en: "pieces", ar: "قطعة" } },
  quantityLabel: { en: "How many do you need?", ar: "كم العدد المطلوب؟" },
  required: {
    validate: (config) =>
      config.customDescription.trim().length > 10
        ? null
        : {
            en: "* Describe what you need in a sentence or two to send",
            ar: "* صف ما تحتاجه في جملة أو جملتين لإتمام الإرسال",
          },
    render: ({ config, update, isAr }) => (
      <div className="space-y-2">
        <FieldLabel
          isAr={isAr}
          htmlFor="cq-custom"
          hint={
            isAr
              ? "كل ما تعرفه يساعد: المقاسات، الخامة، أين ستُستخدم."
              : "Anything you know helps: sizes, material, where it will be used."
          }
        >
          {isAr ? "ما الذي تريد صنعه؟" : "What would you like made?"}
        </FieldLabel>
        <textarea
          id="cq-custom"
          rows={5}
          value={config.customDescription}
          onChange={(e) => update({ customDescription: e.target.value })}
          className={`${inputClass(isAr)} resize-none`}
          placeholder={
            isAr
              ? "مثال: 40 مفرش طاولة مستدير قطر 180 سم بكتان أبيض، لقاعة احتفالات."
              : "e.g. 40 round tablecloths, 180 cm diameter, white linen, for a banqueting hall."
          }
        />
      </div>
    ),
  },
  optional: [],
  offersFabric: false,
};

// ── Registry ────────────────────────────────────────────────────────────────

const SPECS: Record<CategoryType, CategorySpec> = {
  curtains: curtainsSpec,
  chairs: seatingSpec("chairs"),
  sofas: seatingSpec("sofas"),
  "bed-covers": bedCoversSpec,
  custom: customSpec,
};

/**
 * The optional sections a category offers, in order: its own first, then the
 * shared ones. Fabric is skipped for custom, where nothing has been chosen to
 * put a fabric on yet.
 */
export function sectionsFor(spec: CategorySpec): EnquirySection[] {
  return [
    ...spec.optional,
    treatmentsSection,
    ...(spec.offersFabric ? [fabricSection] : []),
    photosSection,
    notesSection,
  ];
}

export function specFor(category: CategoryType): CategorySpec {
  return SPECS[category];
}

import type { CategoryType } from "@/types/configurator";
import type { Bilingual } from "./types";
import { frameMaterials, frameFinishes, fillingOptions } from "@/data/frames";
import { bedSizes } from "@/data/bedSizes";

/**
 * The editorial body copy for the service pages, as data.
 *
 * Curtains proved the shape: an `<h1>` that names the service, a short intro,
 * then what the service is, what it is built from, and who it is for — all of
 * it server-rendered so a crawler and an answer engine can read it without
 * running the enquiry form. This holds the same content for the other four.
 *
 * Data rather than four copies of a component, because the four pages differ
 * only in what they say. Curtains keeps its own bespoke file: its middle
 * section renders `curtainLayers` directly and there was no reason to disturb
 * a page that is already shipped and verified.
 *
 * **Every claim here is traceable to something already in the repository.**
 * Counts are read off the data files below rather than typed in, so they
 * cannot drift when a frame or a filling is added. The rest comes from
 * `productSeo`, the enquiry specs, `propertyTypes`, and the About/Why copy —
 * the factory, the in-house team, treatments to international standards,
 * samples on request. Nothing is invented: no certifications, no client names,
 * no capacities, no numbers that are not already stated on the site.
 */

/** One row in the "what it is built from" list. `body` is optional — a size table needs none. */
export interface ServiceSpecItem {
  title: Bilingual;
  /** Small accent line beside the title. */
  meta?: Bilingual;
  body?: Bilingual;
}

export interface ServiceAudience {
  title: Bilingual;
  body: Bilingual;
}

/** A related destination, as a path under `/{locale}`. */
export interface ServiceLink {
  path: string;
  label: Bilingual;
}

export interface ServiceContentData {
  serviceHeading: Bilingual;
  serviceBody: Bilingual[];
  specLabel: Bilingual;
  specHeading: Bilingual;
  specIntro?: Bilingual;
  specs: ServiceSpecItem[];
  audienceHeading: Bilingual;
  audiences: ServiceAudience[];
  relatedIntro: Bilingual;
  related: ServiceLink[];
  /**
   * The call to action over the enquiry form. These are the old `<h1>` and
   * intro from before the headings were rewritten — a quote request is still
   * exactly what the form is for, it just belongs over the form rather than at
   * the top of the page.
   */
  enquiryHeading: Bilingual;
  enquiryIntro: Bilingual;
}

const FRAME_COUNT = frameMaterials.length;
const FINISH_COUNT = frameFinishes.length;
const FILLING_COUNT = fillingOptions.length;

/** Shared by both seating pages — the same four groups, worded for the piece. */
const designerAudience: ServiceAudience = {
  title: { en: "Interior designers & architects", ar: "مصممو الديكور والمعماريون" },
  body: {
    en: "Work to a specification you have already drawn up, or develop one with us from scratch — including samples and colour swatches on request.",
    ar: "ننفّذ وفق مواصفات جاهزة لديكم، أو نضعها معكم من البداية — بما في ذلك توفير العينات وخرائط الألوان عند الطلب.",
  },
};

export const serviceContent: Record<
  Exclude<CategoryType, "curtains">,
  ServiceContentData
> = {
  // ── Sofas ─────────────────────────────────────────────────────────────────
  sofas: {
    serviceHeading: { en: "Built from the frame up", ar: "من الهيكل حتى القماش" },
    serviceBody: [
      {
        en: "A Kemcon sofa is made to order rather than chosen from a range. The frame is built first, filled to the firmness you ask for, and upholstered in the fabric you pick — all of it in our own factory, by the team that also handles installation.",
        ar: "تُصنع أريكة كيمكون حسب الطلب، لا تُختار من مجموعة جاهزة. يُبنى الهيكل أولًا، ثم يُحشى بالصلابة التي تطلبها، ويُنجَّد بالقماش الذي تختاره — كل ذلك في مصنعنا الخاص، وعلى يد الفريق نفسه الذي يتولى التركيب.",
      },
      {
        en: "That matters most when a piece has to sit in a room that already exists — a lobby with a fixed sightline, a lounge that has to seat a set number of people, a living room with one wall that will take a sofa and no other. Dimensions, proportion and fabric get settled together rather than traded off one against another.",
        ar: "ويظهر أثر ذلك أوضح ما يكون حين يجب أن تستقر القطعة في مساحة قائمة بالفعل — بهو بزاوية رؤية محددة، أو صالة يجب أن تتسع لعدد معيّن من الجالسين، أو غرفة معيشة لا يحتمل سوى جدار واحد فيها أريكة. تُحدَّد الأبعاد والتناسب والقماش معًا، لا على حساب بعضها.",
      },
    ],
    specLabel: { en: "What it is made of", ar: "مما تُصنع" },
    specHeading: { en: "Three decisions, taken separately", ar: "ثلاثة قرارات تُتخذ كل على حدة" },
    specIntro: {
      en: "Frame, filling and fabric are specified one at a time, so a firm seat is not tied to a particular wood and a favourite cloth is not tied to a particular shape.",
      ar: "يُحدَّد الهيكل والحشو والقماش كل على حدة، فلا يرتبط المقعد الصلب بنوع خشب بعينه، ولا يرتبط القماش المفضّل بشكل بعينه.",
    },
    specs: [
      {
        title: { en: "Frame", ar: "الهيكل" },
        meta: {
          en: `${FRAME_COUNT} materials · ${FINISH_COUNT} finishes`,
          ar: `${FRAME_COUNT} خامة · ${FINISH_COUNT} تشطيب`,
        },
        body: {
          en: "Hardwoods and metals — oak, walnut, mahogany and teak through to brushed steel and antique bronze — in natural, stained, painted, matte or high-gloss finishes.",
          ar: "أخشاب صلبة ومعادن — من البلوط والجوز والماهوجني والساج إلى الفولاذ المصقول والبرونز العتيق — بتشطيبات طبيعية أو مصبوغة أو مطلية أو مطفية أو لامعة.",
        },
      },
      {
        title: { en: "Filling", ar: "الحشو" },
        meta: { en: "soft to firm", ar: "من الناعم إلى الصلب" },
        body: {
          en: `${FILLING_COUNT} fills, from soft and memory foam to duck down, goose down and pocket springs — chosen by how the seat should feel rather than by what it costs.`,
          ar: `${FILLING_COUNT} أنواع حشو، من الإسفنج الناعم وإسفنج الذاكرة إلى ريش البط وزغب الأوز والنوابض الجيبية — تُختار وفق الإحساس المطلوب للمقعد لا وفق سعره.`,
        },
      },
      {
        title: { en: "Upholstery", ar: "التنجيد" },
        meta: { en: "fabric, colour, pattern", ar: "قماش ولون ونمط" },
        body: {
          en: "Any fabric in the catalogue, with scatter cushions in the same cloth or a deliberate contrast, and treatments applied where the setting calls for them.",
          ar: "أي قماش في الكتالوج، مع وسائد إضافية بنفس القماش أو بتباين مقصود، ومعالجات تُضاف حين يستدعيها المكان.",
        },
      },
    ],
    audienceHeading: {
      en: "Lobbies, workplaces and living rooms",
      ar: "بهوات ومساحات عمل وغرف معيشة",
    },
    audiences: [
      {
        title: { en: "Hotels & hospitality", ar: "الفنادق والضيافة" },
        body: {
          en: "Lobbies, lounges and suites — specified once and repeated across a floor or a whole property, with fire-retardant finishing where venue codes call for it.",
          ar: "البهوات والصالات والأجنحة — تُحدَّد مواصفاتها مرة واحدة وتُنفَّذ على طابق كامل أو على العقار بأكمله، مع معالجة مقاومة للحريق حين تشترطها أكواد المنشآت.",
        },
      },
      {
        title: { en: "Offices & commercial spaces", ar: "المكاتب والمساحات التجارية" },
        body: {
          en: "Receptions, waiting areas, restaurants and venues, where seating is used hard all day and has to keep its shape.",
          ar: "مناطق الاستقبال والانتظار والمطاعم والقاعات، حيث تُستخدم المقاعد بكثافة طوال اليوم وعليها أن تحافظ على شكلها.",
        },
      },
      {
        title: { en: "Homes", ar: "المنازل" },
        body: {
          en: "Apartments and villas — one piece for a single room, or a full set, from the same workshop as our hospitality work.",
          ar: "الشقق والفيلات — قطعة واحدة لغرفة بعينها أو طقم كامل، من الورشة نفسها التي ننفذ بها أعمال الضيافة.",
        },
      },
      designerAudience,
    ],
    relatedIntro: { en: "Related", ar: "ذات صلة" },
    related: [
      { path: "/services/chairs", label: { en: "Chairs", ar: "الكراسي" } },
      { path: "/services/design-plan", label: { en: "Design & planning", ar: "التصميم والتخطيط" } },
      {
        path: "/services/mass-production",
        label: { en: "Mass production", ar: "الإنتاج بكميات كبيرة" },
      },
      { path: "/contact", label: { en: "Talk to our team", ar: "تحدّث إلى فريقنا" } },
    ],
    enquiryHeading: { en: "Request a sofa quote", ar: "اطلب عرض سعر للأرائك" },
    enquiryIntro: {
      en: "Tell us how many sofas you need, what you're furnishing, and the frame. Finish, filling, fabric and cushions are yours to add now or settle with our team later.",
      ar: "أخبرنا بعدد الأرائك المطلوبة، وما الذي تؤثثه، ونوع الهيكل. أما التشطيب والحشو والقماش والوسائد فيمكنك تحديدها الآن أو مع فريقنا لاحقًا.",
    },
  },

  // ── Chairs ────────────────────────────────────────────────────────────────
  chairs: {
    serviceHeading: { en: "Seating, specified piece by piece", ar: "مقاعد تُحدَّد قطعةً قطعة" },
    serviceBody: [
      {
        en: "Kemcon makes chairs to order — dining and banqueting seating, desk and meeting chairs, occasional and accent pieces. Frame, finish, filling and upholstery are each chosen for the room the chair is going into, and the whole piece is built in our own factory.",
        ar: "تصنع كيمكون الكراسي حسب الطلب — كراسي الطعام والولائم، وكراسي المكاتب والاجتماعات، والقطع الجانبية والمميزة. يُختار الهيكل والتشطيب والحشو والتنجيد لكل غرفة على حدة، وتُصنع القطعة بالكامل في مصنعنا.",
      },
      {
        en: "Hospitality work usually means repetition: the same chair, to the same specification, across a restaurant or a banqueting hall. Frame material and filling are picked for how much use the seat will take, and the fabric can be finished to meet what the venue requires.",
        ar: "تعني أعمال الضيافة عادةً التكرار: الكرسي نفسه، بالمواصفات نفسها، في مطعم كامل أو قاعة ولائم. تُختار خامة الهيكل والحشو وفق حجم الاستخدام المتوقع، ويمكن تشطيب القماش بما يوافق متطلبات المكان.",
      },
    ],
    specLabel: { en: "What it is made of", ar: "مما تُصنع" },
    specHeading: { en: "Specified for the room, not the catalogue", ar: "تُحدَّد للغرفة لا للكتالوج" },
    specs: [
      {
        title: { en: "Frame & finish", ar: "الهيكل والتشطيب" },
        meta: {
          en: `${FRAME_COUNT} materials · ${FINISH_COUNT} finishes`,
          ar: `${FRAME_COUNT} خامة · ${FINISH_COUNT} تشطيب`,
        },
        body: {
          en: "Hardwood or metal — oak, walnut, beech and teak, or brushed and matte black steel, brass and antique bronze — finished natural, stained, painted or lacquered.",
          ar: "خشب صلب أو معدن — البلوط والجوز والزان والساج، أو الفولاذ المصقول والأسود المطفي والنحاس والبرونز العتيق — بتشطيب طبيعي أو مصبوغ أو مطلي أو لامع.",
        },
      },
      {
        title: { en: "Filling & firmness", ar: "الحشو والصلابة" },
        meta: { en: "soft to firm", ar: "من الناعم إلى الصلب" },
        body: {
          en: `${FILLING_COUNT} fills across soft, medium and firm — including memory foam for contour and pocket springs where a seat has to last.`,
          ar: `${FILLING_COUNT} أنواع حشو بين الناعم والمتوسط والصلب — منها إسفنج الذاكرة المتكيف مع الجسم، والنوابض الجيبية حين يلزم أن يدوم المقعد طويلًا.`,
        },
      },
      {
        title: { en: "Upholstery & treatments", ar: "التنجيد والمعالجات" },
        meta: { en: "to international standards", ar: "وفق المعايير الدولية" },
        body: {
          en: "Any fabric in the catalogue, finished on request with stain protection, fire-retardant or anti-fungal and antibacterial treatments.",
          ar: "أي قماش في الكتالوج، مع إمكانية تشطيبه عند الطلب بالحماية من البقع أو مقاومة الحريق أو المعالجة المضادة للفطريات والبكتيريا.",
        },
      },
    ],
    audienceHeading: {
      en: "Restaurants, meeting rooms and dining tables",
      ar: "مطاعم وقاعات اجتماعات وموائد طعام",
    },
    audiences: [
      {
        title: { en: "Hotels & hospitality", ar: "الفنادق والضيافة" },
        body: {
          en: "Restaurants, banqueting halls and guest rooms, where dozens of identical chairs have to match each other and the room they sit in.",
          ar: "المطاعم وقاعات الولائم وغرف النزلاء، حيث يجب أن تتطابق عشرات الكراسي فيما بينها ومع الغرفة التي توضع فيها.",
        },
      },
      {
        title: { en: "Offices & commercial spaces", ar: "المكاتب والمساحات التجارية" },
        body: {
          en: "Meeting rooms, receptions, clinics and schools — settings where a hygienic finish matters as much as the upholstery.",
          ar: "قاعات الاجتماعات ومناطق الاستقبال والعيادات والمدارس — أماكن يوازي فيها التشطيب الصحي أهميةَ التنجيد نفسه.",
        },
      },
      {
        title: { en: "Homes", ar: "المنازل" },
        body: {
          en: "Dining sets, desk chairs and accent pieces for apartments and villas, made to the same specification as our hospitality work.",
          ar: "أطقم الطعام وكراسي المكاتب والقطع المميزة للشقق والفيلات، بالمواصفات نفسها المتبعة في أعمال الضيافة.",
        },
      },
      designerAudience,
    ],
    relatedIntro: { en: "Related", ar: "ذات صلة" },
    related: [
      { path: "/services/sofas", label: { en: "Sofas", ar: "الأرائك" } },
      { path: "/services/design-plan", label: { en: "Design & planning", ar: "التصميم والتخطيط" } },
      {
        path: "/services/mass-production",
        label: { en: "Mass production", ar: "الإنتاج بكميات كبيرة" },
      },
      { path: "/contact", label: { en: "Talk to our team", ar: "تحدّث إلى فريقنا" } },
    ],
    enquiryHeading: { en: "Request a chair quote", ar: "اطلب عرض سعر للكراسي" },
    enquiryIntro: {
      en: "Tell us how many chairs you need, what you're furnishing, and the frame. Finish, filling, fabric and cushions are yours to add now or settle with our team later.",
      ar: "أخبرنا بعدد الكراسي المطلوبة، وما الذي تؤثثه، ونوع الهيكل. أما التشطيب والحشو والقماش والوسائد فيمكنك تحديدها الآن أو مع فريقنا لاحقًا.",
    },
  },

  // ── Bed covers ────────────────────────────────────────────────────────────
  "bed-covers": {
    serviceHeading: { en: "Cut to the bed, finished for the room", ar: "تُفصَّل على السرير وتُنهى للغرفة" },
    serviceBody: [
      {
        en: "Bed covers made to the size of the bed they will dress, in fabric from our catalogue — Egyptian cotton, silk, satin, linen and more — with pillows in the same cloth where you want them. Cut, sewn and finished in our own workshop.",
        ar: "مفارش سرير تُصنع بمقاس السرير الذي ستُفرش عليه، بأقمشة من كتالوجنا — قطن مصري وحرير وساتان وكتان وغيرها — مع مخدات بالقماش نفسه عند الرغبة. تُقص وتُخاط وتُنهى في ورشتنا.",
      },
      {
        en: "The sizes below are the mattress. Drop and tuck are added in the workshop and vary with the height of the bed, which is what lets one specification be repeated across a hotel floor without measuring every room again.",
        ar: "المقاسات أدناه هي مقاسات المرتبة. أما السدل والطي فيُضافان في الورشة ويختلفان بحسب ارتفاع السرير، وهو ما يتيح تكرار المواصفة نفسها على طابق فندقي كامل دون إعادة قياس كل غرفة.",
      },
    ],
    specLabel: { en: "Sizes", ar: "المقاسات" },
    specHeading: { en: "Standard sizes, or your own", ar: "مقاسات قياسية أو مقاسك الخاص" },
    specIntro: {
      en: "Covers are cut to the mattress dimensions below. Anything outside them is made to measure.",
      ar: "تُفصَّل المفارش على أبعاد المرتبة المذكورة أدناه. وما خرج عنها يُصنع بالمقاس.",
    },
    specs: bedSizes.map((size) => ({
      title: { en: size.name, ar: size.nameAr },
      meta: { en: size.dimensions, ar: size.dimensions },
    })),
    audienceHeading: { en: "Guest rooms, wards and bedrooms", ar: "غرف النزلاء والأجنحة وغرف النوم" },
    audiences: [
      {
        title: { en: "Hotels & hospitality", ar: "الفنادق والضيافة" },
        body: {
          en: "Guest rooms and suites at scale — one specification, repeated to the room count, with matching pillows where the scheme asks for them.",
          ar: "غرف النزلاء والأجنحة على نطاق واسع — مواصفة واحدة تُكرَّر بعدد الغرف، مع مخدات مطابقة حين يقتضي التصميم ذلك.",
        },
      },
      {
        title: { en: "Hospitals, clinics & schools", ar: "المستشفيات والعيادات والمدارس" },
        body: {
          en: "Where bedding is changed and laundered constantly, fabric can be finished with an anti-fungal and antibacterial treatment.",
          ar: "حيث تُبدَّل المفروشات وتُغسل باستمرار، يمكن تشطيب القماش بمعالجة مضادة للفطريات والبكتيريا.",
        },
      },
      {
        title: { en: "Homes", ar: "المنازل" },
        body: {
          en: "Apartments and villas — a single bed or every bed in the property, in any colour and pattern from the catalogue.",
          ar: "الشقق والفيلات — سرير واحد أو كل أسرّة العقار، بأي لون ونمط من الكتالوج.",
        },
      },
      designerAudience,
    ],
    relatedIntro: { en: "Related", ar: "ذات صلة" },
    related: [
      { path: "/services/curtains", label: { en: "Curtains", ar: "الستائر" } },
      {
        path: "/services/mass-production",
        label: { en: "Mass production", ar: "الإنتاج بكميات كبيرة" },
      },
      { path: "/clients", label: { en: "Hotels we have supplied", ar: "الفنادق التي زودناها" } },
      { path: "/contact", label: { en: "Talk to our team", ar: "تحدّث إلى فريقنا" } },
    ],
    enquiryHeading: { en: "Request a bed cover quote", ar: "اطلب عرض سعر لمفارش السرير" },
    enquiryIntro: {
      en: "Tell us how many sets you need, what you're furnishing, and the bed size. Fabric, treatments and matching pillows are yours to add now or settle with our team later.",
      ar: "أخبرنا بعدد الأطقم المطلوبة، وما الذي تؤثثه، ومقاس السرير. أما القماش والمعالجات والمخدات المطابقة فيمكنك تحديدها الآن أو مع فريقنا لاحقًا.",
    },
  },

  // ── Custom ────────────────────────────────────────────────────────────────
  custom: {
    serviceHeading: { en: "If it is made of fabric, describe it", ar: "إن كان مصنوعًا من القماش، فصِفه لنا" },
    serviceBody: [
      {
        en: "Tablecloths, cushions, headboards, wall panels — the pieces that fall outside a standard category but still have to be made, matched to the rest of the scheme and delivered alongside it.",
        ar: "مفارش الطاولات والوسائد وظهور الأسرّة والألواح الجدارية — القطع التي تخرج عن الفئات المعتادة، ومع ذلك يجب أن تُصنع وتُنسَّق مع بقية التصميم وتُسلَّم معه.",
      },
      {
        en: "It helps to say as much as you already know — sizes, material, and where the piece will be used. A banqueting hall ordering forty round tablecloths in white linen and a home wanting a single upholstered headboard go through the same workshop.",
        ar: "ويفيدنا أن تذكر كل ما تعرفه — المقاسات والخامة والمكان الذي ستُستخدم فيه القطعة. فقاعة ولائم تطلب أربعين مفرش طاولة مستديرًا من الكتان الأبيض، ومنزل يريد ظهر سرير واحدًا منجَّدًا، كلاهما يمر بالورشة نفسها.",
      },
    ],
    specLabel: { en: "Typical commissions", ar: "أعمال معتادة" },
    specHeading: { en: "Pieces we are asked for most", ar: "القطع الأكثر طلبًا" },
    specIntro: {
      en: "Not a fixed list — these are simply the ones that come up often. Anything else made of fabric is worth asking about.",
      ar: "ليست قائمة مغلقة — هذه فقط أكثرها تكرارًا. وأي شيء آخر مصنوع من القماش يستحق السؤال عنه.",
    },
    specs: [
      {
        title: { en: "Tablecloths", ar: "مفارش الطاولات" },
        body: {
          en: "Round or rectangular, cut to the table and repeated across a venue.",
          ar: "مستديرة أو مستطيلة، تُفصَّل على الطاولة وتُكرَّر في القاعة بأكملها.",
        },
      },
      {
        title: { en: "Cushions", ar: "الوسائد" },
        body: {
          en: "Scatter and seat cushions, in the same fabric as an existing piece or a deliberate contrast.",
          ar: "وسائد إضافية ووسائد مقاعد، بنفس قماش قطعة قائمة أو بتباين مقصود.",
        },
      },
      {
        title: { en: "Headboards", ar: "ظهور الأسرّة" },
        body: {
          en: "Upholstered to your dimensions, in fabric from the catalogue.",
          ar: "منجَّدة بأبعادك، بأقمشة من الكتالوج.",
        },
      },
      {
        title: { en: "Wall panels", ar: "الألواح الجدارية" },
        body: {
          en: "Fabric-covered panelling, made to the dimensions of the wall.",
          ar: "ألواح مكسوّة بالقماش، تُصنع بأبعاد الجدار.",
        },
      },
    ],
    audienceHeading: { en: "Whoever the piece is for", ar: "أيًّا كان صاحب الطلب" },
    audiences: [
      {
        title: { en: "Hotels & hospitality", ar: "الفنادق والضيافة" },
        body: {
          en: "The odd items a property still needs — banqueting linen, decorative panels, pieces that have to match a scheme already installed.",
          ar: "القطع غير النمطية التي يحتاجها العقار — مفروشات الولائم، والألواح الزخرفية، وقطع يجب أن تطابق تصميمًا منفَّذًا بالفعل.",
        },
      },
      {
        title: { en: "Restaurants & venues", ar: "المطاعم والقاعات" },
        body: {
          en: "Table linen and soft furnishing in quantity, in one fabric across every table in the room.",
          ar: "مفروشات الطاولات والمفروشات الناعمة بكميات، بقماش واحد يغطي كل طاولات القاعة.",
        },
      },
      {
        title: { en: "Homes", ar: "المنازل" },
        body: {
          en: "One-off pieces for apartments and villas — a headboard, a run of cushions, a panelled wall.",
          ar: "قطع فردية للشقق والفيلات — ظهر سرير، أو مجموعة وسائد، أو جدار مكسو بالألواح.",
        },
      },
      designerAudience,
    ],
    relatedIntro: { en: "Related", ar: "ذات صلة" },
    related: [
      { path: "/services", label: { en: "All services", ar: "كل الخدمات" } },
      { path: "/services/design-plan", label: { en: "Design & planning", ar: "التصميم والتخطيط" } },
      { path: "/contact", label: { en: "Talk to our team", ar: "تحدّث إلى فريقنا" } },
    ],
    enquiryHeading: { en: "Tell us what you need", ar: "أخبرنا بما تحتاجه" },
    enquiryIntro: {
      en: "Describe the piece — sizes, material, and where it will be used all help. We'll come back with what's possible.",
      ar: "صف القطعة — المقاسات والخامة والمكان الذي ستُستخدم فيه، كلها تساعدنا. وسنعود إليك بما يمكن تنفيذه.",
    },
  },
};

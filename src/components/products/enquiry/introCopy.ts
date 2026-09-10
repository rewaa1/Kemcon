import type { CategoryType } from "@/types/configurator";
import type { Bilingual } from "./types";

/**
 * The heading copy for each service page, kept out of `specs.tsx` on purpose.
 *
 * `specs.tsx` is a `"use client"` module — it carries lucide icons and the
 * field renderers — so nothing in it can reach the server-rendered HTML. The
 * eyebrow, the `<h1>` and the intro paragraph are the three things a crawler
 * most needs, and they used to be locked behind the form's hydration gate:
 * the initial HTML for `/en/services/curtains` was chrome and a skeleton, with
 * the word "curtain" nowhere in it.
 *
 * Holding the copy here — plain data, no client boundary — lets
 * `ServiceIntroHeader` render it on the server while `specs.tsx` keeps
 * spreading the same values into each `CategorySpec`. One source of truth, so
 * the heading a visitor sees and the heading Google indexes cannot drift.
 */
export interface ServiceIntroCopy {
  eyebrow: Bilingual;
  /** The `<h1>` for a new enquiry. */
  title: Bilingual;
  /** The `<h1>` when `?edit=` reopens a line item from the brief. */
  editTitle: Bilingual;
  intro: Bilingual;
}

export const serviceIntroCopy: Record<CategoryType, ServiceIntroCopy> = {
  /**
   * Curtains leads with the service rather than the transaction.
   *
   * The `<h1>` used to read "Request a curtain quote" — an instruction to the
   * one visitor already sold, and nothing at all to the far larger number
   * arriving from a search for curtains in Egypt. The quote request is still
   * the point of the page; it is just an `<h2>` over the form now, where a call
   * to action belongs, with the heading left free to say what the page is.
   */
  curtains: {
    eyebrow: { en: "Curtains", ar: "ستائر" },
    title: {
      en: "Custom Curtain Solutions in Egypt",
      ar: "حلول ستائر مخصصة في مصر",
    },
    editTitle: { en: "Edit your curtains", ar: "عدّل ستائرك" },
    intro: {
      en: "Kemcon designs, makes and installs curtains for hotels, workplaces and homes across Egypt. Each set is specified around the room it belongs to — its light, its privacy and the way it is used — then cut to measure in our own workshop.",
      ar: "تصمّم كيمكون الستائر وتصنّعها وتركّبها للفنادق والمساحات التجارية والمنازل في مصر. تُحدَّد مواصفات كل مجموعة وفق الغرفة التي ستُعلَّق فيها — إضاءتها، ومتطلبات الخصوصية فيها، وطريقة استخدامها — ثم تُفصَّل بمقاسها في ورشتنا.",
    },
  },
  chairs: {
    eyebrow: { en: "Chairs", ar: "كراسي" },
    title: {
      en: "Custom Chairs for Hospitality and Interiors",
      ar: "كراسي مخصصة للضيافة والمساحات الداخلية",
    },
    editTitle: { en: "Edit your chairs", ar: "عدّل كراسيك" },
    intro: {
      en: "Dining, banqueting, meeting and accent seating, made to order in our own factory for hotels, workplaces and homes across Egypt — down to the frame, the filling and the fabric.",
      ar: "كراسي طعام وولائم واجتماعات وقطع مميزة، تُصنع حسب الطلب في مصنعنا للفنادق والمساحات التجارية والمنازل في مصر — وصولًا إلى الهيكل والحشو والقماش.",
    },
  },
  sofas: {
    eyebrow: { en: "Sofas", ar: "أرائك" },
    title: {
      en: "Bespoke Sofas, Made to Order in Egypt",
      ar: "أرائك مخصصة تُصنع حسب الطلب في مصر",
    },
    editTitle: { en: "Edit your sofas", ar: "عدّل أرائكك" },
    intro: {
      en: "Kemcon builds sofas to order for hotels, workplaces and homes across Egypt — frame, filling and upholstery specified separately, then made and installed by our own team.",
      ar: "تبني كيمكون الأرائك حسب الطلب للفنادق والمساحات التجارية والمنازل في مصر — يُحدَّد الهيكل والحشو والتنجيد كلٌّ على حدة، ثم تُصنع ويتولى فريقنا تركيبها.",
    },
  },
  "bed-covers": {
    eyebrow: { en: "Bed Covers", ar: "مفارش سرير" },
    title: {
      en: "Premium Bed Covers, Made to Size",
      ar: "مفارش سرير فاخرة بمقاس سريرك",
    },
    editTitle: { en: "Edit your bed covers", ar: "عدّل مفارش سريرك" },
    intro: {
      en: "Bed covers and matching pillows cut to the bed they will dress, in Egyptian cotton, silk, satin and more — made in our own workshop for hotels, healthcare and homes across Egypt.",
      ar: "مفارش سرير ومخدات مطابقة تُفصَّل على مقاس السرير الذي ستُفرش عليه، من القطن المصري والحرير والساتان وغيرها — تُصنع في ورشتنا للفنادق والمنشآت الصحية والمنازل في مصر.",
    },
  },
  custom: {
    eyebrow: { en: "Something else", ar: "شيء آخر" },
    title: {
      en: "Custom Fabric Solutions in Egypt",
      ar: "حلول أقمشة مخصصة في مصر",
    },
    editTitle: { en: "Edit your request", ar: "عدّل طلبك" },
    intro: {
      en: "Some of what a project needs does not fit a category. If it is made of fabric, our workshop has probably made it — describe the piece and we will tell you what is possible.",
      ar: "بعض ما يحتاجه المشروع لا يندرج تحت فئة بعينها. وإن كان مصنوعًا من القماش فغالبًا صنعته ورشتنا — صف القطعة وسنخبرك بما يمكن تنفيذه.",
    },
  },
};

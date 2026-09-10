import type { CategoryType } from "@/types/configurator";

/**
 * Per-category SEO copy, in one place.
 *
 * The five service pages share a spine — metadata, breadcrumb, `Service`
 * schema, editorial copy, then the enquiry form — so what each `page.tsx`
 * really carries is which category it is. Keeping the metadata strings here
 * stops them being copy-pasted five times and drifting apart.
 *
 * The schema was a `Product` with an `Offer` until the services pass: Kemcon
 * commissions work, it does not sell stock at a listed price, so every page
 * now declares a `Service` provided by the Organization in the root layout.
 * The visible page copy lives next to the components that render it —
 * `introCopy.ts` for the headings, `serviceContentData.ts` and the Curtains
 * page's own file for the body.
 */
export interface ProductSeo {
  /** URL segment under `/services`. */
  slug: string;
  /** Suffix of the `meta.pages.*` translation keys. */
  metaKey: string;
  ogImage: string;
  /** Breadcrumb leaf. */
  name: { en: string; ar: string };
  /** The `Service` schema's name. */
  schemaName: { en: string; ar: string };
  description: { en: string; ar: string };
}

export const productSeo: Record<CategoryType, ProductSeo> = {
  curtains: {
    slug: "curtains",
    metaKey: "curtains",
    ogImage: "cards/curtains.jpg",
    name: { en: "Curtains", ar: "ستائر" },
    schemaName: { en: "Bespoke Curtains", ar: "ستائر مخصصة" },
    description: {
      en: "Bespoke curtains in hundreds of fabrics — sheer, blackout, velvet, linen, and more. Layered to order, manual or remote-controlled, made to your measurements.",
      ar: "ستائر مخصصة بمئات الأقمشة — شفافة، وعازلة للضوء، ومخمل، وكتان، والمزيد. بطبقات حسب الطلب، يدوية أو بريموت، ومصنوعة بمقاساتك.",
    },
  },
  chairs: {
    slug: "chairs",
    metaKey: "chairs",
    ogImage: "cards/chairs.jpg",
    name: { en: "Chairs", ar: "كراسي" },
    schemaName: { en: "Custom Chairs", ar: "كراسي مخصصة" },
    description: {
      en: "Fully custom chairs from Kemcon — choose your frame material, finish, filling firmness, and upholstery fabric for hospitality or residential projects.",
      ar: "كراسي مخصصة بالكامل من كيمكون — اختر مادة الإطار والتشطيب وصلابة الحشو وقماش التنجيد لمشاريع الضيافة أو السكنية.",
    },
  },
  sofas: {
    slug: "sofas",
    metaKey: "sofas",
    ogImage: "cards/sofas.jpg",
    name: { en: "Sofas", ar: "أرائك" },
    schemaName: { en: "Bespoke Sofas", ar: "أرائك مخصصة" },
    description: {
      en: "Bespoke sofas built from scratch — select every element from the frame wood and filling to the final fabric, pattern and scatter cushions.",
      ar: "أرائك مخصصة تُصنع من الصفر — اختر كل عنصر من خشب الهيكل والحشو حتى القماش النهائي والنمط والوسائد.",
    },
  },
  "bed-covers": {
    slug: "bed-covers",
    metaKey: "bedCovers",
    ogImage: "cards/bedsheets.jpg",
    name: { en: "Bed Covers", ar: "مفارش سرير" },
    schemaName: { en: "Premium Bed Covers", ar: "مفارش سرير فاخرة" },
    description: {
      en: "Premium bed covers in Egyptian cotton, silk, satin, and more — cut to any bed size, in any colour and pattern from our catalog, with matching pillows.",
      ar: "مفارش سرير فاخرة من القطن المصري والحرير والساتان والمزيد — بأي مقاس سرير، وبأي لون ونمط من كتالوجنا، مع مخدات مطابقة.",
    },
  },
  custom: {
    slug: "custom",
    metaKey: "custom",
    ogImage: "cards/custom.jpg",
    name: { en: "Custom", ar: "مخصص" },
    schemaName: { en: "Custom Fabric Solutions", ar: "حلول أقمشة مخصصة" },
    description: {
      en: "Tablecloths, cushions, headboards, wall panels — describe what you need and our workshop will tell you what's possible.",
      ar: "مفارش طاولات، ووسائد، وظهور أسرّة، وألواح جدارية — صف ما تحتاجه وستخبرك ورشتنا بما يمكن تنفيذه.",
    },
  },
};

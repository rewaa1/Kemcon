import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { buildPageMetadata } from "@/lib/metadata";

const DesignPlanClient = dynamic(() => import("./design-plan-client"));

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/products/design-plan",
    titleKey: "meta.pages.designPlan.title",
    descriptionKey: "meta.pages.designPlan.description",
    ogImage: "images/about-preview.jpg",
  });
}

export default function DesignPlanPage() {
  return <DesignPlanClient />;
}

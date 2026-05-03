import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/metadata";
import DesignPlanClient from "./design-plan-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/products/design-plan",
    titleKey: "meta.pages.designPlan.title",
    descriptionKey: "meta.pages.designPlan.description",
  });
}

export default function DesignPlanPage() {
  return <DesignPlanClient />;
}

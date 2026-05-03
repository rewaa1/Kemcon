import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/metadata";
import AboutClient from "./about-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/about",
    titleKey: "meta.pages.about.title",
    descriptionKey: "meta.pages.about.description",
  });
}

export default function AboutPage() {
  return <AboutClient />;
}

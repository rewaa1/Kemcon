import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/metadata";
import { Hero } from "@/components/sections/Hero";
import { HomeSections } from "./home-sections";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/",
    titleKey: "meta.title",
    descriptionKey: "meta.description",
  });
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <HomeSections />
    </div>
  );
}

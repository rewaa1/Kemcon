import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/metadata";
import ShowroomClient from "./showroom-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/products/showroom",
    titleKey: "meta.pages.showroom.title",
    descriptionKey: "meta.pages.showroom.description",
  });
}

export default function ShowroomPage() {
  return <ShowroomClient />;
}

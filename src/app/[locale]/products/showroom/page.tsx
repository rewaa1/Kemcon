import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { buildPageMetadata } from "@/lib/metadata";

const ShowroomClient = dynamic(() => import("./showroom-client"));

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildPageMetadata({
    locale,
    path: "/products/showroom",
    titleKey: "meta.pages.showroom.title",
    descriptionKey: "meta.pages.showroom.description",
    ogImage: "cards/fabrics.jpg",
  });
}

export default function ShowroomPage() {
  return <ShowroomClient />;
}

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

const locales = ["en", "ar"] as const;

const routes = [
  { path: "", priority: 1.0, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/clients", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/products", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/products/configure", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/products/showroom", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/products/design-plan", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/products/mass-production", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/products/curtains", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/products/chairs", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/products/sofas", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/products/bed-sheets", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/products/custom", priority: 0.7, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const deployDate = process.env.NEXT_PUBLIC_DEPLOY_DATE;
  const lastModified = deployDate ? new Date(deployDate) : new Date();

  return locales.flatMap((locale) =>
    routes.map(({ path, priority, changeFrequency }) => {
      const languages: Record<string, string> = {};
      for (const l of locales) {
        languages[l] = `${SITE_URL}/${l}${path}`;
      }
      languages["x-default"] = `${SITE_URL}/en${path}`;

      return {
        url: `${SITE_URL}/${locale}${path}`,
        lastModified,
        changeFrequency,
        priority,
        alternates: { languages },
      };
    })
  );
}

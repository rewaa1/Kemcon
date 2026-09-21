import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

const locales = ["en", "ar"] as const;

const routes = [
  { path: "", priority: 1.0, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/clients", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/services/design-plan", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/services/mass-production", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/services/curtains", priority: 0.7, changeFrequency: "monthly" as const },
  // Hospitality is the highest-value curtain intent, so it outranks the sibling
  // category pages here even though it sits a level deeper in the URL.
  { path: "/services/curtains/hospitality", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/services/chairs", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/services/sofas", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/services/bed-covers", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/services/custom", priority: 0.7, changeFrequency: "monthly" as const },
  // Low priority, but they belong here: search engines expect a site to have
  // them, and a policy nobody can find is not much of a policy.
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const deployDate = process.env.NEXT_PUBLIC_DEPLOY_DATE;
  const parsed = deployDate ? new Date(deployDate) : null;
  const lastModified = parsed && !isNaN(parsed.getTime()) ? parsed : new Date();

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

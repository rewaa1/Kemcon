import { createClient } from "@supabase/supabase-js";
import { featuredClients, type FeaturedClient } from "@/data/clients";

/**
 * Client showcase data, read from the CRM's Supabase database.
 *
 * The website only ever holds the anon key. Row-level security on
 * `ShowcaseHotel` restricts it to `isPublished = true`, so an unpublished hotel
 * is unreachable from here even if the query asked for it — the filter below is
 * belt-and-braces, not the security boundary.
 *
 * Published rows are merged over the static `featuredClients` list, matched by
 * slug, so hotels can be published one at a time without the page shrinking to
 * only those published so far. Falls back entirely to the static list when
 * Supabase is unconfigured or errors. See docs/crm-showcase-migration.md.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isShowcaseRemote = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

interface ShowcaseRow {
  slug: string;
  name: string;
  region: string;
  stars: number | null;
  logoUrl: string;
  featuredUrl: string;
  images: { url: string; sortOrder: number }[] | null;
}

function toFeaturedClient(row: ShowcaseRow): FeaturedClient {
  const rooms = (row.images ?? [])
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((image) => image.url);

  return {
    id: row.slug,
    name: row.name,
    region: row.region,
    stars: row.stars ?? 5,
    logo: row.logoUrl,
    featured: row.featuredUrl,
    rooms,
  };
}

export async function getFeaturedClients(): Promise<FeaturedClient[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return featuredClients;

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase
      .from("ShowcaseHotel")
      .select("slug, name, region, stars, logoUrl, featuredUrl, images:ShowcaseHotelImage(url, sortOrder)")
      .eq("isPublished", true)
      .order("sortOrder", { ascending: true });

    if (error) {
      console.error("[showcase] Supabase query failed, using static list:", error.message);
      return featuredClients;
    }

    const rows = (data ?? []) as ShowcaseRow[];
    const published = rows.map(toFeaturedClient);

    // Merge rather than replace. Hotels are published one at a time as their
    // images move to UploadThing, and replacing would drop the site from 59
    // clients to however many happen to be published that day.
    const publishedSlugs = new Set(published.map((client) => client.id));
    const notYetPublished = featuredClients.filter((client) => !publishedSlugs.has(client.id));

    return [...published, ...notYetPublished];
  } catch (error) {
    console.error("[showcase] Supabase unreachable, using static list:", error);
    return featuredClients;
  }
}

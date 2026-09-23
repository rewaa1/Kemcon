import { featuredClients, type FeaturedClient } from "@/data/clients";

/**
 * Client showcase data, read from the Kemcon CRM.
 *
 * This used to query the CRM's Supabase database directly with the anon key,
 * with row-level security limiting it to published rows. The CRM has since
 * moved to Neon, which has no PostgREST equivalent — and handing this site a
 * database credential to replace the anon key would have been a step backwards.
 *
 * So the CRM publishes `GET /api/showcase` instead: published hotels only,
 * public columns only, filtered server-side where we cannot influence it. This
 * site holds no credential at all.
 *
 * Published rows are merged over the static `featuredClients` list, matched by
 * slug, so the page never shrinks to however many hotels happen to be published
 * that day. Falls back entirely to the static list when the CRM URL is unset,
 * unreachable, slow, or returns anything unexpected — the clients page must
 * render even when the CRM is down.
 */

const CRM_SHOWCASE_URL = process.env.CRM_SHOWCASE_URL;

/** How long a stale copy may be served before we re-ask the CRM. */
const REVALIDATE_SECONDS = 300;

/** The CRM is a nice-to-have here; never let it hold up the page. */
const TIMEOUT_MS = 5_000;

export const isShowcaseRemote = Boolean(CRM_SHOWCASE_URL);

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

/** A row is only usable if it has the fields the carousel actually renders. */
function isUsable(row: unknown): row is ShowcaseRow {
  if (typeof row !== "object" || row === null) return false;
  const r = row as Record<string, unknown>;
  return (
    typeof r.slug === "string" &&
    typeof r.name === "string" &&
    typeof r.region === "string" &&
    typeof r.logoUrl === "string" &&
    typeof r.featuredUrl === "string"
  );
}

export async function getFeaturedClients(): Promise<FeaturedClient[]> {
  if (!CRM_SHOWCASE_URL) return featuredClients;

  try {
    const response = await fetch(CRM_SHOWCASE_URL, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.error(`[showcase] CRM returned ${response.status}, using static list`);
      return featuredClients;
    }

    const body: unknown = await response.json();
    const rows = (body as { hotels?: unknown }).hotels;
    if (!Array.isArray(rows)) {
      console.error("[showcase] unexpected response shape, using static list");
      return featuredClients;
    }

    const published = rows.filter(isUsable).map(toFeaturedClient);
    if (published.length === 0) return featuredClients;

    // Merge rather than replace: hotels are published one at a time, and
    // replacing would drop the page from 59 clients to however many are live.
    const publishedSlugs = new Set(published.map((client) => client.id));
    const notYetPublished = featuredClients.filter((client) => !publishedSlugs.has(client.id));

    return [...published, ...notYetPublished];
  } catch (error) {
    console.error("[showcase] CRM unreachable, using static list:", error);
    return featuredClients;
  }
}

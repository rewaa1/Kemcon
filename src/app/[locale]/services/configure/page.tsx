import { permanentRedirect } from "next/navigation";
import { getLocale } from "next-intl/server";

/**
 * `/products/configure` was an interstitial: a page whose only job was to
 * render five category cards on the way to the configurator. The categories
 * are now reachable directly from the catalog at `/services`.
 *
 * Kept as a 308 rather than deleted because the URL is in the published
 * sitemap and may be indexed or linked. The section has since moved from
 * `/products` to `/services`, so the original URL now arrives here via the
 * `redirects()` rule in next.config.ts and this stub finishes the journey.
 */
export default async function ConfigureRedirect() {
  const locale = await getLocale();
  permanentRedirect(`/${locale}/services`);
}

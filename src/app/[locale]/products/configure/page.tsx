import { permanentRedirect } from "next/navigation";
import { getLocale } from "next-intl/server";

/**
 * `/products/configure` was an interstitial: a page whose only job was to
 * render five category cards on the way to the configurator. The categories
 * are now reachable directly from the catalog at `/products`.
 *
 * Kept as a 308 rather than deleted because the URL is in the published
 * sitemap and may be indexed or linked.
 */
export default async function ConfigureRedirect() {
  const locale = await getLocale();
  permanentRedirect(`/${locale}/products`);
}

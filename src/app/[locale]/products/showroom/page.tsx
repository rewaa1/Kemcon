import { permanentRedirect } from "next/navigation";
import { getLocale } from "next-intl/server";

/**
 * `/products/showroom` has been promoted to `/products` — the fabric catalog
 * is now the front door to the whole section rather than one card inside it.
 *
 * 308 so the existing search equity for this URL transfers to the catalog.
 */
export default async function ShowroomRedirect() {
  const locale = await getLocale();
  permanentRedirect(`/${locale}/products`);
}

export const KEMCON_EMAIL =
  process.env.NEXT_PUBLIC_KEMCON_EMAIL ?? "kemcon@yahoo.com";

export const KEMCON_WHATSAPP =
  process.env.NEXT_PUBLIC_KEMCON_WHATSAPP ?? "201223122276";

export const KEMCON_PHONE_DISPLAY = "+20 12 23122276";
export const KEMCON_PHONE_TEL = "+20-12-23122276";

export const SHOWROOM_MAP_URL = "https://maps.app.goo.gl/P258pkoaV3g7dLHP7";
export const FACTORY_MAP_URL = "https://maps.app.goo.gl/DCcFrvaM21skeTs1A";

/**
 * Marks that a visitor has already seen the entrance curtain. A cookie rather
 * than localStorage so the server can render `data-curtain` into the initial
 * HTML — an inline pre-paint script would never execute on a client render,
 * and `next/script` defers past first paint, which is what the overlay exists
 * to prevent.
 */
export const INTRO_COOKIE = "kemcon_intro_v1";

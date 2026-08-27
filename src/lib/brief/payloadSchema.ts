import { z } from "zod";

/**
 * Server-side validation for a submitted brief.
 *
 * The payload is built by our own client, but it arrives over the network and
 * anything that reaches the CRM has to be assumed hostile. Hand-rolled `clamp`
 * helpers were the first attempt and they missed whole objects — a spread left
 * `contact` and `project` completely unchecked — so this is a schema instead.
 *
 * Two deliberate choices:
 *
 * 1. **There is no `contact` field.** Name, phone and email are validated by
 *    the route from the form fields and passed to `saveBrief` separately. If
 *    they were accepted here, a crafted request could put one name in the
 *    email and a different one in the database.
 *
 * 2. **Malformed parts are dropped, not fatal.** A bad line item or a foreign
 *    image URL loses that detail; it must never lose the lead. Only a payload
 *    that is not an object at all is rejected outright.
 */

const MAX_TEXT = 5_000;
/**
 * The rendered brief is the fallback copy of the whole enquiry, so it needs far
 * more room than a notes field. A five-item brief with photo and inspiration
 * URLs runs comfortably past 5,000 characters, which silently truncated it.
 */
const MAX_SUMMARY = 100_000;
const MAX_ITEMS = 50;
const MAX_URLS = 50;
const MAX_STYLES = 20;

/**
 * Hosts we publish images to ourselves. Mirrors `remotePatterns` in
 * next.config.ts — anything else is dropped rather than stored, so a crafted
 * submission cannot plant arbitrary URLs for the CRM to render or fetch.
 */
const ALLOWED_IMAGE_HOSTS = [
  "res.cloudinary.com",
  "gen.pollinations.ai",
  "image.pollinations.ai",
  "utfs.io",
];

function siteHost(): string | null {
  try {
    return process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname
      : null;
  } catch {
    return null;
  }
}

export function isOwnImageUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2048) return false;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    if (ALLOWED_IMAGE_HOSTS.includes(url.hostname)) return true;
    // UploadThing serves from an account-specific subdomain.
    if (url.hostname.endsWith(".ufs.sh")) return true;
    const host = siteHost();
    return host !== null && url.hostname === host;
  } catch {
    return false;
  }
}

/** Trimmed, length-capped, empty becomes null. */
const nullableText = (max = MAX_TEXT) =>
  z.preprocess(
    (v) => (typeof v === "string" ? v.trim().slice(0, max) || null : null),
    z.string().nullable()
  );

/** Trimmed and length-capped; missing becomes an empty string. */
const requiredText = (max = MAX_TEXT) =>
  z.preprocess((v) => (typeof v === "string" ? v.trim().slice(0, max) : ""), z.string());

const imageUrl = z.preprocess((v) => (isOwnImageUrl(v) ? v : null), z.string().nullable());

const imageUrlList = z.preprocess(
  (v) => (Array.isArray(v) ? v.filter(isOwnImageUrl).slice(0, MAX_URLS) : []),
  z.array(z.string())
);

const quantity = z.preprocess((v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return 1;
  return Math.min(100_000, Math.max(1, Math.floor(n)));
}, z.number().int().min(1));

export const briefItemSchema = z.object({
  category: z.enum(["curtains", "chairs", "sofas", "bed-sheets", "custom"]),
  quantity,
  unit: requiredText(40),
  fabricId: nullableText(120),
  fabricName: nullableText(200),
  fabricFamily: nullableText(200),
  colorId: nullableText(120),
  colorName: nullableText(200),
  colorHex: nullableText(32),
  patternId: nullableText(120),
  patternName: nullableText(200),
  options: z.preprocess(
    (v) => (v && typeof v === "object" && !Array.isArray(v) ? v : {}),
    z.record(z.string(), z.unknown())
  ),
  aiImageUrl: imageUrl,
  aiDetailImageUrl: imageUrl,
  notes: nullableText(),
});

const projectSchema = z.object({
  propertyType: nullableText(80),
  propertyName: nullableText(200),
  projectType: nullableText(80),
  scope: nullableText(80),
  numRooms: nullableText(20),
  stylePrefs: z.preprocess(
    (v) =>
      Array.isArray(v)
        ? v
            .filter((x): x is string => typeof x === "string")
            .slice(0, MAX_STYLES)
            .map((s) => s.slice(0, 80))
        : [],
    z.array(z.string())
  ),
  dimensions: nullableText(),
  timeline: nullableText(80),
});

export const briefPayloadSchema = z.object({
  /**
   * Stable across retries of the same submission. A timeout that the server
   * actually processed used to produce a duplicate lead on the next click;
   * this is what lets the second attempt be recognised instead of stored.
   */
  submissionId: z.preprocess(
    (v) => (typeof v === "string" && /^[0-9a-z-]{8,64}$/i.test(v) ? v : null),
    z.string().nullable()
  ),
  type: z.preprocess(
    (v) => (typeof v === "string" ? v.toLowerCase() : "standard"),
    z.enum(["standard", "bulk", "design"]).catch("standard")
  ),
  locale: z.preprocess((v) => (v === "ar" ? "ar" : "en"), z.enum(["en", "ar"])),
  project: z.preprocess(
    (v) => (v && typeof v === "object" && !Array.isArray(v) ? v : {}),
    projectSchema
  ),
  notes: nullableText(),
  photoUrls: imageUrlList,
  inspirationUrls: imageUrlList,
  /**
   * Items are validated one at a time so a single malformed entry costs that
   * line rather than the whole enquiry.
   */
  items: z.preprocess((v) => {
    if (!Array.isArray(v)) return [];
    return v
      .slice(0, MAX_ITEMS)
      .map((item) => briefItemSchema.safeParse(item))
      .filter((result) => result.success)
      .map((result) => result.data);
  }, z.array(briefItemSchema)),
  summary: requiredText(MAX_SUMMARY),
});

export type ValidatedBriefPayload = z.infer<typeof briefPayloadSchema>;

/** Parse an untrusted payload. Returns null when it is not usable at all. */
export function parseBriefPayload(raw: unknown): ValidatedBriefPayload | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const result = briefPayloadSchema.safeParse(raw);
  return result.success ? result.data : null;
}

import { NextResponse, type NextRequest } from "next/server";
import { toLogoMark } from "@/lib/logoMark";

/**
 * Serves a hotel logo as a uniform monochrome mark.
 *
 * The clients page renders these as watermarks on a dark card, and the source
 * files are too inconsistent to normalise in CSS — see `@/lib/logoMark` for
 * what varies and why. This runs the normalisation per request rather than
 * against a checked-in set of assets because the showcase list is merged from
 * the CRM: a hotel published there tomorrow arrives with a logo URL we have
 * never seen, and it has to render like the rest without a redeploy.
 *
 * The host allowlist is the point of this being a route rather than a plain
 * proxy. `next.config.ts` pins `remotePatterns` to our own UploadThing app for
 * the same reason it notes there: anything looser is an open image proxy, and
 * this endpoint fetches whatever URL it is handed.
 */

export const runtime = "nodejs";

/** Mirrors the `images.remotePatterns` allowlist in `next.config.ts`. */
const ALLOWED_HOSTS = new Set(["2e3n0iobhs.ufs.sh", "utfs.io"]);
const ALLOWED_PATH_PREFIX = "/f/";

/** Logos are small; anything larger is not one, and we should not decode it. */
const MAX_BYTES = 8 * 1024 * 1024;

/** The upstream is a nice-to-have — never let it hold a card's render open. */
const TIMEOUT_MS = 8_000;

/**
 * Marks already built, keyed by upstream URL.
 *
 * A cold clients page asks for 59 marks at once, drawn from 34 distinct files.
 * Without this, that is 59 upstream fetches and 59 sharp pipelines per render,
 * and UploadThing starts refusing the burst — a dozen cards came back 502 and
 * lost their logo. The marks are a few KB each, so holding them costs almost
 * nothing next to fetching them again.
 *
 * Process-local and therefore per-instance: a deploy or a new lambda starts
 * cold, which is fine, as the browser cache carries returning visitors.
 */
const marks = new Map<string, Buffer>();

/** Builds in progress, so concurrent requests for one logo do one fetch. */
const inFlight = new Map<string, Promise<Buffer | null>>();

/** Ample for the logos we hold, and bounded so it cannot grow unattended. */
const MAX_CACHED = 128;

function remember(key: string, mark: Buffer): void {
  if (marks.size >= MAX_CACHED) {
    const oldest = marks.keys().next().value;
    if (oldest !== undefined) marks.delete(oldest);
  }
  marks.set(key, mark);
}

function isAllowed(raw: string): URL | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (!ALLOWED_HOSTS.has(url.hostname)) return null;
  if (!url.pathname.startsWith(ALLOWED_PATH_PREFIX)) return null;
  return url;
}

/** Fetches and normalises one logo. Null when the upstream will not give it. */
async function buildMark(url: URL): Promise<Buffer | null> {
  let source: Buffer;
  try {
    const upstream = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!upstream.ok) return null;

    const length = Number(upstream.headers.get("content-length") ?? 0);
    if (length > MAX_BYTES) return null;

    const bytes = await upstream.arrayBuffer();
    if (bytes.byteLength > MAX_BYTES) return null;
    source = Buffer.from(bytes);
  } catch {
    return null;
  }

  return toLogoMark(source);
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("u");
  if (!raw) {
    return NextResponse.json({ error: "Missing u" }, { status: 400 });
  }

  const url = isAllowed(raw);
  if (!url) {
    return NextResponse.json({ error: "Unsupported logo source" }, { status: 400 });
  }

  const key = url.href;
  let mark = marks.get(key);

  if (!mark) {
    // One build per logo, however many requests arrive for it at once.
    let pending = inFlight.get(key);
    if (!pending) {
      pending = buildMark(url).finally(() => inFlight.delete(key));
      inFlight.set(key, pending);
    }

    const built = await pending;
    if (!built) {
      return NextResponse.json({ error: "Logo unavailable" }, { status: 502 });
    }

    remember(key, built);
    mark = built;
  }

  return new NextResponse(new Uint8Array(mark), {
    headers: {
      "Content-Type": "image/png",
      // The upstream URLs are content-addressed, so a mark for a given `u`
      // never changes; only our own pipeline does, and that ships in a deploy.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

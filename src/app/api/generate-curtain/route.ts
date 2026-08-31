import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import {
  QUOTA_COOKIE,
  VISITOR_COOKIE,
  VISITOR_COOKIE_MAX_AGE,
  consumeQuota,
  cookieOptions,
  issueVisitorId,
  readQuota,
  readVisitorId,
  serializeQuota,
} from "@/lib/visitor";

interface ImageRequest {
  url: string;
  headers: Record<string, string>;
}

const LIMITS = { burstMax: 3, burstWindowMs: 60_000, dailyMax: 20 };
const QUOTA_COOKIE_MAX_AGE = 60 * 60 * 24 * 2;

/**
 * DeepAI. Only reachable with a Pro key — the free tier returns
 * "APIs are only available for Pro members", so this path stays dormant until
 * DEEPAI_API_KEY is set to a paid key.
 */
async function generateWithDeepAI(
  apiKey: string,
  prompt: string,
  negativePrompt: string | undefined,
  width: number,
  height: number
): Promise<ImageRequest> {
  const form = new FormData();
  form.append("text", prompt);
  form.append("width", String(width));
  form.append("height", String(height));
  form.append("image_generator_version", process.env.DEEPAI_IMAGE_VERSION ?? "hd");
  if (negativePrompt) form.append("negative_prompt", negativePrompt);

  const response = await fetch("https://api.deepai.org/api/text2img", {
    method: "POST",
    headers: { "api-key": apiKey },
    body: form,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.output_url) {
    throw new Error(payload?.status ?? `DeepAI request failed (${response.status})`);
  }
  return { url: payload.output_url as string, headers: {} };
}

/**
 * Pollinations, on the current `gen.pollinations.ai` host.
 *
 * The legacy `image.pollinations.ai` host does not recognise keys issued by
 * enter.pollinations.ai — it reports `x-auth-result: NONE` and silently serves
 * `sana` for every model name. This host honours the key and the requested
 * model. Generation spends Pollen from the account balance (free Quest Pollen
 * first), and returns 402 once that runs out.
 */
function pollinationsRequest(
  prompt: string,
  seed: number,
  width: number,
  height: number
): ImageRequest {
  const params = new URLSearchParams({
    model: process.env.POLLINATIONS_MODEL ?? "flux",
    width: String(width),
    height: String(height),
    seed: String(seed),
  });

  const headers: Record<string, string> = {};
  const token = process.env.POLLINATIONS_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  return {
    url: `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?${params}`,
    headers,
  };
}

export async function POST(request: NextRequest) {
  // Identity first: the quota cookie is signed against this id.
  const existingVisitorId = readVisitorId(request);
  const issued = existingVisitorId ? null : issueVisitorId();
  const visitorId = existingVisitorId ?? issued!.id;

  const quotaResult = consumeQuota(readQuota(request, visitorId), LIMITS);

  const withCookies = <T extends NextResponse>(response: T): T => {
    if (issued) {
      response.cookies.set(VISITOR_COOKIE, issued.value, cookieOptions(VISITOR_COOKIE_MAX_AGE));
    }
    response.cookies.set(
      QUOTA_COOKIE,
      serializeQuota(visitorId, quotaResult.quota),
      cookieOptions(QUOTA_COOKIE_MAX_AGE)
    );
    return response;
  };

  if (!quotaResult.allowed) {
    return withCookies(
      NextResponse.json(
        {
          error:
            quotaResult.reason === "daily"
              ? "Daily generation limit reached. Please try again tomorrow."
              : "Too many generation requests. Please wait a minute.",
          reason: quotaResult.reason,
        },
        { status: 429, headers: { "Retry-After": String(quotaResult.retryAfterSeconds) } }
      )
    );
  }

  // Second layer: a shared IP burst cap, so one office cannot exhaust the
  // provider quota by clearing cookies. Best-effort only — this resets on
  // serverless cold starts.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRateLimit(`generate:${ip}`, 10, 60_000)) {
    return withCookies(
      NextResponse.json(
        { error: "Too many generation requests from this network. Please wait a minute.", reason: "burst" },
        { status: 429, headers: { "Retry-After": "60" } }
      )
    );
  }

  const { prompt, negativePrompt, seed, width = 1536, height = 1024 } = await request.json();

  if (typeof prompt !== "string" || !prompt.trim()) {
    return withCookies(NextResponse.json({ error: "A prompt is required" }, { status: 400 }));
  }

  const deepAiKey = process.env.DEEPAI_API_KEY;

  try {
    const image = deepAiKey
      ? await generateWithDeepAI(deepAiKey, prompt, negativePrompt, width, height)
      : pollinationsRequest(prompt, seed, width, height);

    const imageResponse = await fetch(image.url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Kemcon/1.0)", ...image.headers },
    });

    if (imageResponse.status === 402) {
      return withCookies(
        NextResponse.json(
          { error: "Image generation credit exhausted.", reason: "credit" },
          { status: 502 }
        )
      );
    }

    if (!imageResponse.ok) {
      const body = await imageResponse.text();
      return withCookies(
        NextResponse.json({ error: "Generation failed", detail: body }, { status: 502 })
      );
    }

    const imageBuffer = await imageResponse.arrayBuffer();

    return withCookies(
      new NextResponse(imageBuffer, {
        headers: {
          "Content-Type": imageResponse.headers.get("content-type") ?? "image/jpeg",
          "Cache-Control": "public, max-age=3600",
          "X-Image-Url": image.url,
          // Which model actually served the request. Pollinations substitutes
          // silently, so this is the only way to tell what you really got.
          "X-Model-Used": imageResponse.headers.get("x-model-used") ?? "unknown",
          "X-Request-Id": imageResponse.headers.get("x-request-id") ?? "unknown",
        },
      })
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Request failed";
    return withCookies(NextResponse.json({ error: "Generation failed", detail }, { status: 502 }));
  }
}

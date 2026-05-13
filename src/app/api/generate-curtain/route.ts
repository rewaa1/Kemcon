import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRateLimit(`generate:${ip}`, 3, 60_000)) {
    return NextResponse.json(
      { error: "Too many generation requests. Please wait a minute." },
      { status: 429 }
    );
  }

  const { prompt, seed, width = 1536, height = 1024 } = await request.json();

  const params = new URLSearchParams({
    width: String(width),
    height: String(height),
    model: "flux-realism",
    enhance: "true",
    nologo: "true",
    seed: String(seed),
  });

  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params}`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Kemcon/1.0)" },
    });

    if (!response.ok) {
      const body = await response.text();
      return NextResponse.json({ error: "Generation failed", detail: body }, { status: 502 });
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": "public, max-age=3600",
        "X-Image-Url": url,
      },
    });
  } catch {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}

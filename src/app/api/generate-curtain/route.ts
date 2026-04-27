import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { prompt, seed, negative } = await request.json();

  const params = new URLSearchParams({
    width: "1024",
    height: "1536",
    nologo: "true",
    seed: String(seed),
    ...(negative ? { negative } : {}),
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

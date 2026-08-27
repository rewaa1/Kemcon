import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { checkRateLimit, checkGlobalLimit } from "@/lib/rateLimit";
import { clientIp, isCrossOriginRequest } from "@/lib/requestGuards";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function sign(params: Record<string, string>, apiSecret: string): string {
  const payload =
    Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join("&") + apiSecret;
  return createHash("sha256").update(payload).digest("hex");
}

export async function POST(request: NextRequest) {
  // Every upload costs Cloudinary storage, so this one is worth guarding too.
  if (isCrossOriginRequest(request)) {
    return NextResponse.json({ error: "Cross-origin requests are not allowed." }, { status: 403 });
  }

  const ip = clientIp(request);
  if (!checkRateLimit(`upload:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: "Too many upload requests." }, { status: 429 });
  }

  if (!checkGlobalLimit("upload", 120, 60_000)) {
    console.warn("[upload] global rate ceiling hit — shedding requests");
    return NextResponse.json({ error: "Too many upload requests." }, { status: 429 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("[upload] Missing Cloudinary env vars");
    return NextResponse.json({ error: "Upload service not configured." }, { status: 500 });
  }

  let file: File;
  try {
    const form = await request.formData();
    const raw = form.get("file");
    if (!(raw instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    file = raw;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `File "${file.name}" exceeds the 5 MB limit.` },
      { status: 400 }
    );
  }

  const timestamp = String(Math.floor(Date.now() / 1000));
  const folder = "kemcon";
  const params = { folder, timestamp };
  const signature = sign(params, apiSecret);

  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", apiKey);
  fd.append("timestamp", timestamp);
  fd.append("folder", folder);
  fd.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: fd }
  );

  if (!res.ok) {
    const body = await res.text();
    console.error("[upload] Cloudinary error:", body);
    return NextResponse.json({ error: "Upload failed." }, { status: 502 });
  }

  const json = (await res.json()) as { secure_url: string };
  return NextResponse.json({ url: json.secure_url });
}

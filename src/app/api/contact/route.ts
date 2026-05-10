import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { KEMCON_EMAIL } from "@/lib/config";
import { checkRateLimit } from "@/lib/rateLimit";

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface JsonPayload {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  locale?: string;
}

async function parseRequest(request: NextRequest): Promise<{
  name: string;
  phone: string;
  email: string;
  message: string;
  isAr: boolean;
  attachments: { filename: string; content: Buffer; contentType: string }[];
}> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const data = await request.formData();
    const photos = data.getAll("photos") as File[];

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    const oversized = photos.find((f) => f.size > MAX_FILE_SIZE);
    if (oversized) {
      throw new Error(`File "${oversized.name}" exceeds the 5 MB limit`);
    }

    const attachments = await Promise.all(
      photos.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
        contentType: file.type || "image/jpeg",
      }))
    );

    const rawPhone = (data.get("phone") as string | null)?.trim() ?? "";
    return {
      name: (data.get("name") as string | null)?.trim() ?? "",
      phone: rawPhone.replace(/[\r\n]/g, ""),
      email: (data.get("email") as string | null)?.trim() ?? "",
      message: (data.get("message") as string | null)?.trim() ?? "",
      isAr: data.get("locale") === "ar",
      attachments,
    };
  }

  const payload = (await request.json()) as JsonPayload;
  return {
    name: payload.name?.trim() ?? "",
    phone: (payload.phone?.trim() ?? "").replace(/[\r\n]/g, ""),
    email: payload.email?.trim() ?? "",
    message: payload.message?.trim() ?? "",
    isAr: payload.locale === "ar",
    attachments: [],
  };
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRateLimit(`contact:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  let parsed: Awaited<ReturnType<typeof parseRequest>>;

  try {
    parsed = await parseRequest(request);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid request body";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { name, phone, email, message, isAr, attachments } = parsed;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: isAr ? "حقول مطلوبة مفقودة" : "Missing required fields" },
      { status: 400 }
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: isAr ? "البريد الإلكتروني غير صالح" : "Invalid email address" },
      { status: 400 }
    );
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO || KEMCON_EMAIL;
  const from = process.env.SMTP_FROM || (user ? `"Kemcon Website" <${user}>` : undefined);

  if (!host || !user || !pass || !from) {
    console.error("Contact form: missing SMTP env vars");
    return NextResponse.json(
      { error: isAr ? "خطأ في إعدادات الخادم" : "Server is not configured to send email" },
      { status: 500 }
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465 || process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });

  const subject = isAr ? `استفسار جديد من ${name}` : `New inquiry from ${name}`;

  const text = [
    `Name: ${name}`,
    `Phone: ${phone || "—"}`,
    `Email: ${email}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1a1a1a">
      <h2 style="margin:0 0 16px;color:#c8a45a">${escapeHtml(subject)}</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
        <tr><td style="padding:6px 0;color:#666;width:90px">Name</td><td style="padding:6px 0">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Phone</td><td style="padding:6px 0">${escapeHtml(phone || "—")}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Email</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        ${attachments.length > 0 ? `<tr><td style="padding:6px 0;color:#666">Photos</td><td style="padding:6px 0">${attachments.length} attached</td></tr>` : ""}
      </table>
      <div style="border-top:1px solid #eee;padding-top:16px;white-space:pre-wrap;line-height:1.6">${escapeHtml(message)}</div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject,
      text,
      html,
      attachments,
    });
  } catch (error) {
    console.error("Contact form: sendMail failed", error);
    return NextResponse.json(
      { error: isAr ? "فشل إرسال الرسالة. حاول مرة أخرى." : "Failed to send message. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

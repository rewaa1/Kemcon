import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { KEMCON_EMAIL } from "@/lib/config";
import { checkRateLimit } from "@/lib/rateLimit";
import { sendLeadToCrm, type LeadChannel } from "@/lib/crm";
import { readVisitorId } from "@/lib/visitor";

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * The single submission endpoint for every form on the site.
 *
 * Two things happen to every enquiry:
 *   1. It is recorded in the CRM — always, whatever the visitor chose.
 *   2. It is delivered on the channel the visitor picked. "email" sends the
 *      SMTP message from here; "whatsapp" is handed off by the browser, so
 *      there is nothing left to send once the lead is recorded.
 */

interface JsonPayload {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  locale?: string;
  channel?: string;
  formType?: string;
  briefType?: string;
  attachments?: string[];
  meta?: Record<string, unknown>;
}

interface ParsedRequest {
  name: string;
  phone: string;
  email: string;
  message: string;
  locale: string;
  isAr: boolean;
  channel: LeadChannel;
  formType: string;
  briefType: string | null;
  /** Uploaded photo URLs — recorded on the lead, already inlined in `message`. */
  attachments: string[];
  meta: Record<string, unknown> | null;
  /** Raw files posted as multipart, attached to the email itself. */
  files: { filename: string; content: Buffer; contentType: string }[];
}

/** Anything other than an explicit "whatsapp" means the email path. */
function toChannel(value: unknown): LeadChannel {
  return value === "whatsapp" ? "whatsapp" : "email";
}

/**
 * Multipart carries everything as strings, so structured fields arrive as
 * JSON text. A malformed value is dropped rather than failing the whole
 * submission — the enquiry itself matters more than its metadata.
 */
function parseJsonField<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    console.warn("[contact] Ignoring malformed JSON field");
    return fallback;
  }
}

async function parseRequest(request: NextRequest): Promise<ParsedRequest> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const data = await request.formData();
    const photos = data.getAll("photos") as File[];

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    const oversized = photos.find((f) => f.size > MAX_FILE_SIZE);
    if (oversized) {
      throw new Error(`File "${oversized.name}" exceeds the 5 MB limit`);
    }

    const files = await Promise.all(
      photos.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
        contentType: file.type || "image/jpeg",
      }))
    );

    const rawPhone = (data.get("phone") as string | null)?.trim() ?? "";
    const locale = (data.get("locale") as string | null) ?? "en";

    return {
      name: (data.get("name") as string | null)?.trim() ?? "",
      phone: rawPhone.replace(/[\r\n]/g, ""),
      email: (data.get("email") as string | null)?.trim() ?? "",
      message: (data.get("message") as string | null)?.trim() ?? "",
      locale,
      isAr: locale === "ar",
      channel: toChannel(data.get("channel")),
      formType: (data.get("formType") as string | null)?.trim() || "contact",
      briefType: (data.get("briefType") as string | null)?.trim() || null,
      attachments: parseJsonField<string[]>(data.get("attachments") as string | null, []),
      meta: parseJsonField<Record<string, unknown> | null>(data.get("meta") as string | null, null),
      files,
    };
  }

  const payload = (await request.json()) as JsonPayload;
  const locale = payload.locale ?? "en";

  return {
    name: payload.name?.trim() ?? "",
    phone: (payload.phone?.trim() ?? "").replace(/[\r\n]/g, ""),
    email: payload.email?.trim() ?? "",
    message: payload.message?.trim() ?? "",
    locale,
    isAr: locale === "ar",
    channel: toChannel(payload.channel),
    formType: payload.formType?.trim() || "contact",
    briefType: payload.briefType?.trim() || null,
    attachments: payload.attachments ?? [],
    meta: payload.meta ?? null,
    files: [],
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

  let parsed: ParsedRequest;

  try {
    parsed = await parseRequest(request);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid request body";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { name, phone, email, message, locale, isAr, channel } = parsed;

  if (!name || !message) {
    return NextResponse.json(
      { error: isAr ? "حقول مطلوبة مفقودة" : "Missing required fields" },
      { status: 400 }
    );
  }

  // The email path needs an address to reply to. The WhatsApp path is happy
  // with either — the visitor may only have given us a phone number.
  if (channel === "email" && !email) {
    return NextResponse.json(
      { error: isAr ? "حقول مطلوبة مفقودة" : "Missing required fields" },
      { status: 400 }
    );
  }

  if (channel === "whatsapp" && !email && !phone) {
    return NextResponse.json(
      {
        error: isAr
          ? "أدخل رقم هاتف أو بريداً إلكترونياً"
          : "Enter a phone number or an email address",
      },
      { status: 400 }
    );
  }

  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: isAr ? "البريد الإلكتروني غير صالح" : "Invalid email address" },
      { status: 400 }
    );
  }

  // 1. Record it. Awaited rather than fired off, so a CRM outage is something
  //    this handler can react to instead of a silently dropped lead.
  const crm = await sendLeadToCrm({
    channel,
    formType: parsed.formType,
    briefType: parsed.briefType,
    name,
    phone,
    email,
    message,
    locale,
    attachments: parsed.attachments,
    meta: parsed.meta,
    // Read from the signed cookie on this very request, so the CRM can attach
    // everything they browsed before enquiring. Costs the client nothing —
    // `kc_vid` is httpOnly, so the form never has to carry it.
    visitorId: readVisitorId(request),
  });

  // 2. Deliver it on the chosen channel. WhatsApp is handed off by the browser
  //    the moment this returns, so it needs no send here — unless the CRM did
  //    not take it, in which case email becomes the safety net that stops the
  //    enquiry existing nowhere but the visitor's own chat window.
  const mustEmail = channel === "email" || !crm.ok;

  if (!mustEmail) {
    return NextResponse.json({ ok: true, recorded: true });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO || KEMCON_EMAIL;
  const from = process.env.SMTP_FROM || (user ? `"Kemcon Website" <${user}>` : undefined);

  if (!host || !user || !pass || !from) {
    console.error("Contact form: missing SMTP env vars");
    // On the WhatsApp path the visitor is about to send the message themselves,
    // so an unconfigured fallback is not their problem — do not fail the form.
    if (channel === "whatsapp") {
      return NextResponse.json({ ok: true, recorded: crm.ok });
    }
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
    `Email: ${email || "—"}`,
    `Channel: ${channel}`,
    !crm.ok ? `CRM: NOT RECORDED (${crm.reason})` : "",
    "",
    "Message:",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1a1a1a">
      <h2 style="margin:0 0 16px;color:#c8a45a">${escapeHtml(subject)}</h2>
      ${
        crm.ok
          ? ""
          : `<p style="margin:0 0 16px;padding:10px 12px;border-radius:4px;background:#fdf2f2;color:#a13b3b;font-size:13px">
              This enquiry could not be saved to the CRM (${escapeHtml(crm.reason)}). Add it by hand.
            </p>`
      }
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
        <tr><td style="padding:6px 0;color:#666;width:90px">Name</td><td style="padding:6px 0">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Phone</td><td style="padding:6px 0">${escapeHtml(phone || "—")}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Email</td><td style="padding:6px 0">${email ? `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>` : "—"}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Channel</td><td style="padding:6px 0">${escapeHtml(channel)}</td></tr>
        ${parsed.files.length > 0 ? `<tr><td style="padding:6px 0;color:#666">Photos</td><td style="padding:6px 0">${parsed.files.length} attached</td></tr>` : ""}
      </table>
      <div style="border-top:1px solid #eee;padding-top:16px;white-space:pre-wrap;line-height:1.6">${escapeHtml(message)}</div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from,
      to,
      ...(email ? { replyTo: email } : {}),
      subject,
      text,
      html,
      attachments: parsed.files,
    });
  } catch (error) {
    console.error("Contact form: sendMail failed", error);
    // Reached on the WhatsApp path only when the CRM already refused the lead,
    // so this is the fallback failing too. Still not the visitor's problem to
    // solve: their own message reaches us through the chat they are opening,
    // and telling them to retry would only duplicate it. Logged, not surfaced.
    if (channel === "whatsapp") {
      return NextResponse.json({ ok: true, recorded: crm.ok });
    }
    return NextResponse.json(
      { error: isAr ? "فشل إرسال الرسالة. حاول مرة أخرى." : "Failed to send message. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, recorded: crm.ok });
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

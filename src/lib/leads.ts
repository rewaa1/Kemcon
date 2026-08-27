import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ValidatedBriefPayload } from "@/lib/brief/payloadSchema";
import { newBriefId, referenceFrom } from "@/lib/brief/reference";

/**
 * Persisting a submitted brief to the CRM's database.
 *
 * The website normally holds only the Supabase **anon** key, which is read-only
 * behind RLS. Writing leads needs the service-role key, so this module is
 * server-only and the key must never appear in a `NEXT_PUBLIC_` variable — an
 * anon key with insert rights would let anyone write rows straight into the CRM.
 *
 * Two Prisma details this has to work around. `@default(cuid())` and
 * `@updatedAt` are applied by the Prisma *client*, not by the database, so a
 * direct insert would violate NOT NULL on `id` and `updatedAt`. Both are
 * supplied explicitly here rather than relying on database defaults that the
 * CRM's migration does not create.
 *
 * See docs/crm-brief-migration.md for the schema this expects — including the
 * `grant`s, without which the service role bypasses RLS and then fails on table
 * permissions anyway.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Postgres unique-violation. */
const UNIQUE_VIOLATION = "23505";

export const isLeadStoreConfigured = Boolean(SUPABASE_URL && SERVICE_ROLE_KEY);

export interface LeadContact {
  name: string;
  phone: string;
  email: string;
}

export type SaveBriefResult =
  | { ok: true; reference: string; duplicate: boolean }
  | { ok: false; reason: "unconfigured" | "error"; detail?: string };

async function findBySubmissionId(
  supabase: SupabaseClient,
  submissionId: string
): Promise<string | null> {
  const { data } = await supabase
    .from("Brief")
    .select("reference")
    .eq("submissionId", submissionId)
    .maybeSingle();
  return (data as { reference?: string } | null)?.reference ?? null;
}

/**
 * Store a brief. Never throws — the caller must still be able to send the
 * email if the database is unreachable, and vice versa. A lead that reaches
 * one of the two is not a lost lead.
 *
 * `contact` is passed separately and deliberately: it comes from the route's
 * validated form fields, never from the payload, so the stored record cannot
 * disagree with the email that was sent.
 */
export async function saveBrief(
  payload: ValidatedBriefPayload,
  contact: LeadContact
): Promise<SaveBriefResult> {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return { ok: false, reason: "unconfigured" };
  }

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // A retried submission — the first attempt reached us even if its response
    // did not reach the browser — must not become a second lead.
    if (payload.submissionId) {
      const existing = await findBySubmissionId(supabase, payload.submissionId);
      if (existing) return { ok: true, reference: existing, duplicate: true };
    }

    const now = new Date().toISOString();

    const insertBrief = async (): Promise<
      { id: string; reference: string } | { conflictOn: "reference" | "submissionId" } | { error: string }
    > => {
      const id = newBriefId();
      const reference = referenceFrom(id);

      const { error } = await supabase.from("Brief").insert({
        id,
        submissionId: payload.submissionId,
        reference,
        type: payload.type.toUpperCase(),
        locale: payload.locale,
        status: "NEW",

        name: contact.name,
        phone: contact.phone,
        email: contact.email,

        propertyType: payload.project.propertyType,
        propertyName: payload.project.propertyName,
        projectType: payload.project.projectType,
        scope: payload.project.scope,
        numRooms: payload.project.numRooms,
        stylePrefs: payload.project.stylePrefs,
        dimensions: payload.project.dimensions,
        timeline: payload.project.timeline,

        notes: payload.notes,
        photoUrls: payload.photoUrls,
        inspirationUrls: payload.inspirationUrls,
        summary: payload.summary,

        createdAt: now,
        updatedAt: now,
      });

      if (!error) return { id, reference };
      if (error.code === UNIQUE_VIOLATION) {
        const onSubmission = `${error.message} ${error.details ?? ""}`.includes("submissionId");
        return { conflictOn: onSubmission ? "submissionId" : "reference" };
      }
      return { error: error.message };
    };

    let result = await insertBrief();

    // A reference collision is vanishingly unlikely at ten hex characters, but
    // it would otherwise silently cost a lead, so it is retried once.
    if ("conflictOn" in result && result.conflictOn === "reference") {
      result = await insertBrief();
    }

    if ("conflictOn" in result) {
      if (result.conflictOn === "submissionId" && payload.submissionId) {
        const existing = await findBySubmissionId(supabase, payload.submissionId);
        if (existing) return { ok: true, reference: existing, duplicate: true };
      }
      console.error("[leads] unresolved unique conflict on", result.conflictOn);
      return { ok: false, reason: "error", detail: `conflict:${result.conflictOn}` };
    }

    if ("error" in result) {
      console.error("[leads] brief insert failed:", result.error);
      return { ok: false, reason: "error", detail: result.error };
    }

    const { id, reference } = result;

    if (payload.items.length > 0) {
      const rows = payload.items.map((item, index) => ({
        id: newBriefId(),
        briefId: id,
        sortOrder: index,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        fabricId: item.fabricId,
        fabricName: item.fabricName,
        fabricFamily: item.fabricFamily,
        colorId: item.colorId,
        colorName: item.colorName,
        colorHex: item.colorHex,
        patternId: item.patternId,
        patternName: item.patternName,
        options: item.options,
        aiImageUrl: item.aiImageUrl,
        aiDetailImageUrl: item.aiDetailImageUrl,
        notes: item.notes,
        createdAt: now,
        updatedAt: now,
      }));

      const { error: itemsError } = await supabase.from("BriefItem").insert(rows);

      if (itemsError) {
        /**
         * supabase-js cannot span two tables in one transaction, so a failed
         * item insert would otherwise leave a committed brief with no line
         * items while this function reported failure — and a retry would add a
         * second copy. Removing the parent keeps "stored" honest; the email
         * still carries the full brief either way.
         */
        console.error(`[leads] item insert failed for ${reference}:`, itemsError.message);
        const { error: cleanupError } = await supabase.from("Brief").delete().eq("id", id);
        if (cleanupError) {
          console.error(`[leads] orphaned brief ${reference} could not be removed:`, cleanupError.message);
        }
        return { ok: false, reason: "error", detail: itemsError.message };
      }
    }

    return { ok: true, reference, duplicate: false };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown error";
    console.error("[leads] unreachable:", detail);
    return { ok: false, reason: "error", detail };
  }
}

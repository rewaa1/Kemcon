# CRM migration proposal — `Brief`

Apply this in `C:\Users\HP\kemcon-crm`. **Nothing here has been applied for you.**

It gives the website somewhere to put a submitted brief, so a lead is a row you
can query, assign and follow up — not only an email in an inbox.

Until this is applied, the website degrades cleanly: `saveBrief()` returns
`{ ok: false, reason: "unconfigured" }`, the email still sends, and nothing
breaks. See `src/lib/leads.ts`.

---

## 1. Prisma models

Append to `prisma/schema.prisma`:

```prisma
enum BriefType {
  STANDARD
  BULK
  DESIGN
}

enum BriefStatus {
  NEW
  CONTACTED
  QUOTED
  WON
  LOST
}

model Brief {
  /// Supplied by the website, not by Prisma — see §3.
  id        String      @id
  /// Short quotable code, e.g. "KMC-4F2A9C1B3D". Appears in the notification
  /// email subject so the team can match inbox to CRM at a glance.
  reference String      @unique
  /// Identifies one submission across browser retries. If a request times out
  /// after the row was written, the retry carries the same value and is
  /// recognised instead of stored again. Nullable: submissions from before
  /// this column existed, and any future non-browser source, have none.
  submissionId String?  @unique
  type      BriefType
  status    BriefStatus @default(NEW)
  locale    String      @default("en")

  name  String
  phone String
  email String

  /// Project context. Which of these are populated depends on the brief type;
  /// all are nullable so one model covers every route into the form.
  propertyType String?
  propertyName String?
  projectType  String?
  scope        String?
  numRooms     String?
  stylePrefs   String[]
  dimensions   String?
  timeline     String?

  notes           String?
  /// Cloudinary URLs from /api/upload.
  photoUrls       String[]
  /// UploadThing URLs of portfolio images the visitor referenced.
  inspirationUrls String[]

  /// The exact text that was emailed, kept verbatim. Cheap insurance: if the
  /// structured columns ever miss something, the human-readable brief is here.
  summary String

  items BriefItem[]

  /// Optional link to the operational record, set by hand when a lead becomes
  /// a project. SetNull so deleting a Hotel never deletes the enquiry.
  hotelId String?
  hotel   Hotel?  @relation(fields: [hotelId], references: [id], onDelete: SetNull)

  createdAt DateTime
  updatedAt DateTime

  @@index([status, createdAt])
  @@index([email])
  @@index([submissionId])
}

model BriefItem {
  /// Supplied by the website — see §3.
  id        String @id
  sortOrder Int    @default(0)

  briefId String
  brief   Brief  @relation(fields: [briefId], references: [id], onDelete: Cascade)

  /// "curtains" | "chairs" | "sofas" | "bed-sheets" | "custom"
  category String
  quantity Int    @default(1)
  /// What the quantity counts: "panels", "units", "sets". Curtains are quoted
  /// in panels, so a bare number is ambiguous when costing the job.
  unit     String

  /// Catalog references are stored as both id and resolved name. The ids are
  /// the source of truth, but the catalog lives in the website's TypeScript
  /// (`src/data/*`), so the CRM cannot resolve them on its own.
  fabricId     String?
  fabricName   String?
  fabricFamily String?
  colorId      String?
  colorName    String?
  colorHex     String?
  patternId    String?
  patternName  String?

  /// Category-specific choices — curtain control and size, frame/finish/filling,
  /// cushions, pillows, custom description. JSON rather than fifteen nullable
  /// columns that are null for most rows.
  options Json?

  aiImageUrl       String?
  aiDetailImageUrl String?
  notes            String?

  createdAt DateTime
  updatedAt DateTime

  @@index([briefId, sortOrder])
}
```

## 2. One required edit to `Hotel`

Prisma needs the other side of the relation. Add this single field inside the
existing `model Hotel` block — nothing else about `Hotel` changes:

```prisma
model Hotel {
  // ... existing fields unchanged ...
  briefs Brief[]
}
```

## 3. Why `id`, `createdAt` and `updatedAt` have no defaults

`@default(cuid())` and `@updatedAt` are applied by the **Prisma client**, not by
the database. The website inserts through `supabase-js`, not Prisma, so a
`@default(cuid())` column would arrive `NULL` and violate the constraint.

The website therefore supplies all three explicitly. Do not add
`@default(...)`/`@updatedAt` to these fields expecting them to fill themselves —
either leave them as written above, or add real database defaults:

```sql
alter table "Brief"     alter column "id" set default gen_random_uuid()::text;
alter table "Brief"     alter column "createdAt" set default now();
alter table "Brief"     alter column "updatedAt" set default now();
```

## 4. Generate the migration

```bash
npx prisma migrate dev --name add_brief
```

## 5. Row-level security — required, and the opposite of `ShowcaseHotel`

`ShowcaseHotel` needed a permissive read policy so the public anon key could
read published rows. **`Brief` needs the reverse.** It holds customer names,
phone numbers and email addresses; the anon key is shipped in the website's
client bundle and must never be able to read or write it.

Enable RLS and create **no policies at all**. Under Postgres RLS, no policy
means no access — the anon key is then locked out entirely, while the
service-role key the website's API route uses bypasses RLS by design.

```sql
alter table "Brief"     enable row level security;
alter table "BriefItem" enable row level security;

-- Lock the public key out entirely. No policy = no access.
revoke all on "Brief"     from anon, authenticated;
revoke all on "BriefItem" from anon, authenticated;

-- REQUIRED. Bypassing RLS is not the same as having table permissions, and
-- Prisma-created tables do not inherit Supabase's default grants — the same
-- trap documented in crm-showcase-migration.md. Without these the website's
-- service-role insert fails on permissions even though it bypasses the policy
-- check, and every lead silently fails to reach the CRM.
grant select, insert, update, delete on "Brief"     to service_role;
grant select, insert, update, delete on "BriefItem" to service_role;
```

Verify with the anon key — this must return an empty set or a permission error,
never a lead:

```sql
select count(*) from "Brief";
```

## 6. Atomicity — known limitation

`supabase-js` cannot span two tables in one transaction, so `saveBrief()`
inserts the `Brief` and then its `BriefItem` rows as two statements. If the
second fails it deletes the parent, which keeps "stored" honest but is
compensation, not a transaction: a crash between the two leaves an itemless
brief. The email always carries the full enquiry, so nothing is lost to the
business either way.

If you want this to be genuinely atomic, add a Postgres function and have
`saveBrief()` call it via `supabase.rpc()` instead:

```sql
create or replace function insert_brief(brief jsonb, items jsonb)
returns text
language plpgsql
security definer
-- Required. A `security definer` function without a pinned search_path is the
-- classic privilege-escalation vector, and Supabase's own database linter
-- flags it.
set search_path = public, pg_temp
as $$
declare
  new_reference text;
begin
  insert into "Brief" select * from jsonb_populate_record(null::"Brief", brief)
    returning reference into new_reference;
  insert into "BriefItem" select * from jsonb_populate_recordset(null::"BriefItem", items);
  return new_reference;
end;
$$;

revoke all on function insert_brief(jsonb, jsonb) from public, anon;
grant execute on function insert_brief(jsonb, jsonb) to service_role;
```

## 7. Data retention

`Brief` holds customer names, phone numbers and email addresses indefinitely.
That is a deliberate choice to make now rather than by default — if you want a
retention window, a scheduled delete is the simplest form:

```sql
delete from "Brief"
where "status" in ('LOST') and "createdAt" < now() - interval '24 months';
```

## 8. Environment variable

Add to the website's `.env.local` and to Vercel:

```bash
# Service role key — server-side only. NEVER prefix with NEXT_PUBLIC_.
SUPABASE_SERVICE_ROLE_KEY=...
```

`NEXT_PUBLIC_SUPABASE_URL` is already set and is reused. The service-role key is
read only by `src/lib/leads.ts`, which is marked `server-only`, so importing it
from a client component is a build error rather than a leak.

## 9. What the website sends

`src/lib/brief/payload.ts` builds the structured payload; `/api/contact`
validates and trims it, then calls `saveBrief()`. Ordering is deliberate: the
database write happens **before** the email, and the request succeeds if either
channel worked. A lead that reaches one of the two is not a lost lead.

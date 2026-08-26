# CRM migration proposal — `ShowcaseHotel`

Apply this in `C:\Users\HP\kemcon-crm`. Nothing here has been applied for you.

It adds the website's client-showcase content as tables decoupled from the
operational `Hotel`, so the CRM can hold every hotel you have ever worked with
while the marketing site shows only what you publish.

---

## 1. Prisma models

Append to `prisma/schema.prisma`:

```prisma
model ShowcaseHotel {
  id          String   @id @default(cuid())
  /// Matches the id the website already uses, e.g. "sheraton-cairo".
  /// Keeping these stable preserves existing links and analytics.
  slug        String   @unique
  name        String
  nameAr      String?
  /// Display string the website groups and filters by, e.g. "Cairo, Egypt".
  region      String
  regionAr    String?
  stars       Int      @default(5)
  /// UploadThing URLs.
  logoUrl     String
  featuredUrl String
  /// Nothing reaches the public site until this is true.
  isPublished Boolean  @default(false)
  sortOrder   Int      @default(0)

  /// Optional link to the operational record. Nullable so you can feature a
  /// hotel with no CRM projects, and SetNull so deleting a Hotel never
  /// silently removes a published page.
  hotelId String? @unique
  hotel   Hotel?  @relation(fields: [hotelId], references: [id], onDelete: SetNull)

  images ShowcaseHotelImage[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([isPublished, sortOrder])
}

model ShowcaseHotelImage {
  id        String  @id @default(cuid())
  /// UploadThing URL.
  url       String
  alt       String?
  sortOrder Int     @default(0)

  showcaseHotelId String
  showcaseHotel   ShowcaseHotel @relation(fields: [showcaseHotelId], references: [id], onDelete: Cascade)

  @@index([showcaseHotelId, sortOrder])
}
```

## 2. One required edit to `Hotel`

Prisma needs the other side of the relation. Add this single field inside the
existing `model Hotel` block — nothing else about `Hotel` changes:

```prisma
model Hotel {
  // ... existing fields unchanged ...
  showcase ShowcaseHotel?
}
```

## 3. Generate the migration

```bash
npx prisma migrate dev --name add_showcase_hotel
```

## 4. Row-level security — required

Prisma creates tables without Supabase's default grants, and RLS is what stops
the anon key reading unpublished rows. Run this in the Supabase SQL editor
**after** the migration:

```sql
-- Prisma quotes table names in PascalCase.
alter table "ShowcaseHotel"      enable row level security;
alter table "ShowcaseHotelImage" enable row level security;

-- Prisma-created tables do not inherit Supabase's default grants.
grant select on "ShowcaseHotel"      to anon;
grant select on "ShowcaseHotelImage" to anon;

create policy "public_read_published_showcase"
  on "ShowcaseHotel" for select
  to anon
  using ("isPublished" = true);

create policy "public_read_published_showcase_images"
  on "ShowcaseHotelImage" for select
  to anon
  using (
    exists (
      select 1 from "ShowcaseHotel" h
      where h.id = "ShowcaseHotelImage"."showcaseHotelId"
        and h."isPublished" = true
    )
  );
```

Prisma connects through `DATABASE_URL` as the table owner and **bypasses RLS**,
so the CRM admin panel keeps full read/write access. Only the website's anon
key is constrained by these policies.

### Verify it works

With the anon key, this must return only published rows:

```sql
set role anon;
select slug, "isPublished" from "ShowcaseHotel";
reset role;
```

If it returns unpublished rows, the policy is not applied — do not point the
website at the database until it does.

## 5. What the website expects

The site reads `ShowcaseHotel` where `isPublished = true`, ordered by
`sortOrder`, with `images` ordered by their own `sortOrder`. It maps onto the
existing `FeaturedClient` shape:

| Website field | Column |
|---|---|
| `id` | `slug` |
| `name` | `name` |
| `region` | `region` |
| `stars` | `stars` |
| `logo` | `logoUrl` |
| `featured` | `featuredUrl` |
| `rooms[]` | `images[].url` ordered by `sortOrder` |

`nameAr` / `regionAr` are in the schema for parity with the CRM's bilingual
convention. The website does not use them yet — hotel brand names currently
render identically in both locales — so they are optional.

## 6. Env vars the website needs

Add to the Kemcon website's `.env.local` and to Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=<same as the CRM>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key, not the service role key>
```

Never put `DATABASE_URL`, `DIRECT_URL`, or the service role key in the website
project. The anon key plus the policies above is the whole security model.

## 7. Migrating the existing 59 clients

`src/data/clients.ts` in the website holds the current data and image paths.
Until rows exist in `ShowcaseHotel`, the website falls back to that file
automatically, so this can be done gradually — one hotel at a time, publishing
each as its images are uploaded. Nothing breaks in between.

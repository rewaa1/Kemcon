import { test, expect } from "@playwright/test";
import { parseBriefPayload, isOwnImageUrl } from "../src/lib/brief/payloadSchema";
import { referenceFrom, newBriefId } from "../src/lib/brief/reference";

/**
 * Pure tests for the layer that decides what reaches the CRM.
 *
 * These need no browser and no server. That matters: the interesting failures
 * here are all in validation, and the only route-level tests that can run
 * safely are rejections — anything that passes validation would send a real
 * email and write a real row.
 */

const validItem = {
  category: "curtains",
  quantity: 3,
  unit: "panels",
  fabricId: "velvet-royal",
  fabricName: "Royal Velvet",
  fabricFamily: "Velvet",
  colorId: "sage",
  colorName: "Sage",
  colorHex: "#8A9A7B",
  patternId: "damask",
  patternName: "Damask",
  options: { control: "remote" },
  aiImageUrl: null,
  aiDetailImageUrl: null,
  notes: null,
};

const base = {
  submissionId: "11111111-2222-3333-4444-555555555555",
  type: "standard",
  locale: "en",
  project: {},
  notes: null,
  photoUrls: [],
  inspirationUrls: [],
  items: [validItem],
  summary: "a brief",
};

test.describe("brief payload validation", () => {
  test("rejects anything that is not an object", () => {
    expect(parseBriefPayload(null)).toBeNull();
    expect(parseBriefPayload("nope")).toBeNull();
    expect(parseBriefPayload([1, 2, 3])).toBeNull();
  });

  test("never carries contact details", () => {
    // Contact is validated by the route from the form fields. Accepting it
    // here would let a crafted request store a different name than the one
    // that was checked and emailed.
    const parsed = parseBriefPayload({
      ...base,
      contact: { name: "Someone Else", email: "attacker@example.com", phone: "000" },
    });
    expect(parsed).not.toBeNull();
    expect(parsed as unknown as Record<string, unknown>).not.toHaveProperty("contact");
  });

  test("only accepts image URLs from hosts we publish to", () => {
    expect(isOwnImageUrl("https://res.cloudinary.com/x/image/upload/a.jpg")).toBe(true);
    expect(isOwnImageUrl("https://2e3n0iobhs.ufs.sh/f/abc")).toBe(true);
    expect(isOwnImageUrl("https://gen.pollinations.ai/image/x")).toBe(true);

    expect(isOwnImageUrl("https://evil.example.com/a.jpg")).toBe(false);
    expect(isOwnImageUrl("http://res.cloudinary.com/a.jpg")).toBe(false); // not https
    expect(isOwnImageUrl("javascript:alert(1)")).toBe(false);
    expect(isOwnImageUrl(12345)).toBe(false);
  });

  test("drops foreign URLs instead of storing them", () => {
    const parsed = parseBriefPayload({
      ...base,
      photoUrls: [
        "https://res.cloudinary.com/kemcon/image/upload/ok.jpg",
        "https://evil.example.com/tracker.gif",
      ],
      items: [{ ...validItem, aiImageUrl: "https://evil.example.com/x.png" }],
    });

    expect(parsed!.photoUrls).toEqual([
      "https://res.cloudinary.com/kemcon/image/upload/ok.jpg",
    ]);
    expect(parsed!.items[0].aiImageUrl).toBeNull();
  });

  test("keeps the lead when one line item is malformed", () => {
    // A bad item should cost that line, never the whole enquiry.
    const parsed = parseBriefPayload({
      ...base,
      items: [validItem, { category: "not-a-category", quantity: 1, unit: "x" }],
    });

    expect(parsed).not.toBeNull();
    expect(parsed!.items).toHaveLength(1);
    expect(parsed!.items[0].category).toBe("curtains");
  });

  test("coerces quantities that would break an integer column", () => {
    const parse = (quantity: unknown) =>
      parseBriefPayload({ ...base, items: [{ ...validItem, quantity }] })!.items[0].quantity;

    expect(parse("abc")).toBe(1);
    expect(parse(-5)).toBe(1);
    expect(parse(0)).toBe(1);
    expect(parse(2.7)).toBe(2);
    expect(parse("300")).toBe(300);
    expect(parse(10 ** 9)).toBe(100_000);
  });

  test("falls back to a known brief type", () => {
    expect(parseBriefPayload({ ...base, type: "BULK" })!.type).toBe("bulk");
    expect(parseBriefPayload({ ...base, type: "hacked" })!.type).toBe("standard");
    expect(parseBriefPayload({ ...base, type: 42 })!.type).toBe("standard");
  });

  test("survives a project that is missing or the wrong shape", () => {
    expect(parseBriefPayload({ ...base, project: undefined })!.project.scope).toBeNull();
    expect(parseBriefPayload({ ...base, project: "nope" })!.project.stylePrefs).toEqual([]);
    expect(
      parseBriefPayload({ ...base, project: { stylePrefs: [1, "modern", {}] } })!.project.stylePrefs
    ).toEqual(["modern"]);
  });

  test("keeps a long summary instead of truncating it", () => {
    // The summary is the fallback copy of the whole enquiry. Capping it at the
    // same length as a notes field silently cut real briefs in half.
    const long = "x".repeat(40_000);
    expect(parseBriefPayload({ ...base, summary: long })!.summary).toHaveLength(40_000);
  });

  test("caps ordinary text fields", () => {
    const parsed = parseBriefPayload({ ...base, notes: "y".repeat(10_000) });
    expect(parsed!.notes).toHaveLength(5_000);
  });

  test("ignores a submission id that is not one", () => {
    expect(parseBriefPayload({ ...base, submissionId: "../../etc/passwd" })!.submissionId).toBeNull();
    expect(parseBriefPayload({ ...base, submissionId: "short" })!.submissionId).toBeNull();
    expect(parseBriefPayload(base)!.submissionId).toBe(base.submissionId);
  });
});

test.describe("brief reference", () => {
  test("is ten hex characters, so collisions stay improbable", () => {
    // Six characters gives 16.7M values — by the birthday bound that is ~3%
    // likely to collide by 1,000 leads and ~50% by 4,800, and `reference` is
    // unique in the database, so a collision loses a lead.
    const reference = referenceFrom("4f2a9c1b-3d4e-5f60-7a8b-9c0d1e2f3a4b");
    expect(reference).toMatch(/^KMC-[0-9A-F]{10}$/);
  });

  test("pads an id with too little entropy rather than producing a short code", () => {
    expect(referenceFrom("ab")).toMatch(/^KMC-[0-9A-F]{10}$/);
  });

  test("does not collide across a realistic volume of leads", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 10_000; i++) seen.add(referenceFrom(newBriefId()));
    expect(seen.size).toBe(10_000);
  });
});

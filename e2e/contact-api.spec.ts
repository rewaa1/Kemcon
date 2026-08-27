import { test, expect } from "@playwright/test";

/**
 * Route-level tests for `/api/contact`, hitting the real handler with no
 * mocking at the boundary.
 *
 * Every case here is one the route rejects or discards *before* it sends an
 * email or writes a row — anything that passes validation would use the
 * developer's real SMTP credentials and create a real lead, which a test suite
 * must not do. The validation layer itself is covered exhaustively and
 * side-effect-free in brief-payload.spec.ts.
 *
 * Each test sends a distinct `x-forwarded-for`, which is what the route keys
 * its per-IP limiter on. Without that, four tests against a five-per-minute
 * limit would start returning 429 on any quick re-run.
 */

const validBody = {
  name: "Test User",
  phone: "01223122276",
  email: "test@example.com",
  message: "hello",
  locale: "en",
};

test.describe("/api/contact", () => {
  test("rejects a submission with an invalid email", async ({ request }) => {
    const response = await request.post("/api/contact", {
      headers: { "x-forwarded-for": "203.0.113.10" },
      // JSON, matching what the contact page sends. The route parses
      // multipart or JSON only — urlencoded is not a supported content type.
      data: { ...validBody, email: "not-an-email" },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).error).toMatch(/invalid email/i);
  });

  test("rejects a submission with required fields missing", async ({ request }) => {
    const response = await request.post("/api/contact", {
      headers: { "x-forwarded-for": "203.0.113.11" },
      data: { name: "", phone: "", email: "", message: "", locale: "en" },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).error).toMatch(/missing required fields/i);
  });

  test("refuses a request carrying a foreign Origin", async ({ request }) => {
    // A form on someone else's page submitting through a visitor's browser.
    const response = await request.post("/api/contact", {
      headers: {
        "x-forwarded-for": "203.0.113.12",
        origin: "https://evil.example.com",
      },
      data: validBody,
    });

    expect(response.status()).toBe(403);
    expect((await response.json()).error).toMatch(/cross-origin/i);
  });

  test("accepts a same-origin request rather than blocking everything", async ({
    request,
    baseURL,
  }) => {
    // Guards against the check being so strict it rejects the real site. This
    // body still fails validation, which is what keeps the test side-effect
    // free — the point is that it gets *past* the origin guard to reach it.
    const response = await request.post("/api/contact", {
      headers: {
        "x-forwarded-for": "203.0.113.13",
        origin: baseURL!,
      },
      data: { ...validBody, email: "not-an-email" },
    });

    expect(response.status()).toBe(400);
  });

  test("silently discards a submission that filled the honeypot", async ({ request }) => {
    // Answering 200 is deliberate: a 400 would tell the bot which field to
    // leave alone next time. Nothing is emailed and nothing is stored.
    const response = await request.post("/api/contact", {
      headers: { "x-forwarded-for": "203.0.113.14" },
      data: { ...validBody, subject_line: "definitely-a-bot" },
    });

    expect(response.status()).toBe(200);
    expect((await response.json()).ok).toBe(true);
  });
});

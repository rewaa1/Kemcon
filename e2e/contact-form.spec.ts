import { test, expect } from "@playwright/test";

test.describe("Contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/contact");
  });

  test("renders all required fields", async ({ page }) => {
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test("shows validation error when submitting empty form", async ({ page }) => {
    await page.getByRole("button", { name: /send|submit/i }).click();
    // Either HTML5 validation or in-page error should prevent silent submission
    const errorOrRequired =
      (await page.getByText(/required|invalid|missing/i).count()) > 0 ||
      (await page.locator(":invalid").count()) > 0;
    expect(errorOrRequired).toBe(true);
  });

  test("fills and submits form (mocked API)", async ({ page }) => {
    await page.route("/api/contact", async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
    });

    await page.getByLabel(/name/i).fill("Test User");
    await page.getByLabel(/email/i).fill("test@example.com");
    // Message field — try common selectors
    const messageField =
      page.getByLabel(/message/i).first() ||
      page.locator("textarea").first();
    await messageField.fill("Hello from Playwright");

    await page.getByRole("button", { name: /send|submit/i }).click();

    // Success state should appear
    await expect(
      page.getByText(/sent|success|thank you|شكراً/i)
    ).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Contact form — Arabic locale", () => {
  test("loads in RTL without crashing", async ({ page }) => {
    await page.goto("/ar/contact");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  });
});

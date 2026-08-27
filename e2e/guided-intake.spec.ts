import { test, expect } from "@playwright/test";

/**
 * The intake exists to route people who cannot tell which service they need.
 * What matters is the derivation: the answers must land the visitor in the
 * right place and set the brief type, so the brief page later asks for the
 * right project fields.
 */

const briefType = (page: import("@playwright/test").Page) =>
  page.evaluate(() => {
    const raw = localStorage.getItem("kemcon_brief_v1");
    return raw ? JSON.parse(raw).state.type : null;
  });

test.describe("Guided intake", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/products");
    await page.evaluate(() => localStorage.removeItem("kemcon_brief_v1"));
    await page.reload();
  });

  test("asks for scale only when it changes the answer", async ({ page }) => {
    const scaleQuestion = page.getByText("How many rooms?");

    await expect(scaleQuestion).toBeHidden();

    await page.getByRole("button", { name: "A hotel or resort" }).click();
    await expect(scaleQuestion).toBeVisible();

    // A home never needs the follow-up.
    await page.getByRole("button", { name: "My home" }).click();
    await expect(scaleQuestion).toBeHidden();
  });

  test("a home resolves to browsing, without leaving the page", async ({ page }) => {
    await page.getByRole("button", { name: "My home" }).click();

    const cta = page.getByRole("button", { name: /Browse products/i });
    await expect(cta).toBeVisible();
    await cta.click();

    await expect(page).toHaveURL(/\/en\/products$/);
    expect(await briefType(page)).toBe("standard");
  });

  test("a large hotel resolves to a bulk enquiry", async ({ page }) => {
    await page.getByRole("button", { name: "A hotel or resort" }).click();
    await page.getByRole("button", { name: "50+ rooms" }).click();

    await page.getByRole("button", { name: /Start a bulk enquiry/i }).click();

    await expect(page).toHaveURL(/\/en\/products\/mass-production$/);
    expect(await briefType(page)).toBe("bulk");
  });

  test("a few rooms resolves to a design plan", async ({ page }) => {
    await page.getByRole("button", { name: "A hotel or resort" }).click();
    await page.getByRole("button", { name: "1–5 rooms" }).click();

    await page.getByRole("button", { name: /Request a design plan/i }).click();

    await expect(page).toHaveURL(/\/en\/products\/design-plan$/);
    expect(await briefType(page)).toBe("design");
  });

  test("not sure resolves to a design plan without a second question", async ({ page }) => {
    await page.getByRole("button", { name: "Not sure yet" }).click();

    await expect(page.getByText("How many rooms?")).toBeHidden();
    await page.getByRole("button", { name: /Tell us about it/i }).click();

    await expect(page).toHaveURL(/\/en\/products\/design-plan$/);
    expect(await briefType(page)).toBe("design");
  });

  test("offers an advised route for visitors who would rather not self-serve", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "My home" }).click();

    await page.getByRole("button", { name: /Or have our team advise you/i }).click();

    await expect(page).toHaveURL(/\/en\/products\/design-plan$/);
    expect(await briefType(page)).toBe("design");
  });
});

test.describe("Guided intake — Arabic", () => {
  test("renders and routes in RTL", async ({ page }) => {
    await page.goto("/ar/products");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    await page.getByRole("button", { name: "فندق أو منتجع" }).click();
    await page.getByRole("button", { name: "أكثر من 50 غرفة" }).click();
    await page.getByRole("button", { name: /ابدأ طلب الجملة/ }).click();

    await expect(page).toHaveURL(/\/ar\/products\/mass-production$/);
  });
});

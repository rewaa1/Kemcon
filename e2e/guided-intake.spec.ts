import { test, expect, type Page } from "@playwright/test";

/**
 * The intake exists to route people who cannot tell which service they need.
 * What matters is the derivation — the answers must land the visitor in the
 * right place — and that what it learns survives the hand-off, so the
 * destination form does not ask the same question again.
 */

const briefState = (page: Page) =>
  page.evaluate(() => {
    const raw = localStorage.getItem("kemcon_brief_v1");
    return raw ? JSON.parse(raw).state : null;
  });

/** The intake is collapsed by default so it never interrupts the page. */
async function openIntake(page: Page) {
  await page.getByRole("button", { name: /Not sure where to start/i }).click();
}

test.describe("Guided intake", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/products");
    await page.evaluate(() => localStorage.removeItem("kemcon_brief_v1"));
    await page.reload();
  });

  test("stays out of the way until asked for", async ({ page }) => {
    // Collapsed: the questions are not on the page at all.
    await expect(page.getByText("What are you furnishing?")).toBeHidden();

    await openIntake(page);
    await expect(page.getByText("What are you furnishing?")).toBeVisible();

    // And it can be dismissed again.
    await page.getByRole("button", { name: "Hide" }).click();
    await expect(page.getByText("What are you furnishing?")).toBeHidden();
  });

  test("asks for scale only when it changes the answer", async ({ page }) => {
    await openIntake(page);
    const scaleQuestion = page.getByText("How many rooms?");

    await expect(scaleQuestion).toBeHidden();

    await page.getByRole("button", { name: "A hotel or resort" }).click();
    await expect(scaleQuestion).toBeVisible();

    // A home never needs the follow-up.
    await page.getByRole("button", { name: "My home" }).click();
    await expect(scaleQuestion).toBeHidden();
  });

  test("a home resolves to browsing, without leaving the page", async ({ page }) => {
    await openIntake(page);
    await page.getByRole("button", { name: "My home" }).click();

    const cta = page.getByRole("button", { name: /Browse products/i });
    await expect(cta).toBeVisible();
    await cta.click();

    await expect(page).toHaveURL(/\/en\/products$/);
    expect((await briefState(page)).type).toBe("standard");
  });

  test("a large hotel resolves to a bulk enquiry", async ({ page }) => {
    await openIntake(page);
    await page.getByRole("button", { name: "A hotel or resort" }).click();
    await page.getByRole("button", { name: "50+ rooms" }).click();
    await page.getByRole("button", { name: /Start a bulk enquiry/i }).click();

    await expect(page).toHaveURL(/\/en\/products\/mass-production$/);
    expect((await briefState(page)).type).toBe("bulk");
  });

  test("a few rooms resolves to a design plan", async ({ page }) => {
    await openIntake(page);
    await page.getByRole("button", { name: "A hotel or resort" }).click();
    await page.getByRole("button", { name: "1–5 rooms" }).click();
    await page.getByRole("button", { name: /Request a design plan/i }).click();

    await expect(page).toHaveURL(/\/en\/products\/design-plan$/);
    expect((await briefState(page)).type).toBe("design");
  });

  test("not sure resolves to a design plan without a second question", async ({ page }) => {
    await openIntake(page);
    await page.getByRole("button", { name: "Not sure yet" }).click();

    await expect(page.getByText("How many rooms?")).toBeHidden();
    await page.getByRole("button", { name: /Tell us about it/i }).click();

    await expect(page).toHaveURL(/\/en\/products\/design-plan$/);
    expect((await briefState(page)).type).toBe("design");
  });

  test("offers an advised route for visitors who would rather not self-serve", async ({
    page,
  }) => {
    await openIntake(page);
    await page.getByRole("button", { name: "My home" }).click();
    await page.getByRole("button", { name: /Or have our team advise you/i }).click();

    await expect(page).toHaveURL(/\/en\/products\/design-plan$/);
    expect((await briefState(page)).type).toBe("design");
  });
});

/**
 * These are the cases that matter most: the intake previously seeded the brief
 * and the destination form immediately overwrote the seed with its own empty
 * state, so the visitor was asked the same question twice. Asserting only the
 * brief *type* let that pass unnoticed.
 */
test.describe("Guided intake — what it learns survives the hand-off", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/products");
    await page.evaluate(() => localStorage.removeItem("kemcon_brief_v1"));
    await page.reload();
  });

  test("a bulk enquiry keeps the project type through mass production", async ({ page }) => {
    await openIntake(page);
    await page.getByRole("button", { name: "A hotel or resort" }).click();
    await page.getByRole("button", { name: "50+ rooms" }).click();
    await page.getByRole("button", { name: /Start a bulk enquiry/i }).click();
    await expect(page).toHaveURL(/\/products\/mass-production$/);

    // Continue without touching the project type — the seed must survive.
    await page.getByRole("button", { name: /Continue to your brief/i }).click();
    await expect(page).toHaveURL(/\/products\/brief$/);

    const state = await briefState(page);
    expect(state.type).toBe("bulk");
    expect(state.project.projectType).toBe("hotel");
  });

  test("a design plan keeps the property type through the design form", async ({ page }) => {
    await openIntake(page);
    await page.getByRole("button", { name: "An office or venue" }).click();
    await page.getByRole("button", { name: "1–5 rooms" }).click();
    await page.getByRole("button", { name: /Request a design plan/i }).click();
    await expect(page).toHaveURL(/\/products\/design-plan$/);

    await page.getByRole("button", { name: /Continue to your brief/i }).click();
    await expect(page).toHaveURL(/\/products\/brief$/);

    const state = await briefState(page);
    expect(state.type).toBe("design");
    expect(state.project.propertyType).toBe("office");
  });
});

test.describe("Guided intake — Arabic", () => {
  test("renders and routes in RTL", async ({ page }) => {
    await page.goto("/ar/products");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    await page.getByRole("button", { name: /لست متأكدًا من أين تبدأ/ }).click();
    await page.getByRole("button", { name: "فندق أو منتجع" }).click();
    await page.getByRole("button", { name: "أكثر من 50 غرفة" }).click();
    await page.getByRole("button", { name: /ابدأ طلب الجملة/ }).click();

    await expect(page).toHaveURL(/\/ar\/products\/mass-production$/);
  });
});

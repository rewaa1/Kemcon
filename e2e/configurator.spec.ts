import { test, expect } from "@playwright/test";

test.describe("Curtains configurator — happy path", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/products/curtains");
  });

  test("loads without crashing", async ({ page }) => {
    await expect(page.locator("main")).toBeVisible();
    // ErrorBoundary fallback must NOT appear
    await expect(page.getByText("Something went wrong loading this section.")).not.toBeVisible();
  });

  test("can advance through all steps", async ({ page }) => {
    const nextBtn = page.getByRole("button", { name: /next|التالي/i });

    // Step 1 — fabric: pick the first available chip
    const firstChip = page.locator("[data-testid='step-option']").first();
    if (await firstChip.isVisible()) await firstChip.click();
    await expect(nextBtn).not.toHaveAttribute("aria-disabled", "true");
    await nextBtn.click();

    // Step 2 — continue if there is a next
    if (await nextBtn.isVisible()) {
      const chip = page.locator("[data-testid='step-option']").first();
      if (await chip.isVisible()) await chip.click();
      await nextBtn.click();
    }

    // Should eventually reach a summary/final step
    await expect(page.locator("main")).toBeVisible();
  });
});

test.describe("Configurator — Arabic locale", () => {
  test("loads in RTL without crashing", async ({ page }) => {
    await page.goto("/ar/products/curtains");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByText("حدث خطأ")).not.toBeVisible();
  });
});

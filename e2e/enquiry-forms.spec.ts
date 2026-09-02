import { test, expect, type Page } from "@playwright/test";

/**
 * The five product enquiry forms that replaced the step-by-step configurator.
 *
 * What these protect is the gate, not the styling: every category asks the
 * same three things — how many, what building, how to reach you — plus one
 * product answer that makes it quotable, and nothing may be sendable until all
 * of them are given.
 */

/** The one product answer each category cannot be quoted without. */
const CATEGORIES = [
  {
    slug: "curtains",
    heading: /request a curtain quote/i,
    requiredHint: /choose at least one curtain layer/i,
    answer: (page: Page) => page.getByTestId("curtain-layer").first().click(),
  },
  {
    slug: "chairs",
    heading: /request a chair quote/i,
    requiredHint: /choose a frame material/i,
    answer: (page: Page) => page.getByTestId("frame-material").first().click(),
  },
  {
    slug: "sofas",
    heading: /request a sofa quote/i,
    requiredHint: /choose a frame material/i,
    answer: (page: Page) => page.getByTestId("frame-material").first().click(),
  },
  {
    slug: "bed-covers",
    heading: /request a bed cover quote/i,
    requiredHint: /choose a bed size/i,
    answer: (page: Page) => page.getByTestId("bed-size").first().click(),
  },
  {
    slug: "custom",
    heading: /tell us what you need/i,
    requiredHint: /describe what you need/i,
    answer: (page: Page) =>
      page.getByLabel(/what would you like made/i).fill("Forty round linen tablecloths."),
  },
] as const;

async function fillContact(page: Page) {
  await page.getByLabel(/full name/i).fill("Rana Adel");
  await page.getByLabel(/phone number/i).fill("+201234567890");
  await page.getByLabel(/email address/i).fill("rana@example.com");
}

for (const category of CATEGORIES) {
  test.describe(`${category.slug} enquiry form`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/en/products/${category.slug}`);
    });

    test("opens as a form, not a wizard", async ({ page }) => {
      await expect(page.getByRole("heading", { name: category.heading })).toBeVisible();

      // The configurator's controls must not exist on any of these routes.
      await expect(page.getByRole("button", { name: "Next", exact: true })).toHaveCount(0);
      await expect(
        page.getByText("Something went wrong loading this section.")
      ).not.toBeVisible();

      // The shared spine is on screen all at once.
      await expect(page.getByLabel(/how many/i).first()).toBeVisible();
      await expect(page.getByRole("button", { name: "Hotel / Resort" })).toBeVisible();
    });

    test("sending is blocked until every required answer is given", async ({ page }) => {
      const send = page.getByRole("button", { name: /send enquiry/i });
      await expect(send).toBeDisabled();

      await fillContact(page);

      // Contact alone is never enough.
      await expect(send).toBeDisabled();
      await expect(page.getByText(/tell us what you're furnishing/i)).toBeVisible();

      await page.getByRole("button", { name: "Apartment" }).click();
      await expect(page.getByText(category.requiredHint)).toBeVisible();
      await expect(send).toBeDisabled();

      await category.answer(page);
      await expect(send).toBeEnabled();
    });

    test("a named property must be named before it can be sent", async ({ page }) => {
      await fillContact(page);
      await category.answer(page);

      // A flat has no name worth asking for.
      await page.getByRole("button", { name: "Apartment" }).click();
      await expect(page.getByLabel(/what is it called/i)).toHaveCount(0);
      await expect(page.getByRole("button", { name: /send enquiry/i })).toBeEnabled();

      // A hospital does, and the enquiry is held until it is given.
      await page.getByRole("button", { name: "Hospital / Clinic" }).click();
      const nameField = page.getByLabel(/what is it called/i);
      await expect(nameField).toBeVisible();
      await expect(page.getByRole("button", { name: /send enquiry/i })).toBeDisabled();

      await nameField.fill("Nile Specialist Hospital");
      await expect(page.getByRole("button", { name: /send enquiry/i })).toBeEnabled();
    });
  });
}

test.describe("Optional sections", () => {
  test("stay shut until asked for", async ({ page }) => {
    await page.goto("/en/products/curtains");

    // Treatments are offered on every category, not just curtains.
    await expect(page.getByTestId("treatment-option")).toHaveCount(0);
    await page.getByRole("button", { name: /fabric treatments/i }).click();
    await expect(page.getByTestId("treatment-option")).toHaveCount(2);
  });

  test("curtain measurements open with a row and can add more", async ({ page }) => {
    await page.goto("/en/products/curtains");
    await expect(page.getByLabel("Width (cm)")).toHaveCount(0);

    await page.getByRole("button", { name: /measurements/i }).click();
    await expect(page.getByLabel("Width (cm)")).toHaveCount(1);

    await page.getByRole("button", { name: /add another window/i }).click();
    await expect(page.getByLabel("Width (cm)")).toHaveCount(2);

    // Asking for a site visit replaces the rows rather than sitting beside them.
    await page.getByTestId("measure-visit").click();
    await expect(page.getByLabel("Width (cm)")).toHaveCount(0);
  });

  test("custom is not asked to choose a fabric it has no product for", async ({ page }) => {
    await page.goto("/en/products/custom");
    await expect(page.getByRole("button", { name: /fabric, colour & pattern/i })).toHaveCount(0);
    // …but every other category is.
    await page.goto("/en/products/sofas");
    await expect(page.getByRole("button", { name: /fabric, colour & pattern/i })).toBeVisible();
  });

  test("a fabric deep link lands on the form with that section already open", async ({
    page,
  }) => {
    await page.goto("/en/products/curtains?fabric=velvet-royal&fabricFamily=velvet");
    await expect(
      page.getByRole("heading", { name: /fabric, colour & pattern/i })
    ).toBeVisible();
  });
});

test.describe("Enquiry forms — Arabic", () => {
  for (const category of CATEGORIES) {
    test(`${category.slug} renders RTL without crashing`, async ({ page }) => {
      await page.goto(`/ar/products/${category.slug}`);
      await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
      await expect(page.getByText("حدث خطأ")).not.toBeVisible();
    });
  }
});

test.describe("Retired configurator routes", () => {
  test("bed-sheets is gone — the category is bed-covers now", async ({ page }) => {
    const response = await page.goto("/en/products/bed-sheets");
    expect(response?.status()).toBe(404);
  });
});

import { test, expect } from "@playwright/test";

/**
 * The brief is the single lead path for the whole services section, so these
 * cover the parts that used to fail silently: the configurator now records a
 * lead instead of opening a `mailto:`, and the brief survives navigation.
 */

const BRIEF_KEY = "kemcon_brief_v1";

test.describe("Brief — configurator to brief page", () => {
  test("configures a piece, adds it to the brief, and reaches the brief page", async ({
    page,
  }) => {
    // Bed sheets has no AI visualization step, so the flow needs no network
    // image generation: fabric -> colour -> pattern -> pillows -> review.
    await page.goto("/en/products/bed-sheets");

    const next = page.getByRole("button", { name: "Next", exact: true });

    for (const _step of ["fabric", "colour", "pattern"]) {
      const option = page.getByTestId("step-option").first();
      await expect(option).toBeVisible();
      await option.click();
      await expect(next).not.toHaveAttribute("aria-disabled", "true");
      await next.click();
    }

    // Pillow add-on — decline, which is a valid terminal choice.
    await page.getByRole("button", { name: /No, thank you/i }).click();
    await next.click();

    // Review step
    const addToBrief = page.getByRole("button", { name: /Add to Brief/i });
    await expect(addToBrief).toBeVisible();
    await addToBrief.click();

    // The drawer opens on add and shows the item.
    const drawer = page.getByRole("dialog", { name: /Your brief/i });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText(/Bed Sheets/i).first()).toBeVisible();

    await drawer.getByRole("link", { name: /Review & Send/i }).click();
    await expect(page).toHaveURL(/\/en\/products\/brief$/);
    // The drawer must close on navigation, not sit over the brief page.
    await expect(drawer).toBeHidden();
    await expect(page.locator("h1")).toHaveText("Your Brief");

    // The contact form on the brief page is the single submit path.
    await expect(page.getByLabel(/Full Name/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Send Brief/i })).toBeVisible();
  });

  test("pressing the commit button twice updates the item, never duplicates it", async ({
    page,
  }) => {
    await page.goto("/en/products/bed-sheets");
    await page.evaluate(() => localStorage.removeItem("kemcon_brief_v1"));
    await page.reload();

    const next = page.getByRole("button", { name: "Next", exact: true });
    for (const _step of ["fabric", "colour", "pattern"]) {
      await page.getByTestId("step-option").first().click();
      await next.click();
    }
    await page.getByRole("button", { name: /No, thank you/i }).click();
    await next.click();

    const itemCount = () =>
      page.evaluate(() => {
        const raw = localStorage.getItem("kemcon_brief_v1");
        return raw ? JSON.parse(raw).state.items.length : 0;
      });

    await page.getByRole("button", { name: /Add to Brief/i }).click();
    expect(await itemCount()).toBe(1);

    // Drawer opens over the step; dismiss it and commit again.
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: /Update your brief/i }).click();
    expect(await itemCount()).toBe(1);
  });

  test("after sending, the page shows only the confirmation", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) })
    );

    await page.goto("/en/products/brief");
    await page.getByLabel(/Full Name/i).fill("Test User");
    await page.getByLabel(/Phone Number/i).fill("01223122276");
    await page.getByLabel(/Email Address/i).fill("t@example.com");
    await page.getByRole("button", { name: /Send Brief/i }).click();

    await expect(page.getByText(/Brief Sent/i)).toBeVisible();
    await expect(page.locator("h1")).toHaveText("Thank you");
    // Clearing the brief must not leave the empty-state card contradicting the
    // confirmation, which is what it did before.
    await expect(page.getByText(/brief is empty/i)).toHaveCount(0);
  });

  test("brief survives navigation between catalog and configurator", async ({ page }) => {
    await page.goto("/en/products");

    // Seed a brief the way the store persists it, then reload.
    await page.evaluate(
      ([key]) => {
        window.localStorage.setItem(
          key,
          JSON.stringify({
            state: {
              type: "standard",
              items: [
                {
                  id: "test-item-1",
                  category: "curtains",
                  quantity: 3,
                  fabricFamilyId: null,
                  fabricId: null,
                  colorGroupId: null,
                  colorId: null,
                  patternId: null,
                  curtainControl: null,
                  curtainWidth: "",
                  curtainHeight: "",
                  requestMeasurement: false,
                  frameMaterialId: null,
                  frameFinishId: null,
                  fillingId: null,
                  cushionAdd: null,
                  cushionSameFabric: null,
                  cushionQty: null,
                  pillowAdd: null,
                  pillowFill: null,
                  pillowSize: null,
                  customDescription: "",
                  aiImageUrl: null,
                  aiDetailImageUrl: null,
                  notes: "",
                },
              ],
              project: {
                propertyType: "",
                scope: "",
                numRooms: "",
                stylePrefs: [],
                dimensions: "",
                projectType: "",
                propertyName: "",
                timeline: "",
              },
              notes: "",
              inspirationImages: [],
              contact: { name: "", phone: "", email: "" },
            },
            // Must match BRIEF_SCHEMA_VERSION — the store's `migrate` discards
            // any persisted brief written by a different schema version.
            version: 1,
          })
        );
      },
      [BRIEF_KEY]
    );

    await page.reload();

    // The header button reports one product, and it is still there after
    // navigating to a different route.
    const briefButton = page.getByRole("button", { name: /Brief — 1 item/i });
    await expect(briefButton).toBeVisible();

    await page.goto("/en/products/curtains");
    await expect(page.getByRole("button", { name: /Brief — 1 item/i })).toBeVisible();
  });
});

test.describe("Retired routes", () => {
  for (const [from, to] of [
    ["/en/products/configure", "/en/products"],
    ["/en/products/showroom", "/en/products"],
    ["/ar/products/showroom", "/ar/products"],
  ]) {
    test(`${from} redirects to ${to}`, async ({ page }) => {
      await page.goto(from);
      await expect(page).toHaveURL(new RegExp(`${to.replace(/\//g, "\\/")}$`));
    });
  }
});

test.describe("Brief — Arabic", () => {
  test("brief page renders RTL without crashing", async ({ page }) => {
    await page.goto("/ar/products/brief");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { name: "موجزك" })).toBeVisible();
  });
});

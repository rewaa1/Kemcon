import { test, expect } from "@playwright/test";

/**
 * The brief is the single lead path for the whole services section, so these
 * cover the parts that used to fail silently: an enquiry records a lead instead
 * of opening a `mailto:`, and the brief survives navigation.
 */

const BRIEF_KEY = "kemcon_brief_v1";

test.describe("Brief — enquiry form to brief page", () => {
  test("specifies a piece, adds it to the brief, and reaches the brief page", async ({
    page,
  }) => {
    await page.goto("/en/products/bed-covers");

    // The required block: quantity defaults to 1, so only the property and the
    // one product answer have to be given.
    await page.getByRole("button", { name: "Hotel / Resort" }).click();
    await page.getByLabel(/what is it called/i).fill("The Grand Nile Hotel");
    await page.getByTestId("bed-size").filter({ hasText: "King" }).first().click();

    const addToBrief = page.getByRole("button", { name: /Add to my brief/i });
    await expect(addToBrief).toBeEnabled();
    await addToBrief.click();

    await expect(page).toHaveURL(/\/en\/products\/brief$/);
    await expect(page.locator("h1")).toHaveText("Your Brief");
    await expect(page.getByText(/Bed Covers/i).first()).toBeVisible();

    // The contact form on the brief page is the single submit path.
    await expect(page.getByLabel(/Full Name/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Send Brief/i })).toBeVisible();
  });

  test("editing a line item replaces it rather than appending a copy", async ({ page }) => {
    await page.goto("/en/products/bed-covers");
    await page.evaluate(() => localStorage.removeItem("kemcon_brief_v1"));
    await page.reload();

    await page.getByRole("button", { name: "Apartment" }).click();
    await page.getByTestId("bed-size").filter({ hasText: "Queen" }).first().click();

    const items = () =>
      page.evaluate(() => {
        const raw = localStorage.getItem("kemcon_brief_v1");
        return raw
          ? (JSON.parse(raw).state.items as { bedSize: string | null }[])
          : [];
      });

    await page.getByRole("button", { name: /Add to my brief/i }).click();
    await expect(page).toHaveURL(/\/en\/products\/brief$/);
    expect(await items()).toHaveLength(1);
    expect((await items())[0].bedSize).toBe("queen");

    // The pencil reopens that item in its own form, seeded from the brief.
    await page.getByRole("link", { name: /^Edit$/i }).click();
    await expect(page).toHaveURL(/\/en\/products\/bed-covers\?edit=/);

    // Edit mode collects no contact details — the brief page already has them.
    await expect(page.getByRole("button", { name: /send enquiry/i })).toHaveCount(0);

    await page.getByTestId("bed-size").filter({ hasText: "Single" }).first().click();
    await page.getByRole("button", { name: /save changes/i }).click();
    await expect(page).toHaveURL(/\/en\/products\/brief$/);

    // One item, changed — not two.
    expect(await items()).toHaveLength(1);
    expect((await items())[0].bedSize).toBe("single");
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
                  curtainLayerIds: [],
                  curtainSizes: [],
                  requestMeasurement: false,
                  treatmentAntimicrobial: false,
                  treatmentFireRetardant: false,
                  frameMaterialId: null,
                  frameFinishId: null,
                  fillingId: null,
                  cushionAdd: null,
                  cushionSameFabric: null,
                  cushionQty: null,
                  bedSize: null,
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
            version: 3,
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

test.describe("Brief button visibility", () => {
  test("stays out of the header until the brief holds something", async ({ page }) => {
    await page.goto("/en/products");
    await page.evaluate(() => localStorage.removeItem("kemcon_brief_v1"));
    await page.reload();

    // An empty brief has nothing to open, so the header does not offer it.
    await expect(page.getByRole("button", { name: /^Brief/i })).toHaveCount(0);

    // Specify a piece and add it; the header picks it up.
    await page.goto("/en/products/bed-covers");
    await page.getByRole("button", { name: "Apartment" }).click();
    await page.getByTestId("bed-size").filter({ hasText: "King" }).first().click();
    await page.getByRole("button", { name: /Add to my brief/i }).click();
    await expect(page).toHaveURL(/\/en\/products\/brief$/);

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

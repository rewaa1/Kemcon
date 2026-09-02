import { test, expect, type Page, type Request } from "@playwright/test";

/**
 * Journey tracking.
 *
 * What matters is not that events fire, but that they are *true*: the visitor
 * gets exactly one id, a gallery reports the photos actually looked at rather
 * than the arrow presses, and nothing on the page depends on any of it working.
 */

type TrackedEvent = { t: string; at: number; [key: string]: unknown };

/**
 * Captures every event the page beacons out, and swallows the request so no
 * test ever depends on a CRM being reachable.
 */
async function captureEvents(page: Page): Promise<TrackedEvent[]> {
  const events: TrackedEvent[] = [];

  await page.route("**/api/journey", async (route, request: Request) => {
    try {
      const body = request.postData();
      if (body) {
        const parsed = JSON.parse(body) as { events?: TrackedEvent[] };
        if (Array.isArray(parsed.events)) events.push(...parsed.events);
      }
    } catch {
      // A body we cannot parse is a failure the assertions will surface.
    }
    await route.fulfill({ status: 204, body: "" });
  });

  return events;
}

/**
 * Provoke a flush by hiding the tab — the trigger that matters most in
 * production, since that is how most visits actually end.
 */
async function hideTab(page: Page) {
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", {
      value: "hidden",
      configurable: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
}

/**
 * Wait for specific events to arrive rather than for a fixed delay — beacons
 * are batched and the dev server's compile times are unpredictable.
 */
async function expectEvents(events: TrackedEvent[], types: string[]) {
  await expect
    .poll(() => events.map((e) => e.t), { timeout: 15_000 })
    .toEqual(expect.arrayContaining(types));
}


test.describe("Journey tracking", () => {
  /**
   * Nothing is tracked until the visitor accepts analytics — `track()` checks
   * consent at the entry point, so without this every assertion below sees an
   * empty queue and the `kc_vid` cookie is never minted. Granting it up front
   * is what these tests were always assuming.
   */
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: "kc_consent", value: "1:granted", url: "http://localhost:3000" },
    ]);
  });

  test("issues exactly one visitor cookie, and keeps it across pages", async ({ page }) => {
    await page.goto("/en");

    const afterFirst = (await page.context().cookies()).filter((c) => c.name === "kc_vid");
    expect(afterFirst).toHaveLength(1);
    expect(afterFirst[0].httpOnly).toBe(true);
    expect(afterFirst[0].sameSite).toBe("Lax");

    // A reload and a navigation must not mint a second identity.
    await page.reload();
    await page.goto("/en/clients");

    const afterMore = (await page.context().cookies()).filter((c) => c.name === "kc_vid");
    expect(afterMore).toHaveLength(1);
    expect(afterMore[0].value).toBe(afterFirst[0].value);
  });

  test("records page views and engaged time", async ({ page }) => {
    const events = await captureEvents(page);

    await page.goto("/en");
    /**
     * Comfortably past the 1s noise floor in dwell.ts. It has to be measured
     * from hydration, not from `goto` — the timer only starts once the provider
     * mounts, which is several hundred milliseconds later.
     */
    await page.waitForTimeout(2500);
    // Hiding the tab is how most visits really end, and it must be enough on
    // its own to report the time — no navigation required.
    await hideTab(page);

    await expectEvents(events, ["page_view", "page_dwell"]);

    const dwell = events.find((e) => e.t === "page_dwell")!;
    expect(dwell.engagedMs as number).toBeGreaterThan(500);
    expect(dwell.maxScrollPct as number).toBeGreaterThanOrEqual(0);
  });

  test("counts distinct gallery photos, not arrow presses", async ({ page }) => {
    const events = await captureEvents(page);

    await page.goto("/en/clients");
    await page.locator(".group.cursor-pointer").first().click();

    const next = page.getByRole("button", { name: "Next image" });
    const prev = page.getByRole("button", { name: "Previous image" });
    await expect(next).toBeVisible();

    // Forward to photo 3, then back to 2 and forward again. Four presses, but
    // only three distinct photos were ever on screen.
    await next.click();
    await next.click();
    await prev.click();
    await next.click();

    await page.getByRole("button", { name: "Close lightbox" }).click();
    await hideTab(page);

    await expectEvents(events, ["client_gallery_open", "client_gallery_close"]);

    const opened = events.find((e) => e.t === "client_gallery_open")!;
    expect(opened.clientId).toBeTruthy();

    const closed = events.find((e) => e.t === "client_gallery_close")!;
    expect(closed.imagesViewed, "three distinct photos, not four presses").toBe(3);
    expect(closed.maxIndex).toBe(2);
    expect(closed.totalImages as number).toBeGreaterThanOrEqual(3);
    expect(closed.dwellMs as number).toBeGreaterThan(0);
  });

  test("records the product view and the moment an enquiry becomes quotable", async ({
    page,
  }) => {
    const events = await captureEvents(page);

    await page.goto("/en/products/chairs");
    // The form is a dynamic import, so nothing is tracked until it is on screen.
    await expect(page.getByRole("button", { name: "Hotel / Resort" })).toBeVisible({
      timeout: 60_000,
    });

    await expectEvents(events, ["product_view"]);
    const view = events.find((e) => e.t === "product_view")!;
    expect(view.category).toBe("chairs");
    // The page is entered once, however much the visitor edits.
    expect(events.filter((e) => e.t === "product_view")).toHaveLength(1);

    // `enquiry_configured` is what keeps the CRM funnel's "configured" stage
    // populated now that there are no configurator steps to emit. It must not
    // fire until the required block is actually complete.
    expect(events.filter((e) => e.t === "enquiry_configured")).toHaveLength(0);

    await page.getByRole("button", { name: "Apartment" }).click();
    await page.getByTestId("frame-material").first().click();
    await hideTab(page);

    await expectEvents(events, ["enquiry_configured"]);
    const configured = events.find((e) => e.t === "enquiry_configured")!;
    expect(configured.category).toBe("chairs");
    // Once per visit, not once per keystroke.
    expect(events.filter((e) => e.t === "enquiry_configured")).toHaveLength(1);
  });

  test("the page still works when tracking cannot reach the server", async ({ page }) => {
    // Every beacon fails outright. Nothing about the visit should change.
    await page.route("**/api/journey", (route) => route.abort());

    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/en/clients");
    await page.locator(".group.cursor-pointer").first().click();
    await expect(page.getByRole("button", { name: "Next image" })).toBeVisible();
    await page.getByRole("button", { name: "Close lightbox" }).click();

    expect(errors, "a failed beacon must never surface as a page error").toEqual([]);
  });
});

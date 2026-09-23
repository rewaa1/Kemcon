# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: journey.spec.ts >> Journey tracking >> counts distinct gallery photos, not arrow presses
- Location: e2e\journey.spec.ts:112:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.group.cursor-pointer').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to main content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e3]:
    - navigation [ref=e4]:
      - generic [ref=e5]:
        - link "KEMCON" [ref=e6] [cursor=pointer]:
          - /url: /en
          - generic [ref=e8]: KEMCON
        - generic [ref=e9]:
          - link "Home" [ref=e10] [cursor=pointer]:
            - /url: /en
          - link "About" [ref=e11] [cursor=pointer]:
            - /url: /en/about
          - link "Services" [ref=e12] [cursor=pointer]:
            - /url: /en/services
          - link "Our Clients" [ref=e13] [cursor=pointer]:
            - /url: /en/clients
            - text: Our Clients
          - link "Contact" [ref=e15] [cursor=pointer]:
            - /url: /en/contact
        - button "EN | عربي" [ref=e17] [cursor=pointer]:
          - generic [ref=e18]: EN
          - generic [ref=e19]: "|"
          - generic [ref=e20]: عربي
  - main [ref=e21]:
    - generic [ref=e25]:
      - generic [ref=e26]: Our Partners
      - heading "Trusted by Leading Hotels" [level=1] [ref=e28]
      - paragraph [ref=e32]: Kemcon proudly serves prestigious hotels and resorts across Egypt, Saudi Arabia, Emirates, and Jordan.
    - generic [ref=e35]:
      - generic [ref=e36]:
        - paragraph [ref=e37]: 100+
        - paragraph [ref=e38]: Egypt
        - paragraph [ref=e39]: Hotels Served
      - generic [ref=e40]:
        - paragraph [ref=e41]: 10+
        - paragraph [ref=e42]: Saudi Arabia
        - paragraph [ref=e43]: Hotels Served
      - generic [ref=e44]:
        - paragraph [ref=e45]: 5+
        - paragraph [ref=e46]: Emirates
        - paragraph [ref=e47]: Hotels Served
      - generic [ref=e48]:
        - paragraph [ref=e49]: 10+
        - paragraph [ref=e50]: Jordan
        - paragraph [ref=e51]: Hotels Served
    - generic [ref=e53]:
      - generic [ref=e54]:
        - generic [ref=e56]: Our Partners
        - heading "Our Clients" [level=2] [ref=e58]
      - generic [ref=e61]:
        - generic [ref=e62]:
          - generic [ref=e63]:
            - generic [ref=e64]: Cairo, Egypt
            - img [ref=e66]
          - heading "Sheraton Cairo Hotel" [level=3] [ref=e67]
          - generic [ref=e70]: ★★★★★
        - generic [ref=e71]:
          - generic [ref=e72]:
            - generic [ref=e73]: Cairo, Egypt
            - img [ref=e75]
          - heading "Meridian Heliopolis" [level=3] [ref=e76]
          - generic [ref=e79]: ★★★★★
        - generic [ref=e80]:
          - generic [ref=e81]:
            - generic [ref=e82]: Cairo, Egypt
            - img [ref=e84]
          - heading "Four Seasons Hotel Cairo at The First Residence" [level=3] [ref=e85]
          - generic [ref=e88]: ★★★★★
        - generic [ref=e89]:
          - generic [ref=e90]:
            - generic [ref=e91]: Cairo, Egypt
            - img [ref=e93]
          - heading "Ramses Hilton" [level=3] [ref=e94]
          - generic [ref=e97]: ★★★★★
        - generic [ref=e98]:
          - generic [ref=e99]:
            - generic [ref=e100]: Cairo, Egypt
            - img [ref=e102]
          - heading "Hilton World Trade Center" [level=3] [ref=e103]
          - generic [ref=e106]: ★★★★★
        - generic [ref=e107]:
          - generic [ref=e108]:
            - generic [ref=e109]: Cairo, Egypt
            - img [ref=e111]
          - heading "Hilton Pyramids Golf" [level=3] [ref=e112]
          - generic [ref=e115]: ★★★★★
        - generic [ref=e116]:
          - generic [ref=e117]:
            - generic [ref=e118]: Giza, Egypt
            - img [ref=e120]
          - heading "Helnan Dreamland Hotel & Conference Center" [level=3] [ref=e121]
          - generic [ref=e124]: ★★★★★
        - generic [ref=e125]:
          - generic [ref=e126]:
            - generic [ref=e127]: Giza, Egypt
            - img [ref=e129]
          - heading "Marriott Mena House" [level=3] [ref=e130]
          - generic [ref=e133]: ★★★★★
        - generic [ref=e134]:
          - generic [ref=e135]:
            - generic [ref=e136]: Cairo, Egypt
            - img [ref=e138]
          - heading "Cairo Marriott Hotel" [level=3] [ref=e139]
          - generic [ref=e142]: ★★★★★
        - generic [ref=e143]:
          - generic [ref=e144]:
            - generic [ref=e145]: Cairo, Egypt
            - img [ref=e147]
          - heading "Conrad Cairo" [level=3] [ref=e148]
          - generic [ref=e151]: ★★★★★
        - generic [ref=e152]:
          - generic [ref=e153]:
            - generic [ref=e154]: Cairo, Egypt
            - img [ref=e156]
          - heading "Concorde El Salam Hotel" [level=3] [ref=e157]
          - generic [ref=e160]: ★★★★★
        - generic [ref=e161]:
          - generic [ref=e162]:
            - generic [ref=e163]: Cairo, Egypt
            - img [ref=e165]
          - heading "Hyatt Regency Cairo West" [level=3] [ref=e166]
          - generic [ref=e169]: ★★★★★
      - button "Load More 47 remaining" [ref=e171]:
        - generic [ref=e172]: Load More
        - generic [ref=e173]: 47 remaining
    - generic [ref=e178]:
      - heading "Experience Kemcon Quality" [level=2] [ref=e180]
      - paragraph [ref=e182]: Bring hotel-grade luxury into your home. Discover our premium collection of fabrics and furnishings.
      - link "Get in Touch" [ref=e184] [cursor=pointer]:
        - /url: /en/contact
        - generic [ref=e185]: Get in Touch
  - contentinfo [ref=e187]:
    - generic [ref=e189]:
      - generic [ref=e190]:
        - link "KEMCON" [ref=e191] [cursor=pointer]:
          - /url: /en
          - generic [ref=e192]: KEMCON
        - paragraph [ref=e193]: Established in 1985, Kemcon is a leading manufacturing group specialising in premium fabrics and furnishings for elite hotels and homes across the Middle East.
        - paragraph [ref=e194]: Serving luxury since 1985
      - generic [ref=e195]:
        - heading "Quick Links" [level=4] [ref=e196]
        - list [ref=e197]:
          - listitem [ref=e198]:
            - link "Home" [ref=e199] [cursor=pointer]:
              - /url: /en
          - listitem [ref=e200]:
            - link "About" [ref=e201] [cursor=pointer]:
              - /url: /en/about
          - listitem [ref=e202]:
            - link "Services" [ref=e203] [cursor=pointer]:
              - /url: /en/services
          - listitem [ref=e204]:
            - link "Our Clients" [ref=e205] [cursor=pointer]:
              - /url: /en/clients
          - listitem [ref=e206]:
            - link "Contact" [ref=e207] [cursor=pointer]:
              - /url: /en/contact
      - generic [ref=e208]:
        - heading "Get in Touch" [level=4] [ref=e209]
        - list [ref=e210]:
          - listitem [ref=e211]:
            - img [ref=e212]
            - link "Showroom — Cairo, Egypt" [ref=e216] [cursor=pointer]:
              - /url: https://maps.app.goo.gl/P258pkoaV3g7dLHP7
          - listitem [ref=e217]:
            - img [ref=e218]
            - link "Factory — Cairo, Egypt" [ref=e220] [cursor=pointer]:
              - /url: https://maps.app.goo.gl/DCcFrvaM21skeTs1A
          - listitem [ref=e221]:
            - img [ref=e222]
            - link "+20 12 23122276" [ref=e224] [cursor=pointer]:
              - /url: https://wa.me/201223122276
          - listitem [ref=e225]:
            - img [ref=e226]
            - link "02 23546722" [ref=e228] [cursor=pointer]:
              - /url: tel:+20223546722
          - listitem [ref=e229]:
            - img [ref=e230]
            - generic [ref=e232]: kemcon@yahoo.com
          - listitem [ref=e233]:
            - img [ref=e234]
            - generic [ref=e236]: "Sunday - Thursday: 9:00 AM - 6:00 PM"
      - generic [ref=e237]:
        - heading "Follow Us" [level=4] [ref=e238]
        - link [ref=e240] [cursor=pointer]:
          - /url: https://web.facebook.com/profile.php?id=100076584950929
          - img [ref=e241]
    - generic [ref=e245]:
      - paragraph [ref=e246]: © 2026 Kemcon. All Rights Reserved.
      - navigation [ref=e247]:
        - link "Privacy Policy" [ref=e248] [cursor=pointer]:
          - /url: /en/privacy
        - link "Terms & Conditions" [ref=e249] [cursor=pointer]:
          - /url: /en/terms
        - button "Cookie settings" [ref=e250]
  - generic [ref=e255] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e256]:
      - img [ref=e257]
    - generic [ref=e260]:
      - button "Open issues overlay" [ref=e261]:
        - generic [ref=e262]:
          - generic [ref=e263]: "0"
          - generic [ref=e264]: "1"
        - generic [ref=e265]: Issue
      - button "Collapse issues badge" [ref=e266]:
        - img [ref=e267]
  - alert [ref=e269]
```

# Test source

```ts
  16  |  */
  17  | async function captureEvents(page: Page): Promise<TrackedEvent[]> {
  18  |   const events: TrackedEvent[] = [];
  19  | 
  20  |   await page.route("**/api/journey", async (route, request: Request) => {
  21  |     try {
  22  |       const body = request.postData();
  23  |       if (body) {
  24  |         const parsed = JSON.parse(body) as { events?: TrackedEvent[] };
  25  |         if (Array.isArray(parsed.events)) events.push(...parsed.events);
  26  |       }
  27  |     } catch {
  28  |       // A body we cannot parse is a failure the assertions will surface.
  29  |     }
  30  |     await route.fulfill({ status: 204, body: "" });
  31  |   });
  32  | 
  33  |   return events;
  34  | }
  35  | 
  36  | /**
  37  |  * Provoke a flush by hiding the tab — the trigger that matters most in
  38  |  * production, since that is how most visits actually end.
  39  |  */
  40  | async function hideTab(page: Page) {
  41  |   await page.evaluate(() => {
  42  |     Object.defineProperty(document, "visibilityState", {
  43  |       value: "hidden",
  44  |       configurable: true,
  45  |     });
  46  |     document.dispatchEvent(new Event("visibilitychange"));
  47  |   });
  48  | }
  49  | 
  50  | /**
  51  |  * Wait for specific events to arrive rather than for a fixed delay — beacons
  52  |  * are batched and the dev server's compile times are unpredictable.
  53  |  */
  54  | async function expectEvents(events: TrackedEvent[], types: string[]) {
  55  |   await expect
  56  |     .poll(() => events.map((e) => e.t), { timeout: 15_000 })
  57  |     .toEqual(expect.arrayContaining(types));
  58  | }
  59  | 
  60  | 
  61  | test.describe("Journey tracking", () => {
  62  |   /**
  63  |    * Nothing is tracked until the visitor accepts analytics — `track()` checks
  64  |    * consent at the entry point, so without this every assertion below sees an
  65  |    * empty queue and the `kc_vid` cookie is never minted. Granting it up front
  66  |    * is what these tests were always assuming.
  67  |    */
  68  |   test.beforeEach(async ({ context }) => {
  69  |     await context.addCookies([
  70  |       { name: "kc_consent", value: "1:granted", url: "http://localhost:3000" },
  71  |     ]);
  72  |   });
  73  | 
  74  |   test("issues exactly one visitor cookie, and keeps it across pages", async ({ page }) => {
  75  |     await page.goto("/en");
  76  | 
  77  |     const afterFirst = (await page.context().cookies()).filter((c) => c.name === "kc_vid");
  78  |     expect(afterFirst).toHaveLength(1);
  79  |     expect(afterFirst[0].httpOnly).toBe(true);
  80  |     expect(afterFirst[0].sameSite).toBe("Lax");
  81  | 
  82  |     // A reload and a navigation must not mint a second identity.
  83  |     await page.reload();
  84  |     await page.goto("/en/clients");
  85  | 
  86  |     const afterMore = (await page.context().cookies()).filter((c) => c.name === "kc_vid");
  87  |     expect(afterMore).toHaveLength(1);
  88  |     expect(afterMore[0].value).toBe(afterFirst[0].value);
  89  |   });
  90  | 
  91  |   test("records page views and engaged time", async ({ page }) => {
  92  |     const events = await captureEvents(page);
  93  | 
  94  |     await page.goto("/en");
  95  |     /**
  96  |      * Comfortably past the 1s noise floor in dwell.ts. It has to be measured
  97  |      * from hydration, not from `goto` — the timer only starts once the provider
  98  |      * mounts, which is several hundred milliseconds later.
  99  |      */
  100 |     await page.waitForTimeout(2500);
  101 |     // Hiding the tab is how most visits really end, and it must be enough on
  102 |     // its own to report the time — no navigation required.
  103 |     await hideTab(page);
  104 | 
  105 |     await expectEvents(events, ["page_view", "page_dwell"]);
  106 | 
  107 |     const dwell = events.find((e) => e.t === "page_dwell")!;
  108 |     expect(dwell.engagedMs as number).toBeGreaterThan(500);
  109 |     expect(dwell.maxScrollPct as number).toBeGreaterThanOrEqual(0);
  110 |   });
  111 | 
  112 |   test("counts distinct gallery photos, not arrow presses", async ({ page }) => {
  113 |     const events = await captureEvents(page);
  114 | 
  115 |     await page.goto("/en/clients");
> 116 |     await page.locator(".group.cursor-pointer").first().click();
      |                                                         ^ Error: locator.click: Test timeout of 30000ms exceeded.
  117 | 
  118 |     const next = page.getByRole("button", { name: "Next image" });
  119 |     const prev = page.getByRole("button", { name: "Previous image" });
  120 |     await expect(next).toBeVisible();
  121 | 
  122 |     // Forward to photo 3, then back to 2 and forward again. Four presses, but
  123 |     // only three distinct photos were ever on screen.
  124 |     await next.click();
  125 |     await next.click();
  126 |     await prev.click();
  127 |     await next.click();
  128 | 
  129 |     await page.getByRole("button", { name: "Close lightbox" }).click();
  130 |     await hideTab(page);
  131 | 
  132 |     await expectEvents(events, ["client_gallery_open", "client_gallery_close"]);
  133 | 
  134 |     const opened = events.find((e) => e.t === "client_gallery_open")!;
  135 |     expect(opened.clientId).toBeTruthy();
  136 | 
  137 |     const closed = events.find((e) => e.t === "client_gallery_close")!;
  138 |     expect(closed.imagesViewed, "three distinct photos, not four presses").toBe(3);
  139 |     expect(closed.maxIndex).toBe(2);
  140 |     expect(closed.totalImages as number).toBeGreaterThanOrEqual(3);
  141 |     expect(closed.dwellMs as number).toBeGreaterThan(0);
  142 |   });
  143 | 
  144 |   test("records the product view and the moment an enquiry becomes quotable", async ({
  145 |     page,
  146 |   }) => {
  147 |     const events = await captureEvents(page);
  148 | 
  149 |     await page.goto("/en/services/chairs");
  150 |     // The form is a dynamic import, so nothing is tracked until it is on screen.
  151 |     await expect(page.getByRole("button", { name: "Hotel / Resort" })).toBeVisible({
  152 |       timeout: 60_000,
  153 |     });
  154 | 
  155 |     await expectEvents(events, ["product_view"]);
  156 |     const view = events.find((e) => e.t === "product_view")!;
  157 |     expect(view.category).toBe("chairs");
  158 |     // The page is entered once, however much the visitor edits.
  159 |     expect(events.filter((e) => e.t === "product_view")).toHaveLength(1);
  160 | 
  161 |     // `enquiry_configured` is what keeps the CRM funnel's "configured" stage
  162 |     // populated now that there are no configurator steps to emit. It must not
  163 |     // fire until the required block is actually complete.
  164 |     expect(events.filter((e) => e.t === "enquiry_configured")).toHaveLength(0);
  165 | 
  166 |     await page.getByRole("button", { name: "Apartment" }).click();
  167 |     await page.getByTestId("frame-material").first().click();
  168 |     await hideTab(page);
  169 | 
  170 |     await expectEvents(events, ["enquiry_configured"]);
  171 |     const configured = events.find((e) => e.t === "enquiry_configured")!;
  172 |     expect(configured.category).toBe("chairs");
  173 |     // Once per visit, not once per keystroke.
  174 |     expect(events.filter((e) => e.t === "enquiry_configured")).toHaveLength(1);
  175 |   });
  176 | 
  177 |   test("the page still works when tracking cannot reach the server", async ({ page }) => {
  178 |     // Every beacon fails outright. Nothing about the visit should change.
  179 |     await page.route("**/api/journey", (route) => route.abort());
  180 | 
  181 |     const errors: string[] = [];
  182 |     page.on("pageerror", (error) => errors.push(error.message));
  183 | 
  184 |     await page.goto("/en/clients");
  185 |     await page.locator(".group.cursor-pointer").first().click();
  186 |     await expect(page.getByRole("button", { name: "Next image" })).toBeVisible();
  187 |     await page.getByRole("button", { name: "Close lightbox" }).click();
  188 | 
  189 |     expect(errors, "a failed beacon must never surface as a page error").toEqual([]);
  190 |   });
  191 | });
  192 | 
```
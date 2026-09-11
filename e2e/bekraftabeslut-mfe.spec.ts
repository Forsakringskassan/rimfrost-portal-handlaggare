import {
  expect,
  gotoPortal,
  mockBekraftabeslutEndpoints,
  mockBekraftabeslutUppgift,
  mockBffApis,
  test,
} from "./fixtures";

// Exercises the real bekraftabeslut-fe micro frontend (built and served on :3033
// by the playwright.config.ts webServer entry) through Module Federation, the
// same way the portal loads it in production — only the downstream BFF calls the
// remote itself makes are mocked (handlaggning data, 4 referensdata endpoints,
// PATCH, done, uppgiftsbeskrivning).
const listLabel = "fta-001: Bekräfta beslut";

test.describe("bekraftabeslut MFE", () => {
  test("laddar och visar beslutsdata", async ({ page }) => {
    await mockBffApis(page, [mockBekraftabeslutUppgift]);
    await mockBekraftabeslutEndpoints(page);
    await gotoPortal(page);

    await page.getByText(listLabel).click();
    await expect(page).toHaveURL(/\/items\/uppg-bekrafta-001/);

    await expect(page.getByText("Lisa Tass")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Region Dalarna")).toBeVisible();
    await expect(page.locator(".error-message")).not.toBeVisible();
  });

  test("bekräftar beslut när alla val är gjorda", async ({ page }) => {
    await mockBffApis(page, [mockBekraftabeslutUppgift]);
    await mockBekraftabeslutEndpoints(page);
    await gotoPortal(page);

    await page.getByText(listLabel).click();
    await expect(page.getByText("Lisa Tass")).toBeVisible({ timeout: 15_000 });

    await page
      .locator("#avslutstyp")
      .selectOption({ label: "Automatiskt avslut" });
    await page.locator("#beslutstyp").selectOption({ label: "Bifall" });
    await page.locator("#beslutsutfall").selectOption({ label: "Ja" });

    const patchRequest = page.waitForRequest(
      (req) =>
        req.url().includes("/api/regel/bekraftabeslut/") &&
        !req.url().includes("handlaggning") &&
        req.method() === "PATCH",
    );
    const doneRequest = page.waitForRequest(
      (req) =>
        req.url().includes("/api/regel/bekraftabeslut/done") &&
        req.method() === "POST",
    );
    await page
      .getByRole("button", { name: "Bekräfta beslut", exact: true })
      .click();
    await patchRequest;
    await doneRequest;
  });

  test("visar fel när fastställt-status saknas i referensdata", async ({
    page,
  }) => {
    await mockBffApis(page, [mockBekraftabeslutUppgift]);
    await mockBekraftabeslutEndpoints(page, undefined, {
      avslutstyp: [
        { id: "a1", kod: "AUTOMATISKT", namn: "Automatiskt avslut" },
      ],
      beslutstyp: [{ id: "b1", kod: "BIFALL", namn: "Bifall" }],
      beslutsutfallstyp: [{ id: "u1", kod: "JA", namn: "Ja" }],
      yrkandestatus: [],
    });
    await gotoPortal(page);

    await page.getByText(listLabel).click();
    await expect(
      page.getByText(
        "Det är inte möjligt att bekräfta beslut eftersom referensdata saknas.",
      ),
    ).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByRole("button", { name: "Bekräfta beslut", exact: true }),
    ).toBeDisabled();
  });

  // KNOWN BUG (found via this test, not fixed here — flagged for the team):
  // BekraftaBeslutKomponent.vue's error <p> lives inside
  // `v-if="!isInfoLoading && store.data"`. fetchBeslutsdata only ever sets
  // store.error when the fetch *fails*, i.e. exactly when store.data stays
  // null — so the error message can never actually render; the page just
  // goes blank instead of showing "Tjänsten är inte tillgänglig...". This
  // test documents the current (broken) behavior rather than the intended one.
  test("går blank vid backend-fel istället för att visa felmeddelande (känd bugg)", async ({
    page,
  }) => {
    await mockBffApis(page, [mockBekraftabeslutUppgift]);
    await mockBekraftabeslutEndpoints(page, { status: 503 });
    await gotoPortal(page);

    await page.getByText(listLabel).click();
    await expect(page).toHaveURL(/\/items\/uppg-bekrafta-001/);
    await expect(page.locator(".beslut-information")).toHaveCount(0);
    await expect(
      page.getByText("Tjänsten är inte tillgänglig", { exact: false }),
    ).toHaveCount(0);
  });
});

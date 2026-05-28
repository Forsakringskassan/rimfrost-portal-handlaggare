import { expect, gotoPortal, mockBffApis, test } from "./fixtures";

test.describe("Portal – grundläggande", () => {
  test.beforeEach(async ({ page }) => {
    await mockBffApis(page);
    await gotoPortal(page);
  });

  test("visar programmets rubrik", async ({ page }) => {
    await expect(page.getByText("Rimfrost Demoapp")).toBeVisible();
  });

  test("visar sidopanelens rubrik 'Uppgifter'", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Uppgifter" }),
    ).toBeVisible();
  });

  test("visar tom vy när ingen uppgift är vald", async ({ page }) => {
    await expect(page.getByText("Ingen uppgift vald")).toBeVisible();
  });

  test("visar handläggare i dropdown", async ({ page }) => {
    const dropdown = page.locator("#handlaggare-dropdown");
    await expect(dropdown).toBeVisible();
    await expect(
      dropdown.getByRole("option", { name: "Anna Andersson" }),
    ).toBeAttached();
    await expect(
      dropdown.getByRole("option", { name: "Björn Bergström" }),
    ).toBeAttached();
  });

  test("visar sidopanelens knappar", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Hämta ny uppgift" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Ladda template MFE" }),
    ).toBeVisible();
  });

  test("visar toast-notifiering vid task-done event", async ({ page }) => {
    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent("task-done", {
          detail: { message: "Uppgift slutförd med framgång" },
        }),
      );
    });
    await expect(page.getByText("Uppgift slutförd med framgång")).toBeVisible();
  });

  test("navigerar till startsidan vid klick på rubriken", async ({ page }) => {
    await page.goto("/items/remoteExample");
    await page.waitForLoadState("networkidle");
    await page.getByText("Rimfrost Demoapp").click();
    await expect(page).toHaveURL("/");
  });
});

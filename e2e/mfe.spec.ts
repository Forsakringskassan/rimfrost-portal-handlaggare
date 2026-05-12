import { expect, gotoPortal, mockBffApis, test } from "./fixtures";

test.describe("MFE-laddning", () => {
  test.beforeEach(async ({ page }) => {
    await mockBffApis(page);
    await gotoPortal(page);
  });

  test("navigerar till MFE-rutten vid klick på 'Ladda template MFE'", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Ladda template MFE" }).click();
    await expect(page).toHaveURL(/\/items\/remoteExample/);
  });

  test("laddar template MFE-komponenten", async ({ page }) => {
    await page.getByRole("button", { name: "Ladda template MFE" }).click();
    await expect(page).toHaveURL(/\/items\/remoteExample/);
    // Wait for loader to disappear and component to mount
    await expect(
      page.locator("f-loader").filter({ hasText: "Vänligen vänta" }),
    ).not.toBeVisible({ timeout: 15_000 });
    await expect(page.locator(".error-message")).not.toBeVisible();
  });

  test("visar felmeddelande när MFE inte kan laddas", async ({ page }) => {
    // Override manifest with unreachable entry — registered after beforeEach so it takes precedence
    await page.route("**/api/route-manifest", async (route) => {
      await route.fulfill({
        json: {
          routes: {
            remoteExample: {
              scope: "microFeTemplateApp",
              module: "./ExampleComponent",
              devEntry: "http://localhost:9999/mf-manifest.json",
              prodEntry: "",
            },
          },
        },
      });
    });
    // Abort immediately so the test doesn't wait for a TCP timeout
    await page.route("http://localhost:9999/**", async (route) => {
      await route.abort("connectionrefused");
    });

    await page.getByRole("button", { name: "Ladda template MFE" }).click();
    await expect(
      page.getByText("Kunde inte ladda komponent", { exact: false }),
    ).toBeVisible({ timeout: 15_000 });
  });
});

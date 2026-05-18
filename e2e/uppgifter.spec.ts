import { expect, gotoPortal, mockBffApis, mockUppgift, test } from "./fixtures";

test.describe("Uppgiftslista", () => {
  test("visar meddelande när inga uppgifter finns", async ({ page }) => {
    await mockBffApis(page, []);
    await gotoPortal(page);
    await expect(
      page.getByText("Inga tilldelade uppgifter hittades"),
    ).toBeVisible();
  });

  test("visar meddelande att välja uppgift när lista är ifylld", async ({
    page,
  }) => {
    await mockBffApis(page, [mockUppgift]);
    await gotoPortal(page);
    await expect(page.getByText("Välj en uppgift i listan")).toBeVisible();
  });

  test("visar uppgift i navigationslistan", async ({ page }) => {
    await mockBffApis(page, [mockUppgift]);
    await gotoPortal(page);
    // Label: last 7 chars of handlaggningId + ": " + regel
    // "handl-0001234".slice(-7) === "0001234"
    await expect(page.getByText("0001234: RTF Manuell")).toBeVisible();
  });

  test("navigerar till uppgift vid klick i listan", async ({ page }) => {
    await mockBffApis(page, [mockUppgift]);
    await gotoPortal(page);
    await page.getByText("0001234: RTF Manuell").click();
    await expect(page).toHaveURL(/\/items\/handl-0001234/);
  });

  test("visar felmeddelande när uppgift inte kan laddas", async ({ page }) => {
    // When url is empty, remoteKey falls back to handlaggningId.
    // It won't match any manifest entry, so the generic load error is shown.
    await mockBffApis(page, [{ ...mockUppgift, url: "" }]);
    await gotoPortal(page);
    await page.getByText("0001234: RTF Manuell").click();
    await expect(
      page.getByText("Kunde inte ladda komponent", { exact: false }),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("tar bort uppgift från listan vid task-done event", async ({ page }) => {
    await mockBffApis(page, [mockUppgift]);
    await gotoPortal(page);
    await expect(page.getByText("0001234: RTF Manuell")).toBeVisible();

    await page.evaluate((id) => {
      window.dispatchEvent(
        new CustomEvent("task-done", {
          detail: { handlaggningId: id, message: "Klar" },
        }),
      );
    }, mockUppgift.handlaggningId);

    await expect(
      page.getByText("Inga tilldelade uppgifter hittades"),
    ).toBeVisible();
  });
});

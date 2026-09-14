import {
  expect,
  gotoPortal,
  mockBffApis,
  mockRtfManuellData,
  mockRtfManuellEndpoints,
  mockRtfManuellUppgift,
  test,
} from "./fixtures";

// uppgift list label = last 7 chars of uppgiftId + ": " + regel (see uppgifter.spec.ts)
const listLabel = "rtf-001: Har kunden rätt till VAH?";

// Exercises the real rtf-manuell-fe micro frontend (built and served on :3031 by
// the playwright.config.ts webServer entry), loaded through Module Federation the
// same way the portal loads it in production — only the downstream BFF calls the
// remote itself makes (GET /api/task, GET /api/uppgiftsbeskrivning, POST
// patchErsattningar) are mocked, per fixtures' captured real backend shape.
test.describe("rtf-manuell MFE", () => {
  test("laddar och visar kunduppgifter", async ({ page }) => {
    await mockBffApis(page, [mockRtfManuellUppgift]);
    await mockRtfManuellEndpoints(page);
    await gotoPortal(page);

    await page.getByText(listLabel).click();
    await expect(page).toHaveURL(/\/items\/uppg-rtf-001/);

    await expect(
      page.getByText("Kontrollera frånvaro från arbete", { exact: true }),
    ).toBeVisible();
    await expect(page.locator(".error-message")).not.toBeVisible();
    await expect(page.getByText("Lisa Tass")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Region Dalarna")).toBeVisible();
  });

  test("hämtar uppgiftsbeskrivning vid tooltip-klick", async ({ page }) => {
    await mockBffApis(page, [mockRtfManuellUppgift]);
    await mockRtfManuellEndpoints(page);
    await gotoPortal(page);

    await page.getByText(listLabel).click();
    await expect(page.getByText("Lisa Tass")).toBeVisible({ timeout: 15_000 });

    const descriptionRequest = page.waitForRequest(
      "**/api/uppgiftsbeskrivning/VAH",
    );
    await page.getByRole("button", { name: /Läs mer om uppgiften/ }).click();
    await descriptionRequest;
    await expect(
      page.getByText("Kontrollerar frånvaro från arbete under perioden."),
    ).toBeVisible();
  });

  test("klarmarkerar uppgiften och skickar patchErsattningar", async ({
    page,
  }) => {
    await mockBffApis(page, [mockRtfManuellUppgift]);
    await mockRtfManuellEndpoints(page);
    await gotoPortal(page);

    await page.getByText(listLabel).click();
    await expect(page.getByText("Lisa Tass")).toBeVisible({ timeout: 15_000 });

    // FKUI's radio input sits under a styled decorator; clicking the visible
    // label text is more reliable than targeting the (visually zero-size) input.
    await page.getByText("Godkänd", { exact: true }).click();

    const patchRequest = page.waitForRequest(
      (req) =>
        req
          .url()
          .includes(
            `/api/${mockRtfManuellData.handlaggning_id}/patchErsattningar`,
          ) && req.method() === "POST",
    );
    await page.getByRole("button", { name: "Klarmarkera" }).click();
    const request = await patchRequest;
    const body = request.postDataJSON();
    expect(body.ersattningar[0].beslutsutfall).toBe("JA");
  });

  test("visar felmeddelande när uppgiftsdata inte kan hämtas", async ({
    page,
  }) => {
    await mockBffApis(page, [mockRtfManuellUppgift]);
    await mockRtfManuellEndpoints(page, { status: 500 });
    await gotoPortal(page);

    await page.getByText(listLabel).click();
    await expect(
      page.getByText("Kunde inte hämta uppgiftsdata", { exact: false }),
    ).toBeVisible({ timeout: 15_000 });
  });
});

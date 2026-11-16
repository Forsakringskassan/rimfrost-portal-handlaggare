import {
  expect,
  gotoPortal,
  isProcessStegUrl,
  mockBffApis,
  mockProcessSteg,
  mockProcessVahSteg,
  mockRtfManuellData,
  mockRtfManuellEndpoints,
  mockRtfManuellUppgift,
  mockRtfManuellUppgiftMedProcessvy,
  processvy,
  test,
  uppgiftINavigering,
} from "./fixtures";

const listLabel = "Har kunden rätt till VAH?";

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

    await uppgiftINavigering(page, listLabel).click();
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

    await uppgiftINavigering(page, listLabel).click();
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

    await uppgiftINavigering(page, listLabel).click();
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

    await uppgiftINavigering(page, listLabel).click();
    await expect(
      page.getByText("Kunde inte hämta uppgiftsdata", { exact: false }),
    ).toBeVisible({ timeout: 15_000 });
  });
});

// The real process-vah-fe processvy (served on :3041), loaded by the portal above
// the real rtf-manuell-fe when the uppgift has a processvyUrl (PORT-FR-08). Only
// the process BFF's GET /api/steg is mocked, per process-vah-bff's contract.
test.describe("rtf-manuell MFE med VAH:s processvy", () => {
  const { processnamn } = mockProcessVahSteg;

  test("visar processvyn ovanför regelns mikrofrontend och båda fungerar", async ({
    page,
  }) => {
    await mockBffApis(page, [mockRtfManuellUppgiftMedProcessvy]);
    await mockRtfManuellEndpoints(page);
    await mockProcessSteg(page);
    await gotoPortal(page);

    await uppgiftINavigering(page, listLabel).click();
    await expect(page).toHaveURL(/\/items\/uppg-rtf-vah-001/);

    const steg = processvy(page, processnamn);
    await expect(steg).toBeVisible({ timeout: 15_000 });
    await expect(steg.getByText("Registrera ansökan")).toBeVisible();
    await expect(steg.locator('[aria-current="step"]')).toContainText(
      "Kontrollera rätt till försäkring",
    );

    const kund = page.getByText("Lisa Tass");
    await expect(kund).toBeVisible({ timeout: 15_000 });

    // PORT-FR-08.3: the processvy sits above the uppgift's micro frontend.
    const stegBox = await steg.boundingBox();
    const kundBox = await kund.boundingBox();
    expect(stegBox!.y + stegBox!.height).toBeLessThanOrEqual(kundBox!.y);

    // The rule's micro frontend still works with the processvy above it.
    await page.getByText("Godkänd", { exact: true }).click();
    const patchRequest = page.waitForRequest(
      (req) =>
        req.url().includes("/patchErsattningar") && req.method() === "POST",
    );
    await page.getByRole("button", { name: "Klarmarkera" }).click();
    await patchRequest;
  });

  test("anropar processens BFF med uppgiftens aktivitetId", async ({
    page,
  }) => {
    await mockBffApis(page, [mockRtfManuellUppgiftMedProcessvy]);
    await mockRtfManuellEndpoints(page);
    await mockProcessSteg(page);
    await gotoPortal(page);

    const stegRequest = page.waitForRequest((req) =>
      isProcessStegUrl(req.url()),
    );
    await uppgiftINavigering(page, listLabel).click();
    const request = await stegRequest;

    expect(new URL(request.url()).searchParams.get("aktivitetId")).toBe(
      mockRtfManuellUppgiftMedProcessvy.aktivitetId,
    );
    await expect(processvy(page, processnamn)).toBeVisible({ timeout: 15_000 });
  });

  test("regelns mikrofrontend fungerar som vanligt när processens BFF svarar med fel", async ({
    page,
  }) => {
    await mockBffApis(page, [mockRtfManuellUppgiftMedProcessvy]);
    await mockRtfManuellEndpoints(page);
    await mockProcessSteg(page, { status: 500 });
    await gotoPortal(page);

    const stegResponse = page.waitForResponse((res) =>
      isProcessStegUrl(res.url()),
    );
    await uppgiftINavigering(page, listLabel).click();
    await stegResponse;

    await expect(page.getByText("Lisa Tass")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Region Dalarna")).toBeVisible();
    await expect(page.locator(".error-message")).not.toBeVisible();
    // process-vah-fe shows a short notice instead of the steps on a BFF error.
    await expect(
      page.getByText("Processens steg kan inte visas just nu."),
    ).toBeVisible();
    await expect(processvy(page, processnamn)).toHaveCount(0);
  });

  test("visar ingen processvy när processens BFF inte känner till aktiviteten", async ({
    page,
  }) => {
    await mockBffApis(page, [mockRtfManuellUppgiftMedProcessvy]);
    await mockRtfManuellEndpoints(page);
    await mockProcessSteg(page, { status: 404 });
    await gotoPortal(page);

    const stegResponse = page.waitForResponse((res) =>
      isProcessStegUrl(res.url()),
    );
    await uppgiftINavigering(page, listLabel).click();
    await stegResponse;

    await expect(page.getByText("Lisa Tass")).toBeVisible({ timeout: 15_000 });
    await expect(page.locator(".process-vy")).not.toBeVisible();
  });

  test("laddar ingen processvy när uppgiften saknar processvyUrl", async ({
    page,
  }) => {
    const processvyRequests: string[] = [];
    page.on("request", (req) => {
      const url = req.url();
      if (url.startsWith("http://localhost:3041") || isProcessStegUrl(url)) {
        processvyRequests.push(url);
      }
    });

    await mockBffApis(page, [mockRtfManuellUppgift]);
    await mockRtfManuellEndpoints(page);
    await mockProcessSteg(page);
    await gotoPortal(page);

    await uppgiftINavigering(page, listLabel).click();
    await expect(page.getByText("Lisa Tass")).toBeVisible({ timeout: 15_000 });

    await expect(page.locator(".process-vy")).toHaveCount(0);
    expect(processvyRequests).toEqual([]);
  });
});

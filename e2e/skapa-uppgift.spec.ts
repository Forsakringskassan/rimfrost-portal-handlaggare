import type { Page } from "@playwright/test";
import { expect, gotoPortal, mockBffApis, test } from "./fixtures";

async function oppnaSkapaUppgift(page: Page) {
  await mockBffApis(page, []);
  await gotoPortal(page);
  await page
    .locator(".nav-footer")
    .getByRole("button", { name: "Skapa uppgift" })
    .click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Skapa uppgift" }),
  ).toBeVisible();
}

test.describe("Skapa uppgift", () => {
  test("sök → välj → bekräfta lägger typen i Senast använda", async ({
    page,
  }) => {
    await oppnaSkapaUppgift(page);
    const vy = page.locator(".skapa-uppgift");

    // Nothing chosen yet, so no Senast använda (PORT-FR-09.6).
    await expect(vy.getByText("Senast använda")).toHaveCount(0);

    // A sökord, matched while typing without pressing Sök (PORT-FR-09.2, 09.3).
    await page.getByPlaceholder("Sök uppgiftstyp").fill("VABB");
    await expect(vy.getByText("1 träff")).toBeVisible();
    await vy.getByRole("button", { name: /Anmälan om vård av barn/ }).click();

    const bekrafta = page.locator(".bekrafta-uppgiftstyp");
    await expect(bekrafta.getByText("Anmälan om vård av barn")).toBeVisible();
    await expect(
      bekrafta.getByText("Tillfällig föräldrapenning"),
    ).toBeVisible();

    await bekrafta.getByLabel("Personnummer").fill("123");
    await bekrafta.getByRole("button", { name: "Skapa uppgift" }).click();
    await expect(
      bekrafta.getByText("12 siffror", { exact: false }),
    ).toBeVisible();

    await bekrafta.getByLabel("Personnummer").fill("19900101-9999");
    await bekrafta.getByRole("button", { name: "Skapa uppgift" }).click();
    await expect(
      page.getByText("inte inkopplat", { exact: false }),
    ).toBeVisible();

    // Back on the search with the text kept (PORT-FR-10.5).
    await expect(page.getByPlaceholder("Sök uppgiftstyp")).toHaveValue("VABB");

    await page.getByPlaceholder("Sök uppgiftstyp").fill("");
    const senast = vy.locator(".senast-anvanda");
    await expect(senast.getByText("Senast använda")).toBeVisible();
    await expect(
      senast.getByRole("button", { name: /Anmälan om vård av barn/ }),
    ).toBeVisible();
  });

  test("visar meddelande när inga uppgiftstyper matchar", async ({ page }) => {
    await oppnaSkapaUppgift(page);
    await page.getByPlaceholder("Sök uppgiftstyp").fill("qwerty");
    await page.getByRole("button", { name: "Sök", exact: true }).click();
    await expect(
      page.getByText('Inga uppgiftstyper matchar "qwerty"', { exact: false }),
    ).toBeVisible();
  });

  test("bläddra → välj med tangentbordet", async ({ page }) => {
    await oppnaSkapaUppgift(page);
    const vy = page.locator(".skapa-uppgift");

    const panel = vy.getByRole("button", { name: /^Bostadsbidrag \(\d+\)$/ });
    await expect(panel).toHaveAttribute("aria-expanded", "false");
    await panel.focus();
    await page.keyboard.press("Enter");
    await expect(panel).toHaveAttribute("aria-expanded", "true");

    // The first type in the open panel is the next Tab stop (PORT-NFR-04.2).
    await page.keyboard.press("Tab");
    const forsta = vy.getByRole("button", { name: "Ansökan om bostadsbidrag" });
    await expect(forsta).toBeFocused();
    await page.keyboard.press("Enter");

    const bekrafta = page.locator(".bekrafta-uppgiftstyp");
    await expect(bekrafta.getByText("Ansökan om bostadsbidrag")).toBeVisible();
    await bekrafta.getByRole("button", { name: "Tillbaka" }).click();
    await expect(page.getByPlaceholder("Sök uppgiftstyp")).toBeFocused();
  });

  test("skapa anteckning validerar och tömmer anteckningen", async ({
    page,
  }) => {
    await oppnaSkapaUppgift(page);
    await page
      .locator(".registrera-lage label", { hasText: "Anteckning" })
      .click();

    const form = page.locator(".skapa-anteckning");
    await expect(page.getByPlaceholder("Sök uppgiftstyp")).toHaveCount(0);

    await form.getByRole("button", { name: "Spara" }).click();
    await expect(form.getByText("12 siffror", { exact: false })).toBeVisible();
    await expect(form.getByText("Skriv en anteckning.")).toBeVisible();

    await form.getByLabel("Personnummer").fill("199001019999");
    await form.getByLabel("Anteckning").fill("Kunden ringde om sitt brev.");
    await form.getByRole("button", { name: "Spara" }).click();

    await expect(page.getByText("Anteckningen har sparats.")).toBeVisible();
    await expect(form.getByLabel("Anteckning")).toHaveValue("");

    await page
      .locator(".registrera-lage label", { hasText: "Uppgift" })
      .click();
    await expect(page.getByPlaceholder("Sök uppgiftstyp")).toBeVisible();
  });

  test("öppnas från knappen längst ner i Sök uppgift", async ({ page }) => {
    await mockBffApis(page, []);
    await gotoPortal(page);
    await page.getByRole("button", { name: "Sök uppgift" }).click();
    await page
      .locator(".sok-uppgift")
      .getByRole("button", { name: "Skapa uppgift" })
      .click();
    await expect(
      page.getByRole("heading", { level: 1, name: "Skapa uppgift" }),
    ).toBeVisible();
  });
});

import {
  expect,
  gotoPortal,
  mockBffApis,
  mockGetNextUppgift,
  mockHandlaggare,
  mockReassignUppgift,
  mockSearchUppgifter,
  mockTeamUppgifter,
  mockUnassignUppgift,
  mockUppgift,
  test,
} from "./fixtures";

test.describe("Hämta ny uppgift (POST /tasks/getNext)", () => {
  test("lägger till och navigerar till den nya uppgiften", async ({ page }) => {
    await mockBffApis(page, []);
    await mockGetNextUppgift(page, mockUppgift);
    await gotoPortal(page);

    await page.getByRole("button", { name: "Hämta ny uppgift" }).click();
    await expect(page).toHaveURL(/\/items\/uppg-001/);
    await expect(page.getByText("ppg-001: RTF Manuell")).toBeVisible();
  });

  test("visar felmeddelande när backend svarar med fel", async ({ page }) => {
    await mockBffApis(page, []);
    await page.route("**/tasks/getNext", async (route) => {
      await route.fulfill({ status: 500 });
    });
    await gotoPortal(page);

    await page.getByRole("button", { name: "Hämta ny uppgift" }).click();
    await expect(
      page.getByText("Kunde inte hämta ny uppgift", { exact: false }),
    ).toBeVisible();
  });
});

test.describe("Lämna tillbaka uppgift (POST /tasks/{id}/unassign)", () => {
  test("tar bort uppgiften och navigerar hem efter bekräftelse", async ({
    page,
  }) => {
    await mockBffApis(page, [mockUppgift]);
    await mockUnassignUppgift(page);
    await gotoPortal(page);

    await page.getByText("ppg-001: RTF Manuell").click();
    await expect(page).toHaveURL(/\/items\/uppg-001/);

    const unassignRequest = page.waitForRequest(
      (req) =>
        req.url().includes("/tasks/uppg-001/unassign") &&
        req.method() === "POST",
    );
    await page.getByRole("button", { name: "Lämna tillbaka uppgift" }).click();
    await page
      .getByRole("button", { name: "Lämna tillbaka", exact: true })
      .click();
    await unassignRequest;

    await expect(page).toHaveURL("/");
    await expect(
      page.getByText("Uppgiften har lämnats tillbaka."),
    ).toBeVisible();
    await expect(
      page.getByText("Inga tilldelade uppgifter hittades"),
    ).toBeVisible();
  });

  test("visar felmeddelande men behåller uppgiften vid serverfel", async ({
    page,
  }) => {
    await mockBffApis(page, [mockUppgift]);
    await page.route("**/tasks/*/unassign", async (route) => {
      await route.fulfill({ status: 500 });
    });
    await gotoPortal(page);

    await page.getByText("ppg-001: RTF Manuell").click();
    await page.getByRole("button", { name: "Lämna tillbaka uppgift" }).click();
    await page
      .getByRole("button", { name: "Lämna tillbaka", exact: true })
      .click();

    await expect(
      page.getByText("Kunde inte lämna tillbaka uppgiften", { exact: false }),
    ).toBeVisible();
    // The task stays in the list — unassign only removes it on success.
    await expect(page.getByText("ppg-001: RTF Manuell")).toBeVisible();
  });
});

test.describe("Teamvy (GET /tasks/team)", () => {
  // Assigned to the second mock handläggare — gotoPortal logs in as the first,
  // and Ta över is hidden on your own tasks.
  const annansUppgift = {
    ...mockUppgift,
    uppgiftId: "team-uppg-001",
    handlaggarId: mockHandlaggare[1].handlaggarId,
  };

  test("visar teamets uppgifter", async ({ page }) => {
    const teamUppgift = {
      ...mockUppgift,
      uppgiftId: "team-uppg-001",
      handlaggningId: "team-handl-0001234",
    };
    await mockBffApis(page, []);
    await mockTeamUppgifter(page, [teamUppgift]);
    await gotoPortal(page);

    await page.getByRole("button", { name: "Teamvy" }).click();
    await expect(
      page.getByRole("heading", { name: "Teamets uppgifter" }),
    ).toBeVisible();
    await expect(page.getByText("RTF Manuell")).toBeVisible();
  });

  test("visar tomt-meddelande när teamet inte har några uppgifter", async ({
    page,
  }) => {
    await mockBffApis(page, []);
    await mockTeamUppgifter(page, []);
    await gotoPortal(page);

    await page.getByRole("button", { name: "Teamvy" }).click();
    await expect(
      page.getByText("Inga uppgifter hos teamet hittades"),
    ).toBeVisible();
  });

  // Mirrors the SID-behörighet toast (PORT-FR-02.6) — OUL can silently unassign
  // tasks a handläggare lacks behörighet for while listing them.
  test("visar behörighetstoast när uppgifter tagits bort pga behörighet", async ({
    page,
  }) => {
    await mockBffApis(page, []);
    await mockTeamUppgifter(page, [], 1);
    await gotoPortal(page);

    await page.getByRole("button", { name: "Teamvy" }).click();
    await expect(
      page.getByText(
        "En eller flera uppgifter har tagits bort av behörighetsskäl",
      ),
    ).toBeVisible();
  });

  test("tar över uppgiften, visar toast och navigerar till den", async ({
    page,
  }) => {
    await mockBffApis(page, []);
    await mockTeamUppgifter(page, [annansUppgift]);
    await mockReassignUppgift(page, annansUppgift);
    await gotoPortal(page);

    await page.getByRole("button", { name: "Teamvy" }).click();

    const reassignRequest = page.waitForRequest(
      (req) =>
        req.url().includes("/tasks/team-uppg-001/reassign") &&
        req.method() === "POST",
    );
    await page.getByRole("button", { name: "Ta över" }).click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Ta över" })
      .click();
    await reassignRequest;

    await expect(page.getByText("Uppgiften har tagits över.")).toBeVisible();
    await expect(page).toHaveURL(/\/items\/team-uppg-001/);
  });

  test("visar ingen Ta över-knapp för uppgift som redan är tilldelad mig", async ({
    page,
  }) => {
    await mockBffApis(page, []);
    await mockTeamUppgifter(page, [{ ...mockUppgift, uppgiftId: "egen-001" }]);
    await gotoPortal(page);

    await page.getByRole("button", { name: "Teamvy" }).click();
    await expect(page.getByText("RTF Manuell")).toBeVisible();
    await expect(page.getByRole("button", { name: "Ta över" })).toHaveCount(0);
  });

  test("avbryter utan att anropa backend och låser inte knappen", async ({
    page,
  }) => {
    await mockBffApis(page, []);
    await mockTeamUppgifter(page, [annansUppgift]);
    let reassignCalls = 0;
    await page.route("**/tasks/*/reassign", async (route) => {
      reassignCalls++;
      await route.fulfill({ json: { uppgift: annansUppgift } });
    });
    await gotoPortal(page);

    await page.getByRole("button", { name: "Teamvy" }).click();
    await page.getByRole("button", { name: "Ta över" }).click();
    await page.getByRole("button", { name: "Avbryt", exact: true }).click();

    expect(reassignCalls).toBe(0);
    // Reopening proves the guard reset on dismiss — otherwise Ta över stays dead.
    await page.getByRole("button", { name: "Ta över" }).click();
    await expect(
      page.getByRole("dialog").getByRole("button", { name: "Ta över" }),
    ).toBeVisible();
  });

  test("visar behörighetsmeddelande när backend svarar 403", async ({
    page,
  }) => {
    await mockBffApis(page, []);
    await mockTeamUppgifter(page, [annansUppgift]);
    await page.route("**/tasks/*/reassign", async (route) => {
      await route.fulfill({ status: 403 });
    });
    await gotoPortal(page);

    await page.getByRole("button", { name: "Teamvy" }).click();
    await page.getByRole("button", { name: "Ta över" }).click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Ta över" })
      .click();

    await expect(
      page.getByText("Du har inte behörighet att ta över uppgiften."),
    ).toBeVisible();
  });

  // Without the button, a colleague's uppgiftId is still visible in the team
  // table's ID column — this proves it can't be opened by pasting/typing it
  // into the URL either (PORT-FR review comment on PR #76).
  test("kan inte öppna en kollegas uppgift genom att navigera direkt till dess URL", async ({
    page,
  }) => {
    await mockBffApis(page, []);
    await mockTeamUppgifter(page, [annansUppgift]);
    await gotoPortal(page, "/items/team-uppg-001");

    // If the id had resolved via teamUppgiftLista, the error would name
    // annansUppgift's own url-derived key instead of the raw uppgiftId —
    // this confirms it was never matched to the colleague's task at all.
    await expect(
      page.getByText('Kunde inte ladda komponent för "team-uppg-001"', {
        exact: false,
      }),
    ).toBeVisible();
  });
});

test.describe("Sök uppgift (POST /tasks/search)", () => {
  const sokUppgift = {
    ...mockUppgift,
    uppgiftId: "sok-uppg-001",
    status: "Ny",
    regel: "Kommunicering",
    beskrivning: "Kommunicering av beslut",
  };

  test("söker automatiskt på personnummer och visar träffarna", async ({
    page,
  }) => {
    await mockBffApis(page, []);
    await mockSearchUppgifter(page, [sokUppgift]);
    await gotoPortal(page);

    await page.getByRole("button", { name: "Sök uppgift" }).click();
    await expect(
      page.getByRole("heading", { name: "Sök uppgift" }),
    ).toBeVisible();

    const request = page.waitForRequest("**/tasks/search");
    await page.getByLabel("Personnummer").fill("199001019999");
    expect((await request).postDataJSON()).toEqual({
      personnummer: "19900101-9999",
    });

    await expect(
      page.getByRole("heading", { name: "Uppgifter för 19900101-9999" }),
    ).toBeVisible();
    await expect(page.getByText("Kommunicering av beslut")).toBeVisible();
  });

  test("visar tomt-meddelande när inga uppgifter hittas", async ({ page }) => {
    await mockBffApis(page, []);
    await mockSearchUppgifter(page, []);
    await gotoPortal(page);

    await page.getByRole("button", { name: "Sök uppgift" }).click();
    await page.getByLabel("Personnummer").fill("19900101-9999");

    await expect(page.getByText("Inga uppgifter hittades")).toBeVisible();
  });

  test("visar felmeddelande när sökningen misslyckas", async ({ page }) => {
    await mockBffApis(page, []);
    await mockSearchUppgifter(page, [], 502);
    await gotoPortal(page);

    await page.getByRole("button", { name: "Sök uppgift" }).click();
    await page.getByLabel("Personnummer").fill("19900101-9999");

    await expect(
      page.getByText("Kunde inte söka efter uppgifter. Försök igen senare."),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Hämta ny uppgift" }),
    ).toBeVisible();
  });

  test("visar valideringstext vid ogiltigt personnummer", async ({ page }) => {
    await mockBffApis(page, []);
    let searched = false;
    await page.route("**/tasks/search", async (route) => {
      searched = true;
      await route.abort();
    });
    await gotoPortal(page);

    await page.getByRole("button", { name: "Sök uppgift" }).click();
    await page.getByLabel("Personnummer").fill("900101-9999");
    await page.getByRole("button", { name: "Sök", exact: true }).click();

    await expect(page.getByText("12 siffror", { exact: false })).toBeVisible();
    expect(searched).toBe(false);
  });

  test("växlar mellan sökvyn och teamvyn", async ({ page }) => {
    await mockBffApis(page, []);
    await mockTeamUppgifter(page, []);
    await gotoPortal(page);

    await page.getByRole("button", { name: "Sök uppgift" }).click();
    await expect(
      page.getByRole("heading", { name: "Sök uppgift" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Teamvy" }).click();
    await expect(
      page.getByRole("heading", { name: "Teamets uppgifter" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Sök uppgift" }).click();
    await expect(
      page.getByRole("heading", { name: "Sök uppgift" }),
    ).toBeVisible();
  });

  test("tilldelar uppgiften och öppnar den", async ({ page }) => {
    await mockBffApis(page, []);
    await mockSearchUppgifter(page, [sokUppgift]);
    await mockReassignUppgift(page, sokUppgift);
    await gotoPortal(page);

    await page.getByRole("button", { name: "Sök uppgift" }).click();
    await page.getByLabel("Personnummer").fill("199001019999");

    const reassign = page.waitForRequest(
      (req) =>
        req.url().includes("/tasks/sok-uppg-001/reassign") &&
        req.method() === "POST",
    );
    await page.getByRole("button", { name: "Tilldela uppgift" }).click();
    await reassign;

    await expect(page).toHaveURL(/\/items\/sok-uppg-001/);
    await expect(page.getByText("Uppgiften har tilldelats dig.")).toBeVisible();
  });

  test("visar meddelande och hämtar träfflistan igen när uppgiften inte längre finns", async ({
    page,
  }) => {
    await mockBffApis(page, []);
    let searches = 0;
    await page.route("**/tasks/search", async (route) => {
      searches++;
      await route.fulfill({
        json: {
          // eslint-disable-next-line camelcase -- the API expects snake_case
          operativa_uppgifter: searches === 1 ? [sokUppgift] : [],
          // eslint-disable-next-line camelcase -- the API expects snake_case
          borttagna_pga_behorighet: 0,
        },
      });
    });
    await page.route("**/tasks/*/reassign", async (route) => {
      await route.fulfill({ status: 404 });
    });
    await gotoPortal(page);

    await page.getByRole("button", { name: "Sök uppgift" }).click();
    await page.getByLabel("Personnummer").fill("199001019999");
    await page.getByRole("button", { name: "Tilldela uppgift" }).click();

    await expect(
      page.getByText(
        "Uppgiften kan inte längre tilldelas. Listan har uppdaterats.",
      ),
    ).toBeVisible();
    await expect(page.getByText("Inga uppgifter hittades")).toBeVisible();
    expect(searches).toBe(2);
  });

  test("visar behörighetsmeddelande när tilldelningen nekas", async ({
    page,
  }) => {
    await mockBffApis(page, []);
    await mockSearchUppgifter(page, [sokUppgift]);
    await page.route("**/tasks/*/reassign", async (route) => {
      await route.fulfill({ status: 403 });
    });
    await gotoPortal(page);

    await page.getByRole("button", { name: "Sök uppgift" }).click();
    await page.getByLabel("Personnummer").fill("199001019999");
    await page.getByRole("button", { name: "Tilldela uppgift" }).click();

    await expect(
      page.getByText("Du har inte behörighet att ta över uppgiften."),
    ).toBeVisible();
  });
});

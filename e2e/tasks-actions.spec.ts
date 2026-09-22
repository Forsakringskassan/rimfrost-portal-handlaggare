import {
  expect,
  gotoPortal,
  mockBffApis,
  mockGetNextUppgift,
  mockHandlaggare,
  mockReassignUppgift,
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
  // and Plocka is hidden on your own tasks.
  const annansUppgift = {
    ...mockUppgift,
    uppgiftId: "team-uppg-001",
    handlaggarId: mockHandlaggare[1].handlaggarId,
  };

  test("visar teamets uppgifter och navigerar vid klick på Öppna", async ({
    page,
  }) => {
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

    await page.getByRole("button", { name: "Öppna" }).click();
    await expect(page).toHaveURL(/\/items\/team-uppg-001/);
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

  test("plockar uppgiften, visar toast och navigerar till den", async ({
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
    await page.getByRole("button", { name: "Plocka" }).click();
    await page.getByRole("button", { name: "Ta över", exact: true }).click();
    await reassignRequest;

    await expect(page.getByText("Uppgiften har tagits över.")).toBeVisible();
    await expect(page).toHaveURL(/\/items\/team-uppg-001/);
  });

  test("visar ingen Plocka-knapp för uppgift som redan är tilldelad mig", async ({
    page,
  }) => {
    await mockBffApis(page, []);
    await mockTeamUppgifter(page, [{ ...mockUppgift, uppgiftId: "egen-001" }]);
    await gotoPortal(page);

    await page.getByRole("button", { name: "Teamvy" }).click();
    await expect(page.getByRole("button", { name: "Öppna" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Plocka" })).toHaveCount(0);
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
    await page.getByRole("button", { name: "Plocka" }).click();
    await page.getByRole("button", { name: "Avbryt", exact: true }).click();

    expect(reassignCalls).toBe(0);
    // Reopening proves the guard reset on dismiss — otherwise Plocka stays dead.
    await page.getByRole("button", { name: "Plocka" }).click();
    await expect(
      page.getByRole("button", { name: "Ta över", exact: true }),
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
    await page.getByRole("button", { name: "Plocka" }).click();
    await page.getByRole("button", { name: "Ta över", exact: true }).click();

    await expect(
      page.getByText("Du har inte behörighet att ta över uppgiften."),
    ).toBeVisible();
  });
});

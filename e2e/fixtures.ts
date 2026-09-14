import { type Page, expect, test as base } from "@playwright/test";
import type { Handlaggare, OperativUppgiftItem } from "../src/types";

export { expect };

export const mockHandlaggare: Handlaggare[] = [
  {
    handlaggarId: { typId: "PERSONAL_ID", varde: "196001011234" },
    fornamn: "Anna",
    efternamn: "Andersson",
  },
  {
    handlaggarId: { typId: "PERSONAL_ID", varde: "197002022345" },
    fornamn: "Björn",
    efternamn: "Bergström",
  },
];

export const mockUppgift: OperativUppgiftItem = {
  uppgiftId: "uppg-001",
  handlaggningId: "handl-0001234",
  skapad: "2024-01-15T10:00:00Z",
  status: "AKTIV",
  handlaggarId: mockHandlaggare[0].handlaggarId,
  planeradTill: "",
  utford: "",
  individer: [],
  regel: "RTF Manuell",
  beskrivning: "Test beskrivning",
  verksamhetslogik: "test",
  roll: "HANDLAGGARE",
  url: "http://localhost:3039",
};

// url is what OppnadUppgift.vue's remoteKey derives from (last path segment) —
// these match the real OUL uppgift.url values for tasks routed through
// rtf-manuell/bekraftabeslut, captured against the local minikube backend.
export const mockRtfManuellUppgift: OperativUppgiftItem = {
  uppgiftId: "uppg-rtf-001",
  handlaggningId: "22222222-2222-2222-2222-222222222222",
  skapad: "2026-09-10",
  status: "TILLDELAD",
  handlaggarId: mockHandlaggare[0].handlaggarId,
  planeradTill: "",
  utford: "",
  individer: [],
  regel: "Har kunden rätt till VAH?",
  beskrivning: "Kontrollerar om kunden har varit frånvarande från sitt arbete",
  verksamhetslogik: "C",
  roll: "ANSVARIG_HANDLAGGARE",
  url: "/regel/rtf-manuell",
};

export const mockBekraftabeslutUppgift: OperativUppgiftItem = {
  uppgiftId: "uppg-bekrafta-001",
  handlaggningId: "33333333-3333-3333-3333-333333333333",
  skapad: "2026-09-10",
  status: "TILLDELAD",
  handlaggarId: mockHandlaggare[0].handlaggarId,
  planeradTill: "",
  utford: "",
  individer: [],
  regel: "Bekräfta beslut",
  beskrivning: "Bekräfta beslut",
  verksamhetslogik: "B",
  roll: "ANSVARIG_HANDLAGGARE",
  url: "/regel/bekraftabeslut",
};

// GetDataResponse shape, snake_case — passed through by the rtf-manuell backend
// unchanged (captured live against the local minikube regel-rtf-manuell service).
export const mockRtfManuellData = {
  // eslint-disable-next-line camelcase -- the API expects snake_case
  handlaggning_id: mockRtfManuellUppgift.handlaggningId,
  kund: {
    fornamn: "Lisa",
    efternamn: "Tass",
    kon: "K",
    anstallning: {
      organisationsnummer: "123456-7890",
      organisationsnamn: "Region Dalarna",
      // eslint-disable-next-line camelcase -- the API expects snake_case
      arbetstid_procent: 100,
      anstallningsdag: "2022-09-10",
      // eslint-disable-next-line camelcase -- the API expects snake_case
      sista_anstallningsdag: null,
    },
  },
  ersattningar: [
    {
      // eslint-disable-next-line camelcase -- the API expects snake_case
      ersattning_id: "8e4c207b-6fdc-4f4d-9084-53455eb459dd",
      ersattningstyp: "042bd313-d5ef-4886-97c5-e0a1c828baca",
      // eslint-disable-next-line camelcase -- the API expects snake_case
      omfattning_procent: 100,
      belopp: 40000,
      berakningsgrund: null,
      from: "2025-12-01",
      tom: "2025-12-31",
      beslutsutfall: "FU",
      avslagsanledning: null,
    },
  ],
};

// BeslutsData shape, camelCase — mapped by the bekraftabeslut BFF.
export const mockBekraftabeslutData = {
  handlaggningId: mockBekraftabeslutUppgift.handlaggningId,
  kund: {
    fornamn: "Lisa",
    efternamn: "Tass",
    kon: "K",
    anstallning: { organisationsnamn: "Region Dalarna", arbetstidProcent: 100 },
  },
  ersattning: [
    {
      ersattningId: "8e4c207b-6fdc-4f4d-9084-53455eb459dd",
      ersattningstyp: "042bd313-d5ef-4886-97c5-e0a1c828baca",
      omfattningProcent: 100,
      belopp: 40000,
      berakningsgrund: 0,
      beslutsutfall: "JA",
      from: "2025-12-01",
      tom: "2025-12-31",
    },
  ],
};

export const mockReferensdata = {
  avslutstyp: [
    { id: "avslut-1", kod: "AUTOMATISKT", namn: "Automatiskt avslut" },
  ],
  beslutstyp: [{ id: "beslut-1", kod: "BIFALL", namn: "Bifall" }],
  beslutsutfallstyp: [{ id: "utfall-1", kod: "JA", namn: "Ja" }],
  // bekraftaBeslut.ts requires a kod "faststallt" entry to enable the confirm button.
  yrkandestatus: [
    { id: "status-faststallt", kod: "faststallt", namn: "Fastställt" },
  ],
};

// Matches public/route-manifest.json — devEntry points to the preview server (port 3039)
// plus the rtf-manuell (3031) and bekraftabeslut (3033) preview servers, mirroring
// portal-bff's real src/main/resources/remotes.json.
export const mockRouteManifest = {
  routes: {
    remoteExample: {
      scope: "remoteExample",
      module: "ExampleComponent",
      devEntry: "http://localhost:3039/mf-manifest.json",
      prodEntry: "https://cdn.example.com/template/mf-manifest.json",
    },
    "rtf-manuell": {
      scope: "remoteApp",
      module: "VardAvHusdjur",
      devEntry: "http://localhost:3031/mf-manifest.json",
      prodEntry: "https://cdn.example.com/rtf-manuell/mf-manifest.json",
    },
    bekraftabeslut: {
      scope: "bekraftaBeslutApp",
      module: "BekraftaBeslut",
      devEntry: "http://localhost:3033/mf-manifest.json",
      prodEntry: "https://cdn.example.com/bekraftabeslut/mf-manifest.json",
    },
  },
};

export async function mockBffApis(
  page: Page,
  uppgifter: OperativUppgiftItem[] = [mockUppgift],
) {
  await page.route("**/handlaggare", async (route) => {
    await route.fulfill({ json: { handlaggare: mockHandlaggare } });
  });

  await page.route("**/tasks", async (route) => {
    if (route.request().method() === "POST") {
      // eslint-disable-next-line camelcase -- the API expects snake_case
      await route.fulfill({ json: { operativa_uppgifter: uppgifter } });
    } else {
      await route.continue();
    }
  });

  await page.route("**/api/route-manifest", async (route) => {
    await route.fulfill({ json: mockRouteManifest });
  });
}

/** Mocks POST /tasks/getNext, triggered by the "Hämta ny uppgift" button. */
export async function mockGetNextUppgift(
  page: Page,
  uppgift: OperativUppgiftItem = mockUppgift,
) {
  await page.route("**/tasks/getNext", async (route) => {
    await route.fulfill({ json: { uppgift } });
  });
}

/** Mocks POST /tasks/\{id\}/unassign, triggered by "Lämna tillbaka uppgift". */
export async function mockUnassignUppgift(page: Page, status = 204) {
  await page.route("**/tasks/*/unassign", async (route) => {
    await route.fulfill({ status });
  });
}

/** Mocks GET /tasks/team, fetched when the Teamvy is opened. */
export async function mockTeamUppgifter(
  page: Page,
  uppgifter: OperativUppgiftItem[] = [],
  borttagnaPgaBehorighet = 0,
) {
  await page.route("**/tasks/team", async (route) => {
    await route.fulfill({
      json: {
        // eslint-disable-next-line camelcase -- the API expects snake_case
        operativa_uppgifter: uppgifter,
        // eslint-disable-next-line camelcase -- the API expects snake_case
        borttagna_pga_behorighet: borttagnaPgaBehorighet,
      },
    });
  });
}

/**
 * Mocks the rtf-manuell-fe's own BFF contract: GET /api/task/\{id\},
 * GET /api/uppgiftsbeskrivning/\{typ\}, POST /api/\{id\}/patchErsattningar.
 */
export async function mockRtfManuellEndpoints(
  page: Page,
  data: typeof mockRtfManuellData | { status: number } = mockRtfManuellData,
) {
  await page.route("**/api/task/**", async (route) => {
    if ("status" in data) {
      await route.fulfill({ status: data.status });
    } else {
      await route.fulfill({ json: data });
    }
  });
  await page.route("**/api/uppgiftsbeskrivning/VAH", async (route) => {
    await route.fulfill({
      json: {
        beskrivning: "Kontrollerar frånvaro från arbete under perioden.",
      },
    });
  });
  await page.route("**/api/*/patchErsattningar", async (route) => {
    await route.fulfill({ status: 204 });
  });
}

/**
 * Mocks the bekraftabeslut-fe's own BFF contract: handlaggning data,
 * referensdata (four kinds), PATCH, POST done, and uppgiftsbeskrivning.
 */
export async function mockBekraftabeslutEndpoints(
  page: Page,
  data:
    | typeof mockBekraftabeslutData
    | { status: number } = mockBekraftabeslutData,
  referensdata: typeof mockReferensdata = mockReferensdata,
) {
  // Registered first so it has the lowest priority (Playwright checks routes
  // LIFO) — it only ever needs to catch PATCH /{handlaggningId}, since every
  // named single-segment path below (avslutstyp, done, ...) is matched by a
  // more specific handler registered after it.
  await page.route("**/api/regel/bekraftabeslut/*", async (route) => {
    if (route.request().method() === "PATCH") {
      await route.fulfill({ status: 204 });
    } else {
      await route.continue();
    }
  });
  await page.route(
    "**/api/regel/bekraftabeslut/handlaggning/**",
    async (route) => {
      if ("status" in data) {
        await route.fulfill({ status: data.status });
      } else {
        await route.fulfill({ json: data });
      }
    },
  );
  await page.route("**/api/regel/bekraftabeslut/avslutstyp", async (route) => {
    await route.fulfill({ json: referensdata.avslutstyp });
  });
  await page.route("**/api/regel/bekraftabeslut/beslutstyp", async (route) => {
    await route.fulfill({ json: referensdata.beslutstyp });
  });
  await page.route(
    "**/api/regel/bekraftabeslut/beslutsutfallstyp",
    async (route) => {
      await route.fulfill({ json: referensdata.beslutsutfallstyp });
    },
  );
  await page.route(
    "**/api/regel/bekraftabeslut/yrkandestatus",
    async (route) => {
      await route.fulfill({ json: referensdata.yrkandestatus });
    },
  );
  await page.route("**/api/regel/bekraftabeslut/done", async (route) => {
    await route.fulfill({ status: 204 });
  });
  await page.route("**/api/uppgiftsbeskrivning", async (route) => {
    await route.fulfill({
      json: { beskrivning: "Bekräfta det fastställda beslutet för ärendet." },
    });
  });
}

// Module Federation's async proxy means Vue isn't mounted when page.goto() resolves.
// Waiting for the /handlaggare response confirms the app is mounted and initialized.
// The timeout covers the Vite optimizer 504 + triggered full-reload cycle on first run.
export async function gotoPortal(page: Page, path = "/") {
  const ready = page.waitForResponse("**/handlaggare", { timeout: 30_000 });
  await page.goto(path);
  await ready;
  await loginAsFirstHandlaggare(page);
}

// The BFF token gate (7c970aa) added a mandatory login modal after the e2e suite
// was written — every view under the left panel is unreachable until this
// completes. The security code is unvalidated by the mock backend; any digits do.
export async function loginAsFirstHandlaggare(page: Page) {
  await page.getByRole("button", { name: "Logga in" }).click();
  await page.getByRole("textbox", { name: "Ange säkerhetskod" }).fill("1234");
  await page.getByRole("button", { name: "OK" }).click();
  await expect(page.getByRole("button", { name: "Logga in" })).toHaveCount(0);
}

export const test = base.extend<{ setupMocks: Page }>({
  setupMocks: async ({ page }, use) => {
    await mockBffApis(page);
    await gotoPortal(page);
    await use(page);
  },
});

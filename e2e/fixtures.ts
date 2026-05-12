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

// Matches public/route-manifest.json — devEntry points to the preview server (port 3039)
export const mockRouteManifest = {
  routes: {
    remoteExample: {
      scope: "remoteExample",
      module: "ExampleComponent",
      devEntry: "http://localhost:3039/mf-manifest.json",
      prodEntry: "https://cdn.example.com/template/mf-manifest.json",
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

// Module Federation's async proxy means Vue isn't mounted when page.goto() resolves.
// Waiting for the /handlaggare response confirms the app is mounted and initialized.
// The timeout covers the Vite optimizer 504 + triggered full-reload cycle on first run.
export async function gotoPortal(page: Page, path = "/") {
  const ready = page.waitForResponse("**/handlaggare", { timeout: 30_000 });
  await page.goto(path);
  await ready;
}

export const test = base.extend<{ setupMocks: Page }>({
  setupMocks: async ({ page }, use) => {
    await mockBffApis(page);
    await gotoPortal(page);
    await use(page);
  },
});

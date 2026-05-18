import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3030",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      // --force clears Vite's optimizer cache so stale dep hashes don't cause 504s
      command: "npx vite --force",
      url: "http://localhost:3030",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      // preview builds and serves the MFE at the port that route-manifest.json points to
      command: "npm run preview",
      url: "http://localhost:3039",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      cwd: "../rimfrost-template-micro-fe",
    },
  ],
});

import { defineConfig, devices } from "@playwright/test"

// Our own specs for the demo's examples, which upstream's specs don't cover:
// they render, and the ones with behavior of their own do what they show.
const port = process.env["DEMO_PORT"] ?? "4330"

export default defineConfig({
  testDir: "tests/examples",
  fullyParallel: true,
  retries: process.env["CI"] ? 2 : 0,
  use: { baseURL: `http://localhost:${port}`, trace: "retain-on-failure" },
  webServer: {
    command: `npx ng serve demo --port ${port} --no-hmr`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env["CI"],
    timeout: 120_000,
  },
  projects: [
    {
      name: "desktop",
      use: { browserName: "chromium" },
      testIgnore: "taps.spec.ts",
    },
    {
      name: "phone",
      use: { ...devices["Pixel 7"] },
      testIgnore: "taps.spec.ts",
    },
    // Taps as iOS makes them, which only WebKit does.
    {
      name: "iphone",
      use: { ...devices["iPhone 13"] },
      testMatch: "taps.spec.ts",
    },
  ],
})

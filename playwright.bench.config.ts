import { defineConfig } from "@playwright/test"
import examples from "./playwright.examples.config"

// What the themes' selectors cost, with `npm run bench`. It measures time, so
// it runs by hand, not in CI, on Chromium, whose traces it reads.
export default defineConfig({
  ...examples,
  testDir: "tests/bench",
  fullyParallel: false,
  retries: 0,
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
})

import { readdirSync, readFileSync } from "node:fs"
import { defineConfig } from "@playwright/test"

// Runs ui-sdk's own behavior specs, unchanged, against the Angular fixtures in
// projects/playground. vendor/ui is pinned to the @ui-sdk/core release we depend on.
const port = process.env["PLAYGROUND_PORT"] ?? "5320"
const specRoot = "vendor/ui/tests/specs"

// Specs that fail for a reason that isn't a bug, by title, each with why.
const knownGaps: Record<string, string> = {
  "a menu inside the popover":
    "The popover fixture leaves out its menu until Menu is ported.",
}

// Only popups move into a portal container, so the portal project runs these
// components' specs again, as upstream's react-portal does. Upstream's list.
const portalComponents = [
  "alignment",
  "autocomplete",
  "combobox",
  "command",
  "date-picker",
  "dialog",
  "drawer",
  "hover-card",
  "list",
  "menu",
  "menubar",
  "navigation-menu",
  "popover",
  "popup",
  "presentation",
  "select",
  "toast",
  "token-input",
  "tooltip",
  "trigger-menu",
]

// The popups that can present as a sheet run their shared specs once more as
// one, as upstream's react-sheet does. Upstream's list.
const sheetComponents = [
  "menu",
  "popover",
  "dialog",
  "select",
  "combobox",
  "autocomplete",
]

// The fixtures the playground has, like "dialog" or "dialog-render".
const fixtures = new Set(
  readdirSync("projects/playground/src/fixtures").map((file) =>
    file.replace(/\.ts$/, "")
  )
)

// As upstream's specsThatSkip: a spec file runs unless every fixture it opens
// is missing. Kitchen sinks and count gates run only for upstream's
// composition frameworks, and SSR specs only for server-rendered projects.
const specs = readdirSync(specRoot).filter((file) => {
  if (
    !file.endsWith(".spec.ts") ||
    /\.(kitchen-sink|counts|ssr)\.spec\.ts$/.test(file)
  ) {
    return false
  }
  const opened = [
    ...readFileSync(`${specRoot}/${file}`, "utf8").matchAll(
      /\bopen\(\s*"([\w-]+)"/g
    ),
  ].map(([, fixture]) => fixture!)
  return !opened.length || opened.some((fixture) => fixtures.has(fixture))
})

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
const filesMatching = (files: string[]) =>
  files.map((file) => new RegExp(`/${escape(file)}$`))

export default defineConfig<{
  framework: string
  fixtureOptions: Record<string, string>
}>({
  testDir: specRoot,
  testMatch: filesMatching(specs),
  grepInvert: Object.keys(knownGaps).length
    ? new RegExp(Object.keys(knownGaps).map(escape).join("|"))
    : undefined,
  fullyParallel: true,
  retries: process.env["CI"] ? 2 : 0,
  use: { baseURL: `http://localhost:${port}`, trace: "retain-on-failure" },
  webServer: {
    command: `npx ng serve playground --port ${port} --no-hmr`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env["CI"],
    timeout: 120_000,
  },
  projects: [
    {
      name: "angular",
      use: { browserName: "chromium", framework: "angular" },
    },
    {
      name: "angular-portal",
      use: {
        browserName: "chromium",
        framework: "angular",
        fixtureOptions: { container: "portal-root" },
      },
      testMatch: filesMatching(
        specs.filter((file) =>
          portalComponents.some((name) => file.startsWith(`${name}.`))
        )
      ),
    },
    {
      name: "angular-sheet",
      use: {
        browserName: "chromium",
        framework: "angular",
        fixtureOptions: { presentation: "sheet" },
      },
      testMatch: filesMatching(
        specs.filter((file) =>
          sheetComponents.some((name) => file === `${name}.spec.ts`)
        )
      ),
    },
  ],
})

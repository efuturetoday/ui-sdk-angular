import { readdirSync, readFileSync } from "node:fs"
import { defineConfig } from "@playwright/test"

// Runs ui-sdk's own behavior specs, unchanged, against the Angular fixtures in
// projects/playground. vendor/ui is pinned to the @ui-sdk/core release we depend on.
const port = process.env["PLAYGROUND_PORT"] ?? "5320"
const specRoot = "vendor/ui/tests/specs"

// Specs that fail for a reason that isn't a bug, by title, each with why.
const knownGaps: Record<string, string> = {
  "a select finds its content inside a fragment":
    "A data root renders a list of its own in React and Vue when its content is empty. Angular's content is the app's template, so an empty `*uiSelectContent` has no options.",
  "a combobox finds its content inside a wrapping element":
    "A data root renders a list of its own in React and Vue when its content is empty. Angular's content is the app's template, so an empty `*uiComboboxContent` has no options.",
  "an autocomplete finds its content inside a wrapping element":
    "A data root renders a list of its own in React and Vue when its content is empty. Angular's content is the app's template, so an empty `*uiAutocompleteContent` has no options.",
  "a trigger menu finds its content inside a fragment":
    "A data root renders a list of its own in React and Vue when its content is empty. Angular's content is the app's template, so an empty `uiTriggerMenuList` has no options.",
  "a click on a trigger in a shadow root opens the menu, and it stays open":
    "With a portal container outside the shadow root, the menu's aria-labelledby points into the shadow root, which no browser resolves, so it has no name. Core's naming, to check upstream.",
  "a label for a slider names its thumb":
    "The label fixture leaves out its slider until Slider is ported.",
  "a label names a control that renders after it":
    "The label fixture leaves out its number input until NumberInput is ported.",
  "without a default value, the first render already selects the first enabled tab":
    "The spec watches nodes added to the document and reports the first tab panel. Angular creates a template's nodes inside its host, which is already in the document, so every node of the first render is added to it, tabs included; React and Vue attach a finished tree.",
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

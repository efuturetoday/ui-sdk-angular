import { provideZonelessChangeDetection, type Type } from "@angular/core"
import { bootstrapApplication } from "@angular/platform-browser"
import { applyFixtureOptions, loadScreenReader } from "tests/fixtures/page"
import { renderLikeTheSpecs } from "./render-like-the-specs"

// The same page contract as the upstream playground: /?fixture=dialog&framework=angular.
const fixtures: Record<string, () => Promise<{ Fixture: Type<unknown> }>> = {
  autocomplete: () => import("./fixtures/autocomplete"),
  "autocomplete-render": () => import("./fixtures/autocomplete-render"),
  collapsible: () => import("./fixtures/collapsible"),
  combobox: () => import("./fixtures/combobox"),
  "combobox-render": () => import("./fixtures/combobox-render"),
  "collapsible-render": () => import("./fixtures/collapsible-render"),
  dialog: () => import("./fixtures/dialog"),
  "cached-page": () => import("./fixtures/cached-page"),
  "dialog-render": () => import("./fixtures/dialog-render"),
  drawer: () => import("./fixtures/drawer"),
  "field-choice-card": () => import("./fixtures/field-choice-card"),
  "field-radios": () => import("./fixtures/field-radios"),
  forms: () => import("./fixtures/forms"),
  "forms-render": () => import("./fixtures/forms-render"),
  popover: () => import("./fixtures/popover"),
  "popover-perf": () => import("./fixtures/popover-perf"),
  "popover-render": () => import("./fixtures/popover-render"),
  select: () => import("./fixtures/select"),
  "select-render": () => import("./fixtures/select-render"),
  toast: () => import("./fixtures/toast"),
}

// Specs that check core's modules load them through the page, as the instances
// the fixtures use, by file name, like upstream's playground.
const coreModules: Record<string, () => Promise<unknown>> = {
  popup: () =>
    import("../../../node_modules/@ui-sdk/core/dist/foundation/popups/popup.js"),
  position: () =>
    import("../../../node_modules/@ui-sdk/core/dist/foundation/platform/position.js"),
  style: () =>
    import("../../../node_modules/@ui-sdk/core/dist/foundation/platform/style.js"),
}

Object.assign(window, {
  loadCoreModule: (name: string) => coreModules[name]!(),
  loadTesting: () => import("@ui-sdk/core/testing"),
})

const params = applyFixtureOptions()
const fixture = params.get("fixture")
const framework = params.get("framework") ?? "angular"
const load = fixture && framework === "angular" ? fixtures[fixture] : undefined

if (!load) {
  document.body.dataset["missingFixture"] = ""
  document.body.textContent = `No fixture for ${fixture} in ${framework}.`
} else {
  const { Fixture } = await load()
  document.getElementById("root")!.append(document.createElement("app-fixture"))
  const app = await bootstrapApplication(Fixture, {
    providers: [provideZonelessChangeDetection()],
  })
  renderLikeTheSpecs(app)
  await app.whenStable()
  document.body.dataset["mounted"] = ""
  await loadScreenReader()
}

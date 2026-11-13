import { provideZonelessChangeDetection, type Type } from "@angular/core"
import { bootstrapApplication } from "@angular/platform-browser"
import { applyFixtureOptions, loadScreenReader } from "tests/fixtures/page"
import { renderLikeTheSpecs } from "./render-like-the-specs"

// The same page contract as the upstream playground: /?fixture=dialog&framework=angular.
const fixtures: Record<string, () => Promise<{ Fixture: Type<unknown> }>> = {
  collapsible: () => import("./fixtures/collapsible"),
  "collapsible-render": () => import("./fixtures/collapsible-render"),
  dialog: () => import("./fixtures/dialog"),
  "dialog-render": () => import("./fixtures/dialog-render"),
  "field-choice-card": () => import("./fixtures/field-choice-card"),
  "field-radios": () => import("./fixtures/field-radios"),
  forms: () => import("./fixtures/forms"),
  "forms-render": () => import("./fixtures/forms-render"),
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

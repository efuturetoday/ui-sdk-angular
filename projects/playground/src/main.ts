import { provideZonelessChangeDetection, type Type } from "@angular/core"
import { bootstrapApplication } from "@angular/platform-browser"
import { applyFixtureOptions, loadScreenReader } from "tests/fixtures/page"
import { renderLikeTheSpecs } from "./render-like-the-specs"

// The same page contract as the upstream playground: /?fixture=dialog&framework=angular.
const fixtures: Record<string, () => Promise<{ Fixture: Type<unknown> }>> = {
  "listbox-render": () => import("./fixtures/listbox-render"),
  "listbox-picker": () => import("./fixtures/listbox-picker"),
  "slider-render": () => import("./fixtures/slider-render"),
  "number-input-scrub": () => import("./fixtures/number-input-scrub"),
  "navigation-menu-bound": () => import("./fixtures/navigation-menu-bound"),
  "navigation-menu-render": () => import("./fixtures/navigation-menu-render"),
  "command-render": () => import("./fixtures/command-render"),
  resizable: () => import("./fixtures/resizable"),
  "resizable-render": () => import("./fixtures/resizable-render"),
  timeline: () => import("./fixtures/timeline"),
  "image-cropper": () => import("./fixtures/image-cropper"),
  "date-input": () => import("./fixtures/date-input"),
  alignment: () => import("./fixtures/alignment"),
  "item-icons": () => import("./fixtures/item-icons"),
  leaks: () => import("./fixtures/leaks"),
  "wrapped-content": () => import("./fixtures/wrapped-content"),
  "file-input": () => import("./fixtures/file-input"),
  "password-input-render": () => import("./fixtures/password-input-render"),
  "password-input": () => import("./fixtures/password-input"),
  "scroll-area-render": () => import("./fixtures/scroll-area-render"),
  "scroll-area": () => import("./fixtures/scroll-area"),
  "segmented-control": () => import("./fixtures/segmented-control"),
  "hover-popups": () => import("./fixtures/hover-popups"),
  "hover-card-render": () => import("./fixtures/hover-card-render"),
  "hover-card": () => import("./fixtures/hover-card"),
  "tooltip-render": () => import("./fixtures/tooltip-render"),
  tooltip: () => import("./fixtures/tooltip"),
  "tabs-perf": () => import("./fixtures/tabs-perf"),
  "tabs-render": () => import("./fixtures/tabs-render"),
  tabs: () => import("./fixtures/tabs"),
  "progress-render": () => import("./fixtures/progress-render"),
  progress: () => import("./fixtures/progress"),
  "meter-render": () => import("./fixtures/meter-render"),
  meter: () => import("./fixtures/meter"),
  avatar: () => import("./fixtures/avatar"),
  accordion: () => import("./fixtures/accordion"),
  "accordion-render": () => import("./fixtures/accordion-render"),
  "accordions-perf": () => import("./fixtures/accordions-perf"),
  autocomplete: () => import("./fixtures/autocomplete"),
  "autocomplete-render": () => import("./fixtures/autocomplete-render"),
  collapsible: () => import("./fixtures/collapsible"),
  combobox: () => import("./fixtures/combobox"),
  command: () => import("./fixtures/command"),
  "command-virtual": () => import("./fixtures/command-virtual"),
  "combobox-render": () => import("./fixtures/combobox-render"),
  "collapsible-render": () => import("./fixtures/collapsible-render"),
  dialog: () => import("./fixtures/dialog"),
  "dialog-patterns": () => import("./fixtures/dialog-patterns"),
  "cached-page": () => import("./fixtures/cached-page"),
  "dialog-render": () => import("./fixtures/dialog-render"),
  drawer: () => import("./fixtures/drawer"),
  "field-choice-card": () => import("./fixtures/field-choice-card"),
  "field-radios": () => import("./fixtures/field-radios"),
  form: () => import("./fixtures/form"),
  forms: () => import("./fixtures/forms"),
  "forms-render": () => import("./fixtures/forms-render"),
  label: () => import("./fixtures/label"),
  menu: () => import("./fixtures/menu"),
  "menu-cases": () => import("./fixtures/menu-cases"),
  "menu-groups": () => import("./fixtures/menu-groups"),
  "menu-render": () => import("./fixtures/menu-render"),
  menubar: () => import("./fixtures/menubar"),
  "navigation-menu": () => import("./fixtures/navigation-menu"),
  "number-input": () => import("./fixtures/number-input"),
  "otp-input": () => import("./fixtures/otp-input"),
  popover: () => import("./fixtures/popover"),
  "popup-payloads": () => import("./fixtures/popup-payloads"),
  "popover-perf": () => import("./fixtures/popover-perf"),
  "popover-render": () => import("./fixtures/popover-render"),
  listbox: () => import("./fixtures/listbox"),
  carousel: () => import("./fixtures/carousel"),
  "carousel-render": () => import("./fixtures/carousel-render"),
  "color-picker": () => import("./fixtures/color-picker"),
  pagination: () => import("./fixtures/pagination"),
  "pagination-render": () => import("./fixtures/pagination-render"),
  rating: () => import("./fixtures/rating"),
  calendar: () => import("./fixtures/calendar"),
  "date-picker": () => import("./fixtures/date-picker"),
  "date-picker-field": () => import("./fixtures/date-picker-field"),
  waterfall: () => import("./fixtures/waterfall"),
  "token-input": () => import("./fixtures/token-input"),
  "trigger-menu": () => import("./fixtures/trigger-menu"),
  select: () => import("./fixtures/select"),
  slider: () => import("./fixtures/slider"),
  "select-render": () => import("./fixtures/select-render"),
  toggle: () => import("./fixtures/toggle"),
  "toggle-render": () => import("./fixtures/toggle-render"),
  toolbar: () => import("./fixtures/toolbar"),
  "toolbar-render": () => import("./fixtures/toolbar-render"),
  toast: () => import("./fixtures/toast"),
  tree: () => import("./fixtures/tree"),
  "tree-links": () => import("./fixtures/tree-links"),
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

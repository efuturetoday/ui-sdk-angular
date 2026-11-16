import { bootstrapApplication } from "@angular/platform-browser"
import { checkPattern } from "@ui-sdk/core/testing"
import { appConfig } from "./app/app.config"
import { App } from "./app/app"
import { Bench } from "./bench/bench"

Object.assign(window, { checkPattern })

// `?bench&theme=<name|none>` shows only the table tests/bench/bench.spec.ts
// measures, with the theme on <body> and nothing else.
const params = new URLSearchParams(location.search)
if (params.has("bench")) {
  // Only the theme, as an app has it, without the docs' own styles.
  document.querySelector('link[href^="styles"]')?.remove()
  const theme = params.get("theme") ?? "default"
  const link = document.getElementById("theme") as HTMLLinkElement
  if (theme === "none") {
    link.remove()
  } else {
    link.href = `theme-${theme}.css`
    document.body.setAttribute("data-ui-theme", "")
  }
}

bootstrapApplication(params.has("bench") ? Bench : App, appConfig).catch(
  (err) => console.error(err)
)

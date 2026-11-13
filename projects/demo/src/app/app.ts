import { Component, effect, signal } from "@angular/core"
import { LucideMoon, LucideSun } from "@lucide/angular"
import { examples } from "../examples"
import { ExampleFrame } from "./example-frame"

const components = [
  ...new Set(Object.keys(examples).map((key) => key.split("/")[0]!)),
]

@Component({
  selector: "app-root",
  imports: [ExampleFrame, LucideMoon, LucideSun],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
class App {
  protected readonly components = components
  protected readonly current = signal(
    new URLSearchParams(location.search).get("component") ?? components[0]!
  )
  protected readonly dark = signal(
    matchMedia("(prefers-color-scheme: dark)").matches
  )

  constructor() {
    effect(() => {
      document.documentElement.style.colorScheme = this.dark()
        ? "dark"
        : "light"
    })
  }

  protected names() {
    return Object.keys(examples).filter((key) =>
      key.startsWith(`${this.current()}/`)
    )
  }

  protected show(component: string) {
    this.current.set(component)
    history.replaceState(null, "", `?component=${component}`)
  }
}

export { App }

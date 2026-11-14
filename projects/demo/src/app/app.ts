import { NgTemplateOutlet } from "@angular/common"
import { Component, effect, signal } from "@angular/core"
import { LucideMenu, LucideMoon, LucideSun } from "@lucide/angular"
import {
  UiDrawer,
  UiDrawerBackdrop,
  UiDrawerContent,
  UiDrawerTitle,
  UiDrawerTrigger,
} from "ui-sdk-angular"
import { examples } from "../examples"
import { ExampleFrame } from "./example-frame"

const components = [
  ...new Set(Object.keys(examples).map((key) => key.split("/")[0]!)),
]

// A component's name as ui-sdk.dev writes it, like "Alert Dialog" or "OTP Input".
const acronyms = new Set(["otp"])
const titleOf = (name: string) =>
  name
    .split("-")
    .map((word) =>
      acronyms.has(word)
        ? word.toUpperCase()
        : word[0]!.toUpperCase() + word.slice(1)
    )
    .join(" ")

@Component({
  selector: "app-root",
  imports: [
    ExampleFrame,
    LucideMenu,
    LucideMoon,
    LucideSun,
    NgTemplateOutlet,
    UiDrawer,
    UiDrawerBackdrop,
    UiDrawerContent,
    UiDrawerTitle,
    UiDrawerTrigger,
  ],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
class App {
  protected readonly components = components
  protected readonly titleOf = titleOf
  protected readonly current = signal(
    new URLSearchParams(location.search).get("component") ?? components[0]!
  )
  protected readonly navOpen = signal(false)
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
    this.navOpen.set(false)
    scrollTo({ top: 0 })
    history.replaceState(null, "", `?component=${component}`)
  }
}

export { App }

import { NgTemplateOutlet } from "@angular/common"
import {
  afterRenderEffect,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
} from "@angular/core"
import { LucideMenu, LucideMoon, LucideSun } from "@lucide/angular"
import {
  UiDrawer,
  UiDrawerBackdrop,
  UiDrawerContent,
  UiDrawerTitle,
  UiDrawerTrigger,
} from "ngx-ui-sdk/drawer"
import { UiToggle } from "ngx-ui-sdk/toggle"
import {
  UiTooltip,
  UiTooltipContent,
  UiTooltipTrigger,
} from "ngx-ui-sdk/tooltip"
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
    UiToggle,
    UiTooltip,
    UiTooltipContent,
    UiTooltipTrigger,
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

  // The example scrolled to, for the section nav: the last one whose top has
  // passed a fifth of the view.
  protected readonly section = signal<string | undefined>(undefined)

  constructor() {
    const track = () => {
      const passed = [
        ...document.querySelectorAll<HTMLElement>("main section[id]"),
      ].filter(
        (section) => section.getBoundingClientRect().top < innerHeight / 5
      )
      this.section.set(passed.at(-1)?.id)
    }
    addEventListener("scroll", track, { passive: true })
    inject(DestroyRef).onDestroy(() => removeEventListener("scroll", track))
    afterRenderEffect(() => {
      this.names()
      track()
    })
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

  protected anchorOf(name: string) {
    return name.split("/")[1]!
  }

  protected show(component: string) {
    this.current.set(component)
    this.section.set(undefined)
    this.navOpen.set(false)
    scrollTo({ top: 0 })
    history.replaceState(null, "", `?component=${component}`)
  }
}

export { App }

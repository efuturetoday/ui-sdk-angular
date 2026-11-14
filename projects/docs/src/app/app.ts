import { NgComponentOutlet, NgTemplateOutlet } from "@angular/common"
import {
  afterRenderEffect,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  resource,
  signal,
} from "@angular/core"
import { LucideMenu, LucideMoon, LucideSun } from "@lucide/angular"
import {
  UiDrawer,
  UiDrawerBackdrop,
  UiDrawerContent,
  UiDrawerTitle,
  UiDrawerTrigger,
} from "@ngx-ui-sdk/core/drawer"
import { UiToggle } from "@ngx-ui-sdk/core/toggle"
import {
  UiTooltip,
  UiTooltipContent,
  UiTooltipTrigger,
} from "@ngx-ui-sdk/core/tooltip"
import { examples } from "../examples"
import { compositions } from "../examples/composition"
import { type Guide, guides } from "../guides"
import { Composition } from "./composition"
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

// The page a URL shows: a guide by `?doc=`, a component by `?component=`,
// and the introduction without either.
type Page = { kind: "doc" | "component"; name: string }
const pageOf = (search: string): Page => {
  const params = new URLSearchParams(search)
  const component = params.get("component")
  if (component && components.includes(component)) {
    return { kind: "component", name: component }
  }
  const doc = params.get("doc")
  return {
    kind: "doc",
    name: guides.some((guide) => guide.slug === doc) ? doc! : "introduction",
  }
}

@Component({
  selector: "app-root",
  imports: [
    Composition,
    ExampleFrame,
    LucideMenu,
    LucideMoon,
    LucideSun,
    NgComponentOutlet,
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
  host: { "(click)": "follow($event)" },
})
class App {
  protected readonly components = components
  protected readonly groups = [...new Set(guides.map((guide) => guide.group))]
  protected readonly titleOf = titleOf
  protected readonly page = signal(pageOf(location.search))
  protected readonly guide = computed(() => {
    const { kind, name } = this.page()
    return kind === "doc"
      ? guides.find((guide) => guide.slug === name)
      : undefined
  })
  // The component's parts as they nest, from its first example.
  protected readonly composition = computed(() => {
    const { kind, name } = this.page()
    return kind === "component" ? compositions[name] : undefined
  })
  protected readonly guidePage = resource({
    params: () => this.guide(),
    loader: ({ params }) => params.load(),
  })
  protected readonly navOpen = signal(false)
  protected readonly dark = signal(
    matchMedia("(prefers-color-scheme: dark)").matches
  )

  // The page's sections, read from it once it renders, for the section nav.
  protected readonly sections = signal<{ id: string; title: string }[]>([])
  // The section scrolled to: the last one whose top has passed a fifth of
  // the view.
  protected readonly activeSection = signal<string | undefined>(undefined)

  constructor() {
    const read = () => [
      ...document.querySelectorAll<HTMLElement>("main section[id][data-title]"),
    ]
    const track = () => {
      const passed = read().filter(
        (section) => section.getBoundingClientRect().top < innerHeight / 5
      )
      this.activeSection.set(passed.at(-1)?.id)
    }
    addEventListener("scroll", track, { passive: true })
    inject(DestroyRef).onDestroy(() => removeEventListener("scroll", track))
    afterRenderEffect(() => {
      this.names()
      this.guidePage.value()
      this.sections.set(
        read().map((section) => ({
          id: section.id,
          title: section.dataset["title"]!,
        }))
      )
      track()
    })
    // Back and forward go to the page in the URL.
    const back = () => this.page.set(pageOf(location.search))
    addEventListener("popstate", back)
    inject(DestroyRef).onDestroy(() => removeEventListener("popstate", back))
    effect(() => {
      document.documentElement.style.colorScheme = this.dark()
        ? "dark"
        : "light"
    })
  }

  protected guidesIn(group: string) {
    return guides.filter((guide: Guide) => guide.group === group)
  }

  protected isCurrent(kind: Page["kind"], name: string) {
    const page = this.page()
    return page.kind === kind && page.name === name
  }

  protected names() {
    const { kind, name } = this.page()
    return kind === "component"
      ? Object.keys(examples).filter((key) => key.startsWith(`${name}/`))
      : []
  }

  protected titleOfExample(name: string) {
    return examples[name]!.title
  }

  protected anchorOf(name: string) {
    return name.split("/")[1]!
  }

  // Links to another page of the site show it without loading the app again.
  protected follow(event: MouseEvent) {
    const link = (event.target as Element).closest<HTMLAnchorElement>(
      'a[href^="?"]'
    )
    if (
      !link ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }
    event.preventDefault()
    const search = link.getAttribute("href")!
    this.page.set(pageOf(search))
    this.activeSection.set(undefined)
    this.navOpen.set(false)
    scrollTo({ top: 0 })
    history.pushState(null, "", search)
  }
}

export { App }

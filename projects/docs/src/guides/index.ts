import type { Type } from "@angular/core"

type Guide = {
  slug: string
  title: string
  description: string
  group: "Get started" | "Guides" | "Build your own"
  load: () => Promise<Type<unknown>>
}

// The pages before the components, in the order the nav shows them.
const guides: Guide[] = [
  {
    slug: "introduction",
    title: "Introduction",
    description:
      "Unstyled Angular directives with keyboard, focus and screen reader support built in.",
    group: "Get started",
    load: () => import("./introduction").then((m) => m.Page),
  },
  {
    slug: "installation",
    title: "Installation",
    description: "Install the packages in your Angular app.",
    group: "Get started",
    load: () => import("./installation").then((m) => m.Page),
  },
  {
    slug: "themes",
    title: "Themes",
    description:
      "Install a theme, choose a palette, change its look, or make your own.",
    group: "Get started",
    load: () => import("./themes").then((m) => m.Page),
  },
  {
    slug: "first-component",
    title: "First Component",
    description: "Add a component to your app and style its state.",
    group: "Get started",
    load: () => import("./first-component").then((m) => m.Page),
  },
  {
    slug: "parts-and-composition",
    title: "Parts and Composition",
    description:
      "Put a component's parts together and choose the elements they're on.",
    group: "Guides",
    load: () => import("./parts-and-composition").then((m) => m.Page),
  },
  {
    slug: "state-and-events",
    title: "State and Events",
    description: "Set a starting value, control it and respond to changes.",
    group: "Guides",
    load: () => import("./state-and-events").then((m) => m.Page),
  },
  {
    slug: "forms",
    title: "Forms",
    description: "Use the controls in a plain form and with Angular's forms.",
    group: "Guides",
    load: () => import("./forms").then((m) => m.Page),
  },
  {
    slug: "popups",
    title: "Popups",
    description: "Place popups, render them elsewhere, and open toasts.",
    group: "Guides",
    load: () => import("./popups").then((m) => m.Page),
  },
  {
    slug: "lists",
    title: "Lists",
    description:
      "Show items you write, from data, by thousands or as they load.",
    group: "Guides",
    load: () => import("./lists").then((m) => m.Page),
  },
  {
    slug: "styling",
    title: "Styling and Animation",
    description: "Style parts by their state, and animate them in and out.",
    group: "Guides",
    load: () => import("./styling").then((m) => m.Page),
  },
  {
    slug: "wrap-parts",
    title: "Wrap Parts",
    description:
      "Make your own components from the parts, with host directives.",
    group: "Build your own",
    load: () => import("./wrap-parts").then((m) => m.Page),
  },
  {
    slug: "custom-parts",
    title: "Custom Parts",
    description:
      "Write the parts of a component ui-sdk has no directives for yet.",
    group: "Build your own",
    load: () => import("./custom-parts").then((m) => m.Page),
  },
]

export { type Guide, guides }

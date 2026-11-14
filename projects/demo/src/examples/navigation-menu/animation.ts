import { Component } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import {
  UiNavigationMenu,
  UiNavigationMenuContent,
  UiNavigationMenuItem,
  UiNavigationMenuLink,
  UiNavigationMenuList,
  UiNavigationMenuTrigger,
  UiNavigationMenuViewport,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideChevronDown,
    UiNavigationMenu,
    UiNavigationMenuContent,
    UiNavigationMenuItem,
    UiNavigationMenuLink,
    UiNavigationMenuList,
    UiNavigationMenuTrigger,
    UiNavigationMenuViewport,
  ],
  template: `
    <nav
      uiNavigationMenu
      aria-label="Main"
      (valueChange)="log($event ? 'Showing ' + $event : 'Closing')"
      (openChangeComplete)="
        log($event ? 'Finished opening' : 'Finished closing')
      "
    >
      <ul uiNavigationMenuList>
        <li uiNavigationMenuItem value="guides">
          <button uiNavigationMenuTrigger>
            Guides
            <svg lucideChevronDown aria-hidden="true"></svg>
          </button>
          <div *uiNavigationMenuContent>
            <ul>
              @for (page of gettingStarted; track page.title) {
                <li>
                  <a uiNavigationMenuLink [href]="page.href">
                    <span>{{ page.title }}</span>
                    <span data-slot="hint">{{ page.description }}</span>
                  </a>
                </li>
              }
            </ul>
          </div>
        </li>
        <li uiNavigationMenuItem value="components">
          <button uiNavigationMenuTrigger>
            Components
            <svg lucideChevronDown aria-hidden="true"></svg>
          </button>
          <div *uiNavigationMenuContent>
            <ul data-slot="grid">
              @for (page of components; track page.title) {
                <li>
                  <a uiNavigationMenuLink [href]="page.href">
                    <span>{{ page.title }}</span>
                    <span data-slot="hint">{{ page.description }}</span>
                  </a>
                </li>
              }
            </ul>
          </div>
        </li>
      </ul>
      <div
        *uiNavigationMenuViewport="let state; sideOffset: 8"
        data-variant="slide"
      ></div>
    </nav>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly gettingStarted = [
    {
      title: "Introduction",
      href: "#",
      description: "Unstyled components with one core for every framework.",
    },
    {
      title: "Installation",
      href: "#",
      description:
        "Add the package for your framework and render your first part.",
    },
    {
      title: "Styling",
      href: "#",
      description:
        "Style parts with data attributes, CSS variables and any CSS.",
    },
  ]

  protected readonly components = [
    {
      title: "Alert Dialog",
      href: "#",
      description:
        "Asks for a decision before anything else on the page can be used.",
    },
    {
      title: "Hover Card",
      href: "#",
      description:
        "A preview of what a link points to, for people who pause on it.",
    },
    {
      title: "Progress",
      href: "#",
      description: "Shows how far along a task is, like an upload.",
    },
    {
      title: "Scroll Area",
      href: "#",
      description: "Scrolls its content with scrollbars you can style.",
    },
    {
      title: "Tabs",
      href: "#",
      description:
        "Shows one panel of content at a time, picked from a list of tabs.",
    },
    {
      title: "Tooltip",
      href: "#",
      description:
        "A short label for a control, shown on hover or keyboard focus.",
    },
  ]
}

export { Example }

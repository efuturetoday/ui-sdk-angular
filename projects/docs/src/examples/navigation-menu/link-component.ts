import { Component, Directive, input, output, signal } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import {
  UiNavigationMenu,
  UiNavigationMenuContent,
  UiNavigationMenuItem,
  UiNavigationMenuLink,
  UiNavigationMenuList,
  UiNavigationMenuTrigger,
  UiNavigationMenuViewport,
} from "@ngx-ui-sdk/core/navigation-menu"
import { injectLog } from "../../shared/log"

@Directive({
  selector: "a[uiRouterLink]",
  hostDirectives: [{ directive: UiNavigationMenuLink, inputs: ["current"] }],
  host: {
    "[attr.href]": "to()",
    "(click)": "onClick($event)",
  },
})
class RouterLink {
  readonly to = input.required<string>()
  readonly navigate = output<string>()

  protected onClick(event: MouseEvent) {
    event.preventDefault()
    this.navigate.emit(this.to())
  }
}

@Component({
  selector: "app-example",
  imports: [
    RouterLink,
    LucideChevronDown,
    UiNavigationMenu,
    UiNavigationMenuContent,
    UiNavigationMenuItem,
    UiNavigationMenuList,
    UiNavigationMenuTrigger,
    UiNavigationMenuViewport,
  ],
  template: `
    <nav uiNavigationMenu aria-label="Docs">
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
                  <a
                    uiRouterLink
                    [to]="page.href"
                    [current]="route() === page.href"
                    (navigate)="navigate($event)"
                  >
                    <span>{{ page.title }}</span>
                    <span data-slot="hint">{{ page.description }}</span>
                  </a>
                </li>
              }
            </ul>
          </div>
        </li>
        <li uiNavigationMenuItem>
          <a
            uiRouterLink
            to="#components"
            [current]="route() === '#components'"
            (navigate)="navigate($event)"
          >
            Components
          </a>
        </li>
      </ul>
      <div *uiNavigationMenuViewport="let state; sideOffset: 8"></div>
    </nav>
  `,
})
class Example {
  protected readonly gettingStarted = [
    {
      title: "Introduction",
      href: "#introduction",
      description: "Unstyled components with one core for every framework.",
    },
    {
      title: "Installation",
      href: "#installation",
      description:
        "Add the package for your framework and render your first part.",
    },
    {
      title: "Styling",
      href: "#styling",
      description:
        "Style parts with data attributes, CSS variables and any CSS.",
    },
  ]
  protected readonly log = injectLog()
  protected readonly route = signal("#introduction")

  protected navigate(href: string) {
    this.route.set(href)
    this.log(`Navigated to ${href}`)
  }
}

export { Example }

import { Component, Directive, input, signal } from "@angular/core"
import {
  UiNavigationMenu,
  UiNavigationMenuContent,
  UiNavigationMenuItem,
  UiNavigationMenuLink,
  UiNavigationMenuList,
  UiNavigationMenuTrigger,
  UiNavigationMenuViewport,
} from "ui-sdk-angular"

// A client-side router's link: it navigates without a page load.
@Directive({
  selector: "a[uiRouterLink]",
  hostDirectives: [{ directive: UiNavigationMenuLink, inputs: ["current"] }],
  host: { "[attr.href]": "to()", "(click)": "navigate($event)" },
})
class RouterLink {
  readonly to = input.required<string>()

  protected navigate(event: MouseEvent) {
    event.preventDefault()
    history.pushState(null, "", this.to())
  }
}

@Component({
  selector: "app-fixture",
  imports: [
    RouterLink,
    UiNavigationMenu,
    UiNavigationMenuContent,
    UiNavigationMenuItem,
    UiNavigationMenuList,
    UiNavigationMenuTrigger,
    UiNavigationMenuViewport,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <nav
        uiNavigationMenu
        aria-label="Docs"
        class="nav-menu"
        (beforeValueChange)="action.set(($event.value ?? 'close') + ': ' + $event.details.reason)"
      >
        <ul uiNavigationMenuList class="nav-list">
          <li uiNavigationMenuItem value="guides">
            <button
              uiNavigationMenuTrigger
              #trigger="uiNavigationMenuTrigger"
              [class]="'nav-trigger ' + (trigger.state().open ? 'is-open' : 'is-closed')"
            >
              Guides
              <span aria-hidden="true">{{ trigger.state().open ? "▲" : "▼" }}</span>
            </button>
            <section *uiNavigationMenuContent class="nav-content" aria-label="Guides panel">
              <a uiRouterLink to="#intro" current>Introduction</a>
              <a uiRouterLink to="#install">Install</a>
            </section>
          </li>
        </ul>
        <div *uiNavigationMenuViewport class="nav-viewport"></div>
      </nav>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly action = signal("")
}

export { Fixture }

import { Component, signal } from "@angular/core"
import {
  exposeNavigationMenuValue,
  navigationMenuFixture as fixture,
  navigationMenuLayout,
} from "tests/fixtures/navigation-menu"
import {
  UiNavigationMenu,
  UiNavigationMenuContent,
  UiNavigationMenuItem,
  UiNavigationMenuLink,
  UiNavigationMenuList,
  UiNavigationMenuTrigger,
  UiNavigationMenuViewport,
} from "ui-sdk-angular"

@Component({
  selector: "app-fixture",
  imports: [
    UiNavigationMenu,
    UiNavigationMenuContent,
    UiNavigationMenuItem,
    UiNavigationMenuLink,
    UiNavigationMenuList,
    UiNavigationMenuTrigger,
    UiNavigationMenuViewport,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <nav
        uiNavigationMenu
        [(value)]="value"
        aria-label="Main"
        class="nav-menu"
        [delay]="0"
        [closeDelay]="0"
        (openChangeComplete)="completed.update((all) => [...all, $event])"
      >
        <ul uiNavigationMenuList class="nav-list">
          @for (item of fixture.items; track item.value) {
            <li uiNavigationMenuItem [value]="item.value">
              <button uiNavigationMenuTrigger class="nav-trigger">{{ item.trigger }}</button>
              <div *uiNavigationMenuContent class="nav-content">
                <ul>
                  @for (link of item.links; track link.href) {
                    <li>
                      <a uiNavigationMenuLink [href]="link.href">{{ link.label }}</a>
                    </li>
                  }
                </ul>
              </div>
            </li>
          }
        </ul>
        @if (layout.viewport) {
          <div *uiNavigationMenuViewport class="nav-viewport"></div>
        }
      </nav>
      <button>After</button>
      <output role="status" aria-label="Completed">{{ completed().join(",") }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly fixture = fixture
  protected readonly layout = navigationMenuLayout()
  protected readonly value = signal<string | null | undefined>(null)
  protected readonly completed = signal<boolean[]>([])

  constructor() {
    exposeNavigationMenuValue((next) => this.value.set(next))
  }
}

export { Fixture }

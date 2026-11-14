import { Component, signal } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  navigationMenuAction,
  navigationMenuFixture as fixture,
  navigationMenuLayout,
  navigationMenuOptions,
} from "tests/fixtures/navigation-menu"
import {
  UiNavigationMenu,
  UiNavigationMenuContent,
  UiNavigationMenuIndicator,
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
    UiNavigationMenuIndicator,
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
        aria-label="Main"
        class="nav-menu"
        [delay]="options.delay"
        [closeDelay]="options.closeDelay"
        [defaultValue]="options.defaultValue"
        [orientation]="options.orientation"
        [openOnHover]="options.openOnHover"
        [closeOnSelect]="options.closeOnSelect"
        [container]="options.container"
        (beforeValueChange)="report($event.value, $event.details)"
      >
        <ul
          uiNavigationMenuList
          [class]="
            options.orientation === 'vertical' ? 'nav-list vertical' : 'nav-list'
          "
        >
          @for (item of fixture.items; track item.value; let index = $index) {
            <li uiNavigationMenuItem [value]="item.value">
              <button uiNavigationMenuTrigger class="nav-trigger">
                {{ item.trigger }}
              </button>
              <div
                *uiNavigationMenuContent="
                  let state;
                  keepMounted: layout.keepMounted;
                  hiddenUntilFound: layout.hiddenUntilFound;
                  side: layout.placement.side;
                  align: layout.placement.align
                "
                [class]="index === 0 ? 'nav-content' : 'nav-content narrow'"
              >
                <ul>
                  @for (link of item.links; track link.href) {
                    <li>
                      <a uiNavigationMenuLink [href]="link.href">{{
                        link.label
                      }}</a>
                    </li>
                  }
                </ul>
                @if (index === 1 && layout.nested) {
                  <div uiNavigationMenu orientation="vertical">
                    <ul uiNavigationMenuList class="nav-list vertical">
                      <li uiNavigationMenuItem [value]="fixture.nested.value">
                        <button uiNavigationMenuTrigger class="nav-trigger">
                          {{ fixture.nested.trigger }}
                        </button>
                        <div
                          *uiNavigationMenuContent
                          class="nav-content narrow"
                        >
                          <ul>
                            @for (link of fixture.nested.links; track link.href) {
                              <li>
                                <a uiNavigationMenuLink [href]="link.href">{{
                                  link.label
                                }}</a>
                              </li>
                            }
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                }
              </div>
            </li>
          }
          <li uiNavigationMenuItem>
            <a
              uiNavigationMenuLink
              class="nav-link"
              [href]="fixture.link.href"
              current
              >{{ fixture.link.label }}</a
            >
          </li>
        </ul>
        <div uiNavigationMenuIndicator class="nav-indicator"></div>
        @if (layout.viewport) {
          <div
            *uiNavigationMenuViewport="
              let state;
              side: layout.placement.side;
              align: layout.placement.align
            "
            class="nav-viewport"
          ></div>
        }
      </nav>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly fixture = fixture
  protected readonly options = navigationMenuOptions()
  protected readonly layout = navigationMenuLayout()
  protected readonly action = signal("")

  protected report(value: string | null, { reason }: ChangeDetails) {
    this.action.set(navigationMenuAction(value, reason))
  }
}

export { Fixture }

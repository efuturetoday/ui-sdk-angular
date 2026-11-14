import { Component } from "@angular/core"
import { LucideChevronDown, LucideChevronRight } from "@lucide/angular"
import {
  UiNavigationMenu,
  UiNavigationMenuContent,
  UiNavigationMenuItem,
  UiNavigationMenuLink,
  UiNavigationMenuList,
  UiNavigationMenuTrigger,
  UiNavigationMenuViewport,
} from "@ngx-ui-sdk/core/navigation-menu"

@Component({
  selector: "app-example",
  imports: [
    LucideChevronDown,
    LucideChevronRight,
    UiNavigationMenu,
    UiNavigationMenuContent,
    UiNavigationMenuItem,
    UiNavigationMenuLink,
    UiNavigationMenuList,
    UiNavigationMenuTrigger,
    UiNavigationMenuViewport,
  ],
  template: `
    <nav uiNavigationMenu aria-label="Main">
      <ul uiNavigationMenuList>
        <li uiNavigationMenuItem value="guides">
          <button uiNavigationMenuTrigger>
            Guides
            <svg lucideChevronDown aria-hidden="true"></svg>
          </button>
          <div *uiNavigationMenuContent>
            <ul>
              @for (link of gettingStarted; track link.title) {
                <li>
                  <a uiNavigationMenuLink [href]="link.href">
                    <span>{{ link.title }}</span>
                    <span data-slot="hint">{{ link.description }}</span>
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
            <nav uiNavigationMenu orientation="vertical">
              <ul uiNavigationMenuList>
                @for (group of groups; track group.value) {
                  <li uiNavigationMenuItem [value]="group.value">
                    <button uiNavigationMenuTrigger>
                      {{ group.label }}
                      <svg lucideChevronRight aria-hidden="true"></svg>
                    </button>
                    <div
                      *uiNavigationMenuContent="
                        let state;
                        sideOffset: 9;
                        alignOffset: -5
                      "
                    >
                      <ul>
                        @for (link of group.links; track link.title) {
                          <li>
                            <a uiNavigationMenuLink [href]="link.href">
                              {{ link.title }}
                            </a>
                          </li>
                        }
                      </ul>
                    </div>
                  </li>
                }
              </ul>
            </nav>
          </div>
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
  protected readonly groups = [
    {
      value: "overlays",
      label: "Overlays",
      links: [
        { title: "Dialog", href: "#" },
        { title: "Popover", href: "#" },
        { title: "Tooltip", href: "#" },
      ],
    },
    {
      value: "forms",
      label: "Forms",
      links: [
        { title: "Input", href: "#" },
        { title: "Select", href: "#" },
        { title: "Checkbox", href: "#" },
      ],
    },
  ]
}

export { Example }

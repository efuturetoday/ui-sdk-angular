import { Component, input, signal } from "@angular/core"
import {
  type IconName,
  icons,
  iconsFixture as f,
  iconsOptions,
} from "tests/fixtures/item-icons"
import {
  UiAutocomplete,
  UiAutocompleteContent,
  UiAutocompleteEmpty,
  UiAutocompleteInput,
  UiAutocompleteItem,
  UiAutocompleteItemIcon,
  UiAutocompleteItemText,
  UiAutocompleteLabel,
  UiAutocompleteList,
} from "ngx-ui-sdk/autocomplete"
import {
  UiCombobox,
  UiComboboxContent,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxItemIcon,
  UiComboboxItemText,
  UiComboboxLabel,
  UiComboboxList,
  UiComboboxValueIcon,
} from "ngx-ui-sdk/combobox"
import {
  UiCommand,
  UiCommandEmpty,
  UiCommandInput,
  UiCommandItem,
  UiCommandItemIcon,
  UiCommandItemText,
  UiCommandList,
} from "ngx-ui-sdk/command"
import {
  UiMenu,
  UiMenuContent,
  UiMenuItem,
  UiMenuItemIcon,
  UiMenuTrigger,
} from "ngx-ui-sdk/menu"
import {
  UiNavigationMenu,
  UiNavigationMenuItem,
  UiNavigationMenuLink,
  UiNavigationMenuLinkIcon,
  UiNavigationMenuList,
} from "ngx-ui-sdk/navigation-menu"
import {
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIcon,
  UiSelectLabel,
  UiSelectTrigger,
  UiSelectValue,
  UiSelectValueIcon,
} from "ngx-ui-sdk/select"
import {
  UiTabs,
  UiTabsList,
  UiTabsTab,
  UiTabsTabIcon,
} from "ngx-ui-sdk/tabs"
import {
  UiToggle,
  UiToggleGroup,
  UiToggleIcon,
} from "ngx-ui-sdk/toggle"

// An entry's icon: its SVG, with its title, or its emoji.
@Component({
  selector: "app-icon-glyph",
  template: `
    @if (entry().icon) {
      <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor">
        <title>{{ icons[entry().icon!].title }}</title>
        <path [attr.d]="icons[entry().icon!].path" />
      </svg>
    } @else {
      {{ entry().emoji }}
    }
  `,
})
class IconGlyph {
  readonly entry = input.required<{ icon?: IconName; emoji?: string }>()
  protected readonly icons = icons
}

@Component({
  selector: "app-fixture",
  imports: [
    IconGlyph,
    UiAutocomplete,
    UiAutocompleteContent,
    UiAutocompleteEmpty,
    UiAutocompleteInput,
    UiAutocompleteItem,
    UiAutocompleteItemIcon,
    UiAutocompleteItemText,
    UiAutocompleteLabel,
    UiAutocompleteList,
    UiCombobox,
    UiComboboxContent,
    UiComboboxInput,
    UiComboboxItem,
    UiComboboxItemIcon,
    UiComboboxItemText,
    UiComboboxLabel,
    UiComboboxList,
    UiComboboxValueIcon,
    UiCommand,
    UiCommandEmpty,
    UiCommandInput,
    UiCommandItem,
    UiCommandItemIcon,
    UiCommandItemText,
    UiCommandList,
    UiMenu,
    UiMenuContent,
    UiMenuItem,
    UiMenuItemIcon,
    UiMenuTrigger,
    UiNavigationMenu,
    UiNavigationMenuItem,
    UiNavigationMenuLink,
    UiNavigationMenuLinkIcon,
    UiNavigationMenuList,
    UiSelect,
    UiSelectContent,
    UiSelectItem,
    UiSelectItemIcon,
    UiSelectLabel,
    UiSelectTrigger,
    UiSelectValue,
    UiSelectValueIcon,
    UiTabs,
    UiTabsList,
    UiTabsTab,
    UiTabsTabIcon,
    UiToggle,
    UiToggleGroup,
    UiToggleIcon,
  ],
  template: `
    <div class="fixture icons-fixture">
      <button>Before</button>

      <ng-container uiMenu [onAction]="onMenu">
        <button uiMenuTrigger class="trigger">{{ f.menu.trigger }}</button>
        <div *uiMenuContent="let state" class="popup">
          @for (item of f.menu.items; track item.value) {
            <div uiMenuItem [value]="item.value">
              @if (hasIcon(item)) {
                <span uiMenuItemIcon [mirror]="item.mirror"
                  ><app-icon-glyph [entry]="item"
                /></span>
              }
              {{ item.label }}
            </div>
          }
          <div
            uiMenuItem
            [value]="f.menu.iconOnly.value"
            [attr.aria-label]="f.menu.iconOnly.label"
          >
            <span uiMenuItemIcon
              ><app-icon-glyph [entry]="f.menu.iconOnly"
            /></span>
          </div>
          @if (o.unnamed) {
            <div uiMenuItem [value]="f.unnamed.value">
              <span uiMenuItemIcon
                ><app-icon-glyph [entry]="f.unnamed"
              /></span>
            </div>
          }
        </div>
      </ng-container>

      <ng-container
        uiSelect
        [placeholder]="f.select.placeholder"
        [defaultValue]="o.select"
        (valueChange)="action.set('select:' + $event)"
      >
        <div uiSelectLabel class="label">{{ f.select.label }}</div>
        <button uiSelectTrigger class="trigger">
          <span uiSelectValueIcon class="value-icon"></span>
          <span uiSelectValue class="value"></span>
        </button>
        <div *uiSelectContent class="popup list-popup">
          @for (item of f.select.items; track item.value) {
            <div uiSelectItem class="item" [value]="item.value">
              @if (hasIcon(item)) {
                <span uiSelectItemIcon
                  ><app-icon-glyph [entry]="item"
                /></span>
              }
              {{ item.label }}
            </div>
          }
        </div>
      </ng-container>

      <ng-container
        uiCombobox
        [defaultValue]="o.combobox"
        (valueChange)="action.set('combobox:' + $event)"
      >
        <div uiComboboxLabel class="label">{{ f.combobox.label }}</div>
        <span uiComboboxValueIcon class="value-icon"></span>
        <input uiComboboxInput class="input" />
        <div *uiComboboxContent class="popup list-popup">
          <div uiComboboxList>
            @for (item of f.combobox.items; track item.value) {
              <div
                uiComboboxItem
                class="item"
                [value]="item.value"
                [label]="item.label"
              >
                @if (hasIcon(item)) {
                  <span uiComboboxItemIcon
                    ><app-icon-glyph [entry]="item"
                  /></span>
                }
                <span uiComboboxItemText></span>
              </div>
            }
          </div>
        </div>
      </ng-container>

      <ng-container uiAutocomplete>
        <div uiAutocompleteLabel class="label">{{ f.autocomplete.label }}</div>
        <input uiAutocompleteInput class="input" />
        <div *uiAutocompleteContent class="popup list-popup">
          <div uiAutocompleteEmpty class="empty">No results</div>
          <div uiAutocompleteList>
            @for (item of f.autocomplete.items; track item.value) {
              <div uiAutocompleteItem class="item" [value]="item.label">
                <span uiAutocompleteItemIcon
                  ><app-icon-glyph [entry]="item"
                /></span>
                <span uiAutocompleteItemText></span>
              </div>
            }
          </div>
        </div>
      </ng-container>

      <div uiCommand class="command" [onAction]="onCommand">
        <input uiCommandInput class="input" [attr.aria-label]="f.command.label" />
        <div uiCommandEmpty class="empty">No results</div>
        <div uiCommandList class="command-list">
          @for (item of f.command.items; track item.value) {
            <div
              uiCommandItem
              class="item"
              [value]="item.value"
              [label]="item.label"
            >
              @if (hasIcon(item)) {
                <span uiCommandItemIcon
                  ><app-icon-glyph [entry]="item"
                /></span>
              }
              <span uiCommandItemText></span>
            </div>
          }
        </div>
      </div>

      <div uiTabs class="tabs">
        <div uiTabsList class="tablist" [attr.aria-label]="f.tabs.label">
          @for (tab of f.tabs.tabs; track tab.value) {
            <button uiTabsTab class="tab" [value]="tab.value">
              <span uiTabsTabIcon><app-icon-glyph [entry]="tab" /></span>
              {{ tab.label }}
            </button>
          }
          <button
            uiTabsTab
            class="tab"
            [value]="f.tabs.iconOnly.value"
            [attr.aria-label]="f.tabs.iconOnly.label"
          >
            <span uiTabsTabIcon
              ><app-icon-glyph [entry]="f.tabs.iconOnly"
            /></span>
          </button>
        </div>
      </div>

      <div uiToggleGroup class="toggle-group" [attr.aria-label]="f.toggles.label">
        <button uiToggle class="toggle" [value]="f.toggles.bold.value">
          <span uiToggleIcon><app-icon-glyph [entry]="f.toggles.bold" /></span>
          {{ f.toggles.bold.label }}
        </button>
        <button
          uiToggle
          class="toggle"
          [value]="f.toggles.iconOnly.value"
          [attr.aria-label]="f.toggles.iconOnly.label"
        >
          <span uiToggleIcon
            ><app-icon-glyph [entry]="f.toggles.iconOnly"
          /></span>
        </button>
      </div>

      <nav uiNavigationMenu class="nav-menu" [attr.aria-label]="f.navigation.label">
        <ul uiNavigationMenuList class="nav-list">
          @for (link of f.navigation.links; track link.value) {
            <li uiNavigationMenuItem [value]="link.value">
              <a uiNavigationMenuLink class="nav-link" [href]="'#' + link.value">
                <span uiNavigationMenuLinkIcon [mirror]="link.mirror"
                  ><app-icon-glyph [entry]="link"
                /></span>
                {{ link.label }}
              </a>
            </li>
          }
        </ul>
      </nav>

      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly o = iconsOptions()
  protected readonly action = signal("")
  protected readonly onMenu = (value: string) => this.action.set(`menu:${value}`)
  protected readonly onCommand = (value: string) =>
    this.action.set(`command:${value}`)

  protected hasIcon(entry: { icon?: string; emoji?: string }) {
    return !!(entry.icon || entry.emoji)
  }
}

export { Fixture }

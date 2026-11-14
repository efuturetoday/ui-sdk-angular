import { afterNextRender, Component, signal } from "@angular/core"
import { menubarFixture as f, menubarOptions } from "tests/fixtures/menubar"
import {
  UiMenu,
  UiMenuCheckboxItem,
  UiMenuContent,
  UiMenuItem,
  UiMenuRadioGroup,
  UiMenuRadioItem,
  UiMenuSeparator,
  UiMenuShortcut,
  UiMenuSub,
  UiMenuSubTrigger,
  UiMenuTrigger,
  type MenuCheckedChangeDetails,
} from "@ngx-ui-sdk/core/menu"
import {
  createMenubarController,
  UiMenubar,
} from "@ngx-ui-sdk/core/menubar"

// Upstream's fixture; an item's shortcut shows through the `uiMenuShortcut`
// written in it.
@Component({
  selector: "app-fixture",
  imports: [
    UiMenu,
    UiMenubar,
    UiMenuCheckboxItem,
    UiMenuContent,
    UiMenuItem,
    UiMenuRadioGroup,
    UiMenuRadioItem,
    UiMenuSeparator,
    UiMenuShortcut,
    UiMenuSub,
    UiMenuSubTrigger,
    UiMenuTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiMenubar
        class="menubar"
        [attr.aria-label]="f.label"
        [controller]="controller"
        [orientation]="options.orientation"
        [loop]="options.loop"
        [disabled]="options.disabled"
        [modal]="options.modal"
      >
        <ng-container uiMenu [onAction]="run">
          <button uiMenuTrigger>{{ f.file.trigger }}</button>
          <div *uiMenuContent class="popup">
            @for (item of f.file.items; track item.value) {
              <div
                uiMenuItem
                class="item"
                [value]="item.value"
                [shortcut]="item.shortcut"
              >
                {{ item.label }}
                @if (item.shortcut) {
                  <span uiMenuShortcut></span>
                }
              </div>
            }
            <ng-container uiMenuSub>
              <div uiMenuSubTrigger class="item">
                {{ f.file.share.trigger }}
              </div>
              <div *uiMenuSubContent class="popup">
                @for (item of f.file.share.items; track item.value) {
                  <div uiMenuItem class="item" [value]="item.value">
                    {{ item.label }}
                  </div>
                }
              </div>
            </ng-container>
            <div uiMenuSeparator class="separator"></div>
            <div uiMenuItem class="item" [value]="f.file.print.value">
              {{ f.file.print.label }}
            </div>
          </div>
        </ng-container>
        <ng-container uiMenu [onAction]="run">
          <button uiMenuTrigger>{{ f.edit.trigger }}</button>
          <div *uiMenuContent class="popup">
            @for (item of f.edit.items; track item.value) {
              <div
                uiMenuItem
                class="item"
                [value]="item.value"
                [disabled]="item.disabled"
              >
                {{ item.label }}
              </div>
            }
          </div>
        </ng-container>
        <ng-container
          uiMenu
          (checkedChange)="onChecked($event.checked, $event.details)"
        >
          <button uiMenuTrigger [shortcut]="f.view.shortcut">
            {{ f.view.trigger }}
          </button>
          <div *uiMenuContent class="popup">
            @for (item of f.view.checkboxes; track item.value) {
              <div
                uiMenuCheckboxItem
                class="item"
                [value]="item.value"
                [defaultChecked]="item.defaultChecked"
              >
                {{ item.label }}
              </div>
            }
          </div>
        </ng-container>
        <ng-container uiMenu>
          <button uiMenuTrigger>{{ f.profiles.trigger }}</button>
          <div *uiMenuContent class="popup">
            <div
              uiMenuRadioGroup
              [defaultValue]="f.profiles.defaultValue"
              (valueChange)="run('profile: ' + $event)"
            >
              @for (item of f.profiles.items; track item.value) {
                <div uiMenuRadioItem class="item" [value]="item.value">
                  {{ item.label }}
                </div>
              }
            </div>
          </div>
        </ng-container>
        <ng-container uiMenu [onAction]="run">
          <button uiMenuTrigger disabled>{{ f.help.trigger }}</button>
          <div *uiMenuContent class="popup">
            @for (item of f.help.items; track item.value) {
              <div uiMenuItem class="item" [value]="item.value">
                {{ item.label }}
              </div>
            }
          </div>
        </ng-container>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly options = menubarOptions()
  protected readonly controller = createMenubarController()
  protected readonly action = signal("")
  protected readonly run = (value: string) => this.action.set(value)

  constructor() {
    // Specs drive the menubar through its controller. Only in the browser.
    afterNextRender(() => Object.assign(window, { __menubar: this.controller }))
  }

  protected onChecked(checked: boolean, details: MenuCheckedChangeDetails) {
    this.run(`${details.value}: ${checked ? "on" : "off"}`)
  }
}

export { Fixture }

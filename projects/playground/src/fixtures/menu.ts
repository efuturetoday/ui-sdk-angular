import { UiText } from "@ngx-ui-sdk/core"
import { Component, signal } from "@angular/core"
import { menuOptions } from "tests/fixtures/page"
import {
  createMenuController,
  UiMenu,
  UiMenuCheckboxItem,
  UiMenuContent,
  UiMenuGroup,
  UiMenuGroupLabel,
  UiMenuItem,
  UiMenuRadioGroup,
  UiMenuRadioItem,
  UiMenuSeparator,
  UiMenuShortcut,
  UiMenuSub,
  UiMenuSubTrigger,
  UiMenuTrigger,
} from "@ngx-ui-sdk/core/menu"

// Upstream's fixture; an item's shortcut shows through the `uiMenuShortcut`
// written in it, where Vue renders one for you.
@Component({
  selector: "app-fixture",
  imports: [UiText, 
    UiMenu,
    UiMenuCheckboxItem,
    UiMenuContent,
    UiMenuGroup,
    UiMenuGroupLabel,
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
      <ng-container
        uiMenu
        [controller]="controller"
        [defaultOpen]="options.defaultOpen"
        [container]="options.container"
        [modal]="options.modal"
        [presentation]="options.presentation"
        [onAction]="onAction"
      >
        <button uiMenuTrigger>File</button>
        <div *uiMenuContent class="popup">
          <div uiMenuItem class="item" value="new" shortcut="mod+n">New file<span uiMenuShortcut uiText></span></div>
          <div uiMenuItem class="item" value="open" shortcut="mod+o">Open…<span uiMenuShortcut uiText></span></div>
          <div uiMenuItem class="item" value="save" disabled>Save</div>
          <div uiMenuSeparator class="separator"></div>
          <div uiMenuGroup>
            <div uiMenuGroupLabel class="label">View</div>
            <div uiMenuCheckboxItem class="item" value="sidebar" defaultChecked>Show sidebar</div>
            <div uiMenuCheckboxItem class="item" value="statusbar">Show status bar</div>
          </div>
          <div uiMenuSeparator class="separator"></div>
          <div uiMenuRadioGroup defaultValue="name">
            <div uiMenuGroupLabel class="label">Sort by</div>
            <div uiMenuRadioItem class="item" value="name">Name</div>
            <div uiMenuRadioItem class="item" value="date">Date</div>
            <div uiMenuRadioItem class="item" value="size">Size</div>
          </div>
          <div uiMenuSeparator class="separator"></div>
          <ng-container uiMenuSub>
            <div uiMenuSubTrigger class="item">Share</div>
            <div *uiMenuSubContent class="popup">
              <div uiMenuItem class="item" value="email">Email</div>
              <div uiMenuItem class="item" value="link">Copy link</div>
              <ng-container uiMenuSub>
                <div uiMenuSubTrigger class="item">More</div>
                <div *uiMenuSubContent class="popup">
                  <div uiMenuItem class="item" value="embed">Embed</div>
                </div>
              </ng-container>
            </div>
          </ng-container>
          <div uiMenuItem class="item" value="delete">Delete</div>
        </div>
      </ng-container>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <button (click)="controller.open({ focus: 'first' })">Open with controller</button>
    </div>
  `,
})
class Fixture {
  protected readonly controller = createMenuController()
  protected readonly options = menuOptions() as {
    defaultOpen?: boolean
    container?: HTMLElement | null
    modal?: boolean | "pointer"
    presentation?: "auto" | "popover" | "sheet"
  }
  protected readonly action = signal("")
  protected readonly onAction = (value: string) => this.action.set(value)
}

export { Fixture }

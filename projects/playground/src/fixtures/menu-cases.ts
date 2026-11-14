import { Component, signal } from "@angular/core"
import {
  UiMenu,
  UiMenuCheckboxItem,
  UiMenuContent,
  UiMenuGroupLabel,
  UiMenuItem,
  UiMenuRadioGroup,
  UiMenuRadioItem,
  UiMenuSeparator,
  UiMenuShortcut,
  UiMenuSub,
  UiMenuSubTrigger,
  UiMenuTrigger,
} from "ui-sdk-angular"

@Component({
  selector: "app-fixture",
  imports: [
    UiMenu,
    UiMenuCheckboxItem,
    UiMenuContent,
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
      <ng-container uiMenu [onAction]="onAction">
        <button uiMenuTrigger>Edit</button>
        <div *uiMenuContent class="popup">
          <div uiMenuItem class="item" value="pin" [onSelect]="keepOpen">Pin</div>
          <div uiMenuItem class="item" value="zoom" [closeOnSelect]="false">Zoom in</div>
          <div uiMenuItem class="item" value="erase" shortcut="mod+backspace">Erase<span uiMenuShortcut></span></div>
          <div uiMenuItem class="item" value="window" shortcut="alt+n">New window<span uiMenuShortcut></span></div>
          <div uiMenuSeparator class="separator"></div>
          <div uiMenuCheckboxItem class="item" value="autosave" closeOnSelect>Autosave</div>
          <div uiMenuCheckboxItem class="item" value="pinned" checked>Pinned</div>
          <div uiMenuRadioGroup [(value)]="align">
            <div uiMenuGroupLabel class="label">Align</div>
            <div uiMenuRadioItem class="item" value="left">Left</div>
            <div uiMenuRadioItem class="item" value="right">Right</div>
          </div>
          <ng-container uiMenuSub>
            <div uiMenuSubTrigger class="item" disabled>Share</div>
            <div *uiMenuSubContent class="popup">
              <div uiMenuItem class="item" value="email">Email</div>
            </div>
          </ng-container>
          <ng-container uiMenuSub [loop]="false">
            <div uiMenuSubTrigger class="item">More</div>
            <div *uiMenuSubContent class="popup">
              <div uiMenuItem class="item" value="first">First</div>
              <div uiMenuItem class="item" value="last">Last</div>
            </div>
          </ng-container>
        </div>
      </ng-container>
      <ng-container uiMenu>
        <button uiMenuTrigger>Offsets</button>
        <div
          *uiMenuContent="let state; sideOffset: 8; alignOffset: -4; collisionPadding: 24"
          class="popup"
        >
          <div uiMenuItem class="item" value="one">One</div>
          <div uiMenuItem class="item" value="two">Two</div>
        </div>
      </ng-container>
      <ng-container uiMenu [(open)]="open">
        <button uiMenuTrigger>Controlled</button>
        <div *uiMenuContent class="popup">
          <div uiMenuItem class="item" value="done" [onSelect]="closeFromState">Done</div>
          <div uiMenuItem class="item" value="later">Later</div>
        </div>
      </ng-container>
      <button (click)="align.set('right')">Align right</button>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Selections">{{ selections() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly action = signal("")
  protected readonly selections = signal(0)
  protected readonly align = signal<string | null | undefined>("left")
  protected readonly open = signal<boolean | undefined>(false)
  protected readonly onAction = (value: string) => this.action.set(value)
  protected readonly keepOpen = (event: Event) => {
    event.preventDefault()
    this.selections.update((count) => count + 1)
  }
  protected readonly closeFromState = (event: Event) => {
    event.preventDefault()
    this.open.set(false)
  }

  constructor() {
    // Specs close the controlled menu from outside it.
    Object.assign(window, { __closeControlled: () => this.open.set(false) })
  }
}

export { Fixture }

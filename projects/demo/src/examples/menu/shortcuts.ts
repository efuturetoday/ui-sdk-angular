import { Component } from "@angular/core"
import {
  UiMenu,
  UiMenuContent,
  UiMenuItem,
  UiMenuSeparator,
  UiMenuShortcut,
  UiMenuTrigger,
} from "ngx-ui-sdk/menu"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiMenu,
    UiMenuContent,
    UiMenuItem,
    UiMenuSeparator,
    UiMenuShortcut,
    UiMenuTrigger,
  ],
  template: `
    <ng-container uiMenu [onAction]="onAction">
      <button uiMenuTrigger>File</button>
      <div *uiMenuContent="let state">
        <div uiMenuItem value="new-tab" shortcut="mod+t">
          New tab<span uiMenuShortcut></span>
        </div>
        <div uiMenuItem value="new-window" shortcut="mod+n">
          New window<span uiMenuShortcut></span>
        </div>
        <div uiMenuItem value="open" shortcut="mod+o">
          Open…<span uiMenuShortcut></span>
        </div>
        <div uiMenuSeparator></div>
        <div uiMenuItem value="save" shortcut="mod+s">
          Save<span uiMenuShortcut></span>
        </div>
        <div uiMenuItem value="save-as" shortcut="mod+shift+s">
          Save as…<span uiMenuShortcut></span>
        </div>
        <div uiMenuSeparator></div>
        <div uiMenuItem value="print" shortcut="mod+p">
          Print…<span uiMenuShortcut></span>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly #log = injectLog()
  protected readonly onAction = (value: string) => this.#log(`Chose ${value}`)
}

export { Example }

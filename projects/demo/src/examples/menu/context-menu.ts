import { Component } from "@angular/core"
import {
  UiMenu,
  UiMenuContent,
  UiMenuContextTrigger,
  UiMenuItem,
  UiMenuSeparator,
} from "@ngx-ui-sdk/core/menu"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiMenu,
    UiMenuContent,
    UiMenuContextTrigger,
    UiMenuItem,
    UiMenuSeparator,
  ],
  template: `
    <ng-container uiMenu [onAction]="onAction">
      <div uiMenuContextTrigger tabindex="0">
        Right-click or long-press here
      </div>
      <div *uiMenuContent="let state">
        <div uiMenuItem value="back">Back</div>
        <div uiMenuItem value="forward" disabled>Forward</div>
        <div uiMenuItem value="reload">Reload</div>
        <div uiMenuSeparator></div>
        <div uiMenuItem value="save">Save page as…</div>
        <div uiMenuItem value="print">Print…</div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly #log = injectLog()
  protected readonly onAction = (value: string) => this.#log(`Chose ${value}`)
}

export { Example }

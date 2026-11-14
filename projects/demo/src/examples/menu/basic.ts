import { Component } from "@angular/core"
import {
  UiMenu,
  UiMenuContent,
  UiMenuGroup,
  UiMenuGroupLabel,
  UiMenuItem,
  UiMenuSeparator,
  UiMenuTrigger,
} from "ngx-ui-sdk/menu"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiMenu,
    UiMenuContent,
    UiMenuGroup,
    UiMenuGroupLabel,
    UiMenuItem,
    UiMenuSeparator,
    UiMenuTrigger,
  ],
  template: `
    <ng-container uiMenu [onAction]="onAction">
      <button uiMenuTrigger>Open Menu</button>
      <div *uiMenuContent="let state">
        <div uiMenuGroup>
          <div uiMenuGroupLabel>Project</div>
          <div uiMenuItem value="overview">Overview</div>
          <div uiMenuItem value="members">Members</div>
          <div uiMenuItem value="settings">Settings</div>
        </div>
        <div uiMenuSeparator></div>
        <div uiMenuGroup>
          <div uiMenuGroupLabel>Help</div>
          <div uiMenuItem value="docs">Documentation</div>
          <div uiMenuItem value="feedback">Send feedback</div>
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

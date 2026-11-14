import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiMenu,
  UiMenuCheckboxItem,
  UiMenuContent,
  UiMenuGroup,
  UiMenuGroupLabel,
  UiMenuItemIndicator,
  UiMenuSeparator,
  UiMenuTrigger,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    UiMenu,
    UiMenuCheckboxItem,
    UiMenuContent,
    UiMenuGroup,
    UiMenuGroupLabel,
    UiMenuItemIndicator,
    UiMenuSeparator,
    UiMenuTrigger,
  ],
  template: `
    <ng-container
      uiMenu
      (checkedChange)="
        log($event.details.value + ' ' + ($event.checked ? 'on' : 'off'))
      "
    >
      <button uiMenuTrigger>View</button>
      <div *uiMenuContent="let state">
        <div uiMenuGroup>
          <div uiMenuGroupLabel>Appearance</div>
          <div uiMenuCheckboxItem value="status-bar" defaultChecked>
            <span *uiMenuItemIndicator="let state; keepMounted: true">
              <svg lucideCheck aria-hidden="true"></svg>
            </span>
            Status bar
          </div>
          <div uiMenuCheckboxItem value="minimap">
            <span *uiMenuItemIndicator="let state; keepMounted: true">
              <svg lucideCheck aria-hidden="true"></svg>
            </span>
            Minimap
          </div>
        </div>
        <div uiMenuSeparator></div>
        <div uiMenuCheckboxItem value="line-numbers" defaultChecked>
          <span *uiMenuItemIndicator="let state; keepMounted: true">
            <svg lucideCheck aria-hidden="true"></svg>
          </span>
          Line numbers
        </div>
        <div uiMenuCheckboxItem value="word-wrap">
          <span *uiMenuItemIndicator="let state; keepMounted: true">
            <svg lucideCheck aria-hidden="true"></svg>
          </span>
          Word wrap
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly log = injectLog()
}

export { Example }

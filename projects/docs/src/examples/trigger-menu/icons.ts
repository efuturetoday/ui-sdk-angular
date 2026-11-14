import { Component } from "@angular/core"
import {
  LucideClock,
  LucideReply,
  LucideSearch,
  LucideShare,
  LucideTrash,
} from "@lucide/angular"
import { UiField, UiFieldControl, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  type TriggerDefinition,
  UiTriggerMenu,
  UiTriggerMenuContent,
  UiTriggerMenuInput,
  UiTriggerMenuItem,
  UiTriggerMenuItemIcon,
  UiTriggerMenuList,
} from "@ngx-ui-sdk/core/trigger-menu"

@Component({
  selector: "app-example",
  imports: [
    LucideClock,
    LucideReply,
    LucideSearch,
    LucideShare,
    LucideTrash,
    UiField,
    UiFieldControl,
    UiFieldLabel,
    UiTriggerMenu,
    UiTriggerMenuContent,
    UiTriggerMenuInput,
    UiTriggerMenuItem,
    UiTriggerMenuItemIcon,
    UiTriggerMenuList,
  ],
  template: `
    <ng-container uiTriggerMenu [triggers]="triggers">
      <div uiField>
        <label uiFieldLabel>Message</label>
        <input
          uiFieldControl
          uiTriggerMenuInput
          placeholder="Type / for commands…"
        />
      </div>
      <div *uiTriggerMenuContent="let state">
        <div uiTriggerMenuList>
          <div uiTriggerMenuItem value="reply">
            <span uiTriggerMenuItemIcon mirror><svg lucideReply></svg></span>
            reply
          </div>
          <div uiTriggerMenuItem value="remind">
            <span uiTriggerMenuItemIcon><svg lucideClock></svg></span>
            remind
          </div>
          <div uiTriggerMenuItem value="search">
            <span uiTriggerMenuItemIcon><svg lucideSearch></svg></span>
            search
          </div>
          <div uiTriggerMenuItem value="share">
            <span uiTriggerMenuItemIcon><svg lucideShare></svg></span>
            share
          </div>
          <div uiTriggerMenuItem value="clear">
            <span uiTriggerMenuItemIcon><svg lucideTrash></svg></span>
            clear
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly triggers: TriggerDefinition[] = [
    { char: "/", boundary: "start", type: "command" },
  ]
}

export { Example }

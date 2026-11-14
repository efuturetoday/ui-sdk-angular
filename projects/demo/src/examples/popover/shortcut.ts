import { Component } from "@angular/core"
import { UiField, UiFieldLabel } from "ngx-ui-sdk/field"
import { UiInput } from "ngx-ui-sdk/input"
import {
  UiPopover,
  UiPopoverClose,
  UiPopoverContent,
  UiPopoverDescription,
  UiPopoverShortcut,
  UiPopoverTitle,
  UiPopoverTrigger,
} from "ngx-ui-sdk/popover"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldLabel,
    UiInput,
    UiPopover,
    UiPopoverClose,
    UiPopoverContent,
    UiPopoverDescription,
    UiPopoverShortcut,
    UiPopoverTitle,
    UiPopoverTrigger,
  ],
  template: `
    <ng-container uiPopover>
      <button uiPopoverTrigger shortcut="mod+i">
        Invite
        <span uiPopoverShortcut></span>
      </button>
      <div *uiPopoverContent>
        <h2 uiPopoverTitle>Invite people</h2>
        <p uiPopoverDescription>They'll get an email with a link to join.</p>
        <div uiField>
          <label uiFieldLabel>Email</label>
          <input uiInput type="email" placeholder="wren@example.com" />
        </div>
        <div data-slot="row">
          <button uiPopoverClose>Cancel</button>
          <button uiPopoverClose data-variant="solid">Send Invite</button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }

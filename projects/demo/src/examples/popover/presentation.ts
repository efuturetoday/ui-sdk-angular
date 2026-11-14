import { Component } from "@angular/core"
import {
  UiField,
  UiFieldLabel,
  UiInput,
  UiPopover,
  UiPopoverClose,
  UiPopoverContent,
  UiPopoverDescription,
  UiPopoverTitle,
  UiPopoverTrigger,
} from "ui-sdk-angular"

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
    UiPopoverTitle,
    UiPopoverTrigger,
  ],
  template: `
    <ng-container uiPopover presentation="sheet">
      <button uiPopoverTrigger>Add Reminder</button>
      <div *uiPopoverContent>
        <h2 uiPopoverTitle>New reminder</h2>
        <p uiPopoverDescription>We'll notify you at the time you pick.</p>
        <div uiField>
          <label uiFieldLabel>Remind me to</label>
          <input uiInput defaultValue="Send the Q3 roadmap" />
        </div>
        <div data-slot="row">
          <button uiPopoverClose>Cancel</button>
          <button uiPopoverClose data-variant="solid">Save</button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }

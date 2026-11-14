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
} from "ngx-ui-sdk"

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
    <ng-container uiPopover>
      <button uiPopoverTrigger>Share</button>
      <div *uiPopoverContent>
        <h2 uiPopoverTitle>Share this document</h2>
        <p uiPopoverDescription>Anyone with the link can view it.</p>
        <div uiField>
          <label uiFieldLabel>Link</label>
          <input uiInput readonly defaultValue="acme.app/d/q3-roadmap" />
        </div>
        <div data-slot="row">
          <button uiPopoverClose>Cancel</button>
          <button uiPopoverClose data-variant="solid">Copy Link</button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }

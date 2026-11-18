import { Component } from "@angular/core"
import {
  UiPopover,
  UiPopoverClose,
  UiPopoverContent,
  UiPopoverDescription,
  UiPopoverTitle,
  UiPopoverTrigger,
} from "@ngx-ui-sdk/core/popover"

@Component({
  selector: "app-example",
  imports: [
    UiPopover,
    UiPopoverClose,
    UiPopoverContent,
    UiPopoverDescription,
    UiPopoverTitle,
    UiPopoverTrigger,
  ],
  template: `
    <div data-slot="popover-frame">
      <div data-slot="popover-corner">
        <ng-container uiPopover>
          <button uiPopoverTrigger>Feedback</button>
          <div *uiPopoverContent="let state; inline: true">
            <h2 uiPopoverTitle>Send feedback</h2>
            <p uiPopoverDescription>
              The panel sits in the corner box, above its trigger.
            </p>
            <div data-slot="row">
              <button uiPopoverClose>Close</button>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
})
class Example {}

export { Example }

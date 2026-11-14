import { Component } from "@angular/core"
import {
  UiPopover,
  UiPopoverClose,
  UiPopoverContent,
  UiPopoverDescription,
  UiPopoverTitle,
  UiPopoverTrigger,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

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
    <ng-container
      uiPopover
      (beforeOpenChange)="log($event.open ? 'Opening' : 'Closing')"
      (openChangeComplete)="log($event ? 'Open' : 'Closed')"
    >
      <button uiPopoverTrigger>What's New</button>
      <div *uiPopoverContent="let state; keepMounted: true">
        <h2 uiPopoverTitle>What's new</h2>
        <p uiPopoverDescription>Comments now support threads and reactions.</p>
        <div data-slot="row">
          <button uiPopoverClose data-variant="solid">Got It</button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly log = injectLog()
}

export { Example }

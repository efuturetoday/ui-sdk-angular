import { Component } from "@angular/core"
import {
  UiPopover,
  UiPopoverArrow,
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
    UiPopoverArrow,
    UiPopoverContent,
    UiPopoverDescription,
    UiPopoverTitle,
    UiPopoverTrigger,
  ],
  template: `
    <ng-container uiPopover openOnHover [delay]="200" [closeDelay]="150">
      <button uiPopoverTrigger>&#64;kofi</button>
      <div *uiPopoverContent="let state; sideOffset: 8">
        <div uiPopoverArrow></div>
        <h2 uiPopoverTitle>Kofi Mensah</h2>
        <p uiPopoverDescription>Engineering manager, platform team.</p>
        <div data-slot="row">
          <button
            type="button"
            data-size="sm"
            data-variant="solid"
            (click)="log('Followed @kofi')"
          >
            Follow
          </button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly log = injectLog()
}

export { Example }

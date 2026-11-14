import { Component } from "@angular/core"
import { UiToolbar, UiToolbarButton } from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [UiToolbar, UiToolbarButton],
  template: `
    <div uiToolbar aria-label="Message">
      <button uiToolbarButton (click)="log('Reply')">Reply</button>
      <button uiToolbarButton disabled (click)="log('Archive')">Archive</button>
      <button
        uiToolbarButton
        disabled
        [focusableWhenDisabled]="false"
        (click)="log('Delete')"
      >
        Delete
      </button>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
}

export { Example }

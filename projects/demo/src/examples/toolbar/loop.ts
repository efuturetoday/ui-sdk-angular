import { Component } from "@angular/core"
import { UiToolbar, UiToolbarButton } from "ngx-ui-sdk/toolbar"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [UiToolbar, UiToolbarButton],
  template: `
    <div uiToolbar [loop]="false" aria-label="Pages">
      @for (label of labels; track label) {
        <button uiToolbarButton (click)="log(label + ' page')">
          {{ label }}
        </button>
      }
    </div>
  `,
})
class Example {
  protected readonly labels = ["First", "Previous", "Next", "Last"]

  protected readonly log = injectLog()
}

export { Example }

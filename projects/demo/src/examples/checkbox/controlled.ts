import { Component, signal } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  type CheckedState,
  createCheckboxController,
  UiCheckbox,
  UiCheckboxInput,
  UiCheckboxIndicator,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [UiCheckboxInput, LucideCheck, UiCheckbox, UiCheckboxIndicator],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="updates.toggle()">Toggle</button>
      </div>
      <label data-slot="label">
        <button
          uiCheckbox
          #box="uiCheckbox"
          [(checked)]="checked"
          [controller]="updates"
          (beforeCheckedChange)="
            onCheckedChange($event.checked, $event.details)
          "
        >
          <span *uiCheckboxIndicator>
            <svg lucideCheck aria-hidden="true"></svg>
          </span>
        </button>
        <input [uiCheckboxInput]="box" />
        Email me about product updates
      </label>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly updates = createCheckboxController()
  protected readonly checked = signal<CheckedState>(false)

  protected onCheckedChange(next: CheckedState, details: ChangeDetails) {
    this.log(
      `${next === "indeterminate" ? "Mixed" : next ? "Checked" : "Unchecked"} (${details.reason})`
    )
  }
}

export { Example }

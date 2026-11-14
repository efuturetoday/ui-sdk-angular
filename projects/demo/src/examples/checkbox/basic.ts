import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { UiCheckbox, UiCheckboxIndicator, UiCheckboxInput } from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [UiCheckboxInput, LucideCheck, UiCheckbox, UiCheckboxIndicator],
  template: `
    <label data-slot="label">
      <button uiCheckbox #box="uiCheckbox">
        <span *uiCheckboxIndicator>
          <svg lucideCheck aria-hidden="true"></svg>
        </span>
      </button>
      <input [uiCheckboxInput]="box" />
      Accept terms and conditions
    </label>
  `,
})
class Example {}

export { Example }

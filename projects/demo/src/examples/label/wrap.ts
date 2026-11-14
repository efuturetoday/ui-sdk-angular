import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxIndicator,
  UiCheckboxInput,
  UiLabel,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    UiCheckbox,
    UiCheckboxIndicator,
    UiCheckboxInput,
    UiLabel,
  ],
  template: `
    <label uiLabel>
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

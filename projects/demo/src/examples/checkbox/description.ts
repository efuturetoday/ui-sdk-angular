import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxInput,
  UiCheckboxIndicator,
} from "@ngx-ui-sdk/core/checkbox"
import {
  UiField,
  UiFieldDescription,
  UiFieldLabel,
} from "@ngx-ui-sdk/core/field"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    UiCheckbox,
    UiCheckboxInput,
    UiCheckboxIndicator,
    UiField,
    UiFieldDescription,
    UiFieldLabel,
  ],
  template: `
    <div uiField>
      <button uiCheckbox #box="uiCheckbox">
        <span *uiCheckboxIndicator>
          <svg lucideCheck aria-hidden="true"></svg>
        </span>
      </button>
      <input [uiCheckboxInput]="box" />
      <div data-slot="stack">
        <label uiFieldLabel>Accept terms and conditions</label>
        <p uiFieldDescription>
          By clicking this checkbox, you agree to the terms and conditions.
        </p>
      </div>
    </div>
  `,
})
class Example {}

export { Example }

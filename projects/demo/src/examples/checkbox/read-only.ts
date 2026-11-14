import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxIndicator,
  UiCheckboxInput,
} from "ngx-ui-sdk/checkbox"
import { UiField, UiFieldDescription, UiFieldLabel } from "ngx-ui-sdk/field"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    UiCheckbox,
    UiCheckboxIndicator,
    UiCheckboxInput,
    UiField,
    UiFieldDescription,
    UiFieldLabel,
  ],
  template: `
    <div uiField>
      <button
        uiCheckbox
        #twoFactor="uiCheckbox"
        name="two-factor"
        defaultChecked
        readOnly
      >
        <span *uiCheckboxIndicator>
          <svg lucideCheck aria-hidden="true"></svg>
        </span>
      </button>
      <input [uiCheckboxInput]="twoFactor" />
      <div data-slot="stack">
        <label uiFieldLabel>Require two-factor authentication</label>
        <p uiFieldDescription>Your organization requires this setting.</p>
      </div>
    </div>
  `,
})
class Example {}

export { Example }

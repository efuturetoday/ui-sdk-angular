import { Component } from "@angular/core"
import { UiField, UiFieldLabel } from "ngx-ui-sdk/field"
import {
  UiRadio,
  UiRadioInput,
  UiRadioGroup,
  UiRadioIndicator,
} from "ngx-ui-sdk/radio"

@Component({
  selector: "app-example",
  imports: [
    UiRadioInput,
    UiField,
    UiFieldLabel,
    UiRadio,
    UiRadioGroup,
    UiRadioIndicator,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Shipping speed</label>
      <div uiRadioGroup defaultValue="standard">
        @for (speed of speeds; track speed.value) {
          <label data-slot="label">
            <button uiRadio #radio="uiRadio" [value]="speed.value">
              <span *uiRadioIndicator></span>
            </button>
            <input [uiRadioInput]="radio" />
            {{ speed.label }}
          </label>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly speeds = [
    { value: "standard", label: "Standard" },
    { value: "express", label: "Express" },
    { value: "overnight", label: "Overnight" },
  ]
}

export { Example }

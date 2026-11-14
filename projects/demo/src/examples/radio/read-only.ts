import { Component } from "@angular/core"
import {
  UiField,
  UiFieldDescription,
  UiFieldLabel,
  UiRadio,
  UiRadioInput,
  UiRadioGroup,
  UiRadioIndicator,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldDescription,
    UiFieldLabel,
    UiRadio,
    UiRadioInput,
    UiRadioGroup,
    UiRadioIndicator,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Your plan</label>
      <p uiFieldDescription>Ask an admin to change plans.</p>
      <div uiRadioGroup defaultValue="pro" readOnly>
        @for (plan of plans; track plan.value) {
          <label data-slot="label">
            <button uiRadio #radio="uiRadio" [value]="plan.value">
              <span *uiRadioIndicator></span>
            </button>
            <input [uiRadioInput]="radio" />
            {{ plan.label }}
          </label>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly plans = [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
    { value: "team", label: "Team" },
  ]
}

export { Example }

import { Component } from "@angular/core"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  UiRadio,
  UiRadioInput,
  UiRadioGroup,
  UiRadioIndicator,
} from "@ngx-ui-sdk/core/radio"

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
      <label uiFieldLabel>Plan</label>
      <div uiRadioGroup defaultValue="hobby">
        @for (plan of plans; track plan.value) {
          <label data-slot="card">
            <span data-slot="stack">
              <span>{{ plan.label }}</span>
              <span data-slot="hint">{{ plan.description }}</span>
            </span>
            <button uiRadio #radio="uiRadio" [value]="plan.value">
              <span *uiRadioIndicator></span>
            </button>
            <input [uiRadioInput]="radio" />
          </label>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly plans = [
    {
      value: "hobby",
      label: "Hobby",
      description: "Free for personal projects.",
    },
    {
      value: "pro",
      label: "Pro",
      description: "$20 per month for growing teams.",
    },
    {
      value: "enterprise",
      label: "Enterprise",
      description: "Custom pricing and support.",
    },
  ]
}

export { Example }

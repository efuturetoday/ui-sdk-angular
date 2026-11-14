import { Component } from "@angular/core"
import {
  UiField,
  UiFieldDescription,
  UiFieldLabel,
} from "@ngx-ui-sdk/core/field"
import {
  UiRadio,
  UiRadioInput,
  UiRadioGroup,
  UiRadioIndicator,
} from "@ngx-ui-sdk/core/radio"

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
      <label uiFieldLabel>Email notifications</label>
      <div uiRadioGroup defaultValue="daily">
        @for (frequency of frequencies; track frequency.value) {
          <div uiField>
            <button uiRadio #radio="uiRadio" [value]="frequency.value">
              <span *uiRadioIndicator></span>
            </button>
            <input [uiRadioInput]="radio" />
            <div data-slot="stack">
              <label uiFieldLabel>{{ frequency.label }}</label>
              <p uiFieldDescription>{{ frequency.description }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly frequencies = [
    {
      value: "instant",
      label: "Instantly",
      description: "An email right away.",
    },
    {
      value: "daily",
      label: "Daily digest",
      description: "One email each morning.",
    },
    {
      value: "weekly",
      label: "Weekly digest",
      description: "A summary every Monday.",
    },
  ]
}

export { Example }

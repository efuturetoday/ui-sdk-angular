import { Component } from "@angular/core"
import { LucideMinus, LucidePlus } from "@lucide/angular"
import {
  UiField,
  UiFieldLabel,
  UiNumberInput,
  UiNumberInputControl,
  UiNumberInputDecrement,
  UiNumberInputGroup,
  UiNumberInputIncrement,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    LucideMinus,
    LucidePlus,
    UiField,
    UiFieldLabel,
    UiNumberInput,
    UiNumberInputControl,
    UiNumberInputDecrement,
    UiNumberInputGroup,
    UiNumberInputIncrement,
  ],
  template: `
    <div data-slot="stack">
      @for (field of fields; track field.label) {
        <div uiField>
          <label uiFieldLabel>{{ field.label }}</label>
          <div
            uiNumberInput
            [defaultValue]="field.defaultValue"
            [step]="field.step"
            [format]="field.format"
            [min]="0"
          >
            <div uiNumberInputGroup>
              <button uiNumberInputDecrement aria-label="Decrease">
                <svg lucideMinus aria-hidden="true"></svg>
              </button>
              <input uiNumberInputControl />
              <button uiNumberInputIncrement aria-label="Increase">
                <svg lucidePlus aria-hidden="true"></svg>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
class Example {
  protected readonly fields: {
    label: string
    defaultValue: number
    step: number
    format: Intl.NumberFormatOptions
  }[] = [
    {
      label: "Price",
      defaultValue: 19.99,
      step: 0.01,
      format: { style: "currency", currency: "USD" },
    },
    {
      label: "Discount",
      defaultValue: 0.15,
      step: 0.01,
      format: { style: "percent" },
    },
    {
      label: "Weight",
      defaultValue: 2.5,
      step: 0.1,
      format: { style: "unit", unit: "kilogram" },
    },
  ]
}

export { Example }

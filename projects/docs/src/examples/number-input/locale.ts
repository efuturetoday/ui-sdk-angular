import { Component } from "@angular/core"
import { LucideMinus, LucidePlus } from "@lucide/angular"
import {
  UiField,
  UiFieldDescription,
  UiFieldLabel,
} from "@ngx-ui-sdk/core/field"
import {
  UiNumberInput,
  UiNumberInputControl,
  UiNumberInputDecrement,
  UiNumberInputGroup,
  UiNumberInputIncrement,
} from "@ngx-ui-sdk/core/number-input"

@Component({
  selector: "app-example",
  imports: [
    LucideMinus,
    LucidePlus,
    UiField,
    UiFieldDescription,
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
            [locale]="field.locale"
            [min]="0">
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
          <p uiFieldDescription>Formatted for {{ field.locale }}.</p>
        </div>
      }
    </div>
  `,
})
class Example {
  protected readonly fields: {
    label: string
    locale: string
    defaultValue: number
    step: number
    format: Intl.NumberFormatOptions
  }[] = [
    {
      label: "Preis",
      locale: "de-DE",
      defaultValue: 1234.5,
      step: 0.01,
      format: { style: "currency", currency: "EUR" },
    },
    {
      label: "Budget",
      locale: "en-IN",
      defaultValue: 1234567,
      step: 1000,
      format: { style: "currency", currency: "INR", maximumFractionDigits: 0 },
    },
  ]
}

export { Example }

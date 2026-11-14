import { Component } from "@angular/core"
import { LucideMinus, LucidePlus } from "@lucide/angular"
import { UiField, UiFieldDescription, UiFieldLabel } from "ngx-ui-sdk/field"
import {
  UiNumberInput,
  UiNumberInputControl,
  UiNumberInputDecrement,
  UiNumberInputGroup,
  UiNumberInputIncrement,
} from "ngx-ui-sdk/number-input"

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
    <div uiField>
      <label uiFieldLabel>Hours</label>
      <div
        uiNumberInput
        [defaultValue]="1.5"
        [min]="0"
        [max]="24"
        [step]="0.25"
        [largeStep]="1"
        [smallStep]="0.05"
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
      <p uiFieldDescription>Logged in quarter hours.</p>
    </div>
  `,
})
class Example {}

export { Example }

import { Component } from "@angular/core"
import { LucideMinus, LucidePlus } from "@lucide/angular"
import {
  UiField,
  UiFieldDescription,
  UiFieldLabel,
  UiNumberInput,
  UiNumberInputControl,
  UiNumberInputDecrement,
  UiNumberInputGroup,
  UiNumberInputIncrement,
} from "ui-sdk-angular"

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
      <label uiFieldLabel>Guests</label>
      <div uiNumberInput [defaultValue]="2" [min]="1" [max]="8">
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
      <p uiFieldDescription>Tables seat between 1 and 8 guests.</p>
    </div>
  `,
})
class Example {}

export { Example }

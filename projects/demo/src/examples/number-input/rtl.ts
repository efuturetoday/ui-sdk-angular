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
} from "ui-sdk-angular"

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
    <div dir="rtl">
      <div uiField>
        <label uiFieldLabel>الكمية</label>
        <div uiNumberInput [defaultValue]="1" [min]="0">
          <div uiNumberInputGroup>
            <button uiNumberInputDecrement aria-label="إنقاص">
              <svg lucideMinus aria-hidden="true"></svg>
            </button>
            <input uiNumberInputControl />
            <button uiNumberInputIncrement aria-label="زيادة">
              <svg lucidePlus aria-hidden="true"></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }

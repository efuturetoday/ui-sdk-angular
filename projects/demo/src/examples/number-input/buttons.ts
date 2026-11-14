import { Component } from "@angular/core"
import { LucideMinus, LucidePlus } from "@lucide/angular"
import {
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
    UiNumberInput,
    UiNumberInputControl,
    UiNumberInputDecrement,
    UiNumberInputGroup,
    UiNumberInputIncrement,
  ],
  template: `
    <div uiNumberInput [defaultValue]="1" [min]="0">
      <div uiNumberInputGroup>
        <button uiNumberInputDecrement aria-label="Decrease">
          <svg lucideMinus aria-hidden="true"></svg>
        </button>
        <input uiNumberInputControl aria-label="Quantity" />
        <button uiNumberInputIncrement aria-label="Increase">
          <svg lucidePlus aria-hidden="true"></svg>
        </button>
      </div>
    </div>
  `,
})
class Example {}

export { Example }

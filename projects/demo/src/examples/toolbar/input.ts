import { Component } from "@angular/core"
import { LucideMinus, LucidePlus } from "@lucide/angular"
import {
  UiNumberInput,
  UiNumberInputControl,
  UiNumberInputDecrement,
  UiNumberInputGroup,
  UiNumberInputIncrement,
} from "@ngx-ui-sdk/core/number-input"
import {
  UiToolbar,
  UiToolbarInput,
  UiToolbarSeparator,
} from "@ngx-ui-sdk/core/toolbar"

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
    UiToolbar,
    UiToolbarInput,
    UiToolbarSeparator,
  ],
  template: `
    <div uiToolbar aria-label="Text">
      <div uiNumberInput [defaultValue]="14" [min]="8" [max]="72">
        <div uiNumberInputGroup>
          <button uiNumberInputDecrement aria-label="Decrease font size">
            <svg lucideMinus aria-hidden="true"></svg>
          </button>
          <input uiNumberInputControl uiToolbarInput aria-label="Font size" />
          <button uiNumberInputIncrement aria-label="Increase font size">
            <svg lucidePlus aria-hidden="true"></svg>
          </button>
        </div>
      </div>
      <div uiToolbarSeparator></div>
      <input uiToolbarInput aria-label="Find" placeholder="Find…" />
    </div>
  `,
})
class Example {}

export { Example }

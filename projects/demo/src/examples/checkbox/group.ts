import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxInput,
  UiCheckboxGroup,
  UiCheckboxIndicator,
} from "ngx-ui-sdk/checkbox"

@Component({
  selector: "app-example",
  imports: [
    UiCheckboxInput,
    LucideCheck,
    UiCheckbox,
    UiCheckboxGroup,
    UiCheckboxIndicator,
  ],
  template: `
    <div data-slot="stack">
      <h3 id="basic-toppings">Toppings</h3>
      <div
        uiCheckboxGroup
        aria-labelledby="basic-toppings"
        [defaultValue]="['cheese']"
      >
        @for (topping of toppings; track topping.value) {
          <label data-slot="label">
            <button uiCheckbox #box="uiCheckbox" [value]="topping.value">
              <span *uiCheckboxIndicator>
                <svg lucideCheck aria-hidden="true"></svg>
              </span>
            </button>
            <input [uiCheckboxInput]="box" />
            {{ topping.label }}
          </label>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly toppings = [
    { value: "cheese", label: "Cheese" },
    { value: "mushrooms", label: "Mushrooms" },
    { value: "olives", label: "Olives" },
    { value: "peppers", label: "Peppers" },
  ]
}

export { Example }

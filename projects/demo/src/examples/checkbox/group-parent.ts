import { Component } from "@angular/core"
import { LucideCheck, LucideMinus } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxInput,
  UiCheckboxGroup,
  UiCheckboxIndicator,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideMinus,
    UiCheckbox,
    UiCheckboxInput,
    UiCheckboxGroup,
    UiCheckboxIndicator,
  ],
  template: `
    <div data-slot="stack">
      <h3 id="parent-toppings">Toppings</h3>
      <div
        uiCheckboxGroup
        aria-labelledby="parent-toppings"
        [defaultValue]="['cheese', 'olives']"
        [allValues]="values"
      >
        <label data-slot="label">
          <button uiCheckbox #box="uiCheckbox" parent>
            <span *uiCheckboxIndicator>
              <svg lucideCheck aria-hidden="true"></svg>
              <svg lucideMinus aria-hidden="true"></svg>
            </span>
          </button>
          <input [uiCheckboxInput]="box" />
          Select all
        </label>
        <div data-slot="stack">
          @for (topping of toppings; track topping.value) {
            <label data-slot="label">
              <button uiCheckbox #box2="uiCheckbox" [value]="topping.value">
                <span *uiCheckboxIndicator>
                  <svg lucideCheck aria-hidden="true"></svg>
                </span>
              </button>
              <input [uiCheckboxInput]="box2" />
              {{ topping.label }}
            </label>
          }
        </div>
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
  protected readonly values = this.toppings.map((topping) => topping.value)
}

export { Example }

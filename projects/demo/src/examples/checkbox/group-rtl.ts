import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxInput,
  UiCheckboxGroup,
  UiCheckboxIndicator,
} from "@ngx-ui-sdk/core/checkbox"

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
    <div data-slot="stack" dir="rtl">
      <h3 id="rtl-toppings">الإضافات</h3>
      <div
        uiCheckboxGroup
        aria-labelledby="rtl-toppings"
        [defaultValue]="['cheese']"
      >
        @for (topping of toppings; track topping.value) {
          <label data-slot="label">
            <button uiCheckbox #box="uiCheckbox" [value]="topping.value">
              <span *uiCheckboxIndicator>
                <svg lucideCheck></svg>
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
    { value: "cheese", label: "جبن" },
    { value: "mushrooms", label: "فطر" },
    { value: "olives", label: "زيتون" },
    { value: "peppers", label: "فلفل" },
  ]
}

export { Example }

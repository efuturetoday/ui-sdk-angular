import { Component } from "@angular/core"
import {
  UiLabel,
  UiRadio,
  UiRadioGroup,
  UiRadioIndicator,
  UiRadioInput,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [UiLabel, UiRadio, UiRadioGroup, UiRadioIndicator, UiRadioInput],
  template: `
    <div data-slot="stack">
      <label uiLabel for="shipping-speed">Shipping speed</label>
      <div uiRadioGroup id="shipping-speed" defaultValue="standard">
        @for (speed of speeds; track speed.value) {
          <label uiLabel>
            <button uiRadio #radio="uiRadio" [value]="speed.value">
              <span *uiRadioIndicator></span>
            </button>
            <input [uiRadioInput]="radio" />
            {{ speed.label }}
          </label>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly speeds = [
    { value: "standard", label: "Standard" },
    { value: "express", label: "Express" },
    { value: "overnight", label: "Overnight" },
  ]
}

export { Example }

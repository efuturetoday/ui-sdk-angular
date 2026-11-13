import { Component } from "@angular/core"
import { UiSwitch, UiSwitchThumb, UiSwitchInput } from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [UiSwitchInput, UiSwitch, UiSwitchThumb],
  template: `
    <div dir="rtl">
      <label data-slot="label">
        وضع الطيران
        <button uiSwitch #toggle="uiSwitch">
          <span uiSwitchThumb></span>
        </button>
        <input [uiSwitchInput]="toggle" />
      </label>
    </div>
  `,
})
class Example {}

export { Example }

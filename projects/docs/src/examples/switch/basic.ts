import { Component } from "@angular/core"
import { UiSwitch, UiSwitchThumb, UiSwitchInput } from "@ngx-ui-sdk/core/switch"

@Component({
  selector: "app-example",
  imports: [UiSwitchInput, UiSwitch, UiSwitchThumb],
  template: `
    <label data-slot="label">
      Airplane mode
      <button uiSwitch #toggle="uiSwitch">
        <span uiSwitchThumb></span>
      </button>
      <input [uiSwitchInput]="toggle" />
    </label>
  `,
})
class Example {}

export { Example }

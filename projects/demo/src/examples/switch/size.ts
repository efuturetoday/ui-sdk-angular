import { Component } from "@angular/core"
import { UiSwitch, UiSwitchThumb, UiSwitchInput } from "ngx-ui-sdk/switch"

@Component({
  selector: "app-example",
  imports: [UiSwitchInput, UiSwitch, UiSwitchThumb],
  template: `
    <div data-slot="stack">
      <label data-slot="label">
        Small
        <button uiSwitch #toggle="uiSwitch" data-size="sm">
          <span uiSwitchThumb></span>
        </button>
        <input [uiSwitchInput]="toggle" />
      </label>
      <label data-slot="label">
        Default
        <button uiSwitch #toggle2="uiSwitch">
          <span uiSwitchThumb></span>
        </button>
        <input [uiSwitchInput]="toggle2" />
      </label>
    </div>
  `,
})
class Example {}

export { Example }

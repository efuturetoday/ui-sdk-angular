import { Component } from "@angular/core"
import { UiSwitch, UiSwitchThumb, UiSwitchInput } from "@ngx-ui-sdk/core/switch"

@Component({
  selector: "app-example",
  imports: [UiSwitchInput, UiSwitch, UiSwitchThumb],
  template: `
    <div data-slot="stack">
      <label data-slot="label">
        Product updates
        <button uiSwitch #toggle="uiSwitch">
          <span uiSwitchThumb></span>
        </button>
        <input [uiSwitchInput]="toggle" />
      </label>
      <label data-slot="label">
        Security alerts
        <button uiSwitch #toggle2="uiSwitch" defaultChecked disabled>
          <span uiSwitchThumb></span>
        </button>
        <input [uiSwitchInput]="toggle2" />
      </label>
    </div>
  `,
})
class Example {}

export { Example }

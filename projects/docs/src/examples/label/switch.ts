import { Component } from "@angular/core"
import { UiLabel } from "@ngx-ui-sdk/core/label"
import { UiSwitch, UiSwitchInput, UiSwitchThumb } from "@ngx-ui-sdk/core/switch"

@Component({
  selector: "app-example",
  imports: [UiLabel, UiSwitch, UiSwitchInput, UiSwitchThumb],
  template: `
    <div data-slot="row">
      <button uiSwitch #updates="uiSwitch" id="updates">
        <span uiSwitchThumb></span>
      </button>
      <input [uiSwitchInput]="updates" />
      <label uiLabel for="updates">Email me product updates</label>
    </div>
  `,
})
class Example {}

export { Example }

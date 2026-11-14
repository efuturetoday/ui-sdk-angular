import { Component } from "@angular/core"
import {
  UiField,
  UiFieldDescription,
  UiFieldLabel,
} from "@ngx-ui-sdk/core/field"
import { UiSwitch, UiSwitchInput, UiSwitchThumb } from "@ngx-ui-sdk/core/switch"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldDescription,
    UiFieldLabel,
    UiSwitch,
    UiSwitchInput,
    UiSwitchThumb,
  ],
  template: `
    <div uiField>
      <div data-slot="stack">
        <label uiFieldLabel>Encrypt backups</label>
        <p uiFieldDescription>Your organization manages this setting.</p>
      </div>
      <button
        uiSwitch
        #encrypt="uiSwitch"
        name="encrypt"
        defaultChecked
        readOnly>
        <span uiSwitchThumb></span>
      </button>
      <input [uiSwitchInput]="encrypt" />
    </div>
  `,
})
class Example {}

export { Example }

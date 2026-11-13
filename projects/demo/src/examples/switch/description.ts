import { Component } from "@angular/core"
import {
  UiField,
  UiFieldDescription,
  UiFieldLabel,
  UiSwitch,
  UiSwitchInput,
  UiSwitchThumb,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
    UiSwitchInput,
    UiField,
    UiFieldDescription,
    UiFieldLabel,
    UiSwitch,
    UiSwitchThumb,
  ],
  template: `
    <div uiField>
      <div data-slot="stack">
        <label uiFieldLabel>Weekly digest</label>
        <p uiFieldDescription>A summary of your week, every Monday.</p>
      </div>
      <button uiSwitch #toggle="uiSwitch">
        <span uiSwitchThumb></span>
      </button>
      <input [uiSwitchInput]="toggle" />
    </div>
  `,
})
class Example {}

export { Example }

import { Component } from "@angular/core"
import { LucideMoon, LucideSun } from "@lucide/angular"
import { UiSwitch, UiSwitchThumb, UiSwitchInput } from "ngx-ui-sdk/switch"

@Component({
  selector: "app-example",
  imports: [UiSwitchInput, LucideMoon, LucideSun, UiSwitch, UiSwitchThumb],
  template: `
    <label data-slot="label">
      Dark mode
      <button uiSwitch #toggle="uiSwitch">
        <span uiSwitchThumb #thumb="uiSwitchThumb">
          @if (thumb.state().checked) {
            <svg lucideMoon aria-hidden="true"></svg>
          } @else {
            <svg lucideSun aria-hidden="true"></svg>
          }
        </span>
      </button>
      <input [uiSwitchInput]="toggle" />
    </label>
  `,
})
class Example {}

export { Example }

import { Component, signal } from "@angular/core"
import {
  createSwitchController,
  UiSwitch,
  UiSwitchThumb,
  UiSwitchInput,
} from "@ngx-ui-sdk/core/switch"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [UiSwitchInput, UiSwitch, UiSwitchThumb],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="wifi.toggle()">Toggle</button>
      </div>
      <label data-slot="label">
        Wi-Fi
        <button
          uiSwitch
          #toggle="uiSwitch"
          [(checked)]="checked"
          [controller]="wifi"
          (beforeCheckedChange)="
            log(
              ($event.checked ? 'On' : 'Off') +
                ' (' +
                $event.details.reason +
                ')'
            )
          "
        >
          <span uiSwitchThumb></span>
        </button>
        <input [uiSwitchInput]="toggle" />
      </label>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly wifi = createSwitchController()
  protected readonly checked = signal(true)
}

export { Example }

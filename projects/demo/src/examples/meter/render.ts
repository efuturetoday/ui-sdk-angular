import { Component } from "@angular/core"
import {
  UiMeter,
  UiMeterIndicator,
  UiMeterLabel,
  UiMeterTrack,
  UiMeterValue,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    UiMeter,
    UiMeterIndicator,
    UiMeterLabel,
    UiMeterTrack,
    UiMeterValue,
  ],
  template: `
    <div uiMeter [value]="91">
      <span uiMeterLabel>Disk</span>
      <span uiMeterValue #value="uiMeterValue">
        {{ value.state().text }} used
      </span>
      <span uiMeterTrack
        ><div
          uiMeterIndicator
          #indicator="uiMeterIndicator"
          [attr.data-variant]="
            indicator.state().percent >= 90 ? 'destructive' : undefined
          "
        ></div
      ></span>
    </div>
  `,
})
class Example {}

export { Example }

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
    <div uiMeter [value]="42">
      <span uiMeterLabel>Battery</span>
      <span uiMeterValue></span>
      <div uiMeterTrack><div uiMeterIndicator></div></div>
    </div>
  `,
})
class Example {}

export { Example }

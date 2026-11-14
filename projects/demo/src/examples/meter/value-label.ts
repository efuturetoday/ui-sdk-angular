import { Component } from "@angular/core"
import type { MeterLabelDetails } from "ngx-ui-sdk"
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
    <div uiMeter [value]="750" [max]="1000" [getValueLabel]="valueLabel">
      <span uiMeterLabel>API requests</span>
      <span uiMeterValue>750 / 1,000</span>
      <div uiMeterTrack><div uiMeterIndicator></div></div>
    </div>
  `,
})
class Example {
  protected readonly valueLabel = (value: number, details: MeterLabelDetails) =>
    `${value} of ${details.max} requests, ${details.formatted}`
}

export { Example }

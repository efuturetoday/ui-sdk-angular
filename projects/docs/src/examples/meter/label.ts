import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import {
  UiMeter,
  UiMeterIndicator,
  UiMeterLabel,
  UiMeterTrack,
  UiMeterValue,
} from "@ngx-ui-sdk/core/meter"

@Component({
  selector: "app-example",
  imports: [
    UiText,
    UiMeter,
    UiMeterIndicator,
    UiMeterLabel,
    UiMeterTrack,
    UiMeterValue,
  ],
  template: `
    <div uiMeter [value]="42">
      <span uiMeterLabel>Battery</span>
      <span uiMeterValue uiText></span>
      <div uiMeterTrack><div uiMeterIndicator></div></div>
    </div>
  `,
})
class Example {}

export { Example }

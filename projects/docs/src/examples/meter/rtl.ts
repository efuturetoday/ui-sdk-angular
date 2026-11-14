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
    UiMeter,
    UiMeterIndicator,
    UiMeterLabel,
    UiMeterTrack,
    UiMeterValue,
  ],
  template: `
    <div dir="rtl">
      <div uiMeter [value]="68" locale="ar-EG">
        <span uiMeterLabel>مساحة التخزين</span>
        <span uiMeterValue></span>
        <div uiMeterTrack><div uiMeterIndicator></div></div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }

import { Component } from "@angular/core"
import {
  UiSlider,
  UiSliderControl,
  UiSliderIndicator,
  UiSliderThumb,
  UiSliderTrack,
  UiSliderValue,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
    UiSlider,
    UiSliderControl,
    UiSliderIndicator,
    UiSliderThumb,
    UiSliderTrack,
    UiSliderValue,
  ],
  template: `
    <div dir="rtl" data-slot="stack">
      <div
        uiSlider
        [defaultValue]="[20, 60]"
        locale="ar-EG"
        aria-label="نطاق السعر"
      >
        <div data-slot="row">
          <span data-slot="label">نطاق السعر</span>
          <output uiSliderValue></output>
        </div>
        <div uiSliderControl>
          <div uiSliderTrack>
            <div uiSliderIndicator></div>
            <div uiSliderThumb [index]="0" aria-label="الحد الأدنى"></div>
            <div uiSliderThumb [index]="1" aria-label="الحد الأقصى"></div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }

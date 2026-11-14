import { Component } from "@angular/core"
import { UiField, UiFieldLabel } from "ngx-ui-sdk/field"
import {
  UiSlider,
  UiSliderControl,
  UiSliderIndicator,
  UiSliderThumb,
  UiSliderTrack,
  UiSliderValue,
} from "ngx-ui-sdk/slider"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldLabel,
    UiSlider,
    UiSliderControl,
    UiSliderIndicator,
    UiSliderThumb,
    UiSliderTrack,
    UiSliderValue,
  ],
  template: `
    <div uiField>
      <div
        uiSlider
        [defaultValue]="[10, 20, 70]"
        [step]="10"
        [format]="{ style: 'unit', unit: 'percent' }"
      >
        <div data-slot="row">
          <label uiFieldLabel>Alert thresholds</label>
          <output uiSliderValue></output>
        </div>
        <div uiSliderControl>
          <div uiSliderTrack>
            <div uiSliderIndicator></div>
            @for (label of thumbs; track label; let index = $index) {
              <div
                uiSliderThumb
                [index]="index"
                [attr.aria-label]="label"
              ></div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly thumbs = ["Low", "Medium", "High"]
}

export { Example }

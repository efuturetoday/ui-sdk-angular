import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  UiSlider,
  UiSliderControl,
  UiSliderIndicator,
  UiSliderThumb,
  UiSliderTrack,
  UiSliderValue,
} from "@ngx-ui-sdk/core/slider"

@Component({
  selector: "app-example",
  imports: [
    UiText,
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
          <output uiSliderValue uiText></output>
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

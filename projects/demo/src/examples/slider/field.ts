import { Component } from "@angular/core"
import { UiField, UiFieldDescription, UiFieldLabel } from "ngx-ui-sdk/field"
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
    UiFieldDescription,
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
        [defaultValue]="0.3"
        [format]="{ style: 'percent' }"
        [min]="0"
        [max]="1"
        [step]="0.01"
      >
        <div data-slot="row">
          <label uiFieldLabel>Volume</label>
          <output uiSliderValue></output>
        </div>
        <div uiSliderControl>
          <div uiSliderTrack>
            <div uiSliderIndicator></div>
            <div uiSliderThumb></div>
          </div>
        </div>
      </div>
      <p uiFieldDescription>How loud notifications play.</p>
    </div>
  `,
})
class Example {}

export { Example }

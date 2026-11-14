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
        [defaultValue]="[25, 50]"
        [step]="5"
        [format]="{
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }"
      >
        <div data-slot="row">
          <label uiFieldLabel>Price</label>
          <output uiSliderValue uiText></output>
        </div>
        <div uiSliderControl>
          <div uiSliderTrack>
            <div uiSliderIndicator></div>
            <div uiSliderThumb [index]="0" aria-label="Minimum price"></div>
            <div uiSliderThumb [index]="1" aria-label="Maximum price"></div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }

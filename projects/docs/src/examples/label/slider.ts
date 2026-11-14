import { Component } from "@angular/core"
import { UiLabel } from "@ngx-ui-sdk/core/label"
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
    UiLabel,
    UiSlider,
    UiSliderControl,
    UiSliderIndicator,
    UiSliderThumb,
    UiSliderTrack,
    UiSliderValue,
  ],
  template: `
    <div uiSlider id="volume" [defaultValue]="75">
      <div data-slot="row">
        <label uiLabel for="volume">Volume</label>
        <output uiSliderValue></output>
      </div>
      <div uiSliderControl>
        <div uiSliderTrack>
          <div uiSliderIndicator></div>
          <div uiSliderThumb></div>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }

import { Component } from "@angular/core"
import {
  UiLabel,
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

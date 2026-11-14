import { Component } from "@angular/core"
import {
  UiField,
  UiFieldLabel,
  UiSlider,
  UiSliderControl,
  UiSliderIndicator,
  UiSliderThumb,
  UiSliderTrack,
  UiSliderValue,
} from "ngx-ui-sdk"

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
      <div uiSlider [defaultValue]="60">
        <div data-slot="row">
          <label uiFieldLabel>Brightness</label>
          <output uiSliderValue #value="uiSliderValue"
            >{{ value.state().text }}%</output
          >
        </div>
        <div uiSliderControl>
          <div uiSliderTrack>
            <div uiSliderIndicator></div>
            <span uiSliderThumb #thumb="uiSliderThumb">
              <span data-slot="output">{{ thumb.state().thumbValue }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
